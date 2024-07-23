const mongoose=require("mongoose")
const {mongo_url}=require('../keys')
const connectMongodb=async()=>{
    try{
    await mongoose.connect(mongo_url)
    console.log("database up and running")
    }catch(e){
        console.log(e.message)
    }
}
module.exports=connectMongodb;