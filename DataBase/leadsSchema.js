const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const shortid = require("shortid");
shortid.characters(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);
dotenv.config({ path: "../config.env" });


const leadsSchema = new mongoose.Schema({
  
  name: {
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

 company:{
    type:String,
    required:true
 } ,

  phone: {
    type: Number,
    required: true,
  },
  value:{
    type:Number,
    required:true
  },

  tags:{
    type:Array,
    default:[],
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

  assignedTo: {
    name:{
      type:String,
      required:true
    },
    id:{
      type:String,
      required:true
    }
  },

  status:{
    type:String,
    required:true,
    enum:["Done","Customer"],
    default:"Customer"
  },

  source:{
    type:String,
    required:true,
  },

  lastContacted:{
    type:Date,
    default:Date.now
  }

});



module.exports = mongoose.model("Lead", leadsSchema);
