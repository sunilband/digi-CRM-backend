const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../DataBase/userSchema");
const SuperUser = require("../DataBase/superUserSchema");
const Otp = require("../DataBase/optSchema");
const mongoose = require("mongoose");

// taking data from req.body and store the data in mongodb Database
const Register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email or password are missing" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      res.status(422).json({
        success: false,
        error: "User already exist",
      });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      await user.save();
      res.status(200).json({
        success: true,
        message: "User created",
      });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

// Registering a Superuser admin
const RegisterSuperUser = async (req, res) => {
  // checking admin key
  try {
    const { adminKey } = req.body;
    if (adminKey !== process.env.SUPER_USER_KEY) {
        return res
          .status(400)
          .json({ success: false, error: "Not authorized for admin signup" });
      }
  } catch (error) {
    return res
    .status(400)
    .json({ success: false, error: "Not authorized for admin signup" });
  }
  
  
// creating superuser if admin key is good
  

  try {
    const { name, email, password, authLevel, role, department, phone } =
    req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "email or password are missing" });
  }
    const superUserExist = await SuperUser.findOne({ email: email });
    if (superUserExist) {
      res.status(422).json({
        success: false,
        error: "User already exist",
      });
    } else {
      const superUser = new SuperUser({
        name,
        email,
        password,
        authLevel,
        role,
        department,
        phone,
      });
      await superUser.save();
      res.status(200).json({
        success: true,
        message: "Super User created",
      });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

//Adding login Authentication through here and creating the jwt tokens for auth
const Login = async (req, res) => {

let userId = "";
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: "email and password both are require",
      });
    }

    let userLogin = await User.findOne({ email: email }).select("+password");
    if(userLogin===null)
    {
    userLogin = await SuperUser.findOne({ email: email }).select("+password");
    }
    userId = userLogin._id;

    if (!userLogin) {
      res.status(404).json({
        success: false,
        error: "email not found",
      });
    } else {
      const isMatch = await bcrypt.compare(password, userLogin.password);
      const token = jwt.sign({ _id: userId }, process.env.private_key);
      // save user token
      User.token = token;

      // store jwt token in cookie
      res.cookie("accessToken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({
          success: false,
          error: "Invalid Credentials",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "login Success",
          token,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

// getting data from id
const GetDataById = async (req, res) => {

  const token = req.headers.authorization.split(" ")[1];
  if (!token)
    return res.send({
      success: false,
      error: "No token found",
    });
  try {
    const decoded = jwt.verify(token, process.env.private_key);

    let user = await User.find({ _id: { $in: decoded._id } });
    if(user.length==0)
    {
    user = await SuperUser.find({ _id: { $in: decoded._id } });

    }
    if (!user) {
      throw new Error("User not found");
    }
    res.json(user[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// updating data by Admin by using id
const UpdateDataById = async (req, res) => {
  const updatedUser = req.body;
  // const token=req.body.token
  const token = req.headers.authorization.split(" ")[1];
  if (!token)
    return res.send({
      success: false,
      error: "No token found",
    });
  const { _id } = jwt.verify(token, process.env.private_key);
  try {
    const user = await User.findByIdAndUpdate(_id, updatedUser, { new: true });
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
};

// adding forget email to opts data collections in database
const SendMail = async (req, res) => {
  const email = req.body.email;
  if (!email) {
    res.status(400).json({ error: "email are require" });
  }
  try {
    const emailExist = await User.findOne({ email: email });

    if (emailExist) {
      const OtpCode = Math.floor(Math.random() * 10000 + 1);
      const OtpData = new Otp({
        email,
        otp: OtpCode,
        expireIn: new Date().getTime() + 300 * 1000,
      });
      await OtpData.save();

      try {
        const mailTransporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "jayram.bagal.it@ghrcem.raisoni.net",
            pass: "jayram@1234",
          },
        });
        const details = {
          from: "jayram.bagal.it@ghrcem.raisoni.net",
          to: email,
          subject: `Your ClassCarft reset password OTP is ${OtpCode}`,
          text: `Your one time password for resetting the password is ${OtpCode}`,
        };

        mailTransporter.sendMail(details, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("mail send successfully");
          }
        });
      } catch (err) {
        res.send(err);
      }

      res.status(200).json({ success: "send opt done" });
    } else {
      res.status(400).json({ error: "email does not exists" });
    }
  } catch (err) {
    console.log(err);
    res.send(400);
  }
};

// validating the otp and changeing the password with new one
const ChangePass = async (req, res) => {
  const data = await Otp.findOne({ email: req.body.email, otp: req.body.Otp });

  if (data) {
    const currentTime = new Date().getTime();
    const diff = data.expireIn - currentTime;

    if (diff < 0) {
      res.status(400).json({ message: "otp is expired" });
    } else {
      const user = await User.findOne({ email: req.body.email });
      user.password = req.body.password;
      await user.save();
      res.status(200).json({ message: "reset password successfully" });
    }
  } else {
    res.status(400).json({ error: "invalid otp" });
  }
};

const HomePage = (req, res) => {
  res.status(200).send("Welcome 🙌 ");
};

// logout
const Logout = (req, res) => {
  res.clearCookie("accesssToken", { path: "/" });
  res.status(200).send("user logout");
};

module.exports = {
  Register,
  RegisterSuperUser,
  Login,
  SendMail,
  ChangePass,
  HomePage,
  GetDataById,
  UpdateDataById,
  Logout,
};
