import React from 'react'
import "../../css/Settings/GroupSettings.css"
import { FiUserPlus, FiUserMinus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from 'react-router-dom'

function GroupSettings() {
    const navigate = useNavigate();

    const [loggedIn, setLoggedIn] = React.useState(null);
    const [adminGroups, setAdminGroups] = React.useState([]);
    const [activeManageGroup, setActiveManageGroup] = React.useState(null);
    const [grpNameEdit, setGrpNameEdit] = React.useState("");
    const [grpBioEdit, setGrpBioEdit] = React.useState("");
    const [grpPicFile, setGrpPicFile] = React.useState(null);
    const [grpPicPreview, setGrpPicPreview] = React.useState(null);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [creator, setCreator] = React.useState(null)
    const [searchUser, setSearchUser] = React.useState("");

    const sortedMembers = React.useMemo(() => {
        if (!activeManageGroup?.members) return [];

        const creatorId = (activeManageGroup.createdBy?._id ?? activeManageGroup.createdBy)?.toString();
        const adminIds = new Set(
            (activeManageGroup.admins ?? []).map(a => (a._id ?? a).toString())
        );

        function rank(member) {
            const id = member._id?.toString();
            if (id === creatorId) return 0;
            if (adminIds.has(id)) return 1;
            return 2;
        }

        return [...activeManageGroup.members].sort((a, b) => {
            const rankDiff = rank(a) - rank(b);
            if (rankDiff !== 0) return rankDiff;
            return (a?.name ?? "").localeCompare(b?.name ?? "");
        });
    }, [activeManageGroup]);

    const searchedUsers = activeManageGroup?.members?.filter(user =>
        user?.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
        user?.username?.toLowerCase().includes(searchUser.toLowerCase())
    );

    const displayedMembers = searchUser ? searchedUsers : sortedMembers;

    const fetchAdminGroups = React.useCallback(async () => {
        try {
            const [groupsRes, userRes] = await Promise.all([
                fetch("/api/group/getGroups", { credentials: "include" }),
                fetch("/api/home/me", { credentials: "include" }),
            ]);

            if (userRes.status === 401) {
                navigate("/");
                return;
            }

            if (!groupsRes.ok) {
                throw new Error("Failed to load groups");
            }

            if (!userRes.ok) {
                throw new Error("Failed to load your account");
            }

            const [groups, user] = await Promise.all([groupsRes.json(), userRes.json()]);
            setLoggedIn(user);

            const userId = user?._id?.toString();
            const myAdminGroups = (groups || []).filter(group =>
                group?.admins?.some(admin =>
                    (admin?._id ?? admin)?.toString() === userId
                )
            );

            setAdminGroups(myAdminGroups);
        } catch (err) {
            console.error(err);
            setError("Failed to load admin groups");
        }
    }, [navigate]);

    React.useEffect(() => {
        fetchAdminGroups();
    }, [fetchAdminGroups]);

    function openManageGroup(group) {
        setActiveManageGroup(group);
        setGrpNameEdit(group.grpName ?? "");
        setGrpBioEdit(group.grpBio ?? "");
        setGrpPicFile(null);
        setGrpPicPreview(null);
        setCreator(group.createdBy)
    }

    function closeManageGroup() {
        setActiveManageGroup(null);
    }

    function handleGrpPicChange(e) {
        const file = e.target.files[0];
        if (file) {
            setGrpPicFile(file);
            setGrpPicPreview(URL.createObjectURL(file));
        }
    }

    async function handleSaveGroupInfo(e) {
        e.preventDefault();
        if (!activeManageGroup) return;
        setSaving(true);

        const formData = new FormData();
        formData.append("grpName", grpNameEdit);
        formData.append("bio", grpBioEdit);
        if (grpPicFile) formData.append("grpPic", grpPicFile);

        try {
            const res = await fetch(`/api/group/updateGroup/${activeManageGroup._id}`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (res.ok) {
                const updated = await res.json();
                setActiveManageGroup(updated.data ?? updated);
                await fetchAdminGroups();
            } else {
                setError("Failed to update group");
            }
        } catch (err) {
            console.error(err);
            setError("Unable to connect to the server.");
        } finally {
            setSaving(false);
        }
    }

    async function handleRemoveMember(userId, removerId) {
        if (!activeManageGroup) return;

        const isAdmin = activeManageGroup.admins?.some(
            a => (a._id ?? a).toString() === userId?.toString()
        );
        const remover_isCreator = (activeManageGroup.createdBy?._id ?? activeManageGroup.createdBy)?.toString() === removerId?.toString();

        if (isAdmin && !remover_isCreator) return null;

        if (!window.confirm("Remove this member from the group?")) return;

        try {
            const res = await fetch(`/api/group/removeUser/${activeManageGroup._id}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (res.ok) {
                const updated = await res.json();
                setActiveManageGroup(updated.data ?? updated);
                await fetchAdminGroups();
            }
        } catch (err) {
            console.error(err);
        }
    }


    async function handlePromoteMember(userId, removerId) {
        if (!activeManageGroup) return;

        const promoter_isCreator = (activeManageGroup.createdBy?._id ?? activeManageGroup.createdBy)?.toString() === removerId?.toString();

        if (!promoter_isCreator) return null;

        try {
            const res = await fetch(`/api/group/promoteUser/${activeManageGroup._id}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (res.ok) {
                const updated = await res.json();
                setActiveManageGroup(updated.data ?? updated);
                await fetchAdminGroups();
            }
        } catch (err) {
            console.error(err);
        }
    }


    async function handleDemoteMember(userId, removerId) {
        if (!activeManageGroup) return;

        const isAdmin = activeManageGroup.admins?.some(
            a => (a._id ?? a).toString() === userId?.toString()
        );
        const isCreator = (activeManageGroup.createdBy?._id ?? activeManageGroup.createdBy)?.toString() === removerId?.toString();

        const remover_isAdmin = activeManageGroup.admins?.some(
            a => (a._id ?? a).toString() === removerId?.toString()
        );

        if (isAdmin && !isCreator && remover_isAdmin) return null

        try {
            const res = await fetch(`/api/group/demoteUser/${activeManageGroup._id}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            if (res.ok) {
                const updated = await res.json();
                setActiveManageGroup(updated.data ?? updated);
                await fetchAdminGroups();
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDeleteGroup() {
        if (!activeManageGroup) return;
        if (!window.confirm("Are you sure you want to delete this group? This cannot be undone.")) {
            return;
        }

        try {
            const res = await fetch(`/api/group/deleteGroup/${activeManageGroup._id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                setAdminGroups(prev => prev.filter(group => group._id !== activeManageGroup._id));
                closeManageGroup();
            } else {
                setError("Failed to delete group");
            }
        } catch (err) {
            console.error(err);
            setError("Unable to connect to the server.");
        }
    }

    function groupImgSrc(pic) {
        if (!pic) return null;
        return pic.startsWith("http") ? pic : `http://localhost:8000/${pic}`;
    }

    return (
        <>
            <section className="settings_card">
                <div className="settings_card_head">
                    <h2>Manage groups</h2>
                    <p className="settings_card_subtitle">Groups you admin, and their members.</p>
                </div>

                {error && (
                    <div className="settings_alert settings_alert--error">
                        <svg className="settings_alert_icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="13" /><line x1="12" y1="16.5" x2="12" y2="16.5" />
                        </svg>
                        {error}
                    </div>
                )}

                {adminGroups.length === 0 ? (
                    <div className="manage_groups_empty">
                        <span>You aren't an admin of any group yet.</span>
                    </div>
                ) : (
                    <div className="admin_group_list">
                        {adminGroups.map(g => {
                            const src = groupImgSrc(g.grpPic);
                            return (
                                <div
                                    key={g._id}
                                    className="admin_group_tabs"
                                    onClick={() => openManageGroup(g)}
                                >
                                    {src ? (
                                        <img src={src} alt={g.grpName} />
                                    ) : (
                                        <div className="admin_group_tab_placeholder">
                                            {g.grpName?.charAt(0).toUpperCase() ?? "?"}
                                        </div>
                                    )}
                                    <span>{g.grpName}</span>
                                    <svg className="admin_group_tab_chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
            {activeManageGroup && (
                <div className="manage_group_overlay">
                    <div className="manage_group_backdrop" onClick={closeManageGroup} />
                    <div className="manage_group_panel">
                        <div className="basicSettings">
                            <button className="manage_group_closee" onClick={closeManageGroup} aria-label="Close">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>

                            <h3>Manage "{activeManageGroup.grpName}"</h3>

                            <form onSubmit={handleSaveGroupInfo} className="manage_group_form">

                                <div className="manage_group_avatar_wrap">
                                    {(grpPicPreview || groupImgSrc(activeManageGroup.grpPic)) ? (
                                        <img
                                            src={grpPicPreview ? grpPicPreview : groupImgSrc(activeManageGroup.grpPic)}
                                            alt=""
                                        />
                                    ) : (
                                        <div className="manage_group_avatar_placeholder">
                                            {activeManageGroup.grpName?.charAt(0).toUpperCase() ?? "?"}
                                        </div>
                                    )}
                                    <label htmlFor="grpPicInput" className="manage_group_pic_edit">
                                        Change photo
                                    </label>
                                    <input
                                        id="grpPicInput"
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleGrpPicChange}
                                    />
                                </div>

                                <label className="manage_group_label">
                                    Group name
                                    <input
                                        type="text"
                                        value={grpNameEdit}
                                        onChange={e => setGrpNameEdit(e.target.value)}
                                        required
                                    />
                                </label>

                                <label className="manage_group_label">
                                    Bio
                                    <textarea
                                        rows={3}
                                        value={grpBioEdit}
                                        onChange={e => setGrpBioEdit(e.target.value)}
                                        placeholder="What's this group about?"
                                    />
                                </label>

                                <div className="manage_group_form_action">
                                    <button type="submit" disabled={saving} className="manage_group_save_btn">
                                        {saving ? "Saving…" : "Save changes"}
                                    </button>

                                    {loggedIn && (activeManageGroup.createdBy?._id ?? activeManageGroup.createdBy)?.toString() === loggedIn._id?.toString() && (
                                        <button
                                            type="button"
                                            className="manage_group_delete_btn"
                                            onClick={handleDeleteGroup}
                                        >
                                            Delete group
                                        </button>
                                    )}
                                </div>

                            </form>
                        </div>

                        <div className="manage_group_members">

                            <div className="manage_group_headerr">
                                <h4>Members ({displayedMembers?.length})</h4>
                                <input type="search" onChange={(e) => setSearchUser(e.target.value)} />
                            </div>

                            {displayedMembers.map(member => {
                                const isSelf = (loggedIn?._id ?? loggedIn)?.toString() === member._id?.toString();

                                const isAdmin = activeManageGroup.admins?.some(
                                    a => (a._id ?? a).toString() === member._id?.toString()
                                );

                                const isCreator = (activeManageGroup.createdBy?._id ?? activeManageGroup.createdBy)?.toString() === member._id?.toString();

                                const loggedIn_isCreator = (loggedIn?._id ?? loggedIn)?.toString() === (activeManageGroup.createdBy?._id ?? activeManageGroup.createdBy)?.toString();

                                const memberSrc = groupImgSrc(member?.profilePic);

                                return (
                                    <div key={member?._id} className="manage_group_member_row">
                                        {memberSrc ? (
                                            <img src={memberSrc} alt={member?.name} />
                                        ) : (
                                            <div className="manage_group_member_placeholder">
                                                {member?.name?.charAt(0).toUpperCase() ?? "?"}
                                            </div>
                                        )}

                                        <div className="manage_group_member_info">
                                            <span>{member?.name}</span>

                                            {isCreator && (
                                                <small className="creator_badge">
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2 15 8.5 22 9.5 17 14.5 18.5 21.5 12 18 5.5 21.5 7 14.5 2 9.5 9 8.5z" />
                                                    </svg>
                                                    Creator
                                                </small>
                                            )}

                                            {!isCreator && isAdmin && (
                                                <small className="admin_badge">
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M2 20h20l-2-9-5 4-3-8-3 8-5-4z" />
                                                    </svg>
                                                    Admin
                                                </small>
                                            )}
                                        </div>

                                        {isSelf ? null : (
                                            <div className="manage_group_member_actions">
                                                {isAdmin ? (
                                                    loggedIn_isCreator && (
                                                        <button
                                                            type="button"
                                                            className='demote_user'
                                                            onClick={() => handleDemoteMember(member._id, loggedIn._id)}
                                                        >
                                                            <svg
                                                                width="12"
                                                                height="12"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            >
                                                                <line x1="12" y1="5" x2="12" y2="19" />
                                                                <polyline points="5 12 12 19 19 12" />
                                                            </svg>
                                                            <FiUserMinus size={15} />
                                                            Demote
                                                        </button>
                                                    )
                                                ) : (
                                                    loggedIn_isCreator && (
                                                        <button
                                                            type="button"
                                                            className='promote_user'
                                                            onClick={() => handlePromoteMember(member._id, loggedIn._id)}
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                                                            </svg>
                                                            <FiUserPlus size={15} />
                                                            Promote
                                                        </button>
                                                    )
                                                )}

                                                {!isCreator && (isAdmin ? loggedIn_isCreator : true) && (
                                                    <button
                                                        type="button"
                                                        className="remove_btn"
                                                        onClick={() => handleRemoveMember(member._id, loggedIn._id)}
                                                    >
                                                        <FiTrash2 size={15} />
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}

export default GroupSettings