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
    GetAllusers,
    GetAdmins,
    GetManagers,
    GetDataById,
    UpdateDataById,
    Logout
} = require("../controllers/auth")


// GET
router.get("/home",Authenticate,HomePage)
router.get("/logout",Logout)
router.get("/users/",GetDataById)
router.get("/users/getallusers",GetAllusers)
router.get("/users/getalladmins",GetAdmins)
router.get("/users/getmanagers",GetManagers)



// POST
router.post("/register",Register)
router.post("/registerAdmin",RegisterSuperUser)
router.post("/login",Login)
router.post("/sendmail",SendMail)
router.post('/changepass',ChangePass)

// UPDATE
router.put('/users/updateuser',UpdateDataById );

// EXPORTS
module.exports = router

