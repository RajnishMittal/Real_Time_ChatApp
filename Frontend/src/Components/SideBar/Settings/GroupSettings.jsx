import React from 'react'
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
                group.admins?.some(admin =>
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
        setGrpBioEdit(group.bio ?? "");
        setGrpPicFile(null);
        setGrpPicPreview(null);
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

    async function handleRemoveMember(userId) {
        if (!activeManageGroup) return;
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

    async function handlePromoteMember(userId) {
        if (!activeManageGroup) return;

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

    return (
        <div className="manage_groups_section">
            <h2>Manage Groups</h2>

            {error && <div className="manage_groups_error">{error}</div>}

            {adminGroups.length === 0 ? (
                <p className="manage_groups_empty">You aren't an admin of any group yet.</p>
            ) : (
                <div className="admin_group_list">
                    {adminGroups.map(g => (
                        <div
                            key={g._id}
                            className="admin_group_tab"
                            onClick={() => openManageGroup(g)}
                        >
                            <img
                                src={
                                    g.grpPic?.startsWith("http")
                                        ? g.grpPic
                                        : `http://localhost:8000/${g.grpPic}`
                                }
                                alt={g.grpName}
                            />
                            <span>{g.grpName}</span>
                        </div>
                    ))}
                </div>
            )}

            {activeManageGroup && (
                <div className="manage_group_overlay">
                    <div className="manage_group_panel">

                        <button className="manage_group_close" onClick={closeManageGroup}>✕</button>

                        <h3>Manage "{activeManageGroup.grpName}"</h3>

                        <form onSubmit={handleSaveGroupInfo} className="manage_group_form">

                            <div className="manage_group_avatar_wrap">
                                <img
                                    src={
                                        grpPicPreview
                                            ? grpPicPreview
                                            : activeManageGroup.grpPic?.startsWith("http")
                                                ? activeManageGroup.grpPic
                                                : `http://localhost:8000/${activeManageGroup.grpPic}`
                                    }
                                    alt=""
                                />
                                <label htmlFor="grpPicInput" className="manage_group_pic_edit">
                                    Change Photo
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
                                Group Name
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

                            <button type="submit" disabled={saving} className="manage_group_save_btn">
                                {saving ? "Saving..." : "Save Changes"}
                            </button>

                            {loggedIn && (activeManageGroup.createdBy?._id ?? activeManageGroup.createdBy)?.toString() === loggedIn._id?.toString() && (
                                <button
                                    type="button"
                                    className="manage_group_delete_btn"
                                    onClick={handleDeleteGroup}
                                >
                                    Delete Group
                                </button>
                            )}

                        </form>

                        <div className="manage_group_members">
                            <h4>Members</h4>

                            {activeManageGroup.members?.map(member => {
                                const isAdmin = activeManageGroup.admins?.some(
                                    a => (a._id ?? a).toString() === member._id?.toString()
                                );
                                const isCreator = (activeManageGroup.createdBy?._id ?? activeManageGroup.createdBy)?.toString() === member._id?.toString();

                                return (
                                    <div key={member._id} className="manage_group_member_row">
                                        <img
                                            src={
                                                member.profilePic?.startsWith("http")
                                                    ? member.profilePic
                                                    : `http://localhost:8000/${member.profilePic}`
                                            }
                                            alt={member.name}
                                        />

                                        <div className="manage_group_member_info">
                                            <span>{member.name}</span>
                                            {isAdmin && <small className="admin_badge">ADMIN</small>}
                                        </div>

                                        {!isCreator && (
                                            <div className="manage_group_member_actions">
                                                {loggedIn &&
                                                    (activeManageGroup.createdBy?._id ?? activeManageGroup.createdBy)?.toString() === loggedIn._id?.toString() &&
                                                    !isAdmin && (
                                                        <button type="button" onClick={() => handlePromoteMember(member._id)}>
                                                            Promote
                                                        </button>
                                                    )}
                                                <button
                                                    type="button"
                                                    className="remove_btn"
                                                    onClick={() => handleRemoveMember(member._id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

export default GroupSettings