const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser')
const BodyParser = require("body-parser")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
require('dotenv').config()

app.use(cors())
app.use(cookieParser())
app.use(BodyParser.json())
app.use(BodyParser.urlencoded({extended:false}))

// Route
app.use(require("./router/auth"))
app.use(require("./router/Tasks"))
app.use(require("./router/Lead"))
app.use(require("./router/Customer"))
app.use(require("./router/Item"))
app.use(require("./router/Proposal"))
app.use(require("./router/Estimate"))
app.use(require("./router/Invoice"))
app.use(require("./router/CreditNote"))
app.use(require("./router/Payment"))


const port  = process.env.PORT || 5002
const path = process.env.DB_PATH

app.get("/",(req,res)=>{
  res.send("Hello from the server")
})

// connecting to the Database
mongoose.connect(path)
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(err));

// connectiong to the server 
app.listen(port,async ()=>{
  console.log(`Your port is ${port}`)
});

export default app;