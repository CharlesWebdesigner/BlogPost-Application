const mongoose=require("mongoose")
const fileSchema=mongoose.Schema({
    key:{type:String, required:true},
    size:Number,
    mimetype:String,
    body:{type:Buffer,contentType:String},
    // body:String,
    createdBy:{type:mongoose.Types.ObjectId,ref:"user"}
},
{timestamps:true}
);
const File=mongoose.model("file",fileSchema)
module.exports=File