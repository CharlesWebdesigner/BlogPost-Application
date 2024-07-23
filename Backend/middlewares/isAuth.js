const jwt=require("jsonwebtoken")
const {jwtSecret}=require("../keys")
const isAuth=async(req,res,next)=>{
    try{
       const authorization=req.headers.authorization ? req.headers.authorization.split(" ") : []
       const token=authorization.length > 1 ? authorization[1] : null;
       if(!token){
        res.code=400;
        throw new Error("Token is required")
       }else{
        const payload=jwt.verify(token,jwtSecret)
        if(payload){
            req.user={
                _id:payload._id,
                name:payload.name,
                email:payload.email,
                role:payload.role
            }
            next()
        }else{
            res.code=401;
            throw new Error("Unauthorized")
        }
       }
    }catch(e){
        next(e)
    }
}
module.exports=isAuth