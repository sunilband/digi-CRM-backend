const express = require("express")
const router = express.Router()
const Authenticate = require("../Middleware/Authentication")
const {
    Register,
    RegisterSuperUser,
    Login,
    SendMail,
    ChangePass,
    HomePage,
    GetDataById,
    UpdateDataById,
    Logout
} = require("../controllers/auth")


// GET
router.get("/home",Authenticate,HomePage)
router.get("/logout",Logout)
router.get("/users/",GetDataById)

// POST
router.post("/register",Register)
router.post("/registerAdmin",RegisterSuperUser)
router.post("/login",Login)
router.post("/sendmail",SendMail)
router.post('/changepass',ChangePass)

// UPDATE
router.put('/users/',UpdateDataById );

// EXPORTS
module.exports = router

