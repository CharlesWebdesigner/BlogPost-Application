import { useState,useEffect } from "react";
import {useNavigate} from "react-router-dom"
import axios from "../utils/axiosinstance";
import { toast } from "react-toastify";
import ProfileValidator from "../validators/ProfileValidator";
const Profile=()=>{
    const initialFormData={name:"",email:""}
    const initialFormError={name:"",email:""}
    const navigate=useNavigate()
    const [formData,setFormData]=useState(initialFormData)
    const [formError,setFormError]=useState(initialFormError)
    const [oldEmail,setOldEmail]=useState(null)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`/auth/current-user`);
                const data = response.data.data;
                setFormData({name:data.user.name,email:data.user.email})
                setOldEmail(data.user.email)          
            } catch (e) {
                const res = e.response;
                const data = res.data;
                toast.error(data.message, {
                    position: "top-right",
                    autoClose: true,
                })
            }
        }
        getUser()
    }, [])
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const errors=ProfileValidator({name:formData.name,email:formData.email})
        if(errors.name || errors.email){
            setFormError(errors)
        }else{
            try{
                setLoading(true)
                const reqBody={
                    name:formData.name,
                    email:formData.email
                }
                const res=await axios.put("/auth/update-profile",formData)
                const data=res.data;
                toast.success(data.message,{
                    position:"top-right",
                    autoClose:true
                })
                setFormError(initialFormError)
                setLoading(false)
                if(oldEmail !== formData.email){
                    localStorage.removeItem("blogData")
                    navigate("/login")
                }
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
    const handleChange=(e)=>{
        setFormData((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    return(
        <div>
        <button className="button button-block" onClick={() => navigate(-1)}>
          Go Back
        </button>
  
        <div className="form-container">
          <form className="inner-container" onSubmit={handleSubmit}>
            <h2 className="form-title">Update profile</h2>
            <div className="form-group">
              <label>Name</label>
              <input
                className="form-control"
                type="text"
                name="name"
                placeholder="Your name..."
                value={formData.name}
                onChange={handleChange}
              />
              {formError.name && <p className="error">{formError.name}</p>}
            </div>
  
            <div className="form-group">
              <label>Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Your email..."
                value={formData.email}
                onChange={handleChange}
              />
              {formError.email && <p className="error">{formError.email}</p>}
            </div>
  
            <div className="form-group">
              <input
                className="button"
                type="submit"
                value={`${loading ? "Updating..." : "Update"}`}
              />
            </div>
          </form>
        </div>
      </div>
    )
}
export default Profile