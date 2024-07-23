const { User }=require("../models")
const hashedPassword=require('../utils/hashed')
const comparePassword=require("../utils/compare")
const generateToken=require('../utils/generateToken')
const generateCode=require('../utils/generateCode')
const sendMail=require('../utils/sendEmail')
const File=require("../models/file")
const signup=async(req,res,next)=>{
    const {name,email,password,role}=req.body;
try{
 const isEmailExist=await User.findOne({email})
//  console.log(isEmailExist)
 if(isEmailExist){
    res.code=400;
    throw new Error("Email already exist")
 }
 const hashedpassword=await hashedPassword(password)
const newUser=new User({name, email, password:hashedpassword, role})
await newUser.save()
res.status(201).json({code:201, status:true, message:"User registered successfully"})
}catch(e){
    console.log(e)
  next(e)  
}
}
const signin=async(req,res,next)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email})
        if(!user){
            res.code=401;
            throw new Error("Invalid credentials")
        }
        const match=await comparePassword(password,user.password)
        if(!match){
            res.code=401;
            throw new Error("Invalid credentials")
        }
        user.password=undefined;
        const token=generateToken(user);
        res.status(200).json({code:200, status:true, message:"User logged in successfully",data:{token,user}})
    }catch(e){
        next(e)
    }
}

const verifyCode=async(req,res,next)=>{
    try{
const {email}=req.body;
const user=await User.findOne({email})
if(!user){
    res.code=401;
    throw new Error("User not found")
}
if(user.isVerified){
    res.code=401;
    throw new Error("User already verified")
}
const code=generateCode(6);
user.verificationCode=code;
await user.save();
await sendMail({
    emailTo:user.email,
    subject:"Email verification code",
    code,
    content:"verify your account"
})
res.status(200).json({code:200, status:true, message:"Verification code sent successfully"})
    }catch(e){
        next(e)
    }
}
const verifyUser=async(req,res,next)=>{
    try{
        const {email,code}=req.body;
        const user=await User.findOne({email});
        if(!user){
            res.code=404;
            throw new Error("User not found")
        }
        if(user.verificationCode.toString().trim() !== code.toString().trim()){
            console.log(user.verificationCode, code)
            res.code=400;
            throw new Error("Invalid verification code")
        }
        user.isVerified=true;
        user.verificationCode=null;
        await user.save();
        res.status(200).json({code:200, status:true, message:"User verified successfully"})

    }catch(e){
        next(e)
    }
}
const forgotPassword=async(req,res,next)=>{
    try{
const {email}=req.body
const user=await User.findOne({email})
if(!user){
    res.code=404;
    throw new Error("User not found")
}
const code=generateCode(6)
user.forgotPassword=code;
await user.save()
await sendMail({
    emailTo:user.email,
    subject:"Password reset code",
    code,
    content:"reset your password"
    })
    res.status(200).json({code:200, status:true, message:"Password reset code sent successfully"})
    }catch(e){
        next(e)
    }
}
const recoverPassword=async(req,res,next)=>{
    try{
        const { email,code,password}=req.body;
        const user=await User.findOne({email})
        if(!user){
            res.code=404;
            throw new Error("User not found")
        }
        if(user.forgotPassword.toString().trim() !== code.toString().trim()){
            res.code=400;
            throw new Error("Invalid verification code")
            }
            const hashedpassword=await hashedPassword(password)
            user.password=hashedpassword;
            user.forgotPassword=null;
            await user.save()
            res.status(200).json({code:200, status:true, message:"Password reset successfully"})
    }catch(e){
        next(e)
    }
}
const changePassword=async(req,res,next)=>{
    try{
        const {oldPassword,newPassword}=req.body;
        // console.log(req.user)
        const{_id}=req.user
        const user=await User.findById(_id)
        if(!user){
            res.code=404;
            throw new Error("User not found")
        }
        const isMatch=await comparePassword(oldPassword,user.password)
        console.log(isMatch)
        if(!isMatch){
            res.code=400;
            throw new Error("Old password doesn't match")
        }
        if(oldPassword === newPassword){
            res.code=400;
            throw new Error("New password can't be same as old password")
        }
        const hashedpassword=await hashedPassword(newPassword)
        user.password=hashedpassword;
        await user.save()
        res.status(200).json({code:200, status:true, message:"Password changed successfully"})
    }catch(e){
        next(e)
    }
}
const updateProfile=async(req,res,next)=>{
    try{
const {_id}=req.user;
const {name,email, profilePic}=req.body;
const user = await User.findById(_id, {
    password: 0,
    verificationCode: 0,
    forgotPassword: 0,
    isVerified: 0,
    role: 0,
  });
  
if(!user){
    res.code=404;
    throw new Error("User not found")
}
user.name=name ? name :user.name;
user.email=email ? email : user.email;
user.profilePic=profilePic;
if(email){
    const isUserExist=await User.findOne({email})
    if(isUserExist && isUserExist.email === email && String(user._id) !== String(isUserExist._id)){
        res.code=400;
        throw new Error("Email already exists")
    }
}
if(profilePic){
const file=await File.findById(profilePic);
if(!file){
    res.code=404;
    throw new Error("File not found")
}
}
await user.save()
res.status(200).json({code:200, status:true, message:"user updated successfully", data:{user}})
    }catch(e){
        next(e)
    }
}
const currentUser=async (req,res,next)=>{
    try{
        const {_id}=req.user;
        const user=await User.findById(_id).select("-password -forgotPassword -verificationCode").populate("profilePic")
        if(!user){
            res.code=404;
            throw new Error("User not found")
        }
        res.status(200).json({code:200, status:true, message:"Get current user successfully", data:{user}})
    }catch(e){
        next(e)
    }
}
module.exports={
    signup,
    signin,
    verifyCode,
    verifyUser,
    forgotPassword,
    recoverPassword,
    changePassword,
    updateProfile,
    currentUser
}