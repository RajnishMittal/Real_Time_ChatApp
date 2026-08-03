import React from 'react'
import { useNavigate } from 'react-router-dom';
import "../css/Mainwindow/Sidebar.css"
import userImg from "../../assets/icons/user.png";
import settingImg from "../../assets/icons/settings.png";
import chatImg from "../../assets/icons/chat.png";

function Sidebar({ activeContactId, loggedIn }) {

    const navigate = useNavigate()

    return (

        <div className={`sidebar ${activeContactId ? "sidebar_collapsed" : ""}`}>
            <button style={{width: "50px", height: "50px"}} className='sideBar' onClick={() => navigate("/linksync")}  >
                <img style={{width: "20px", height: "20px"}} src={chatImg} alt="" />
            </button>
            <button style={{width: "50px", height: "50px"}} className='sideBar' onClick={() => navigate("/UserProfile")}  >
                <img style={{width: "20px", height: "20px"}} src={userImg} alt="" />
            </button>
            <button style={{width: "50px", height: "50px"}} className='sideBar' onClick={() => navigate("/Settings")}>
                <img style={{width: "20px", height: "20px"}} src={settingImg} alt="" />
            </button>
        </div>
        
    )
}

export default Sidebar
