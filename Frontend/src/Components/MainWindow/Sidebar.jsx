import React from 'react'
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Mainwindow/Sidebar.css"
import userImg from "../../assets/icons/user.png";
import settingImg from "../../assets/icons/settings.png";
import chatImg from "../../assets/icons/chat.png";
import addFriend from "../../assets/icons/add-friend.png";

function Sidebar({ activeContactId, loggedIn }) {

    const navigate = useNavigate()

    return (

        <div className={`sidebar ${activeContactId ? "sidebar_collapsed" : ""}`}>
            <button
                className={`sideBar ${location.pathname === "/linksync" ? "active" : ""}`}
                onClick={() => navigate("/linksync")}
            >
                <img src={chatImg} alt="Chats" />
            </button>

            <button
                className={`sideBar ${location.pathname === "/FriendRequests" ? "active" : ""}`}
                onClick={() => navigate("/FriendRequests")}
            >
                <img src={addFriend} alt="Chats" />
            </button>

            <button
                className={`sideBar ${location.pathname === "/UserProfile" ? "active" : ""}`}
                onClick={() => navigate("/UserProfile")}
            >
                <img src={userImg} alt="Profile" />
            </button>

            <button
                className={`sideBar ${location.pathname === "/Settings" ? "active" : ""}`}
                onClick={() => navigate("/Settings")}
            >
                <img src={settingImg} alt="Settings" />
            </button>
        </div>

    )
}

export default Sidebar
