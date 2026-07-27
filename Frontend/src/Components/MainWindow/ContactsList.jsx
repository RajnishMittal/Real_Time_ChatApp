import React from 'react'

function ContactsList({setActiveContactId, activeContactId, users }) {

    function show_chats(id) {
        return setActiveContactId(id);
    }

    return (
        <div className={`contacts ${activeContactId ? "contacts_collapsed" : ""}`}>

            <input
                type="search"
                placeholder="SEARCH CHAT"
                autoComplete='off'
            />

            <div className="contacts_list">

                {users.map(user => (

                    <div
                        key={user._id}
                        className="contact_tab"
                        onClick={() => show_chats(user._id)}
                    >

                        <img src={user.profilePic} />

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

                ))}

            </div>

        </div>
    )
}

export default ContactsList
