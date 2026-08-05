import React from 'react'
import "../css/Mainwindow/ProfilePanel.css"

function ProfilePanel({ activeContact, isGroup, group, activeContactId, onlineUsers, setIsGroup, setActiveContactId, setShowProfile, showProfile }) {

    function getAge(dob) {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const hasHadBirthdayThisYear =
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
        if (!hasHadBirthdayThisYear) age--;
        return age;
    }

    function show_chats(id, isGroup) {
        setActiveContactId(id);
        setIsGroup(isGroup)
    }

    if (!activeContact) {
        return (
            <div className="profile">
                <div className="profile_empty">
                    <p>Select a contact or group to view details</p>
                </div>
            </div>
        );
    }


    return (
        <div className={`profile ${showProfile ? "profile-visible-mobile" : ""}`}>

            <button className="back_btn" onClick={() => setShowProfile(false)} aria-label="Back to contacts">
                ←
            </button>

            {!isGroup ? <>
                <div className="profile_avatar_wrap">

                    {activeContact?.profilePic ? <img
                        src={
                            activeContact?.profilePic.startsWith("http")
                                ? activeContact.profilePic
                                : `http://localhost:8000/${activeContact?.profilePic}`
                        }
                        alt={activeContact?.name}
                    /> : null}

                    {onlineUsers?.[activeContact?._id] ? <span className="profile_status_dot" /> : null}
                </div>

                <h1 className="profile_name">{activeContact?.name}</h1>
                <p className="profile_username">@{activeContact?.username}</p>

                <p className="profile_bio">
                    {activeContact?.bio}
                </p>

                <div className="profile_divider" />

                <div className="profile_details">

                    <div className="profile_detail_row">
                        <span className="profile_detail_label">Date of Birth</span>
                        <span className="profile_detail_value">
                            {activeContact?.dob
                                ? new Date(activeContact.dob).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })
                                : "Not specified"}
                        </span>
                    </div>

                    <div className="profile_detail_row">
                        <span className="profile_detail_label">Age</span>
                        <span className="profile_detail_value">
                            {activeContact?.dob ? `${getAge(activeContact.dob)} years` : "Not specified"}
                        </span>
                    </div>

                    <div className="profile_detail_row">
                        <span className="profile_detail_label">Location</span>
                        <span className="profile_detail_value">
                            {activeContact?.state || activeContact?.country
                                ? `${activeContact?.state ?? ""}${activeContact?.state && activeContact?.country ? ", " : ""}${activeContact?.country ?? ""}`
                                : "Not specified"}
                        </span>
                    </div>

                </div>

            </> :

                <>

                    <div className="profile_avatar_wrap">
                        <img
                            src={
                                activeContact?.grpPic.startsWith("http")
                                    ? activeContact.grpPic
                                    : `http://localhost:8000/${activeContact?.grpPic}`
                            }
                            alt={activeContact?.grpName}
                        />
                    </div>

                    <h1 className="profile_name">{activeContact?.grpName}</h1>

                    <div className="profile_divider" />

                    <div className="profile_details">

                        <div className="profile_detail_row">
                            <span className="profile_detail_label">Created By</span>
                            <span className="profile_detail_value">
                                {activeContact?.createdBy?.name ?? "Unknown"}
                            </span>
                        </div>

                        <div className="profile_detail_row">
                            <span className="profile_detail_label">Created At</span>
                            <span className="profile_detail_value">
                                {activeContact?.createdAt
                                    ? new Date(activeContact.createdAt).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })
                                    : "Not specified"}
                            </span>
                        </div>

                        <div className="profile_detail_row">
                            <span className="profile_detail_value">
                                ~{activeContact.grpBio}~
                            </span>
                        </div>

                    </div>

                    <div className="profile_divider" />


                    <h1 style={{ marginTop: "30px", textAlign: "left" }}>Members</h1>

                    <div className="allContacts">

                        {[...(activeContact?.members ?? [])]
                            .sort((a, b) => {
                                if (a._id === activeContact?.createdBy?._id) return -1;
                                if (b._id === activeContact?.createdBy?._id) return 1;
                                return 0;
                            })
                            .map(user => (

                                <div
                                    key={user?._id}
                                    className="contact_tab"
                                    onClick={() => show_chats(user?._id, false)}
                                >

                                    <img
                                        src={
                                            user?.profilePic?.startsWith("http")
                                                ? user?.profilePic
                                                : `http://localhost:8000/${user?.profilePic}`
                                        }
                                        style={{
                                            border: onlineUsers?.[user?._id]
                                                ? "3px solid #22c55e"
                                                : "2px solid transparent"
                                        }}
                                        alt={user?.name}
                                    />

                                    <h2 className="person_name">
                                        {user?.name}

                                        {activeContact?.admins?.some(admin => admin?._id === user?._id) && (
                                            <small
                                                style={{
                                                    marginLeft: "8px",
                                                    background: "#22c55e",
                                                    color: "#fff",
                                                    padding: "2px 8px",
                                                    borderRadius: "10px",
                                                    fontSize: "0.65rem",
                                                    fontWeight: "600",
                                                    verticalAlign: "middle"
                                                }}
                                            >
                                                ADMIN
                                            </small>
                                        )}

                                        <p
                                            style={{
                                                fontSize: "0.85rem",
                                                color: "#888",
                                                margin: "2px 0 0",
                                            }}
                                        >
                                            @{user?.username}
                                        </p>
                                    </h2>

                                </div>

                            ))}

                    </div>

                </>}

        </div>
    )
}

export default ProfilePanel