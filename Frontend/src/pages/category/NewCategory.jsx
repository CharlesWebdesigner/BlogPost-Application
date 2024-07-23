import { useNavigate } from "react-router-dom"
import { useState } from "react";
import axios from "../../utils/axiosinstance";
import { toast } from "react-toastify";
import addCategoryValidator from "../../validators/addCategoryValidator";
const  initialFormData={
    title:"",
    desc:""
}
const initialFormError={
    title:""
}
const NewCategory=()=>{
    const [formData,setFormData]=useState(initialFormData)
    const [formError,setFormError]=useState(initialFormError)
    const [loading, setLoading]=useState()     
    const navigate=useNavigate()
    const handleChange=(e)=>{
        setFormData((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        const errors=addCategoryValidator({title:formData.title})
        if(errors.title){
            setFormError(errors)
        }else{
            try{
                setLoading(true)
                const res=await axios.post("/category",formData)
                const data=res.data;
                toast.success(data.message,{
                    position:"top-right",
                    autoClose:true
                })
                setFormData(initialFormData)
                setFormError(initialFormError)
                setLoading(false)
                navigate("/categories")
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
<div>
    <button className="button button-block" onClick={()=>navigate(-1)}>Go back</button>
    <div className="form-container">
        <form action="" className="inner-container" onSubmit={handleSubmit}>
            <h2 className="form-title">New Category</h2>
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" placeholder="Title..." className="form-control" value={formData.title} onChange={handleChange}/>
                {formError.title && <p className="error">{formError.title}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="desc">Description</label>
                <textarea type="text" name="desc" placeholder="Description..." className="form-control" value={formData.desc} onChange={handleChange}/>
            </div>
            <div className="form-group">
               <input type="submit" className="button" value={`${loading ? "Adding": "Add"}`}/>
            </div>
        </form>
    </div>
</div>
)
}
export default NewCategory