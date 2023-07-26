const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../DataBase/userSchema");
const Task = require("../DataBase/tasksSchema");
const Lead = require("../DataBase/leadsSchema");
const SuperUser = require("../DataBase/superUserSchema");
const Otp = require("../DataBase/optSchema");
const mongoose = require("mongoose");

const createLead = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res.send({
        success: false,
        error: "No token found",
      });

    let admin = false;
    const decoded = jwt.verify(token, process.env.private_key);
    let user = await User.findById(decoded);
    if (!user) {
      user = await SuperUser.findById(decoded);
      admin = true;
    }
    if (!user) {
      return res.send({
        success: false,
        error: "Non users cant assign tasks",
      });
    }

    const {
      name,
      email,
      company,
      phone,
      value,
      tags,
      assignedBy,
      assignedTo,
      status,
      source,
      lastContacted,
    } = req.body;
    if (
      !name ||
      !email ||
      !company ||
      !phone ||
      !value ||
      !assignedTo ||
      !lastContacted
    ) {
      return res.send({
        success: false,
        error: "Incomplete data",
      });
    }

    try {
      try {
        var taskUser = await User.findById(assignedTo);

        if (!taskUser) {
          if (admin) {
            taskUser = await SuperUser.findById(assignedTo);
          }
        }

        if (!taskUser) {
          return res.send({
            success: false,
            error: "The user to assign task doesnt exist",
          });
        }
      } catch (error) {
        return res.send({
          success: false,
          error: "The user to assign task doesnt exist",
        });
      }

      const newLead = new Lead({
        assignedBy: {
          name: user.name,
          id: user._id,
        },
        assignedTo: {
          name: taskUser.name,
          id: taskUser._id,
        },
        name,
        email,
        company,
        phone,
        value,
        tags,
        status,
        source,
        lastContacted,
      });
      await newLead.save();
      res.json({
        success: true,
        message: "Lead created successfully",
        data: newLead,
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

//   if userID passed then it will search leads for specific user else will use decoded token
const getLeads = async (req, res) => {
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

    const leads = await Lead.find({
      "assignedTo.id": userID ? userID : decoded,
    });
    const assigned = await Lead.find({
      "assignedBy.id": userID ? userID : decoded,
    });
    return res.send({
      success: true,
      message: "Leads fetched successfully",
      data: {
        myLeads: leads,
        assignedLeads: assigned,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error,
    });
  }
};

// update lead info
const updateLead = async (req, res) => {
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
      const updatedLead = req.body;
      var authorized = true;

      let lead = await Lead.findById(req.body._id);

      if (lead.assignedTo.id !== decoded._id) {
        authorized = false;
      }
      if (lead.assignedBy.id === decoded._id) {
        authorized = true;
      }

      if (user.admin) {
        let lead = await Lead.findByIdAndUpdate(req.body._id, updatedLead, {
          new: true,
        });
        authorized = true;
      }

      if (authorized === false)
        return res.send({
          success: false,
          error: "Cant edit other users task status",
        });

      let newLead = await Lead.findByIdAndUpdate(req.body._id, updatedLead, {
        new: true,
      });

      if (!newLead) {
        return res.send({
          success: false,
          error: "lead update failed",
        });
      }

      res.send({
        success: true,
        message: "Lead updated",
        updateLead: newLead,
      });
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
  createLead,
  getLeads,
  updateLead,
};
