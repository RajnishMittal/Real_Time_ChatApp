import React from 'react'
import "../css/Mainwindow/Sidebar.css"
import userImg from "../../assets/icons/user.png";
import settingImg from "../../assets/icons/settings.png";

function Sidebar({ activeContactId, loggedIn }) {

    return (

        <div className={`sidebar ${activeContactId ? "sidebar_collapsed" : ""}`}>
            {loggedIn?.name || "Loading..."}
            <button style={{width: "50px", height: "50px"}} className='sideBar'  >
                <img style={{width: "20px", height: "20px"}} src={userImg} alt="" />
            </button>
            <button style={{width: "50px", height: "50px"}} className='sideBar' >
                <img style={{width: "20px", height: "20px"}} src={settingImg} alt="" />
            </button>
        </div>
        
    )
}

export default Sidebar
