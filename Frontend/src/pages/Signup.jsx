import { useState } from "react";
import axios from "../utils/axiosinstance";
import { toast } from "react-toastify";
import signUpValidator from "../validators/SignupValidator";
import { useNavigate } from "react-router-dom";
const Signup=()=>{
    const initialFormData={name:"",email:"",password:"",confirmPassword:""}
    const initialFormError={name:"",email:"",password:"",confirmPassword:""}
    const [formData,setFormData]=useState(initialFormData)
    const [formError,setFormError]=useState(initialFormError)
    const [loading, setLoading]=useState()
    const navigate=useNavigate()

    const handleChange=(e)=>{
        setFormData((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const errors=signUpValidator({name:formData.name,email:formData.email,password:formData.password,confirmPassword:formData.confirmPassword})
        if(errors.name || errors.email ||errors.password || errors.confirmPassword){
            setFormError(errors)
        }else{
            try{
                setLoading(true)
                const reqBody={
                    name:formData.name,
                    email:formData.email,
                    password:formData.password
                }
                const res=await axios.post("/auth/signup",reqBody)
                const data=res.data;
                toast.success(data.message,{
                    position:"top-right",
                    autoClose:true
                })
                setFormData(initialFormError)
                setFormError(initialFormError)
                setLoading(false)
                navigate("/login")
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
    return(
        <div className="form-container">
            <form action="" className="inner-container" onSubmit={handleSubmit}>
                <h2 className="form-title">SignUp Form</h2>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" name="name" placeholder="Your name..." value={formData.name} onChange={handleChange}/>
                    {formError.name && <p className="error">{formError.name}</p>}
                </div>
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
                    <label htmlFor="confirm-password"> Confirm Password</label>
                    <input type="password" placeholder="******" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} />
                    {formError.confirmPassword && <p className="error">{formError.confirmPassword}</p>}
                </div>
                <div className="form-group">
                    <input type="submit" className="button" value={`${loading ? "saving...." : "signup"}`} />
                </div>
            </form>
        </div>
    )
}
export default Signup;