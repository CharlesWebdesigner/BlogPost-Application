import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from "react-toastify"
import axios from "../utils/axiosinstance"
import { useAuth } from "../components/context/AuthContext"

const VerifyUser=()=>{
    const auth=useAuth();
    const [loading,setLoading]=useState(false)
    const [loading2,setLoading2]=useState(false)
    const [code,setCode]=useState("")
    const [codeError,setCodeError]=useState("")
    const navigate=useNavigate()
    const handleSendVerificationCode=async (e)=>{
        e.preventDefault();
        try{
            setLoading(true)
            const res=await axios.post("/auth/send-verification-email",{email:auth.email})
            const data=res.data;
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
    const handleSubmit=async (e)=>{
        e.preventDefault();
        if(code){
            try{
                setLoading2(true)
                const res=await axios.post("/auth/verify-user",{email:auth.email,code:code})
                const data=res.data;
                toast.success(data.message,{
                    position:"top-right",
                    autoClose:true
                })
                setCode("")
                setCodeError("")
                localStorage.removeItem("blogData")
                setLoading2(false)
                navigate("/login")
            }catch(e){
                setCode("")
                setCodeError("")
                const res=e.response;
                const data = res.data;
                toast.error(data.message, {
                    position: "top-right",
                    autoClose: true,
                })
            }
        }else{
            setCodeError("Please enter the verification code")
        }
    }
    return (
        <div>
        <button className="button button-block" onClick={() => navigate(-1)}>
          Go Back
        </button>
        <button
          className="button button-block"
          onClick={handleSendVerificationCode}
        >{`${loading ? "Sending..." : "Send verification code"}`}</button>
  
        <div className="form-container">
          <form className="inner-container" onSubmit={handleSubmit}>
            <h2 className="form-title">Verify User</h2>
            <div className="form-group">
              <label>Confirmation code</label>
              <input
                className="form-control"
                type="text"
                name="code"
                placeholder="789654"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {codeError && <p className="error">{codeError}</p>}
            </div>
  
            <div className="form-group">
              <input
                className="button"
                type="submit"
                value={`${loading2 ? "Verifying..." : "Verify"}`}
              />
            </div>
          </form>
        </div>
      </div>
    )
}
export default VerifyUser