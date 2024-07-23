import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../utils/axiosinstance";
import { toast } from "react-toastify";
import addPostValidator from "../../validators/addPostValidator";

const initialFormData = {
  title: "",
  desc: "",
  category: "",
};
const initialFormError = {
  title: "",
  category: "",
};

const NewPost = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [extensionError, setExtensionError] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [isDisable,setIsDisable]=useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(`/category?size=1000`);
        const data = response.data.data;
        setCategories(data.Categories);
      } catch (e) {
        const res = e.response;
        const data = res.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
      }
    };
    getCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = addPostValidator({ 
         title: formData.title,
         category: formData.category
         });
    if (errors.title || errors.category) {
      setFormError(errors);
    } else {
      try {
        setLoading(true);
  
        let input =formData;
        if (fileId) {
          input={...input,file:fileId}
        }
        const res = await axios.post("/posts", input);
        const data = res.data;
        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });
        setFormData(initialFormData);
        setFormError(initialFormError);
        setLoading(false);
        navigate("/posts");
      } catch (e) {
        console.log(e)
        const res = e.response;
        const data = res.data;
        toast.error(data.data, {
          position: "top-right",
          autoClose: true,
        });
        setLoading(false);  // Reset loading state on error
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formInput = new FormData();
    formInput.append("image", file);
    const type = file.type;
    if (type === "image/png" || type === "image/jpg" || type === "image/jpeg") {
      setExtensionError(null);
      try {
        setIsDisable(true)
        const res = await axios.post("/file/upload", formInput);
        const data = res.data;
        setFileId(data.data._id);
        toast.success(data.message, {
          position: "top-right",
          autoClose: true,
        });
        setIsDisable(false)
      } catch (e) {
        setIsDisable(false)
        const res = e.response;
        const data = res.data;
        toast.error(data.message, {
          position: "top-right",
          autoClose: true,
        });
      }
    } else {
      setExtensionError("Only .png .jpg .jpeg files are allowed");
    }
  };

  return (
    <div>
      <button className="button button-block" onClick={() => navigate(-1)}>Go Back</button>
      <div className="form-container">
        <form className="inner-container" encType="multipart/form-data" onSubmit={handleSubmit}>
          <h2 className="form-title">New Post</h2>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              placeholder="Title..."
              value={formData.title}
              onChange={handleChange}
            />
            {formError.title && <p className="error">{formError.title}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="desc">Description</label>
            <textarea
              name="desc"
              id="desc"
              className="form-control"
              placeholder="Your text..."
              value={formData.desc}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="image">Select an Image</label>
            <input
              type="file"
              className="form-control"
              name="file"
              placeholder="Image..."
              onChange={handleFileChange}
            />
            {extensionError && <p className="error">{extensionError}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="category">Select category</label>
            <select
              name="category"
              id="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="" disabled>Select category</option>
              {categories.map((category) => (
                <option value={category._id} key={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
            {formError.category && <p className="error">{formError.category}</p>}
          </div>
          <div className="form-group">
            <input
              type="submit"
              className="button"
                disabled={isDisable}
              value={`${loading ? "Adding..." : "Add"}`}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPost;
