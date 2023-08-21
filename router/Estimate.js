const express = require("express")
const router = express.Router()
const Authenticate = require("../Middleware/Authentication")
const {
   createEstimate,
   getEstimates,
    updateEstimate
} = require("../controllers/sales/estimate")


// GET




// POST
router.post("/createestimate",createEstimate)
router.post("/getestimates",getEstimates)




// UPDATE
// router.put('/users/updateuser',UpdateDataById );
router.put('/updateestimate',updateEstimate );


// EXPORTS
module.exports = router

