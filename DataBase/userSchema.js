const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config({ path: "../config.env" });

const userSchema = new mongoose.Schema(
//     {
//   name: String,
//   email: {
//     type: String,
//     require: true,
//   },
//   password: {
//     type: String,
//     require: true,
//   },
// }
{
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        validate:{
            validator: function(v){
                return (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g).test(v)
            },
            message:(props)=>`${props.value} is not a valid email`
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
        minLength: [6, "Password too short"],
      }
        }

);

userSchema.pre("save", async function (next) {
  console.log("we are in middleware");
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  console.log("middleware sent to next")
  next();
});

module.exports = mongoose.model("User", userSchema);
