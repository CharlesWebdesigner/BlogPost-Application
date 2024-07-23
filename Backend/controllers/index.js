const authController=require('./auth')
const notFound=require('./notFound')
const categoryController=require("./category")
const fileController=require('./files')
const postController=require("./post")
module.exports={authController,
    notFound,
    categoryController,
    fileController,
    postController
}