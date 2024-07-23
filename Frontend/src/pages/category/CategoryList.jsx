import moment from 'moment';
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import axios from "../../utils/axiosinstance"
import {Modal,Button} from "react-bootstrap"
const CategoryList = () => {
    const [loading,setLoading]=useState(false)
    const [categories,setCategories]=useState([])
    const [totalPage,setTotalPage]=useState(1)
    const [currentPage,setCurrentPage]=useState(1)
    const [pageCount,setPageCount]=useState([])
    const [show, setShow] = useState(false);
    const [search,setSearch]=useState("")
    const [categoryId,setCategoryId]=useState(null)
    const navigate = useNavigate()
    useEffect(() => {
        const getCategories = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`/category?page=${currentPage}&q=${search}`);
                const data = response.data.data;
                setTotalPage(data.pages)
                if (data && data.Categories) {
                    setCategories(data.Categories)
                } else {
                    console.error('Expected an array of categories, but got:', data)
                }
                setLoading(false)
            } catch (e) {
                setLoading(false)
                const res = e.response;
                const data = res.data;
                toast.error(data.message, {
                    position: "top-right",
                    autoClose: true,
                })
            }
        }
        getCategories()
    }, [currentPage])
    useEffect(()=>{
        if(totalPage > 1){
            let tempPageCount=[]
            for(let i=1;i<=totalPage;i++){
                tempPageCount=[...tempPageCount, i]
            }
            setPageCount(tempPageCount)
        }else{
            setPageCount([])
        }
    },[totalPage])
    const handlePrev=()=>{
        setCurrentPage((prev)=>prev -1)
    }
    const handleNext=()=>{
        setCurrentPage((prev)=>prev + 1)
    }
    const handlePage=(pageNumber)=>{
        setCurrentPage(pageNumber)
    }
    const handleSearch=async(e)=>{
        try{
            const input=e.target.value;
            setSearch(input)
            const response=await axios.get(`/category?q=${input}&page=${currentPage}`)
            const data=response.data.data
            setCategories(data.Categories)
            setTotalPage(data.page)
        }catch(e){
            const res=e.response;
                const data = res.data;
                toast.error(data.message, {
                    position: "top-right",
                    autoClose: true,
                }) 
        }
    }
    const handleDelete=async()=>{
        try{
            const response=await axios.delete(`/category/${categoryId}`)
            const data=response.data;
            setShow(false)
            toast.success(data.message, {
                position: "top-right",
                autoClose: true,
                })
                const response2 = await axios.get(`/category?page=${currentPage}&q=${search}`);
                const data2 = response2.data.data;
                setTotalPage(data2.pages)
                setCategories(data2.Categories)
        }catch(e){
            const res=e.response;
            setShow(false)
                const data = res.data;
                toast.error(data.message, {
                    position: "top-right",
                    autoClose: true,
                })   
        }
    }
    // console.log(pageCount)
    return (
        <div>
            <button className="button button-block" onClick={() => navigate("new-category")}>Add new Category</button>
            <h2 className="table-title">Category List</h2>
            <input type="text" name="search" placeholder="search here" className="search-input" value={search} onChange={(e) => handleSearch(e)}/>
            <br /> <br />
           {loading ? 'Loading...': (
             <table>
             <thead>
                 <tr>
                     <th>Title</th>
                     <th>description</th>
                     <th>Created At</th>
                     <th>updated at</th>
                     <th>Action</th>
                 </tr>
             </thead>
             <tbody>
 {categories.map((category) => (
     <tr key={category._id}>
         <td>{category.title}</td>
         <td>{category.desc}</td>
         <td>{moment(category.createdAt).format('YYYY-MM-DD HH:mm')}</td>
         <td>{moment(category.updatedAt).format('YYYY-MM-DD HH:mm')}</td>
         <td>
             <button className="button" onClick={() => navigate(`update-category/${category._id}`)}>Update</button>
             <button className="button" onClick={()=>{setShow(true);setCategoryId(category._id)}}>Delete</button>
         </td>
     </tr>
 ))}
</tbody>
         </table>
           )}
           <br />
         {pageCount .length >1 && (
              <div className="page-container">
              <button className="page-button" onClick={handlePrev} disabled={currentPage === 1}>prev</button>
                {pageCount.map((pageNumber,index)=>(
                    <button className="page-button" key={index} onClick={()=>handlePage(pageNumber)} style={{backgroundColor:currentPage === pageNumber ?"#ccc":""}}>{pageNumber}</button>
                ))}
              <button className="page-button" onClick={handleNext} disabled={currentPage ===totalPage}>next</button>
             </div>
         )}

         <Modal show={show} onHide={()=>{setShow(false);setCategoryId(null)}}>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure you want to delete ?</Modal.Title>
                    <br />
        <Modal.Footer style={{ justifyContent: 'center' }}>
    <div style={{ margin: '0 auto',marginTop:"5px" }}>
        <Button className='no-button' onClick={() => {setShow(false);setCategoryId(null)}}>No</Button>
        <Button className="yes-button" onClick={handleDelete}>Yes</Button>
    </div>
    </Modal.Footer>
            </Modal.Header>
         </Modal>
        </div>
    )
}

export default CategoryList