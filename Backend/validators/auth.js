const {check}=require("express-validator")
const validateEmail=require("./validateEmail")
const mongoose=require("mongoose")
const signupvalidator=[
    check('name').notEmpty().withMessage("Name is required"),
    check('email').isEmail().withMessage("Invalid Email").notEmpty().withMessage("Email is required"),
    check('password').isLength({min:6}).withMessage("Password should be 6 character long").notEmpty().withMessage("password is required")
];
const signinvalidator=[
    check('email').isEmail().withMessage("Invalid Email").notEmpty().withMessage("Email is required"),
    check('password').isLength({min:6}).withMessage("Password should be 6 character long").notEmpty().withMessage("password is required")
]
const emailValidate=[
    check('email').isEmail().withMessage("Invalid Email").notEmpty().withMessage("Email is required")
]
const verifyUserValidator=[
    check('email').isEmail().withMessage("Invalid Email").notEmpty().withMessage("Email is required"),
    check('code').notEmpty().withMessage("code is required").isInt().withMessage("Only numbers are allowed")
]
const recoverPassword=[
    check('email').isEmail().withMessage("Invalid Email").notEmpty().withMessage("Email is required"),
    check('code').notEmpty().withMessage("code is required").isInt().withMessage("Only numbers are allowed"),
    check('password').isLength({min:6}).withMessage("Password should be 6 character long").notEmpty().withMessage("password is required")
]
const changePassword=[
    check('oldPassword').notEmpty().withMessage("Old password is required").isLength({min:6}).withMessage("Password should be 6 character long"),
    check("newPassword").notEmpty().withMessage("New password is required").isLength({min:6}).withMessage("Password should be 6 character long")
]
const updateProfile=[
    check('email').custom(async(email)=>{
        if(email){
            isValidEmail=validateEmail(email);
            if(!isValidEmail){
                throw new Error("Invalid Email")
            }
        }
    }),
    check("profilePic").custom(async (profilePic)=>{
        if(profilePic && !mongoose.Types.ObjectId.isValid(profilePic)){
            throw  "Invalid profile picture"
        }
    })
]
module.exports={signupvalidator,
    signinvalidator,
    emailValidate,
    verifyUserValidator,
    recoverPassword,
    changePassword,
    updateProfile
}