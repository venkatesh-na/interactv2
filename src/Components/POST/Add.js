import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { useGlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
import "./Add.css"
import Invalid from "../AUTH/Invalid";
const Add = ()=>{
    const [data,setData] = useState({images:[],tags:[]})
    const [images,setImages] = useState([])
    const [tags,setTags] = useState("")
    const [imageLoad,setImageLoad] = useState(false)
    const { user,setUser } = useGlobalContext()
    const [loading,setLoading] = useState(false)
    const [postLoading,setpostLoading] = useState(false)
    const [message,setMessage] = useState({type:"",msg:""})
    const navigate = useNavigate()
    const [isAuth,setisAuth] = useState(false)
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
            setisAuth(true)
        }
    }
    useEffect(()=>{
        fetchUser()
    },[])
    const upload = async (e)=>{
        if(e.target.name == "image")
        {
            setImageLoad(true)
            const formData = new FormData()
            formData.append("image",e.target.files[0])
            try
            {
            const res = await axios.post(`/api/v1/post/uploadImage`,formData,{
                "Content-Type":"multipart/form-data"
            })
            setImages([...images,res.data.img.src])
            setImageLoad(false)
            }
            catch(err)
            {

            }
        }
        else if(e.target.name == "tags")
        {
            setTags(e.target.value)
        }
    }
    const handleClick = async (e)=>{
        e.preventDefault()
        let tag = tags.match(/([#]\w{2,15})/g)
        if(tag)
        {
            setData({...data,tags:tag})
        }
        else
            setData({...data,tags:[]})
        if(data.images.length < 1)
        {
            setMessage({type:"danger",msg:"Please choose image file"})
            return;
        }
        try
        {
            setpostLoading(true)
            const res = await axios.post(`/api/v1/post`,data)
            setData({images:[],tags:[]})
            setImages([])
            setTags("")
            setMessage({type:"success",msg:"Image Posted"})
            setpostLoading(false)
            setTimeout(()=>{
                setMessage({type:"",msg:""  })
                navigate("/profile")
            },3000)
        }
        catch(err)
        {
            setMessage({type:"danger",msg:err.data.msg})
        }
    }
    
    useEffect(()=>{
        setData({...data,images})
    },[images])
    if(isAuth) return <Invalid/>
    return (
        <section className="post_image_section">
            <form>
                {message.msg ? <p className= {message.type}>{message.msg}</p> : ""}
                <div>
                    <input name = "image" onChange = {(e)=>upload(e)} type = "file"/>
                    {data.images.length > 0 && <input name = "image" onChange = {(e)=>upload(e)} type = "file"/>}
                    {data.images.length > 1 && <input name = "image" onChange = {(e)=>upload(e)} type = "file"/>}
                    {data.images.length > 2 && <input name = "image" onChange = {(e)=>upload(e)} type = "file"/>}
                    {data.images.length > 3 && <input name = "image" onChange = {(e)=>upload(e)} type = "file"/>}
                    {imageLoad ? <AiOutlineLoading3Quarters className="l_icon"/> : ""}
                </div>
                <textarea onChange = {(e)=>upload(e)} value = {tags} name = "tags" placeholder="eg: #game #dance #cricket">
                </textarea>
                <button
                disabled = {postLoading ? true : false} 
                onClick={(e)=>handleClick(e)}>{postLoading ? <AiOutlineLoading3Quarters className="l_icon"/> : "Post"}</button>
            </form>
        </section>
    )
}
export default Add;