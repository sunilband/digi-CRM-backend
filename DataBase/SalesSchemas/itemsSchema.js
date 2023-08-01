const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const shortid = require("shortid");
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);
dotenv.config({ path: "../config.env" });

const itemsSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true,
  },
  longDesc: {
    type: String,
  },
  rate: {
    rateValue: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
      enum: ["INR", "USD", "EUR", "GBP"],
    },
  },
  tax1: {
    type: Number,
    required: true,
  },
  tax2: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  groupName:{
    type:String,
    default:"N/A"
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type:String,
      required:true
    }
  },
});

module.exports = mongoose.model("Item", itemsSchema);
