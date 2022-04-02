
const followContainer = ({_id,profileImage,fullName,user,load,handleClick})=>{
    return(
        <div key = {_id}>
        <div>
            <img src = {profileImage}/>
            <p>{fullName}</p>
        </div>
        {_id != user[0]._id &&
        <>
        {user[0].following.findIndex(e=>e.user == _id) == -1 ? 
        <button className="follow" onClick={()=>handleClick(_id)}>{load ? <AiOutlineLoading3Quarters/> : "follow"}</button> : 
        <button className = "following" onClick={()=>handleClick(_id)}>{load ? <AiOutlineLoading3Quarters/> :  "following"}</button>}
        </>}
        </div>
    )
}
export default followContainer;