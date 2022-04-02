import axios from "axios";
import { useState , useEffect} from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { useGlobalContext } from "../context";
import "./EditProfile.css"

const EditProfile = ()=>{
    const [loading,setLoading] = useState(false)
    const [updateLoading,setupdateLoading] = useState(false)
    const [imageLoading,setimageLoading] = useState(false)
    const [data,setData] = useState({profileImage:"",bio:""})
    const { user ,setUser} = useGlobalContext()
    const [message,setMessage] = useState({type:"",msg:""})
     const fetchUser = async ()=>{
        try
        {
        setLoading(true)
        const result = await axios.get("/api/v1/auth/showMe")
        setUser([{...result.data.user}])
        setLoading(false)
        }
        catch(err)
        {

        }
    }
    useEffect(()=>{
        fetchUser()
    },[])
    const upload = async (e)=>{
        const formData = new FormData()
        formData.append("image",e.target.files[0])
        setimageLoading(true)
        try{
        const res = await axios.post(`/api/v1/post/uploadImage`,formData,{
                "Content-Type":"multipart/form-data"

            })
            setData({...data,profileImage:res.data.img.src})
            setimageLoading(false)
        }
        catch(err){
            setMessage({type:"danger",msg:err.data.msg || "something went wrong"})
        }
    }
    const updateProfile = async (e)=>{  
        e.preventDefault()
        let object = {}
        for(let a in data)
        {
            if(data[a])
                object[a] = data[a]
        }
        try
        {        
        setupdateLoading(true)
        const res = await axios.patch(`/api/v1/auth/${user[0]._id}`,object)
        setData({profileImage:"",bio:""})
        setupdateLoading(false)
        setMessage({type:"success",msg:res.data.msg})
        setTimeout(()=>{
            setMessage({type:"",msg:""})
        },3000)
        }
        catch(err){
            console.log(err)
            setupdateLoading(false)
        }
    }
    return (
        <section className="edit_section">
            <article>
                <div>
                    <h1>Edit Profile</h1>
                </div>
                {message.msg && <p className={message.type}>{message.msg}</p>}
                <form>  
                    <div>
                        <input onChange = {(e)=>upload(e)} type = "file"/>
                        {imageLoading && <AiOutlineLoading3Quarters className="l_icon"/>}
                    </div>
                    <textarea 
                    value = {data.bio} 
                    onChange={(e)=>setData({...data,bio:e.target.value})}>
                    </textarea>
                    <button 
                    disabled = {updateLoading ? true : false}
                    onClick = {(e)=>updateProfile(e)}>{updateLoading ? <AiOutlineLoading3Quarters className="l_icon"/> : "update"}</button>
                </form>
            </article>
        </section>
    )
}

export default EditProfile;