import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"
import { IoChevronBack } from "react-icons/io5"
import { AiOutlineLoading3Quarters } from "react-icons/ai" 
import { useGlobalContext } from "../context"
import "./Following.css"
import  { useNavigate } from "react-router-dom"

const Following = ({followPopup,handleCloseFollowPopup})=>{
    const [usersFollowings,setusersFollowing] = useState([])
    const [loading,setLoading] = useState(false)
    const [load,setLoad] = useState(false)
    const { user, setUser } = useGlobalContext()    
    const navigate = useNavigate()
    const fetchFollowing = async ()=>{
        try{
        setLoading(true)
        const res = await axios.get(`/api/v1/auth/${followPopup.type}/${followPopup.id}`)
        setusersFollowing(res.data.user)
        setLoading(false)
        }
        catch(err){
            setLoading(false)
        }
    }
    const handleClick = async (_id)=>{
        try{
            setLoad(true)
            const res = await axios.post(`/api/v1/auth/follow`,{
            userId:  _id
            })
            if(res.data.msg == "followed")
            {
                setUser([{...user[0],following:[...user[0].following,{user:_id}]}])
            }
            else if(res.data.msg == "unfollowed")
            {
               setUser([{...user[0],following:user[0].following.filter(e=>e.user != _id)}])
            }
            setLoad(false)
        }
        catch(err)
        {
            setLoad(false)
        }
    }
    useEffect(()=>{
        fetchFollowing()
    },[])
    return (
        <section className="user_following_section" onClick={(e)=>handleCloseFollowPopup(e)}>
            <article onClick={(e)=>e.stopPropagation()}>
                <div>
                    <IoChevronBack onClick = {(e)=>handleCloseFollowPopup(e)} className="back"/>
                    <p>{followPopup.type}</p>
                </div>
                {
                    loading ? <div className="follow_load"><AiOutlineLoading3Quarters/></div> :
                <div className="user_list">
                    {usersFollowings.length > 0 && 
                    usersFollowings.map(e=>{
                        const { _id, fullName, profileImage } = e
                        return (
                            <div key = {_id}>
                                <div>
                                    <img src = {profileImage}/>
                                    <p>{fullName}</p>
                                </div>
                                {_id != user[0]._id &&
                                <>
                                {user[0].following.findIndex(e=>e.user == _id) == -1 ? 
                                <button className="follow" onClick={()=>handleClick(_id)}>{load ? <AiOutlineLoading3Quarters/> : "follow"}</button> : 
                                <button className = "following" onClick={()=>handleClick(_id)}>{load ? <AiOutlineLoading3Quarters/> :  "following"}</button>}
                                </>}
                            </div>
                        )
                    })}
                </div>
}
            </article>
        </section>
    )
}
export default Following;
