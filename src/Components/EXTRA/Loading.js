import { AiOutlineLoading3Quarters } from "react-icons/ai"
import "./Loading.css"
const Loading = ()=>{
    return (
        <div className="loading">
            <div className="loading-icon">
                <AiOutlineLoading3Quarters className="icon"/>
            </div>
        </div>
    )
}

export default Loading;