const express=require("express")
const router=express.Router()
const {authController}=require('../controllers')
const {signupvalidator,signinvalidator,emailValidate,verifyUserValidator,recoverPassword
    ,changePassword
    ,updateProfile
}=require('../validators/auth')
const validate=require("../validators/validate")
const isAuth=require('../middlewares/isAuth')

router.post("/signup",signupvalidator,validate, authController.signup)
router.post("/signin",signinvalidator,validate,authController.signin)
router.post("/send-verification-email",emailValidate,validate,authController.verifyCode)
router.post('/verify-user',verifyUserValidator,validate,authController.verifyUser)
router.post('/forgot-password',emailValidate,validate,authController.forgotPassword)
router.post("/recover-password",recoverPassword,validate,authController.recoverPassword)

router.get("/current-user",isAuth,authController.currentUser)

router.put("/change-password",isAuth,changePassword,validate,authController.changePassword)
router.put('/update-profile',isAuth,updateProfile,validate,authController.updateProfile)
module.exports=router;