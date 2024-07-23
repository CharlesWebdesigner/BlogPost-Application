import { useState } from "react";
import axios from "../utils/axiosinstance";
import { toast } from "react-toastify";
import sendCodeValidator from "../validators/sendCodeValidator";
import recoverPassword from "../validators/RecoverPassword";
import { useNavigate } from "react-router-dom";
const ForgotPassword=()=>{
    const navigate=useNavigate();
    const initialFormData={email:"",password:"",code:""}
    const initialFormError={password:"",code:""}
    const [formData,setFormData]=useState(initialFormData)
    const [formError,setFormError]=useState(initialFormError)
    const [emailError,setEmailError]=useState("")
    const [hasEmail,setHasEmail]=useState(false)
    const [loading, setLoading]=useState()
    const handleChange=(e)=>{
        setFormData((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const handleSendCode=async(e)=>{
        e.preventDefault();
        const errors=sendCodeValidator({email:formData.email});
        if(errors.email){
            setEmailError(errors.email)
        }else{
            try{
                setLoading(true)
                const res=await axios.post("/auth/forgot-password",{email:formData.email})
                const data=res.data;
                setHasEmail(true)
                toast.success(data.message,{
                    position:"top-right",
                    autoClose:true
                })
                setLoading(false)
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
    const handleRecoverPassword=async(e)=>{
        e.preventDefault();
        const errors=recoverPassword({code:formData.code,password:formData.password})
        if(errors.code || errors.password ){
            setFormError(errors)
        }else{
            try{
                setLoading(true)
                const res=await axios.post("/auth/recover-password",formData)
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
        <form
          className="inner-container"
          onSubmit={!hasEmail ? handleSendCode : handleRecoverPassword}
        >
          <h2 className="form-title">{`${
            !hasEmail ? "Recover Password" : "New Password"
          }`}</h2>
  
          {!hasEmail ? (
            <div className="form-group">
              <label>Email</label>
              <input
                className="form-control"
                type="text"
                name="email"
                placeholder="Your email..."
                value={formData.email}
                onChange={handleChange}
              />
              {emailError && <p className="error">{emailError}</p>}
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>code</label>
                <input
                  className="form-control"
                  type="text"
                  name="code"
                  placeholder="123456"
                  value={formData.code}
                  onChange={handleChange}
                />
                {formError.code && <p className="error">{formError.code}</p>}
              </div>
  
              <div className="form-group">
                <label>New Password</label>
                <input
                  className="form-control"
                  type="password"
                  name="password"
                  placeholder="*****"
                  value={formData.password}
                  onChange={handleChange}
                />
                {formError.password && (
                  <p className="error">{formError.password}</p>
                )}
              </div>
            </>
          )}
  
          <div className="form-group">
            <input
              className="button"
              type="submit"
              value={`${loading ? "Sending..." : "Send"}`}
            />
          </div>
        </form>
      </div>
    )
}
export default ForgotPassword