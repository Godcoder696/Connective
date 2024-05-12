const express= require("express")
const {registerUser, loginUser, allUsers}=require("../controllers/userController")
const {protect}= require("../middlewares/authMiddleware")

const router= express.Router()

router.route("/signUpUser").post(registerUser)
router.route("/logInUser").post(loginUser)
router.route("/allUsers").get(protect,allUsers) 

module.exports= router