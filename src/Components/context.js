import React, { useContext, useState } from "react"
const AppContext = React.createContext()

const AppProvider = ({ children })=>{
    const [registerData,setRegisterData] = useState({firstName:"",lastName:"",email:"",password:"",profileImage:""})
    const [loginData,setLoginData] = useState({email:"",password:""})
    const [user,setUser] = useState(null)
    return (
        <AppContext.Provider value = {{registerData, setRegisterData, loginData, setLoginData, user, setUser}}>
            { children }
        </AppContext.Provider>
    )
}

const useGlobalContext = ()=>{
    return useContext(AppContext)
}

export { AppProvider, useGlobalContext }