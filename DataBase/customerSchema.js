const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const shortid = require("shortid");
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);
dotenv.config({ path: "../config.env" });

const customerSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  vat: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  website: {
    type: String,
  },
  currency: {
    type: String,
    enum: ["USD","INR"],
    required: true,
  },
  language: {
    type: String,
    enum: ["English", "Hindi","Vietnamese","Turkish","Swedish","Polish","Ukrainian","Russian","Romanian","Portuguese","Norwegian","Korean","Japanese","Italian","Indonesian","Hungarian","French","Finnish","Dutch","Danish","Czech","Chinese","Bulgarian","Bengali","Arabic","Spanish","German","Greek"],
    default: "English",
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

  status:{
    type: String,
    enum: ["Active", "Inactive"],
    default: "Inactive",
  },

  dateCreated: {
    type: Date,
    default: Date.now(),
  },

  primaryContact: {
    type: String,
  },

  groups:{
   type:Array,
   default:[]
  },

  address: {
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
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
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
      type: Number,
    },
    country: {
      type: String,
    },
  },
});




module.exports = mongoose.model("Customer", customerSchema);
