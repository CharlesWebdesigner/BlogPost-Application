const multer=require("multer")
const path=require("path")
const generateCode=require("../utils/generateCode")
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./uploads");
    },
    filename:(req,file,cb)=>{
        const originalName=file.originalname
        const extension=path.extname(originalName)
        const filename=originalName.replace(extension, "")
        const compressedFilename=filename.split(" ").join("_")
        const lowerCaseFileName=compressedFilename.toLocaleLowerCase()
        const code=generateCode(12)
        const finalFile=`${lowerCaseFileName}_${code}${extension}`;
        cb(null, finalFile)
    }
})
const upload=multer({
    storage,
    fileFilter:(req,file,cb)=>{
        const mimeType=file.mimetype;
        const allowedMimeTypes=["image/jpeg","image/png","image/jpg","image/gif","image/webp"]
            if(allowedMimeTypes.includes(mimeType)){
                cb(null,true)
                }else{
                    cb(new Error("Only  .jpeg .png .jpg .gif .webp format is allowed"))
                    }}
    })
module.exports=upload