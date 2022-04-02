import { useState } from "react";
import Loading from "../EXTRA/Loading";
import { Link , useLocation} from "react-router-dom"
import "./EmailVerify.css"
import axios from "axios"
import { useEffect } from "react";
const useQuery = ()=>{
    return new URLSearchParams(useLocation().search)
}
const EmailVerify = ()=>{
    const [loading,setLoading] = useState(false)
    const [err,setError] = useState("")
    const query = useQuery()

    const verifyEmail = async ()=>{
        try
        {
        setLoading(true)
        const result = await axios.post("api/v1/auth/verifyEmail",{email:query.get("email"),verificationToken:query.get("token")})
        setLoading(false)
        }
        catch(err)
        {
            setLoading(false)
            setError(err.response.data.msg)
        }
    }

    useEffect(()=>{
        verifyEmail()
    },[])
    if(loading)
    {
        return (
            <div className="loading-component">
                {<Loading/>}
            </div>
        )
    }
    else if(err)
    {
        return (
            <div className="err-message">
                <h1>{err}</h1>
            </div>
        )
    }
    return (
        <div className="verify-email">
            <h1>Account Confirmed</h1>
            <Link to = "/login">Login</Link>
        </div>
    )
}

export default EmailVerify;