import React from 'react'
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom"
import "../css/Mainwindow/FriendRequests.css"
import SideBar from "../MainWindow/Sidebar"

function Friend_Requests() {

    const navigate = useNavigate();

    const [loggedIn, setLoggedIn] = React.useState(null);
    const [requests, setRequests] = React.useState([]);
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

            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        }

        getLoggedIn();

    }, []);

    React.useEffect(() => {

        async function getRequests() {
            try {
                const response = await fetch("/api/connections/sendRequest", {
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
                setRequests(result.data || []);

            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        }

        if (loggedIn) getRequests();

    }, [loggedIn]);

    async function handleRespond(requestId, action) {

        try {
            const response = await fetch(
                `/api/connections/${action}Request/${requestId}`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                const errBody = await response.json().catch(() => ({}));
                setError(
                    errBody.error || `Failed to ${action} request`
                );
                return;
            }

            // Immediately remove from UI
            setRequests(prev =>
                prev.filter(request => request._id !== requestId)
            );

        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    }

    return (
        <div className='mainScreen'>
            <SideBar />

            <div className="friendsRequest">
                <div className="friendsRequestHeader">
                    <h2>Friend Requests</h2>
                    {requests.length > 0 && (
                        <span className="requestCount">{requests.length}</span>
                    )}
                </div>

                {error && <p className="requestError">{error}</p>}

                {requests.length === 0 && !error && (
                    <p className="noRequests">No pending friend requests</p>
                )}

                <div className="requestList">
                    {requests.map(request => {

                        return (
                            <div className="reqWrapper" key={request._id}>
                                <div className="requestTab">
                                    <img
                                        className="requestAvatar"
                                        src={
                                            request?.profilePic?.startsWith("http")
                                                ? request?.profilePic
                                                : `http://localhost:8000/${request?.profilePic}`
                                        }
                                        alt={request?.name || "User"}
                                    />

                                    <div className="requestInfo">
                                        <p className="requestName">{request?.name}</p>
                                        <p className="requestUsername">@{request?.username}</p>
                                        {request?.bio && (
                                            <p className="requestBio">{request.bio}</p>
                                        )}
                                    </div>

                                    <div className="requestActions">
                                        <button
                                            className="requestBtn accept"
                                            onClick={() => handleRespond(request._id, "accept")}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="requestBtn decline"
                                            onClick={() => handleRespond(request._id, "decline")}
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>

                                <div className="previewUser">
                                    <div className="previewDetails">
                                        <div className="previewRow">
                                            <span className="previewLabel">Country</span>
                                            <span className="previewValue">
                                                {request?.country
                                                    ? Country.getCountryByCode(request.country)?.name
                                                    : "—"}
                                            </span>
                                        </div>
                                        <div className="previewRow">
                                            <span className="previewLabel">State</span>
                                            <span className="previewValue">
                                                {request?.state
                                                    ? State.getStateByCode(request.state)?.name
                                                    : "—"}
                                            </span>
                                        </div>
                                        <div className="previewRow">
                                            <span className="previewLabel">DOB</span>
                                            <span className="previewValue">
                                                {request?.dob ? new Date(request.dob).toLocaleDateString() : "—"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Friend_Requests