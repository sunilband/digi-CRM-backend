const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../../DataBase/userSchema");
const Task = require("../../DataBase/tasksSchema");
const Payment = require("../../DataBase/SalesSchemas/paymentSchema");
const SuperUser = require("../../DataBase/superUserSchema");
const Group = require("../../DataBase/SalesSchemas/groupSchema");
const Otp = require("../../DataBase/optSchema");
const Invoice=require("../../DataBase/SalesSchemas/invoiceSchema");
const Customer=require("../../DataBase/customerSchema");
const mongoose = require("mongoose");

const createPayment = async (req, res) => {
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
    const { customerID,invoiceID,date,transactionID,paymentMode,amount,paymentNo } = req.body;
    if (!customerID || !invoiceID || !date || !transactionID || !paymentMode || !amount || !paymentNo) {
      return res.send({
        success: false,
        error: "Incomplete data",
      });
    }

    try {
      const customer=await Customer.findById(customerID);
        if(!customer){
            return res.send({
                success: false,
                error: "Customer not found",
            });
        }
      const invoice=await Invoice.findById(invoiceID);
        if(!invoice){
            return res.send({
                success: false,
                error: "Invoice not found",
            });
        }

      const newPayment = new Payment({
        paymentNo,
        customer:{
            name:customer.company,
            id:customer._id,
        },
        invoiceID:invoice.invoiceNumber,
        paymentMode,
        amount,
        transactionID,
        date,
        createdBy: {
            name: user.name,
            id: user._id,
          },
      });
      await newPayment.save();
      res.json({
        success: true,
        message: "Payment created successfully",
        data: newPayment,
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


//   if userID passed then it will search Payments for specific user else will use decoded token
const getPayments = async (req, res) => {
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
        error: "Non users cant get payments",
      });
    }

    const Payments = await Payment.find({});
  
    return res.send({
      success: true,
      message: "Payments fetched successfully",
      data: {
        myPayments: Payments,
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
  createPayment,
  getPayments,
};
