const express = require("express")
const router = express.Router()
const Authenticate = require("../Middleware/Authentication")
const {
  createItem,
  createGroup,
  getItems,
  getGroups,
} = require("../controllers/sales/items")


// GET




// POST
router.post("/createitem",createItem)
router.post("/creategroup",createGroup)
router.post("/getitems",getItems)
router.post("/getgroups",getGroups)




// UPDATE
// router.put('/updatecustomer',updateCustomer );


// EXPORTS
module.exports = router

