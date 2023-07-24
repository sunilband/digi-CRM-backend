const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../DataBase/userSchema");
const Task = require("../DataBase/tasksSchema");
const SuperUser = require("../DataBase/superUserSchema");
const Otp = require("../DataBase/optSchema");
const mongoose = require("mongoose");

const createTask = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res.send({
        success: false,
        error: "No token found",
      });
    let admin=false
    const decoded = jwt.verify(token, process.env.private_key);
    let user = await User.findById(decoded);
    if (!user) {
      user=await SuperUser.findById(decoded);
      admin=true
    }
    if (!user) {
      return res.send({
        success: false,
        error: "Non users cant assign tasks",
      });
    }
    
    const { taskName, taskDesc, status, assignedTo ,priority ,startDate ,tags ,dueDate } = req.body;
    if (!taskName || !taskDesc || !assignedTo || !priority || !dueDate) {
      return res.send({
        success: false,
        error: "Incomplete data",
      });
    }

    try {
      try {
        var taskUser = await User.findById(assignedTo);

        if(!taskUser){
          if(admin){
            taskUser=await SuperUser.findById(assignedTo)
          }
        }
        
      } catch (error) {
        return res.send({
          success: false,
          error: "The user to assign task doesnt exist",
        });
      }

      const newTask = new Task({
        taskName,
        taskDescription: taskDesc,
        status,
        assignedBy: {
          name: user.name,
          id: user._id,
        },
        assignedTo: {
          name: taskUser.name,
          id: taskUser._id,
        },
        startDate,
        priority,
        tags,
        dueDate
      });
      await newTask.save();
      res.json({
        success: true,
        message: "Task created successfully",
        data: newTask,
      });
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        error,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error,
    });
  }
};

//   if userID passed then it will search tasks for specific user else will use decoded token
const getTasks = async (req, res) => {
  try {
    const { userID } = req.body;
    
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res.send({
        success: false,
        error: "No token found",
      });

    const decoded = jwt.verify(token, process.env.private_key);
    let user = await User.findById(decoded);
    if (!user) {
      user = await SuperUser.findById(decoded);
    }

    if (!user) {
      return res.send({
        success: false,
        error: "Non users cant assign tasks",
      });
    }
    const tasks = await Task.find({ "assignedTo.id": userID?userID:decoded });
    return res.send({
      success: false,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error,
    });
  }
};

// update task info
const updateTask = async (req, res) => {
try {
    let token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res.send({
        success: false,
        error: "No token found",
      });
      const decoded = jwt.verify(token, process.env.private_key);
      let user = await User.findById(decoded);
      if (!user) {
        user = await SuperUser.findById(decoded);
      }
  
      if (!user) {
        return res.send({
          success: false,
          error: "Non users cant update tasks",
        });
      }
  
     
    
      try {
          const updatedTask = req.body;
          if(user.admin)
          {
             let task = await Task.findByIdAndUpdate(req.body._id,updatedTask, {
              new: true,
            });
          }
          else{
              let task =await Task.findById(req.body._id)
              if(task.assignedTo.id!==decoded._id){
                  return res.send({
                      success: false,
                      error: "Cant edit other users task status",
                    }); 
              }
      
              let newTask = await Task.findByIdAndUpdate(req.body._id,updatedTask, {
                  new: true,
              });
  
              if (!newTask) {
                  return res.send({
                    success: false,
                    error: "task update failed",
                  });
                }
  
              res.send({
                  success: true,
                  message: "Task updated",
                  updateTask:newTask
                });
          }
          
      } catch (err) {
        res.status(500).send(err);
      }

} catch (error) {
    return res.send({
        success: false,
        error: error,
      });
}
    
  
   
  };

module.exports = {
  createTask,
  getTasks,
  updateTask
};
