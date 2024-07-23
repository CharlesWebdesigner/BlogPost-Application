const {File, Category, Post,post}=require("../models")
const addPost=async (req,res,next)=>{
    try{
        const {title,desc,file, category}=req.body
        const {_id}=req.user
        if(file){
            const isFileExist=await File.findById(file)
            if(!isFileExist){
                res.code=404;
                throw new Error("file not found")
            }
        }
        const isCategoryExist=await Category.findById(category)
        if(!isCategoryExist){
            res.code=404;
            throw new Error("Category not found")
        }
        const newPost= new post({
            title,desc,file,category,updatedBy:_id
        })
        await newPost.save()
        res.status(201).json({code:201, status:true,message:"Post added successfully"})
    }catch(e){
        next(e)
    }
}
const updatePost=async(req,res,next)=>{
    try{
        const {title,desc, file, category}=req.body
        const {id}=req.params
        const {_id}=req.user       
        if(file){
            const isFileExist=await File.findById(file)
            if(!isFileExist){
                res.code=404
                throw new Error("File not found")
            }
        }
     if(category){
        const isCategoryExist=await Category.findById(category)
        if(!isCategoryExist){
            res.code=404;
            throw new Error("Category not found")
        }
     }
        const post =await Post.findById(id) 
        post.title=title ?  title : post.title
        post.desc=desc;
        post.file=file;
        post.category=category ? category : post.category
        post.updatedBy=_id;
        if(!post){
            res.code=404;
            throw new Error("Post not found")
        }
        await post.save();
        res.status(200).json({code:200, status:true, message:"Post updated successfully",data:{post}})
    }catch(e){
        next(e)
    }
}
const deletePost=async(req,res,next)=>{
    try{
        const {id}=req.params
        const post=await Post.findById(id);
        if(!post){
            res.code=404;
            throw new Error("Post not found")
            }   
            await post.deleteOne({_id:id})
            res.status(200).json({code:200, status:true, message:"Post deleted successfully"})
    }catch(e){
        next(e)
    }
}
const getPosts=async(req,res,next)=>{
    try{
        const {page, size, q, category}=req.query;
        const sizeNumber=parseInt(size) || 10;
        const pageNumber=parseInt(page) || 1;
        let query={};
        if(q){
            const search=new RegExp(q, "i")
            query={
                $or:[{title:search}]
            }
        }
        if(category){
            query={...query, category}
        }
        const total=await Post.countDocuments(query)
        const pages=Math.ceil( total / sizeNumber)
        const posts=await Post.find(query).populate("category").populate("updatedBy", "-password -forgotPassword -verificationCode").sort({updatedBy: -1}).skip((pageNumber - 1)* sizeNumber).limit(sizeNumber);
        res.status(200).json({code:200, status:true, message:"Posts fetched successfully", data:{posts, total, pages}})
    }catch(e){
        next(e)
    }
}
const getPost=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const post=await Post.findById(id).populate("category").populate("updatedBy", "-password -forgotPassword -verificationCode");
        if(!post){
            res.code=404;
            throw new Error("Post not found")
            }
            res.status(200).json({code:200, status:true, message:"Post fetched successfully", data:{post}})
    }catch(e){
        next(e)
    }
}
const getFile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate("file").populate("updatedBy", "-password -forgotPassword -verificationCode");
        if (!post) {
            res.code = 404;
            throw new Error("Post not found");
        }
        const file = post.file;  
        if (!file) {
            res.code = 404;
            throw new Error("File not found in post");
        }
        // console.log(file.body)
        let image=file.body
        res.status(200).json({ code: 200, status: true, message: "File fetched successfully", data: { image } });

    } catch (e) {
        next(e);
    }
};

module.exports = { addPost, updatePost, deletePost, getPost };

module.exports={addPost,updatePost,deletePost,
    getPosts,
    getFile,
    getPost}