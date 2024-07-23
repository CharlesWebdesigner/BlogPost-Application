import { useState } from "react";
import axios from "../utils/axiosinstance";
import { toast } from "react-toastify";
import loginValidator from "../validators/loginValidators";
import { useNavigate } from "react-router-dom";
const Login=()=>{
    const initialFormData={email:"",password:""}
    const initialFormError={email:"",password:""} 
    const [formData,setFormData]=useState(initialFormData)
    const [formError,setFormError]=useState(initialFormError)
    const [loading, setLoading]=useState()  

    const navigate=useNavigate()

    const handleChange=(e)=>{
        setFormData((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const errors=loginValidator({email:formData.email,password:formData.password})
        if(errors.email ||errors.password){
            setFormError(errors)
        }else{
            try{
                setLoading(true)
                const res=await axios.post("/auth/signin",formData)
                const data=res.data;
                window.localStorage.setItem('blogData',JSON.stringify(data.data))
                toast.success(data.message,{
                    position:"top-right",
                    autoClose:true
                })
                setFormData(initialFormData)
                setFormError(initialFormError)
                setLoading(false)
                navigate("/")
            }catch(e){
                const res=e.response;
                const data = res.data;
                toast.error(data.message, {
                    position: "top-right",
                    autoClose: true,
                })
            }
        }
    }
     return (
        <div className="form-container">
            <form action="" className="inner-container" onSubmit={handleSubmit}>
                <h2 className="form-title">Login Form</h2>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="Your email..." name="email" className="form-control" value={formData.email} onChange={handleChange}/>
                    {formError.email && <p className="error">{formError.email}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="******" name="password" className="form-control" value={formData.password} onChange={handleChange}/>
                    {formError.password && <p className="error">{formError.password}</p>}
                </div>
                <div className="form-group">
                    <input type="submit" className="button" value={`${loading ? "Logging...." : "Login"}`} />
                </div>
            </form>
        </div>
    )
}
export default Login