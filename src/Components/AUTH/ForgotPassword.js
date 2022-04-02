import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Loading from "../EXTRA/Loading"
import "./ForgotPassword.css"
const ForgotPassword = ()=>{
     const [loading,setLoading] = useState(false)
    const [message,setMessage] = useState({status:"",message:""})
    const [userEmail,setuserEmail] = useState("")
    const getLink = async (e)=>{
        e.preventDefault()
        try
        {
            setLoading(true)
        const result = await axios.post("/api/v1/auth/forgotPassword",{email:userEmail})
        setLoading(false)
        setMessage({status:"success",message:result.data.msg})
        setuserEmail("")
        }
        catch(err)
        {
            setLoading(false)
        setMessage({status:"failure",message:err.response.data.msg})
        }
    }
    return (
        <section className="forgot-password">
            {message && <p className = {message.status === "success" ? "success" : "failure"}>{message.message}</p>}
            <h3>Trouble Logging In?</h3>
            <article>
                <form>
                    <input onChange = {(e)=>setuserEmail(e.target.value)} value = {userEmail} type = "text" placeholder="email"/>
                    <button onClick = {getLink} type = "submit">{loading ? <Loading/> : "Get Reset Password Link"}</button>
                </form>
            </article>
            <p>Don't have an Account?<Link to = "/register">Register</Link></p>
        </section>
    )
}

export default ForgotPassword;