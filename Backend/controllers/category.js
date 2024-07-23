const {category, User}=require("../models")
const addCategory=async(req,res,next)=>{
    try{
      const {title,desc}  =req.body;
      const {_id}=req.user
      const isCategoryExist=await category.findOne({title})
      if(isCategoryExist){
        res.code=400;
        throw new Error("Category already exist")
      }
      const user=await User.findById(_id)
      if(!user){
        res.code=404;
        throw new Error("User not fouund")
      }
      const newCategory=new category({
        title,
        desc,
        updatedBy:_id
      })
      await newCategory.save()
      res.status(201).json({code:200, status:true, message:"Category added successfully"})
    }catch(e){
        next(e)
    }
}
const updateCategory=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const {_id}=req.user;
        const {title,desc}=req.body;
        const Category=await category.findById(id);
        if(!Category){
            res.code=404;
            throw new Error("Category not found")
        }
        const isCategoryExist=await category.findOne({title})
        if(isCategoryExist && isCategoryExist.title === title && String(isCategoryExist._id !== String(category._id))){
            res.code=400;
            throw new Error("Title already exist")
        }
        Category.title=title ? title :  Category.title;
        Category.desc=desc ? desc : Category.desc;
        Category.updatedBy=_id;
        await Category.save()
        res.status(200).json({code:200, status:true, message:"Category updated successfully", date:{Category}}) 

    }catch(e){
        next(e)
    }
}
const deleteCategory=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const Category=await category.findById(id);
        if(!Category){
            res.code=404;
            throw new Error("Category not found")
        }
        await Category.deleteOne({_id:id})
        res.status(200).json({code:200, status:true, message:"Category deleted successfully"})
    }catch(e){
        next(e)
    }
}
const getCategories=async(req,res,next)=>{
    try{
        const {q, size, page}=req.query;
        let query={}
        const sizeNumber=parseInt(size) || 10;
        const pageNumber=parseInt(page) || 1;

        if(q){
            const search=RegExp(q, "i")
            query={$or: [{title: search},{desc: search}]}
        }
        const total=await category.countDocuments(query)
        const pages=Math.ceil(total / sizeNumber);
        const Categories=await category.find(query).skip((pageNumber - 1)* sizeNumber).limit(sizeNumber).sort({updatedBy: -1 })
        res.status(200).json({code:200, status:true, message:"Categories fetched successfully", data:{Categories, total, pages}})
    }catch(e){
        next(e)
    }
}
const getCategory=async(req,res,next)=>{
    try{
        const {id}=req.params
        const Category=await category.findById(id)
        if(!Category){
            res.code=404;
            throw new Error("Category not found")
        }
        res.status(200).json({code:200, status:true, message:"Category fetched successfully", data:{Category}})
    }catch(e){
        next(e)
    }
}
module.exports={
    addCategory,
    updateCategory,
    deleteCategory,
    getCategories,
    getCategory
}