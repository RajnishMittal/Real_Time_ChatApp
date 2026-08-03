import React from 'react'
import { FiPlus } from "react-icons/fi";
import "../css/Mainwindow/ContactList.css"

function ContactsList({ setActiveContactId, activeContactId, users, setNewGroup, group, onlineUsers, setIsGroup, isGroup, loggedIn, setOnlineUsers, joinGroup, activeContact, setGroupJoin }) {

    const [showChat, setShowChat] = React.useState(true)

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
            />

            <div className="create_group">
                <h2>Create New Group</h2>
                <button onClick={(e) => setNewGroup(true)} >
                    <FiPlus size={22} />
                </button>
            </div>

            <div className="choice">
                <div className="get_users" onClick={() => setShowChat(true)} >
                    Chats
                </div>
                <div className="get_groups" onClick={() => setShowChat(false)} >
                    Groups
                </div>
            </div>

            <div className="contacts_list">

                {showChat ? <> {users.map(user => (

                    <div
                        key={user._id}
                        className="contact_tab"
                        onClick={() => show_chats(user._id, false)}
                    >

                        <img
                            src={
                                user.profilePic.startsWith("http")
                                    ? user.profilePic
                                    : `http://localhost:8000/${user.profilePic}`
                            }
                            style={{
                                border:
                                    onlineUsers?.[user._id]
                                        ? "3px solid #22c55e"
                                        : "2px solid transparent"
                            }}
                            alt={user.name}
                        />

                        <h2 className="person_name">
                            {user.name}<br />
                            <p
                                style={{
                                    fontSize: "0.85rem",
                                    color: "#888",
                                    margin: "2px 0 0",
                                }}
                            >
                                @{user.username}
                            </p>
                        </h2>

                    </div>

                ))} </> : <> {
                    group.map(user => (

                        <div
                            key={user._id}
                            className="contact_tab"
                            onClick={() => show_chats(user._id, true)}
                        >

                            <img
                                src={
                                    user?.grpPic?.startsWith("http")
                                        ? user?.grpPic
                                        : `http://localhost:8000/${user.grpPic}`
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
