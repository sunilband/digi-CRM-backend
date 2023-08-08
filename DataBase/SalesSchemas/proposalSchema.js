const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const shortid = require("shortid");
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);
dotenv.config({ path: "../config.env" });
// items schema
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
// ------------------------------------------
const itemReference = new mongoose.Schema({
  data: {
    type: itemsSchema,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  rate: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
});

const proposalSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  related: {
    type: String,
    enum: ["Lead", "Customer"],
    required: true,
  },
  lead: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  customer: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  date: {
    type: Date,
    required: true,
  },
  openTill: {
    type: Date,
    required: true,
  },
  currency: {
    type: String,
    enum: ["INR", "USD"],
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  discountType: {
    type: String,
    enum: ["None", "Before Tax", "After Tax"],
    default: "None",
  },
  status: {
    type: String,
    enum: ["Draft", "Sent", "Open", "Revisited", "Accepted", "Declined"],
    default: "Draft",
  },
  assignedTo: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  to: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(v);
      },
      message: (props) => `${props.value} is not a valid email`,
    },
  },
  phone: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  assignedBy: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  // items
  items: {
    type: [itemReference],
    default: [],
    required: true,
  },
  // Pricing
  discount: {
    totalDiscountType: {
      type: String,
      enum: ["Percentage", "Amount"],
      default: "Percentage",
    },
    value: {
      type: Number,
      default: 0,
    },
    adjustment: {
      type: Number,
      default: 0,
    },
  },
  subTotal: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Proposal", proposalSchema);
