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

    const decoded = jwt.verify(token, process.env.private_key);
    let user = await User.findById(decoded);
    if (!user) {
      return res.send({
        success: false,
        error: "Non users cant assign tasks",
      });
    }
    const { taskName, taskDesc, status, assignedTo ,priority ,startDate ,tags } = req.body;
    if (!taskName || !taskDesc || !assignedTo || !priority ) {
      return res.send({
        success: false,
        error: "Incomplete data",
      });
    }

    try {
      try {
        var taskUser = await User.findById(assignedTo);
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
        tags
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

const getTasks = async (req, res) => {
  try {
    const { userID } = req.body;
    if (!userID) {
      return res.send({
        success: false,
        error: "userID not found in request body",
      });
    }
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
    const tasks = await Task.find({ "assignedTo.id": userID });
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

module.exports = {
  createTask,
  getTasks,
};
