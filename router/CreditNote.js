const express = require("express");
const router = express.Router();
const Authenticate = require("../Middleware/Authentication");
const {
  createCreditNote,
  getCreditNotes,
  updateCreditNote,
} = require("../controllers/sales/creditNote");

// GET

// POST
router.post("/createcreditnote", createCreditNote);
router.post("/getcreditnotes", getCreditNotes);

// UPDATE
// router.put('/users/updateuser',UpdateDataById );
router.put("/updatecreditnote", updateCreditNote);

// EXPORTS
module.exports = router;
