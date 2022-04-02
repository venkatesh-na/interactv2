import { useState } from "react"
import { Link } from "react-router-dom"
import "./Register.css"
import axios from "axios"
import Loading from "../EXTRA/Loading"
import { useGlobalContext } from "../context"
const Register = ()=>{
    const { registerData, setRegisterData } = useGlobalContext()
    const [loading,setLoading] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)
    const [message,setMessage] = useState({status:"",message:""})

    const handleRegisterInput = async (e)=>{
        if(e.target.name === "profileImage")
        {
            const Form = new FormData()
            Form.append("image",e.target.files[0])
            try
            {
                setImageLoading(true)
                const result = await axios.post("/api/v1/post/uploadImage",Form,{
                    headers:{
                        "Content-Type":"multipart/form-data"
                    }
                })
                setImageLoading(false)
                setRegisterData({...registerData,profileImage:result.data.img.src})
                return;
            }
            catch(err)
            {
                console.log(err)
                return;
            }
        }
        setRegisterData({...registerData,[e.target.name]:e.target.value})
    }

    const RegisterUser = async (e)=>{
        e.preventDefault()
        try
        {
        setLoading(true)
        const response = await axios.post("/api/v1/auth/register",registerData)
        setLoading(false)
        setMessage({ status:"success",message:response.data.msg })
        setRegisterData({firstName:"",lastName:"",email:"",password:"",profileImage:""})
        setTimeout(()=>{
            setMessage({status:"",message:""})
        },3000)
        }
        catch(err)
        {
            setLoading(false)
            setMessage({ status:"failure",message:err.response.data.msg })
        }
    }
    return (
        <section className="register-container">
            {message && <p className = {message.status === "success" ? "success" : "failure"}>{message.message}</p>}
            <h1>Register</h1>
            <article>
                <form>
                    <input 
                    type = "text" 
                    name = "firstName" 
                    placeholder="firstName" 
                    value = {registerData.firstName} 
                    onChange={handleRegisterInput}/>
                    <input 
                    type = "text" 
                    name = "lastName" 
                    placeholder="lastName" 
                    value = {registerData.lastName}
                    onChange={handleRegisterInput}/>
                    <input 
                    type = "text" 
                    name = "email" 
                    placeholder="email" 
                    value = {registerData.email}
                    onChange={handleRegisterInput}/>
                    <input 
                    type = "password" 
                    name = "password" 
                    placeholder="password"
                    value={registerData.password}
                    onChange={handleRegisterInput}/>
                    <input 
                        type = "file" 
                        name = "profileImage" 
                        placeholder="image"
                        onChange={handleRegisterInput}/>
                        {(imageLoading || loading) && <p className = "image-loading"><Loading/>image uploading</p>}
                    <button 
                    type = "submit" onClick={RegisterUser} disabled = {(loading || imageLoading) ? true : false}>{loading ? <Loading/> : "Register"}</button>
                </form>
            </article>
            <p>lready have an acccount ?<Link to = "/login">Login</Link></p>
        </section>
    )
}

export default Register;