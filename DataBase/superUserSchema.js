const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
dotenv.config({ path: "../config.env" });


const taskSchema = new mongoose.Schema({
    taskId: {
        type: String,
        required: true,
      },
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
        required: true,
      },
    assignedBy: {
        type: String,
        required: true,
      },
    assignedTime:  {
        type: Date,
        default: Date.now
      }
});

const superUserSchema = new mongoose.Schema({

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
  password: {
    type: String,
    required: true,
    select: false,
    minLength: [6, "Password too short"],
  },

  tasks: [{
    type: [taskSchema],
    default: []
  }],

  admin:{
    type:Boolean,
    default:true,
    enum:[true]
  },

  authLevel:{
    type:Number,
    required: true,
    enum: [1,2,3,4],
  },

  role: {
    type: String,
    required: true,
    enum: ["Manager", "Team Lead", "CEO"],
    message: 'Role must be one of intern, manager, or jr.dev'
  },

  employeeID: {
    type: String,
    default: shortid.generate,
    unique: true
  },

  department: {
    type: String,
    required: true,
    enum: ["Sales", "Frontend", "Backend", "Hr", "Other"],
    message: 'Role must be one of sales, frontend,backend or hr'
  },

  phone: {
    type: Number,
    required: true,
  },

});

superUserSchema.pre("save", async function (next) {
  console.log("we are in middleware");
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  console.log("middleware sent to next");
  next();
});

module.exports = mongoose.model("SuperUser", superUserSchema);
