import axios from "axios";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import Loading from "../EXTRA/Loading";
import { GrGrid } from "react-icons/gr"
import "./Profile.css"
import Popup from "./Popup";
import { Link } from "react-router-dom"
import Following from "./Following";
import { BiDotsVerticalRounded } from "react-icons/bi"
import { MdCancel } from "react-icons/md"
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import Invalid from "../AUTH/Invalid";
const Profile = ()=>{
    const [isPop,setisPop] = useState({bool:false,id:null})
    const [followPopup,setfollowPopup] = useState({bool:false,id:null,type:""})
    const [loading,setLoading] = useState(false)
    const { user,setUser } = useGlobalContext()
    const [load,setLoad] = useState(false)
    const navigate = useNavigate()
    const [isOpen,setisOpen] = useState(false)
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
    const handlePopUp = (_id)=>
    {
        setisPop({bool:!isPop.bool,id:_id})
    }
    const handleClosePopup = (e)=>{
        e.stopPropagation()
        setisPop({bool:!isPop.bool,id:null})
    }
    const handleCloseFollowPopup = (e)=>{
        e.stopPropagation()
        setfollowPopup({bool:false,id:null,type:""})
    }
    const handleLogout = async ()=>{
        try
        {
            setLoad(true)
        const res = await axios.delete(`/api/v1/auth`)
        setLoad(false)
        navigate("/login")
        }
        catch(err)
        {
            setLoad(false)
        }

    }
    useEffect(()=>{
        fetchUser()
    },[])
    if(isAuth)
    {
        return <Invalid/>
    }
    if(loading)
    {
        return <Loading/>
    }
    return (
        <>
            <section className="profile-section">
            {user && 
            user.map((user)=>{
                const { profileImage, bio, fullName, posts, followers, following , post, _id} = user
                return (
                <div className="profile-div">
                <article className="user-article">
                    <div className="profile-image">
                        <Link to = "/editProfile"><img src = {profileImage} alt = {fullName}/></Link>
                    </div>
                    <div className="user-name">
                        <h3>{fullName}</h3>
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
                    <BiDotsVerticalRounded onClick = {()=>setisOpen(true)}className="logout_icon"/>
                    {isOpen &&
                        <div className="logout_container">
                            <div>
                                <div><MdCancel className="cancel" onClick={()=>setisOpen(false)}/></div>
                                <div onClick = {handleLogout}>{load ? <AiOutlineLoading3Quarters className="l_icon"/> : "LogOut"}</div>
                                <div onClick={()=>navigate("/login")}>Login</div>
                            </div>
                        </div>
                    }   
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
            handleClosePopup = {handleClosePopup}
            isPop = {isPop}
            setisPop = {setisPop}
            />}
            {followPopup.bool && <Following
            handleCloseFollowPopup = {handleCloseFollowPopup}
            followPopup = {followPopup}
            />}
            </>
            )
}

export default Profile;