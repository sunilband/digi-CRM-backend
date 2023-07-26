const express = require("express")
const router = express.Router()
const Authenticate = require("../Middleware/Authentication")
const {
   createLead,
   getLeads,
   updateLead
} = require("../controllers/leads")


// GET




// POST
router.post("/createlead",createLead)
router.post("/getleads",getLeads)





// UPDATE
router.put('/updatelead',updateLead );



// EXPORTS
module.exports = router

