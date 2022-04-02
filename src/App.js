import Nav from "./Components/POST/Nav"
import Loading from "./Components/EXTRA/Loading"
import Register from "./Components/AUTH/Register";
import Login from "./Components/AUTH/Login";
import EmailVerify from "./Components/AUTH/EmailVerify";
import ForgotPassword from "./Components/AUTH/ForgotPassword";
import ResetPassword from "./Components/AUTH/ResetPassword";
import Explore from "./Components/POST/Explore"
import { HashRouter as Router, Route, Routes } from "react-router-dom"
import Profile from "./Components/POST/Profile";
import User from "./Components/POST/User"
import Add from "./Components/POST/Add";
import EditProfile from "./Components/POST/EditProfile";
function App() {
  return (
    <main>
      <Router>
        <Nav/>
        <Routes>
        <Route path = "/register" element = {<Register/>}/>
        <Route path = "/login" element = {<Login/>}/>
        <Route path = "/verify-email" element = {<EmailVerify/>}/>
        <Route path = "/forgot-password" element = {<ForgotPassword/>}/>
        <Route path = "/reset-password" element = {<ResetPassword/>}/>
        <Route path = "/profile" element = {<Profile/>}/>
        <Route path = "/" element = {<Explore/>}/>
        <Route path = "/user/:id" element = {<User/>}/>
        <Route path = "/add" element = {<Add/>}/>
        <Route path = "/editProfile" element = {<EditProfile/>}/>
        </Routes>
      </Router>
    </main>
  );
}

export default App;
