const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../../DataBase/userSchema");
const Task = require("../../DataBase/tasksSchema");
const Item = require("../../DataBase/SalesSchemas/itemsSchema");
const SuperUser = require("../../DataBase/superUserSchema");
const Group = require("../../DataBase/SalesSchemas/groupSchema");
const Otp = require("../../DataBase/optSchema");
const mongoose = require("mongoose");

const createItem = async (req, res) => {
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
    const { desc, longDesc, rateValue, currency, tax1, tax2, unit , groupName } = req.body;
    if (!desc || !rateValue || !tax1 || !tax2 || !unit) {
      return res.send({
        success: false,
        error: "Incomplete data",
      });
    }
    try {
      const newItem = new Item({
        desc,
        longDesc,
        rate: {
          rateValue,
          currency,
        },
        tax1,
        tax2,
        unit,
        groupName,
        createdBy: {
            name: user.name,
            id: user._id,
          },
      });
      await newItem.save();
      res.json({
        success: true,
        message: "Item created successfully",
        data: newItem,
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

const createGroup= async (req, res) => {
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

    const { name } = req.body;
    if (!name) {
      return res.send({
        success: false,
        error: "Incomplete data",
      });
    }

    try {
      const checkGroupExist=await Group.findOne({name});
      if(checkGroupExist){
        return res.send({
          success: false,
          error: "Group already exist",
        });
      }
      const newGroup= new Group({
        name,
        createdBy: {
            name: user.name,
            id: user._id,
          },
      });
      await newGroup.save();
      res.json({
        success: true,
        message: "Group created successfully",
        data: newGroup,
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

//   if userID passed then it will search Items for specific user else will use decoded token
const getItems = async (req, res) => {
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
      user = await SuperUser.findById(decoded);
    }

    if (!user) {
      return res.send({
        success: false,
        error: "Non users cant get items",
      });
    }

    const Items = await Item.find({});
  
    return res.send({
      success: true,
      message: "Items fetched successfully",
      data: {
        myItems: Items,
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

const getGroups = async (req, res) => {
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
      user = await SuperUser.findById(decoded);
    }

    if (!user) {
      return res.send({
        success: false,
        error: "Non users cant get groups",
      });
    }

    const Items = await Group.find({});
  
    return res.send({
      success: true,
      message: "Groups fetched successfully",
      data: {
        myItems: Items,
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

module.exports = {
  createItem,
  createGroup,
  getItems,
  getGroups,
};
