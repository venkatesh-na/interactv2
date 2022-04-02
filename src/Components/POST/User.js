import axios from "axios";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import Loading from "../EXTRA/Loading";
import { GrGrid } from "react-icons/gr"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { IoChevronBack } from "react-icons/io5"
import { Link } from "react-router-dom"
import "./Profile.css"
import Popup from "./Popup";
import Following from "./Following";
import { useParams } from "react-router-dom";
const User = ()=>{
    const [loading,setLoading] = useState(false)
    const [isPop,setisPop] = useState({bool:false,id:null})
    const [data,setData] = useState(null)
    const [followLoading,setfollowLoading] = useState(false)
    const [followPopup,setfollowPopup] = useState({bool:false,id:null,type:""})
    const { id } = useParams()
    const { user,setUser } = useGlobalContext()
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
    const fetchOtherUser = async ()=>{
        try
        {
        setLoading(true)
        const result = await axios.get(`/api/v1/auth/${id}`)
        setData([{...result.data.user}])
        setLoading(false)
        }
        catch(err)
        {

        }
    }
    const followUser = async (userId)=>{
        try{
            setfollowLoading(true)
            const res = await axios.post(`/api/v1/auth/follow`,{
                userId
            })
            let following = [...user[0].following]
            following.push({user:userId})   
            setUser([{...user[0],following}])
            let followers = [...data[0].followers]
            followers.push({user:user[0]._id})
            setData([{...data[0],followers}])
            setfollowLoading(false)
        }
        catch(err)
        {
            setfollowLoading(false)

        }
    }
    useEffect(()=>{
        fetchUser()
        fetchOtherUser()
    },[])
    const handlePopUp = (_id)=>
    {
        setisPop({bool:!isPop.bool,id:_id})
    }
    const handleClosePopup = (e)=>{
        console.log(e)
        e.stopPropagation()
        setisPop({bool:!isPop.bool,id:null})
    }
    const handleCloseFollowPopup = (e)=>{
        e.stopPropagation()
        setfollowPopup({bool:false,id:null,type:""})
    }
    if(loading)
    {
        return <Loading/>
    }
    return (
        <>
            <section className="profile-section user_section">
            {data && 
            data.map((e)=>{
                const { profileImage, bio, fullName, posts, followers, following , post, _id} = e
                return (
                <div className="profile-div">
                    <div>
                        <Link to = "/"><IoChevronBack className="back"/></Link>
                        <p>{fullName}</p>
                    </div>
                <article className="user-article"   >
                    <div className="profile-image">
                        <img src = {profileImage} alt = {fullName}/>
                    </div>
                    <div className="user-name">
                            <h3>{fullName}</h3>
                            {user[0].following.findIndex(e=>e.user == _id) == -1 && <p onClick={()=>followUser(_id)}>{followLoading ? 
                            <AiOutlineLoading3Quarters className="l_icon"/> : "follow"}</p>}
                    </div>
                    <div className="follow">
                        <div>
                            <p>{posts}</p>
                            <p>posts</p>
                        </div>
                        <div>
                            <p>{followers.length}</p>
                            <p onClick = {()=>setfollowPopup({bool:true,id:_id,type:"followers"})}>followers</p>
                        </div>
                        <div>
                            <p>{following.length}</p>
                            <p onClick = {()=>setfollowPopup({bool:true,id:_id,type:"following"})}>following</p>
                        </div>
                    </div>
                    <div className="bio">
                       <p>{bio}</p>
                    </div>
                </article>
                <article className="post-article">
                    <div className="tab">
                        <div>
                            <GrGrid className="grid-icon"/>
                            <p>posts</p>
                        </div>
                    </div>
                    <div className="posts-container">
                        <div className="posts">
                            {post && 
                            post.map(e=>{
                                const {images, _id} = e
                                return (
                                    <div onClick = {()=>handlePopUp(_id)} 
                                    key = {_id}>
                                        <img src = {images[0]}/>
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>
                </article>
                </div>
                )
            })}
            </section>
            {isPop.bool && <Popup 
            id = {isPop.id} 
            handleClosePopup = {handleClosePopup}/>}
               {followPopup.bool && <Following
            handleCloseFollowPopup = {handleCloseFollowPopup}
            followPopup = {followPopup}
            />}
            </>
            )
}

export default User;