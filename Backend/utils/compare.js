const bcrypt=require("bcryptjs")
const comparePassword=(password,hashedpassword)=>{
  const data=bcrypt.compare(password,hashedpassword)
  // console.log(data,password,"hello from hash")
  return  data
}
module.exports=comparePassword;