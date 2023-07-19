const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
dotenv.config({ path: "../config.env" });

// schema for tasks in user
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


const userSchema = new mongoose.Schema({
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

  // non required fields below
  tasks: [{
    type: [taskSchema],
    default: []
  }],

  role: {
    type: String,
    enum: ["intern", "manager", "jr.dev", "CEO"],
    message: 'Role must be one of intern, manager, or jr.dev'
  },
  
  authLevel:{
    type:Number,
    default:0
  },

  employeeID: {
    type: String,
    default: shortid.generate,
    unique: true
  },

  department: {
    type: String,
    enum: ["sales", "frontend", "backend", "hr"],
    message: 'Role must be one of sales, frontend,backend or hr'
  },

  manager: {
    name: {
      type: String,
    },
    id: {
      type: String,
    },
  },

  phone: {
    type: Number,
  },

});

userSchema.pre("save", async function (next) {
  console.log("we are in middleware");
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  console.log("middleware sent to next");
  next();
});

module.exports = mongoose.model("User", userSchema);
