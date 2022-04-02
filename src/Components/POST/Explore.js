import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import "./Explore.css"
import Popup from "./Popup";
import { useGlobalContext } from "../context";
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import Invalid from "../AUTH/Invalid";

const Explore = () => {
    const [data, setData] = useState([])
    const [isPop,setisPop] = useState({bool:false,id:null})
     const { user,setUser } = useGlobalContext()
     const [loading,setLoading] = useState(false)
     const [tags,setTags] = useState("")
     const [isAuth,setisAuth] = useState(false)
    const fetchUser = async ()=>{
        try
        {
            const result = await axios.get("/api/v1/auth/showMe")
            setUser([{...result.data.user}])
        }
        catch(err)
        {
            setisAuth(true)
        }
    }
    useEffect(()=>{
        fetchUser()
    },[])
    const fetchAllPost = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`/api/v1/post`)
            setData(res.data.posts)
            console.log(res.data.posts)
            setLoading(false)
        }
        catch (err) {
            setLoading(false)
        }
    }
     const handlePopUp = (_id)=>
    {
        setisPop({bool:!isPop.bool,id:_id})
    }
    const handleClosePopup = (e)=>{
        console.log(e)
        e.stopPropagation()
        setisPop({bool:!isPop.bool,id:null})
    }
    const handleFilterPost = async (e)=>{
        if(e.target.dataset.id == "tag")
        {
            try
            {
            const res = await axios.get(`/api/v1/post?${e.target.dataset.id}=${tags}`)
            setData(res.data.posts)
            setTags("")
            }
            catch(err){}
            return;
        }
        try
        {
            const res = await axios.get(`/api/v1/post?${e.target.dataset.id}=true`)
            setData(res.data.posts)
        }
        catch(err)
        {

        }
    }
    useEffect(() => {
        fetchAllPost()
    }, [])
    if(isAuth) return <Invalid/>
    return (
        <>
        <section className="explore_section">
            <article>
                <div className="tabs">
                    <button onClick = {()=>fetchAllPost()} data-id = "all">All</button>
                    <button onClick= {(e)=>handleFilterPost(e)} data-id = "mostLiked">MostLiked</button>
                    <button onClick = {(e)=>handleFilterPost(e)} data-id = "mostDisliked">MostDisliked</button>
                    <div>
                        <input onChange = {(e)=>setTags(e.target.value)} type="text" placeholder="eg: dance" />
                        <button data-id = "tag" onClick= {(e)=>handleFilterPost(e)}>Search</button>
                    </div>
                </div>
            </article>
            <article className="post_article">
                {loading ? <div className="explore_load"><AiOutlineLoading3Quarters className="l_icon"/></div> :
                <div className="post_div">
                    {data.map(post => {
                        const { images } = post
                        return (
                            <div onClick = {()=>handlePopUp(post._id)}>
                                <img src={images[0]}/>
                            </div>
                        )
                    })}
                </div>
                }
            </article>
        </section>
        {isPop.bool && <Popup 
        id = {isPop.id} 
        handleClosePopup = {handleClosePopup}
        isPop = {isPop}
        setisPop = {setisPop}
        data = {data}
        setData = {setData}
        />}
        </>
    )
}

export default Explore;