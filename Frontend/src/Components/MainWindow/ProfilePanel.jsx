import React from 'react'
import "../css/Mainwindow/ProfilePanel.css"
import { Country, State } from "country-state-city";

function ProfilePanel({ activeContact, isGroup, group, activeContactId, onlineUsers, setIsGroup, setActiveContactId, setShowProfile, showProfile }) {

    const [searchUser, setSearchUser] = React.useState("")

    const sortedMembers = React.useMemo(() => {
        if (!activeContact?.members) return [];

        const creatorId = (activeContact.createdBy?._id ?? activeContact.createdBy)?.toString();
        const adminIds = new Set(
            (activeContact.admins ?? []).map(a => (a._id ?? a).toString())
        );

        function rank(member) {
            const id = member._id?.toString();
            if (id === creatorId) return 0;
            if (adminIds.has(id)) return 1;
            return 2;
        }

        return [...activeContact.members].sort((a, b) => {
            const rankDiff = rank(a) - rank(b);
            if (rankDiff !== 0) return rankDiff;
            return (a?.name ?? "").localeCompare(b?.name ?? "");
        });
    }, [activeContact]);

    const searchedUsers = activeContact?.members
        ?.filter(user =>
            user?.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
            user?.username?.toLowerCase().includes(searchUser.toLowerCase())
        )

    React.useEffect(() => {
        setSearchUser("")
    }, [activeContactId])


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

            <button style={{ marginBottom: "20px" }} className="back_btn" onClick={() => setShowProfile(false)} aria-label="Back to contacts">
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
                            {(() => {
                                const stateName = activeContact?.state
                                    ? State.getStateByCodeAndCountry(activeContact.state, activeContact.country)?.name
                                    : null;
                                const countryName = activeContact?.country
                                    ? Country.getCountryByCode(activeContact.country)?.name
                                    : null;

                                if (!stateName && !countryName) return "Not specified";

                                return `${stateName ?? ""}${stateName && countryName ? ", " : ""}${countryName ?? ""}`;
                            })()}
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

                    {activeContact?.members?.length > 4 ? <input
                        type="search"
                        placeholder="SEARCH CHAT"
                        autoComplete='off'
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                    /> : null}

                    <div className="allContacts">

                        {searchUser ? searchedUsers.map(user => (

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
                                    <p className="username_row">
                                    {activeContact?.createdBy?._id === user?._id && (
                                        <small className="creator_badge">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2 15 8.5 22 9.5 17 14.5 18.5 21.5 12 18 5.5 21.5 7 14.5 2 9.5 9 8.5z" />
                                            </svg>
                                            Creator
                                        </small>
                                    )}

                                    {activeContact?.createdBy?._id === user?._id ? null : <>{activeContact?.admins?.some(admin => admin?._id === user?._id) && (
                                        <small className="admin_badge">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M2 20h20l-2-9-5 4-3-8-3 8-5-4z" />
                                            </svg>
                                            Admin
                                        </small>
                                    )}</>}

                                    <span
                                        style={{
                                            fontSize: "0.85rem",
                                            color: "#888",
                                            margin: "2px 0 0",
                                        }}
                                    >
                                        @{user?.username}
                                    </span>
                                    </p>
                                </h2>

                            </div>

                        )) : <>{sortedMembers
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
                                        <p className="username_row">
                                            {activeContact?.createdBy?._id === user?._id && (
                                                <small className="creator_badge">
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2 15 8.5 22 9.5 17 14.5 18.5 21.5 12 18 5.5 21.5 7 14.5 2 9.5 9 8.5z" />
                                                    </svg>
                                                    Creator
                                                </small>
                                            )}

                                            {activeContact?.createdBy?._id === user?._id ? null : <>{activeContact?.admins?.some(admin => admin?._id === user?._id) && (
                                                <small className="admin_badge">
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M2 20h20l-2-9-5 4-3-8-3 8-5-4z" />
                                                    </svg>
                                                    Admin
                                                </small>
                                            )}</>}


                                            <span
                                                style={{
                                                    fontSize: "0.85rem",
                                                    color: "#888",
                                                    margin: "2px 0 0",
                                                }}
                                            >
                                                @{user?.username}
                                            </span>

                                        </p>
                                    </h2>

                                </div>

                            ))} </>}

                    </div>

                </>}

        </div>
    )
}

export default ProfilePanel