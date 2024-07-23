const path =require("path")
const validateExtension=require("../validators/file")
const {uploadFileToMongo}=require("../utils/files")
const File=require("../models/file")
const uploadFile=async (req,res,next)=>{
    try{
        const {file}=req;
        if(!file){
            res.code=400;
            throw new Error("File is not selected")
        }
        const ext=path.extname(file.originalname)
        const isValidExt=validateExtension(ext)
        if(!isValidExt){
            res.code=400;
            throw new Error("Only .jpg .jpeg .png format is allowed")
        }
        const key=await uploadFileToMongo({file, ext})
        let newFile=null;
        let data=key.key
        if(key){
             newFile=new File({
                key:data,
                size:file.size,
                body:file.buffer,
                mimetype:file.mimetype,
                createdBy:req.user._id
            })
            await newFile.save()
        }
        // console.log(newFile)
        res.status(201).json({code:201, status:true, message:"file uploaded successfully",data:{key, _id:newFile._id}})
    }catch(e){
        next(e)
    }
}
const deleteFile=async (req,res,next)=>{
    try{
        const {key}=req.query;
        await File.findOneAndDelete({key})
        res.status(200).json({code:200, status:true, message:"file deleted successfully"})
    }catch(e){
        next(e)
    }
}
module.exports={uploadFile,deleteFile}