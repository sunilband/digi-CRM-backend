const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const shortid = require("shortid");
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);
dotenv.config({ path: "../config.env" });

const paymentSchema = new mongoose.Schema({
  paymentNo:{
    type:String,
    required:true,
  },
  invoiceID: {
    type: String,
    required: true,
  },
  paymentMode:{
    type: String,
    enum: ["Cash", "Cheque", "Credit Card", "Debit Card", "Net Banking", "UPI", "Other"],
    default: "Net Banking",
  },
  transactionID: {
    type: String,
    required: true,
  },
  customer: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  amount:{
    type:Number,
    required:true
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
