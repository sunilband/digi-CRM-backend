const express = require("express")
const router = express.Router()
const Authenticate = require("../Middleware/Authentication")
const {
   createTask,
   getTasks
} = require("../controllers/Tasks")


// GET
router.get("/gettasks",getTasks)




// POST
router.post("/createtask",createTask)



// UPDATE
// router.put('/users/updateuser',UpdateDataById );

// EXPORTS
module.exports = router

