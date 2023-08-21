const express = require("express");
const router = express.Router();
const Authenticate = require("../Middleware/Authentication");
const {
  createInvoice,
  getInvoices,
  updateInvoice,
} = require("../controllers/sales/invoice");

// GET

// POST
router.post("/createinvoice", createInvoice);
router.post("/getinvoices", getInvoices);

// UPDATE
// router.put('/users/updateuser',UpdateDataById );
router.put("/updateinvoice", updateInvoice);

// EXPORTS
module.exports = router;
