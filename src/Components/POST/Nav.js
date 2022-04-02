import { CgProfile } from "react-icons/cg"
import { MdOutlineExplore } from "react-icons/md"
import { AiOutlineSearch , AiOutlinePlusCircle} from "react-icons/ai"
import { Link } from "react-router-dom"
import { useGlobalContext } from "../context"
import "./Nav.css"
import { useState } from "react"
import { MdOutlineCancel } from "react-icons/md"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { useEffect } from "react"
const Nav = () => {
    const { user } =  useGlobalContext()
    const [focus,setFocus] = useState(false)
    const [users,setUsers] = useState([])
    const [match,setMatch] = useState(window.matchMedia("(max-width:660px)").match)
    const location = useLocation().pathname
    window.matchMedia("(max-width:660px)").addEventListener("change",(x)=>{
        if(x.matches) setMatch(true)
        else setMatch(false)
    })
    const handleFocus = ()=>{
        setFocus(true)
    }
    const handleCancelSearch = ()=>{
        setFocus(false)
    }
    const searchUser =async  (e)=>{
        try{
            const res = await axios.get(`/api/v1/auth?name=${e.target.value}`)
            setUsers(res.data.user)
        }
        catch(err){}
    }
    useEffect(()=>{
        if(window.matchMedia("(max-width:660px)").matches)
        {
            setMatch(true)
        }
    },[])
    return (
        <nav style = {{padding:(location != "/" || !match) && "0px"}}>
            <section>
                {(location != "/" || !match) && <h3>Interact</h3>}
                {
                    user && 
                <article>
                    {(location == "/" || !match) &&
                    <div className="search-container">
                        <AiOutlineSearch />
                        <input onChange = {searchUser} onFocus = {handleFocus} type="text" placeholder="search user" />
                        {focus && <MdOutlineCancel onClick={handleCancelSearch} className="search_cancel"/>}
                    </div>}
                    <div className="navigation">
                        <Link title = "post images" to = "/add"><AiOutlinePlusCircle className={location == "/add" && "loc_icon"}/></Link>
                        <Link title = "explore" to="/"><MdOutlineExplore className={location == "/" && "loc_icon"}/></Link>
                        <Link title = "profile" to="/profile"><CgProfile className={location == "/profile" && "loc_icon"}/></Link>
                    </div>
                </article>
                }
            </section>
            {focus && 
            <section className="search_user_container">
                <article>
                {users.length > 0 && users.filter(e=>e._id != user[0]._id).map(e=>{
                    const { profileImage, _id, fullName } = e
                    return (
                    <Link onClick = {()=>setFocus(false)}to = {`/user/${_id}`}>
                        <div>
                            <img src = {profileImage}/>
                            <p>{fullName}</p>
                        </div>
                    </Link>
                    )
                })} 
                </article>
            </section>
            }
        </nav>
    )
}

export default Nav;