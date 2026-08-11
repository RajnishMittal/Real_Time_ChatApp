import React, { useState, useMemo, useEffect } from 'react';
import "../css/Mainwindow/ProfilePanel.css";
import { Country, State } from "country-state-city";

function ProfilePanel({ activeContact, isGroup, group, activeContactId, onlineUsers, setIsGroup, setActiveContactId, setShowProfile, showProfile }) {
    const [searchUser, setSearchUser] = useState("");

    const sortedMembers = useMemo(() => {
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

    const searchedUsers = activeContact?.members?.filter(user =>
        user?.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
        user?.username?.toLowerCase().includes(searchUser.toLowerCase())
    );

    useEffect(() => {
        setSearchUser("");
    }, [activeContactId]);

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

    function show_chats(id, isGroupTarget) {
        setActiveContactId(id);
        setIsGroup(isGroupTarget);
    }

    const displayedMembers = searchUser ? searchedUsers : sortedMembers;

    if (!activeContact) {
        return (
            <aside className="profile-panel empty-state">
                <p>Select a contact or group to view details</p>
            </aside>
        );
    }

    return (
        <aside className={`profile-panel ${showProfile ? "profile-visible-mobile" : ""}`}>
            <header className="panel-header">
                <button className="back-btn" onClick={() => setShowProfile(false)} aria-label="Back to contacts">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
            </header>

            <div className="profile-scroll-content">
                {!isGroup ? (
                    /* --- INDIVIDUAL USER PROFILE --- */
                    <div className="profile-content-wrapper">
                        <div className="avatar-container">
                            {activeContact?.profilePic && (
                                <img
                                    className="panel-avatar"
                                    src={
                                        activeContact.profilePic.startsWith("http")
                                            ? activeContact.profilePic
                                            : `http://localhost:8000/${activeContact.profilePic}`
                                    }
                                    alt={activeContact?.name}
                                />
                            )}
                            {onlineUsers?.[activeContact?._id] && <span className="online-indicator" />}
                        </div>

                        <div className="profile-primary-info">
                            <h2 className="profile-name">{activeContact?.name}</h2>
                            <p className="profile-username">@{activeContact?.username}</p>
                            {activeContact?.bio && <p className="profile-bio">{activeContact.bio}</p>}
                        </div>

                        <hr className="panel-divider" />

                        <div className="details-list">
                            <div className="detail-row">
                                <span className="detail-label">Date of Birth</span>
                                <span className="detail-value">
                                    {activeContact?.dob
                                        ? new Date(activeContact.dob).toLocaleDateString(undefined, {
                                            year: "numeric", month: "long", day: "numeric",
                                        })
                                        : "Not specified"}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Age</span>
                                <span className="detail-value">
                                    {activeContact?.dob ? `${getAge(activeContact.dob)} years` : "Not specified"}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Location</span>
                                <span className="detail-value">
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
                    </div>
                ) : (
                    /* --- GROUP PROFILE --- */
                    <div className="profile-content-wrapper">
                        <div className="avatar-container">
                            <img
                                className="panel-avatar"
                                src={
                                    activeContact?.grpPic?.startsWith("http")
                                        ? activeContact.grpPic
                                        : `http://localhost:8000/${activeContact?.grpPic}`
                                }
                                alt={activeContact?.grpName}
                            />
                        </div>

                        <div className="profile-primary-info">
                            <h2 className="profile-name">{activeContact?.grpName}</h2>
                        </div>

                        <hr className="panel-divider" />

                        <div className="details-list">
                            <div className="detail-row">
                                <span className="detail-label">Created By</span>
                                <span className="detail-value">{activeContact?.createdBy?.name ?? "Unknown"}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Created At</span>
                                <span className="detail-value">
                                    {activeContact?.createdAt
                                        ? new Date(activeContact.createdAt).toLocaleDateString(undefined, {
                                            year: "numeric", month: "long", day: "numeric",
                                        })
                                        : "Not specified"}
                                </span>
                            </div>
                            {activeContact?.grpBio && (
                                <div className="detail-row">
                                    <span className="detail-value italic text-muted text-center w-full">
                                        ~ {activeContact.grpBio} ~
                                    </span>
                                </div>
                            )}
                        </div>

                        <hr className="panel-divider" />

                        <div className="members-section">
                            <h3 className="section-title">Members ({activeContact?.members?.length || 0})</h3>

                            {activeContact?.members?.length >= 3 && (
                                <input
                                    className="modern-search"
                                    type="search"
                                    placeholder="Search members..."
                                    autoComplete='off'
                                    value={searchUser}
                                    onChange={(e) => setSearchUser(e.target.value)}
                                />
                            )}

                            <div className="member-list">
                                {displayedMembers?.map(user => {
                                    const isCreator = activeContact?.createdBy?._id === user?._id;
                                    const isAdmin = !isCreator && activeContact?.admins?.some(admin => admin?._id === user?._id);
                                    const isOnline = onlineUsers?.[user?._id];

                                    return (
                                        <div
                                            key={user?._id}
                                            className="member-item hover-effect"
                                            onClick={() => show_chats(user?._id, false)}
                                        >
                                            <div className="member-avatar-wrapper">
                                                <img
                                                    className={`member-avatar ${isOnline ? 'is-online' : ''}`}
                                                    src={
                                                        user?.profilePic?.startsWith("http")
                                                            ? user?.profilePic
                                                            : `http://localhost:8000/${user?.profilePic}`
                                                    }
                                                    alt={user?.name}
                                                />
                                            </div>

                                            <div className="member-info">
                                                <span className="member-name">{user?.name}</span>
                                                <div className="member-meta">
                                                    <span className="member-handle">@{user?.username}</span>

                                                    {isCreator && (
                                                        <small className="creator_badgee">

                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">

                                                                <path d="M12 2 15 8.5 22 9.5 17 14.5 18.5 21.5 12 18 5.5 21.5 7 14.5 2 9.5 9 8.5z" />

                                                            </svg>

                                                            Creator

                                                        </small>
                                                    )}
                                                    {isAdmin && (
                                                        <small className="admin_badgee">

                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">

                                                                <path d="M2 20h20l-2-9-5 4-3-8-3 8-5-4z" />

                                                            </svg>

                                                            Admin

                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}

export default ProfilePanel;