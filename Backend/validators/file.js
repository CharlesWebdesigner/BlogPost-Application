const validateExtension=(ext)=>{
    const validExtensions = ['jpg','jpeg','png','gif','bmp','webp'];
    if(validExtensions){
        return true;
    }else{
        return false;
    }
}
module.exports=validateExtension