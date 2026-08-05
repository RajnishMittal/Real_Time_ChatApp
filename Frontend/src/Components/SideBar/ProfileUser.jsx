import React from 'react'
import { useNavigate } from 'react-router-dom'
import SideBar from "../MainWindow/Sidebar"
import locationIcon from "../../assets/icons/location.png"
import '../css/Mainwindow/ProfileUser.css'

function ProfileUser() {
    const [loggedIn, setLoggedIn] = React.useState(null);
    const [analytics, setAnalytics] = React.useState({
        msg_sent: 0,
        msg_received: 0,
    });
    const [error, setError] = React.useState(null);

    React.useEffect(() => {

        async function getLoggedIn() {
            try {
                const response = await fetch("/api/home/me", {
                    credentials: "include"
                });

                if (response.status === 401) {
                    navigate("/");
                    return;
                }

                if (!response.ok) {
                    const errBody = await response.json().catch(() => ({}));
                    setError(errBody.error || "Failed to fetch");
                    return;
                }

                const result = await response.json();
                setLoggedIn(result);
                console.log(result)

            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        }

        getLoggedIn();

    }, []);

    React.useEffect(() => {
        async function fetchAnalytics() {
            const res = await fetch("/api/home/analytics", {
                credentials: "include",
            });

            const data = await res.json();
            setAnalytics(data);
        }

        fetchAnalytics();
    }, []);


    return (
        <div className='hero' >
            <SideBar />
            <div className="main_container">
                <div className="profile-page">
                    <div className="profile_image">
                        <img
                            style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }}
                            src={
                                    loggedIn?.profilePic?.startsWith("http")
                                        ? loggedIn?.profilePic
                                        : `http://localhost:8000/${loggedIn?.profilePic}`
                                }
                            alt="image"
                        />

                        <div className="info">
                            <h1>{loggedIn?.name}</h1>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <img src={locationIcon} alt="" style={{ width: "16px", height: "16px" }} />
                                <h4>{loggedIn?.state}, {loggedIn?.country}</h4>
                            </div>
                            <h3>{loggedIn?.bio}</h3>
                        </div>
                    </div>
                </div>
                <div className='user_data'>
                    <div className="data-row">
                        <span className="label">Name</span>
                        <span className="value">{loggedIn?.name}</span>
                    </div>
                    <div className="data-row">
                        <span className="label">Username</span>
                        <span className="value">@{loggedIn?.username}</span>
                    </div>
                    <div className="data-row">
                        <span className="label">Email</span>
                        <span className="value">{loggedIn?.email}</span>
                    </div>
                    <div className="data-row">
                        <span className="label">State</span>
                        <span className="value">{loggedIn?.state}</span>
                    </div>
                    <div className="data-row">
                        <span className="label">Country</span>
                        <span className="value">{loggedIn?.country}</span>
                    </div>
                </div>
                <div className="analytics">
                    <div className="sent">
                        <span className="stat-number">{analytics?.msg_sent}</span>
                        <span className="stat-label">SENT</span>
                    </div>
                    <div className="recieved">
                        <span className="stat-number">{analytics?.msg_received}</span>
                        <span className="stat-label">RECEIVED</span>
                    </div>
                    <div className="total_score">
                        <span className="stat-number">{(analytics?.msg_received || 0) + (analytics?.msg_sent || 0)}</span>
                        <span className="stat-label">TOTAL SCORE</span>
                    </div>
                    <div className="total_time">
                        <span className="stat-number">0</span>
                        <span className="stat-label">TIME</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileUser