import axios from "axios";
import { AiOutlineLike } from "react-icons/ai"
import { AiFillLike } from "react-icons/ai"
import { AiOutlineDislike } from "react-icons/ai"
import { AiFillDislike } from "react-icons/ai"
import { FcLike } from "react-icons/fc"
import { IoMdHeartEmpty } from "react-icons/io"
import { useState } from "react";
import { useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { MdDelete } from "react-icons/md" 
import { BiDotsVerticalRounded } from "react-icons/bi"
import { useGlobalContext } from "../context";
import { MdOutlineCancel } from "react-icons/md"
import { Link } from "react-router-dom"
import { IoChevronBackCircleSharp } from "react-icons/io5"
import {IoChevronForwardCircleSharp } from "react-icons/io5"
import { IoChevronBackOutline } from "react-icons/io5"
import "./Popup.css"

const Popup = ({id,handleClosePopup,isPop,setisPop,data,setData})=>{
    const [post,setPost] = useState(null)
    const [comments,setComments] = useState([])
    const [lload,setlLoad] = useState(false)
    const [dload,setdLoad] = useState(false)
    const [loading,setLoading] = useState(false)
    const [input,setInput] = useState("")
    const { user, setUser } = useGlobalContext()
    const [match,setMatch] = useState(window.matchMedia("(max-width:900px)").matches && true)
    const [pop,setPop] = useState(false)
    const [postLoad,setpostLoad] = useState(false)
    const [message,setMessage] = useState({type:"",msg:""})
   
    window.matchMedia("(max-width:900px)").addEventListener("change",(e)=>{
        if(e.matches)
        {
            setMatch(true)
        }
        else
        {
            setMatch(false)
        }
    })

    const fetchData = async ()=>{
        try
        {   
            setpostLoad(true)
            const response = await axios.get(`/api/v1/post/${id}`)
            setPost([response.data.post])
            const res = await axios.post("/api/v1/comment",{
                postId:id
            })
            setComments(res.data.comment)
            setpostLoad(false)
        }
        catch(err)
        {
            setpostLoad(false)
            console.log(err)
        }
    }
    const handleLike = async (productId,userId)=>{
        try{
            setlLoad(true)
            const res = await axios.patch(`/api/v1/post/likePost/${productId}`)
            let likeArr = [...post[0].likes]
            let dislikeArr = [...post[0].dislikes]
            let index = likeArr.findIndex(e=>e.user == userId)
            let dislikeIndex = dislikeArr.findIndex(e=>e.user == userId)
            if(index == -1)
                likeArr.push({user:userId})
            else
                likeArr.splice(index,1)
            if(dislikeIndex != -1)
            {
                dislikeArr.splice(dislikeIndex,1)
            }
            setPost([{...post[0],likes:likeArr,likeCount:likeArr.length,dislikes:dislikeArr,dislikeCount:dislikeArr.length}])
            setlLoad(false)
        }
        catch(err)
        {
            setlLoad(false)
        }
    }
    const handleDislike = async (productId,userId)=>{
        try
        {
            setdLoad(true)
        const res = await axios.patch(`/api/v1/post/dislikePost/${productId}`)
            let arr = [...post[0].dislikes]
            let likeArr = [...post[0].likes]
            let likeIndex = likeArr.findIndex(e=>e.user == userId)
            let index = arr.findIndex(e=>e.user == userId)
            if(index == -1)
                arr.push({user:userId})
            else
                arr.splice(index,1)
            if(likeIndex != -1)
            {
                likeArr.splice(likeIndex,1)
            }
            setPost([{...post[0],dislikes:arr,dislikeCount:arr.length,likes:likeArr,likeCount:likeArr.length}])
            setdLoad(false)
        }    
        catch(err)
        {
            setdLoad(false)
        }
    }
    const postComment = async (productId)=>{
        try
        {
            setLoading(true)
            const res = await axios.post(`/api/v1/comment/${productId}`,{
                description:input
            })
            console.log(res)
            setComments([...comments,res.data.comment[0]])
            setLoading(false)
            setInput("")
        }
        catch(err){
            setLoading(false)
            setMessage({type:"fail",msg:err.response.data.msg})
            setTimeout(()=>{
                setMessage({type:"",msg:""})
            },3000)
        }
    }
    const handleCommentDelete = async (commentId)=>{
        try{
            const res = await axios.delete(`/api/v1/comment/${commentId}`)
            setComments(comments.filter(e=>e._id != commentId))
        }catch(err)
        {

        }
    }
    const handleCommentLike = async (commentId,productId,userId)=>{
        const res = await axios.patch(`/api/v1/comment/like/${productId}/${commentId}`)
        let likeArr = [...comments.filter(e=>e._id == commentId)[0].likes]
        let index = likeArr.findIndex(e=>e.user == user[0]._id)
        let dislikeArr = [...comments.filter(e=>e._id == commentId)[0].dislikes]
        let disIndex = dislikeArr.findIndex(e=>e.user == user[0]._id)
        console.log(index,disIndex)
        if(index == -1)
        {
            likeArr.push({user:userId})
        }
        else
        {
            likeArr.splice(index,1)
        }
        if(disIndex != -1)
        {
            dislikeArr.splice(disIndex,1)
        }
        setComments(comments.map(e=>{
            if(e._id == commentId)
            {
                e.likes = likeArr
                e.likeCount = likeArr.length
                e.dislikes = dislikeArr
                e.dislikeCount = dislikeArr.length
            }
                return e;
        }))
    }
    const handleCommentDislike = async (commentId,productId,userId)=>{
        const res = await axios.patch(`/api/v1/comment/dislike/${productId}/${commentId}`)
        let dislikeArr = [...comments.filter(e=>e._id == commentId)[0].dislikes]
        let index = dislikeArr.findIndex(e=>e.user == user[0]._id)
        let likeArr = [...comments.filter(e=>e._id == commentId)[0].likes]
        let likeIndex = likeArr.findIndex(e=>e.user == user[0]._id)

        if(index == -1)
        {
            dislikeArr.push({user:userId})
        }
        else
        {
            dislikeArr.splice(index,1)
        }
        if(likeIndex != -1)
        {
            likeArr.splice(likeIndex,1)
        }
        setComments(comments.map(e=>{
            if(e._id == commentId)
            {
                e.dislikes = dislikeArr
                e.dislikeCount = dislikeArr.length
                e.likeCount = likeArr.length
                e.likes = likeArr
            }
            return e;
        }))
    }
    const handlePop = ()=>{
        setPop(!pop)
    }
    const handleDeletePost = async (productId)=>{
        try{
            const res = await axios.patch(`/api/v1/post/${productId}`)
            setUser([{...user[0],post:user[0].post.filter(e=>e._id != productId),posts:user[0].post.filter(e=>e._id != productId).length}])
            if(data && setData)
            {
                setData(data.filter(e=>e._id != productId))
            }
            setisPop({bool:false,id:null})
        }
        catch(err){}
    }
    let amount = 0
    const handleDirection = (e)=>{
        let length = post[0].images.length
        if(e.currentTarget.dataset.id == "back")
        {
            if(amount == 0) amount = length-1
            else amount -= 1
           e.currentTarget.parentElement.children[0].children[0].children[0].src = post[0].images[amount]
        }
        else if(e.currentTarget.dataset.id == "forward")
        {
            if(amount == length-1) amount = 0
            else amount += 1
             e.currentTarget.parentElement.children[0].children[0].children[0].src = post[0].images[amount]
        }
    }
    useEffect(()=>{
        fetchData()
    },[])

    return (
        <div onClick = {(e)=>handleClosePopup(e)} className="popup">
        <section onClick = {(e)=>e.stopPropagation()}className="popup_section">
            {match && 
            <div className="post_top">
                <IoChevronBackOutline className = "back" onClick = {(e)=>handleClosePopup(e)}/>
                <p>{data ? "Explore" : "Post"}</p>
            </div>}
            {
                (post && !postLoad) ?
                post.map(data=>{
                    const { _id:productId,images,dislikeCount,likeCount,likes,dislikes,tags,comment ,user:{fullName,_id:userId, profileImage}} = data
                    return (
                        <>
                        <article className="pos_header">
                            <Link to = {user[0]._id == userId ? "/profile" : `/user/${userId}`}>
                            <div>
                                <img src = {profileImage}/>
                                <p>{fullName}</p>
                            </div>
                            </Link>
                            {(pop && (userId == user[0]._id)) &&  
                            <div className="post_modifiy_div">
                                <div>
                                    <MdOutlineCancel onClick={handlePop}/>
                                </div>
                                <div onClick={()=>handleDeletePost(productId)}>Delete</div>
                            </div>}
                            {((userId == user[0]._id) && !pop) &&
                            <BiDotsVerticalRounded onClick = {handlePop}/>}
                        </article>
                        <article className="image-container">
                            <div>
                            {
                                <div>
                                    <img src = {images[0]}/>
                                </div>
                            }
                            </div>
                            {post[0].images.length > 1 &&
                            <>
                                <div data-id = "back" onClick = {(e)=>handleDirection(e)} className = "back_image">
                                    <IoChevronBackCircleSharp/>
                                </div>
                                <div data-id = "forward" onClick = {(e)=>handleDirection(e)} className = "forward_image">
                                    <IoChevronForwardCircleSharp/>
                                </div>
                            </> 
                            }
                        </article>
                        <article className="post_footer">
                            <div>
                                {lload ? <AiOutlineLoading3Quarters className="l_icon"/> :
                               (likes.filter(e=>e.user == user[0]._id).length == 1 ? 
                               <FcLike onClick = {()=>handleLike(productId,user[0]._id)}/> : <IoMdHeartEmpty onClick = {()=>handleLike(productId,user[0]._id)}/>)}
                               {dload ? <AiOutlineLoading3Quarters className="l_icon"/> :
                               (dislikes.filter(e=>e.user == user[0]._id).length == 1 ? 
                               <AiFillDislike onClick = {()=>handleDislike(productId,user[0]._id)}/> : <AiOutlineDislike onClick = {()=>handleDislike(productId,user[0]._id)}/>)}
                            </div>
                            <div>
                                <p><span>{likeCount}</span>likes</p>
                                <p><span>{dislikeCount}</span>dislikes</p>
                            </div>
                        </article>
                        <article className="comment-form">
                            <input value = {input} onChange = {(e)=>setInput(e.target.value)} disabled = {comments.filter(e=>e.user._id == user[0]._id).length == 1 ? true : false}type = "text"/>
                            <button onClick = {()=>postComment(productId)} disabled = {comments.filter(e=>e.user._id == user[0]._id).length == 1 ? true : false}>{loading ? <AiOutlineLoading3Quarters className="l_icon"/> : "Post"}</button>
                        </article>  
                        <article className="comments">
                            <div className="all_comment">
                                {
                                    comments.length > 0 &&
                                    comments.map(com=>{
                                        const {_id:commentId,description,dislikeCount, likeCount,user:{ fullName,_id:comuserId,profileImage }} = com
                                        return (
                                            <div>
                                                <div className="comment_user_image">
                                                    <div>
                                                        <img src = {profileImage}/>
                                                        <p>{fullName}</p>
                                                    </div>
                                                    {comuserId == user[0]._id ? <MdDelete 
                                                    className="trash"
                                                    onClick = {()=>handleCommentDelete(commentId)}
                                                    /> : ""}
                                                </div>
                                                <p className="desc">{description}</p>
                                                <div className="like_dis">
                                                    <div>
                                                        {comments.filter(e=>e._id == com._id)[0].likes.findIndex(e=>e.user == user[0]._id) == -1 ? 
                                                        <AiOutlineLike onClick = {()=>handleCommentLike(commentId,productId,user[0]._id)}
                                                        className="thumb"/> : 
                                                        <AiFillLike onClick = {()=>handleCommentLike(commentId,productId,user[0]._id)}
                                                        className="thumb"/>
                                                        }
                                                        <p>{likeCount}</p>
                                                    </div>
                                                    <div>       
                                                        {comments.filter(e=>e._id == com._id)[0].dislikes.findIndex(e=>e.user == user[0]._id) == -1 ? 
                                                        <AiOutlineDislike onClick = {()=>handleCommentDislike(commentId,productId,user[0]._id)}className="thumb"/> : 
                                                        <AiFillDislike onClick = {()=>handleCommentDislike(commentId,productId,user[0]._id)}className="thumb"/>
                                                        }
                                                        <p>{dislikeCount}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </article>       
                        </>
                    )
                }) :
                <div className="post_load">
                    <AiOutlineLoading3Quarters className="l_icon"/>
                </div>
            }
        </section>
        {message.msg && <p className={`${message.type} float_message`}>{message.msg}</p>}
    </div>
    )
}

export default Popup;