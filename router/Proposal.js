const express = require("express")
const router = express.Router()
const Authenticate = require("../Middleware/Authentication")
const {
   createProposal,
   getProposals,
   updateProposal
} = require("../controllers/sales/proposals")


// GET




// POST
router.post("/createproposal",createProposal)
router.post("/getproposals",getProposals)




// UPDATE
// router.put('/users/updateuser',UpdateDataById );
router.put('/updateproposal',updateProposal );


// EXPORTS
module.exports = router

