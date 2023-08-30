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
  groupName: {
    type: String,
    default: "N/A",
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
      type: String,
      required: true,
    },
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

// invoice schema
const invoiceSchema = new mongoose.Schema({
  customer: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  billingAddress: {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: Number,
    },
    country: {
      type: String,
    },
  },

  shippingAddress: {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
    country: {
      type: String,
    },
  },

  invoiceNumber: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  expiryDate: {
    type: Date,
    required: true,
  },

  paymentMode:{
    type: String,
    enum: ["Cash", "Cheque", "Credit Card", "Debit Card", "Net Banking", "UPI", "Other"],
    default: "Net Banking",
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
    enum: ["Paid","Overdue","Draft","Unpaid","Not Sent","Partially Paid"],
    default: "Draft",
  },

  saleAgent: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },

  recurringInvoice:{
    type:String,
    enum: ["No", "Every 1 month", "Every 2 months", "Every 3 months","Every 4 months","Every 5 months","Every 6 months","Every 7 months","Every 8 months","Every 9 months","Every 10 months","Every 11 months","Every 12 months"],
    default: "No",
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
  reference:{
    type: String,
    default: "N/A",
  },
  adminNote: {
    type: String,
    default: "N/A",
  },
  clientNote:{
    type: String,
    default: "N/A",
  },
  terms:{
    type: String,
    default: "N/A",
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

module.exports = mongoose.model("Invoice", invoiceSchema);
