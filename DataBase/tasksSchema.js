const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },

  taskDescription: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: [
      "Not Started",
      "In Progress",
      "Testing",
      "Awaiting Feedback",
      "Complete"
    ],
    default: "Not Started",
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

  assignedTime: {
    type: Date,
    default: Date.now,
  },

  startDate:{
    type:Date
  },

  dueDate:{
    type:Date,
    required:true
  },

  priority:{
    type:String,
    enum: [
      "Low",
      "Medium",
      "High",
      "Urgent",
    ],
    required:true
  },

  tags:{
    type:Array,
    default:[],
  }

});

module.exports = mongoose.model("Task", taskSchema);
