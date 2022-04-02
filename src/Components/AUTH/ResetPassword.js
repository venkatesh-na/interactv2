import axios from "axios"
import { useState ,useEffect} from "react";
import Loading from "../EXTRA/Loading";
import { useLocation , useNavigate} from "react-router-dom";
const useQuery = ()=>{
    return new URLSearchParams(useLocation().search)
}
const ResetPassword = ()=>{
    const [loading,setLoading] = useState(false)
    const [message,setMessage] = useState({status:"",message:""})
    const query = useQuery()
    const navigate = useNavigate()
    const [usernewPassword, setusernewPassword] = useState("")
    const verifyEmail = async (e)=>{
        e.preventDefault()
        try
        {
        setLoading(true)
        const result = await axios.post("/api/v1/auth/resetPassword",{email:query.get("email"),passwordToken:query.get("token"),newPassword:usernewPassword})
        setLoading(false)
        setMessage({status:"success",message:result.data.msg})
        setTimeout(() => {
            navigate("/login")
        }, 3000);
        }
        catch(err)
        {
            setLoading(false)
            setMessage({status:"failure",message:err.response.data.msg})
        }
    }
    useEffect(()=>{
        verifyEmail()
    },[])
    return (
        <section className="forgot-password">
            {message && <p className = {message.status === "success" ? "success" : "failure"}>{message.message}</p>}
            <h3>Reset Password</h3>
            <article>
                <form>
                    <input type = "text" onChange = {(e)=>setusernewPassword(e.target.value)} value = {usernewPassword} placeholder="new password"/>
                    <button onClick = {verifyEmail} type = "submit">{loading ? <Loading/> : "Reset Password"}</button>
                </form>
            </article>
        </section>
    )
}

export default ResetPassword;