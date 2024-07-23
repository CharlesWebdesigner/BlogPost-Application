import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../utils/axiosinstance";
import { toast } from "react-toastify";
import { useAuth } from "../components/context/AuthContext";
import changePassword from "../validators/ChangePasswordValidator";
const Setting=()=>{
    const auth=useAuth();
    const [loading, setLoading]=useState()
    const initialFormData={oldPassword:"",newPassword:""}
    const initialFormError={oldPassword:"",newPassword:""}
    const [formData,setFormData]=useState(initialFormData)
    const [formError,setFormError]=useState(initialFormError) 
    const navigate=useNavigate()
    const handleChange=(e)=>{
        setFormData((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const errors=changePassword({oldPassword:formData.oldPassword,newPassword:formData.newPassword})
        if(errors.oldPassword ||errors.newPassword){
            setFormError(errors)
        }else{
            try{
                setLoading(true)
                const res=await axios.put("/auth/change-password",formData)
                const data=res.data;
                toast.success(data.message,{
                    position:"top-right",
                    autoClose:true
                })
                setFormData(initialFormData)
                setFormError(initialFormError)
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
    return(
        <div>
        <button className="button button-block" onClick={() => navigate(-1)}>
          Go Back
        </button>
        {!auth.isVerified && (
          <button
            className="button button-block"
            onClick={() => navigate("/verify-user")}
          >
            Verify user
          </button>
        )}
  
        <div className="form-container">
          <form className="inner-container" 
          onSubmit={handleSubmit}
          >
            <h2 className="form-title">Change Password</h2>
            <div className="form-group">
              <label>Old password</label>
              <input
                className="form-control"
                type="password"
                name="oldPassword"
                placeholder="*****"
                value={formData.oldPassword}
                onChange={handleChange}
              />
              {formError.oldPassword && (
                <p className="error">{formError.oldPassword}</p>
              )}
            </div>
  
            <div className="form-group">
              <label>New password</label>
              <input
                className="form-control"
                type="password"
                name="newPassword"
                placeholder="*****"
                value={formData.newPassword}
                onChange={handleChange}
              />
              {formError.newPassword && (
                <p className="error">{formError.newPassword}</p>
              )}
            </div>
  
            <div className="form-group">
              <input
                className="button"
                type="submit"
                value={`${loading ? "Changing..." : "Change"}`}
              />
            </div>
          </form>
        </div>
      </div>
    )
}
export default Setting