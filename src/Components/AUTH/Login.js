import { useState } from "react"
import { Link , useNavigate} from "react-router-dom"
import "./Login.css"
import axios from "axios"
import Loading from "../EXTRA/Loading"
import { useGlobalContext } from "../context"

const Login = ()=>{
    const { loginData, setLoginData } = useGlobalContext()
    const [loading,setLoading] = useState(false)
    const [message,setMessage] = useState({status:"",message:""})
    const navigate = useNavigate()
    const handleLoginInput = (e)=>{
        setLoginData({...loginData,[e.target.name]:e.target.value})
    }
    const LoginUser = async (e)=>{
        e.preventDefault()
        try
        {
            setLoading(true)
        const result = await axios.post("/api/v1/auth/login",loginData)
        setLoading(false)
        setMessage({status:"success",message:result.data.msg})
        setLoginData({email:"",password:""})
        setTimeout(()=>{
            navigate("/")
        },3000)
        }
        catch(err)
        {
            setLoading(false)
            setMessage({status:"failure",message:err.response.data.msg})
        }
    }
    return (
        <section className="login-container">
              {message && <p className = {message.status === "success" ? "success" : "failure"}>{message.message}</p>}
            <h1>INTERACT</h1>
            <article>
                <form>
                    <input name = "email" type = "text" value = {loginData.email} onChange = {handleLoginInput} placeholder="email"/>
                    <input name = "password" type = "password" value = {loginData.password} onChange = {handleLoginInput} placeholder="password"/>
                    <p><Link to = "/forgot-password">Forgot password?</Link></p>
                    <button type= "submit" disabled = {loading ? true : false} onClick = {LoginUser}>{loading ? <Loading/> : "Login"}</button>
                </form>
            </article>
            <p>Don't have an account?<Link to = "/register">register</Link></p>
        </section>
    )
}

export default Login;