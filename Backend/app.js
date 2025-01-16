const express=require('express')
const bodyParser=require('body-parser')
const morgan=require('morgan')
const dotenv=require('dotenv')
const cors=require("cors")
dotenv.config()
const app=express()
const connectMongodb=require('./init/mongodb')
const {authRoute, categoryRoute, fileRoute,postRoute}=require("./Routes")
const {errorHandler}=require("./middlewares")
const {notFound}=require('./controllers')
connectMongodb()

const frontedUrl=process.env.Fronted_Url
app.use(cors({origin:[frontedUrl,"https://blog-post-application-frontend.vercel.app","https://blog-post-application-frontend-git-main-charles--dev-projects.vercel.app","https://blog-post-application-frontend.vercel.app/"]}))

app.use(express.json({limit:"500mb"}))
app.use(bodyParser.urlencoded({limit:"500mb",extended:true}))
app.use(morgan('dev'))
app.use("/api/v1/auth",authRoute)
app.use("/api/v1/category",categoryRoute)
app.use("/api/v1/file",fileRoute)
app.use("/api/v1/posts",postRoute)
app.use("*",notFound)
//Error middleware
app.use(errorHandler)
module.exports=app;
