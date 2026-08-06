import React from 'react'
import { FiPlus } from "react-icons/fi";
import { FiUser, FiUsers } from "react-icons/fi";
import "../css/Mainwindow/ContactList.css"

function ContactsList({ setActiveContactId, activeContactId, users, setNewGroup, group, onlineUsers, setIsGroup, isGroup, loggedIn, setOnlineUsers, joinGroup, activeContact, setGroupJoin, mess, unreadCounts }) {

    const [showChat, setShowChat] = React.useState(true)
    const [searchUser, setSearchUser] = React.useState("")
    const [searchChoice, setSearchChoice] = React.useState(true)

    const searchedUsers = users
        ?.filter(user =>
            user?.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
            user?.username?.toLowerCase().includes(searchUser.toLowerCase())
        )

    const searchedGroups = group
        ?.filter(grp =>
            grp?.grpName?.toLowerCase().includes(searchUser.toLowerCase())
        )

    function show_chats(id, isGroup = false) {
        setActiveContactId(id);
        setIsGroup(isGroup)
    }

    function isMember(userId) {
        if (!activeContact?.members) return false;

        return activeContact.members.some(
            m => (m._id ?? m).toString() === userId?.toString()
        );
    }



    React.useEffect(() => {
        if (!isGroup || !activeContact || !loggedIn) {
            setGroupJoin(false);
            return;
        }

        setGroupJoin(isMember(loggedIn._id));
    }, [activeContact, loggedIn, isGroup]);

    return (
        <div className={`contacts ${activeContactId ? "contacts_collapsed" : ""}`}>

            <input
                type="search"
                placeholder="SEARCH CHAT"
                autoComplete='off'
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
            />

            {searchUser && (
                <div className="searched_items">

                    <div className="searchChoice">
                        <h3
                            className="choice"
                            onClick={() => setSearchChoice(true)}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
                                e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
                            }}
                        >
                            <span className="text">Users</span>
                            <FiUser className="icon" />
                        </h3>

                        <h3
                            className="choice"
                            onClick={() => setSearchChoice(false)}
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
                                e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
                            }}
                        >
                            <span className="text">Groups</span>
                            <FiUsers className="icon" />
                        </h3>
                    </div>

                    <div className="searched_list">

                        {searchChoice ? (
                            searchedUsers.length > 0 ? (
                                searchedUsers.map(user => (
                                    <div
                                        key={user?._id}
                                        className="contact_tab"
                                        onClick={() => show_chats(user?._id, false)}
                                    >
                                        <img
                                            src={
                                                user?.profilePic?.startsWith("http")
                                                    ? user.profilePic
                                                    : `http://localhost:8000/${user?.profilePic}`
                                            }
                                            style={{
                                                border: onlineUsers?.[user._id]
                                                    ? "3px solid #22c55e"
                                                    : "2px solid transparent"
                                            }}
                                            alt={user?.name}
                                        />

                                        <h2 className="person_name">
                                            {user?.name}
                                            <br />
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
                                ))
                            ) : (
                                <p>No results found.</p>
                            )
                        ) : (
                            searchedGroups.length > 0 ? (
                                <>
                                    {searchedGroups.map(grp => (
                                        <div
                                            key={grp?._id}
                                            className="contact_tab"
                                            onClick={() => show_chats(grp?._id, true)}
                                        >
                                            <img
                                                src={
                                                    grp?.grpPic?.startsWith("http")
                                                        ? grp.grpPic
                                                        : `http://localhost:8000/${grp?.grpPic}`
                                                }
                                                alt={grp?.grpName}
                                            />

                                            <h2 className="person_name">
                                                <span className="name_row">
                                                    {grp?.grpName}
                                                </span>
                                                <p className="group_members_row">
                                                    {grp?.members?.map(m => `~${m.username}`).join(" , ")}
                                                </p>
                                            </h2>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <p>No results found.</p>
                            )
                        )}

                    </div>

                </div>
            )}

            <div className="create_group">
                <h2>Create New Group</h2>
                <button onClick={(e) => setNewGroup(true)} >
                    <FiPlus size={22} />
                </button>
            </div>

            <div className="choices">
                <div className="get_users" onClick={() => setShowChat(true)} >
                    Chats
                </div>
                <div className="get_groups" onClick={() => setShowChat(false)} >
                    Groups
                </div>
            </div>

            <div className="contacts_list">

                {showChat ? <> {users?.map(user => (

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
                                border:
                                    onlineUsers?.[user._id]
                                        ? "3px solid #22c55e"
                                        : "2px solid transparent"
                            }}
                            alt={user?.name}
                        />

                        <h2 className="person_name">
                            {user?.name}<br />
                            <p
                                style={{
                                    fontSize: "0.85rem",
                                    color: "#888",
                                    margin: "2px 0 0",
                                }}
                            >
                                @{user?.username}
                            </p>
                            {unreadCounts[user?._id] > 0 && (
                                <span className="unread_badge">{unreadCounts[user?._id]}</span>
                            )}
                        </h2>

                    </div>

                ))} </> : <> {
                    group?.map(user => (

                        <div
                            key={user?._id}
                            className="contact_tab"
                            onClick={() => show_chats(user?._id, true)}
                        >

                            <img
                                src={
                                    user?.grpPic?.startsWith("http")
                                        ? user?.grpPic
                                        : `http://localhost:8000/${user?.grpPic}`
                                }
                                alt=""
                            />

                            <h2 className="person_name">
                                {user?.grpName}
                            </h2>

                        </div>

                    ))
                } </>}

            </div>

        </div>
    )
}

export default ContactsList
