const express = require("express")
const router = express.Router()
const Authenticate = require("../Middleware/Authentication")
const {
   createCustomer,
   getCustomers,
   updateCustomer
} = require("../controllers/Customer")


// GET




// POST
router.post("/createcustomer",createCustomer)
router.post("/getcustomers",getCustomers)




// UPDATE
// router.put('/users/updateuser',UpdateDataById );
router.put('/updatecustomer',updateCustomer );


// EXPORTS
module.exports = router

