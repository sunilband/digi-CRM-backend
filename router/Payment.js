const express = require("express")
const router = express.Router()
const Authenticate = require("../Middleware/Authentication")
const {
  createPayment,
getPayments,
} = require("../controllers/sales/payment")


// GET




// POST
router.post("/createpayment",createPayment)
router.post("/getpayments",getPayments)





// UPDATE
// router.put('/updatecustomer',updateCustomer );


// EXPORTS
module.exports = router

