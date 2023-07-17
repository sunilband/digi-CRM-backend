const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    email:String,
    otp:String,
    expireIn:Number
},{
    timestamps:true
})

module.exports = mongoose.model('otp',otpSchema)