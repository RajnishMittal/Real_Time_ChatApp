import React from 'react'
import { FiPlus } from "react-icons/fi";
import { FiUser, FiUsers } from "react-icons/fi";
import "../css/Mainwindow/ContactList.css"

function ContactsList({ setActiveContactId, activeContactId, users, setNewGroup, group, onlineUsers, setIsGroup, isGroup, loggedIn, setOnlineUsers, joinGroup, activeContact, setGroupJoin, mess, userChatData, friends, othersChatData, groupJoined }) {

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

            <div className="input">
                <input
                    className='searchBar'
                    type="search"
                    placeholder="SEARCH CHAT"
                    autoComplete='off'
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                />
            </div>

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
                                        <div className="searchedData">

                                            <img
                                                src={
                                                    user?.profilePic?.startsWith("http")
                                                        ? user.profilePic
                                                        : `${import.meta.env.VITE_API_URL}/${user?.profilePic}`
                                                }
                                                style={{
                                                    border: onlineUsers?.[user._id]
                                                        ? "3px solid #22c55e"
                                                        : "2px solid transparent"
                                                }}
                                                alt={user?.name}
                                            />

                                            <div className="searchedUserInfo">

                                                <div className="searchedUserName">
                                                    <span>{user?.name}</span>

                                                    {friends?.some(friend => friend._id === user._id) && (
                                                        <span className="friend_badge">
                                                            ✓ Friend
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="searchedUsername">
                                                    @{user?.username}
                                                </p>

                                            </div>

                                        </div>
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
                                                        : `${import.meta.env.VITE_API_URL}/${grp?.grpPic}`
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

                {showChat ? <> {friends?.map(user => (

                    <div
                        key={user?._id}
                        className="contact_tab"
                        onClick={() => show_chats(user?._id, false)}
                    >

                        <img
                            src={
                                user?.profilePic?.startsWith("http")
                                    ? user?.profilePic
                                    : `${import.meta.env.VITE_API_URL}/${user?.profilePic}`
                            }
                            style={{
                                border:
                                    onlineUsers?.[user._id]
                                        ? "3px solid #22c55e"
                                        : "2px solid transparent"
                            }}
                            alt={user?.name}
                        />

                        <div className="person_name">
                            <div>
                                {user?._id === loggedIn?._id ? <> {user?.name}(me) </> : <>{user?.name}</>}
                                <p
                                    style={
                                        userChatData?.lastUnread?.[user?._id]
                                            ? {
                                                fontSize: "0.85rem",
                                                fontWeight: 600,
                                                margin: "2px 0 0",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                maxWidth: "160px",
                                            }
                                            : {
                                                fontSize: "0.85rem",
                                                color: "#888",
                                                margin: "2px 0 0",
                                            }
                                    }
                                >
                                    {userChatData?.lastUnread?.[user?._id]
                                        ? `: ${userChatData.lastUnread[user._id].text || "Attachment"}`
                                        : `@${user?.username}`}
                                </p>
                            </div>
                            {userChatData?.number_of_unreadMsg?.[user?._id] > 0 && (
                                <div className="unread_badge">
                                    {userChatData.number_of_unreadMsg[user._id]}
                                </div>
                            )}
                        </div>

                    </div>

                ))} </> : <> {
                    groupJoined?.map(user => (

                        <div
                            key={user?._id}
                            className="contact_tab"
                            onClick={() => show_chats(user?._id, true)}
                        >

                            <img
                                src={
                                    user?.grpPic?.startsWith("http")
                                        ? user?.grpPic
                                        : `${import.meta.env.VITE_API_URL}/${user?.grpPic}`
                                }
                                alt=""
                            />



                            <div className="person_name">
                                {user?.grpName}
                                <p
                                    className="group_members_row"
                                    style={
                                        userChatData?.lastUnread?.[user?._id]
                                            ? {
                                                fontSize: "0.85rem",
                                                fontWeight: 600,
                                                margin: "2px 0 0",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }
                                            : {
                                                fontSize: "0.85rem",
                                                color: "#888",
                                                margin: "2px 0 0",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }
                                    }
                                >
                                    {userChatData?.lastUnread?.[user?._id]
                                        ? `${userChatData.lastUnread[user._id]?.sender?.username || "Someone"}: ${userChatData.lastUnread[user._id]?.text || "Attachment"}`
                                        : `~${user?.members?.map(m => `~${m.username}`).join(" , ")}`}
                                </p>
                            </div>



                            {userChatData?.number_of_unreadMsg?.[user?._id] > 0 && (
                                <div className="unread_badge">
                                    {userChatData.number_of_unreadMsg[user._id]}
                                </div>
                            )}

                        </div>

                    ))
                } </>}

            </div>

        </div >
    )
}

export default ContactsList