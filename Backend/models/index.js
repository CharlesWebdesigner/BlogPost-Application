const {User}=require('./User')
const category=require("./category")
const File=require('./file')
const post=require("./post")
module.exports={User, 
    category,
    Category:category,
    File,
    Post:post,
post}