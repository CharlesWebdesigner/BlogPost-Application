const bcrypt=require("bcryptjs")
const hashedPassword=(password)=>{
return new Promise((resolve,reject)=>{
    bcrypt.genSalt(12,(err,salt)=>{
        if(err){
            return reject(err)
        }
        bcrypt.hash(password,salt,(err,hash)=>{
            if(err){
                return reject(err)
            }
            resolve(hash)
        })
    })
})
}
module.exports=hashedPassword