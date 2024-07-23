import axios from "axios";
const axiosInstance=axios.create({baseURL:"http://localhost:5000/api/v1"})
axiosInstance.interceptors.request.use((req)=>{
    const stringBlogData=localStorage.getItem("blogData")
    if(stringBlogData){
        const blogData=JSON.parse(stringBlogData)
        const token=blogData.token;
        req.headers.Authorization=`Bearer ${token}`
    }
    return req
})
export default axiosInstance;