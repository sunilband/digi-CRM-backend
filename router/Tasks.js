const express = require("express")
const router = express.Router()
const Authenticate = require("../Middleware/Authentication")
const {
   createTask,
   getTasks,
   updateTask
} = require("../controllers/Tasks")


// GET




// POST
router.post("/createtask",createTask)
router.post("/gettasks",getTasks)




// UPDATE
// router.put('/users/updateuser',UpdateDataById );
router.put('/updatetask',updateTask );


// EXPORTS
module.exports = router

