const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../DataBase/userSchema");
const Task = require("../DataBase/tasksSchema");
const Lead = require("../DataBase/leadsSchema");
const SuperUser = require("../DataBase/superUserSchema");
const Customer = require("../DataBase/customerSchema");
const Otp = require("../DataBase/optSchema");
const mongoose = require("mongoose");

const createCustomer = async (req, res) => {
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
      company,
      vat,
      phone,
      website,
      currency,
      language,
      status,
      email,
      address,
      billingAddress,
      shippingAddress,
      groups
    } = req.body;
    if (!company || !vat || !phone || !currency || !email || !address ) {
      return res.send({
        success: false,
        error: "Incomplete data",
      });
    }

    try {
      const newCustomer = new Customer({
        company,
        vat,
        phone,
        website,
        currency,
        language,
        email,
        status,
        address,
        billingAddress,
        shippingAddress,
        groups
      });
      await newCustomer.save();
      res.json({
        success: true,
        message: "Customer created successfully",
        data: newCustomer,
      });
    } catch (error) {
      res.json({
        success: false,
        error,
      });
    }
  } catch (error) {
    res.json({
      success: false,
      error,
    });
  }
};

//   if userID passed then it will search leads for specific user else will use decoded token
const getCustomers = async (req, res) => {
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
        error: "Non users cant get customers details",
      });
    }

    const customers = await Customer.find({});

    return res.send({
      success: true,
      message: "Customers fetched successfully",
      data: {
        myCustomers: customers,
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
const updateCustomer = async (req, res) => {
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
        error: "Non users cant update customer details",
      });
    }

    try {
      const updatedCustomer = req.body;


      let newCustomer = await Customer.findByIdAndUpdate(req.body._id, updatedCustomer, {
        new: true,
      });

      if (!newCustomer) {
        return res.send({
          success: false,
          error: "customer update failed",
        });
      }

      res.send({
        success: true,
        message: "Customer updated",
        updateCustomer: newCustomer,
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
  createCustomer,
  getCustomers,
  updateCustomer,
};
