const generateCode=require("./generateCode")
const uploadFileToMongo=async ({file,ext})=>{
const key=`${generateCode(12)}_${Date.now()}${ext}`;
const params={
    // Body:file.buffer,
    key,
    ContentType:file.mimetype
}
return params
}
module.exports={uploadFileToMongo}