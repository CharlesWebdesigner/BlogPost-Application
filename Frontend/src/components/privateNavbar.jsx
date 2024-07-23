import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const PrivateNavbar=()=>{
    const navigate=useNavigate()
    const handleLogOut=()=>{
        localStorage.removeItem("blogData");
        toast.success("Logout Successfully",{
            position:"top-right",
            autoClose:true
        });
        navigate("/login")
    }
return (
    <nav className="primary-link">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/categories">Categories</NavLink>
        <NavLink to="/posts">Posts</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/setting">Setting</NavLink>
        <NavLink to="/login" onClick={handleLogOut}>Logout</NavLink>
    </nav>
)
}
export default PrivateNavbar;