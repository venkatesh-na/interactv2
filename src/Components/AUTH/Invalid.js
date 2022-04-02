import { Link } from "react-router-dom";

const Invalid = ()=>{
    return (
        <div className="invalid_message_container">
            <div>
                <p>Authentication Invalid</p>
                <Link to = "/login">Login</Link>
            </div>
        </div>
    )
}
export default Invalid;