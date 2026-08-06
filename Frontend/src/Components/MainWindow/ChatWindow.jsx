import React from 'react'
import "../css/Mainwindow/ChatWindow.css"
import { useNavigate } from 'react-router-dom'
import io from "socket.io-client"
import sendIcon from "../../assets/icons/send.png";
import fileIcon from "../../assets/icons/file.png";

function ChatWindow({ mess, setMess, setActiveContactId, activeContactId, activeContact, loggedIn, onlineUsers, setOnlineUsers, users, setIsGroup, isGroup, joinGroup, setGroupJoin, fetchGroups, setShowProfile, showProfile, setUnreadCounts }) {

    const [error, setError] = React.useState(null);
    const [selectedFile, setSelectedFile] = React.useState(null)
    const [socket, setSocket] = React.useState(null);
    const messagesRef = React.useRef(null);
    const fileInputRef = React.useRef(null);
    const socketRef = React.useRef(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const s = io("http://localhost:8000");
        setSocket(s);
        return () => s.disconnect();
    }, []);

    React.useEffect(() => {
        if (loggedIn?._id && socket) {
            socket.emit("join", loggedIn._id);
        }
    }, [loggedIn, socket]);

    React.useEffect(() => {
        if (!socket || !isGroup || !activeContactId) return;
        socket.emit("join_group_room", activeContactId);
    }, [activeContactId, isGroup, socket]);

    React.useEffect(() => {
        if (!users || users.length === 0) return;

        async function fetchAllStatuses() {
            try {
                const results = await Promise.all(
                    users.map(u =>
                        fetch(`/api/home/status/${u._id}`, { credentials: "include" })
                            .then(r => r.json())
                            .catch(() => null)
                    )
                );

                setOnlineUsers(prev => {
                    const updated = { ...prev };
                    results.forEach(d => {
                        if (d && d._id) updated[d._id] = d.status;
                    });
                    return updated;
                });
            } catch (err) {
                console.error(err);
            }
        }

        fetchAllStatuses();
    }, [users]);

    React.useEffect(() => {
        if (!socket) return;
        function onPresence({ userId, online }) {
            setOnlineUsers(prev => ({
                ...prev,
                [userId]: online
            }));
        }
        socket.on("online", onPresence);
        return () => socket.off("online", onPresence);
    }, [socket]);

    React.useEffect(() => {
    if (!activeContactId) return;
    setUnreadCounts(prev => {
        if (!prev[activeContactId]) return prev;
        const updated = { ...prev };
        delete updated[activeContactId];
        return updated;
    });
}, [activeContactId]);

    React.useEffect(() => {
        if (!socket) return;
        function onReceive(msg) {
            if (msg.sender !== activeContactId) {
                setUnreadCounts(prev => ({
                    ...prev,
                    [msg.sender]: (prev[msg.sender] || 0) + 1
                }));
            }
            if (msg.sender === activeContactId) {
                setMess(prev => [...prev, msg]);
            }
        }
        socket.on("receive_message", onReceive);
        return () => socket.off("receive_message", onReceive);
    }, [activeContactId, socket]);

    React.useEffect(() => {
        if (!socket) return;
        function onReceiveGroup(msg) {
            if (msg.group !== activeContactId) {
                setUnreadCounts(prev => ({
                    ...prev,
                    [msg.group]: (prev[msg.group] || 0) + 1
                }));
            }
            if (isGroup && msg.group === activeContactId) {
                setMess(prev => [...prev, msg]);
            }
        }
        socket.on("receive_group_message", onReceiveGroup);
        return () => socket.off("receive_group_message", onReceiveGroup);
    }, [activeContactId, isGroup, socket]);

    React.useEffect(() => {
        if (!activeContactId) return;

        async function fetchMessages() {
            try {
                const url = isGroup
                    ? `/api/home/group/messages/${activeContactId}`
                    : `/api/home/messages/${activeContactId}`;

                const response = await fetch(url, { credentials: "include" });

                if (response.status === 401) {
                    navigate("/");
                    return;
                }

                if (!response.ok) {
                    const errBody = await response.json().catch(() => ({}));
                    setError(errBody.error || "Failed to fetch messages");
                    return;
                }

                setError(null)
                const result = await response.json();
                setMess(result);

            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        }

        fetchMessages();

    }, [activeContactId, isGroup, navigate]);

    async function handleSend(e) {
        e.preventDefault()
        const formdata = new FormData(e.target)
        const text_message = formdata.get("msg")

        if (!text_message && !selectedFile) return;

        const formData = new FormData();

        formData.append("sender", loggedIn._id);
        { isGroup ? formData.append("group", activeContact._id) : formData.append("to", activeContact._id); }
        formData.append("text", text_message);

        if (selectedFile) {
            formData.append("file", selectedFile);
        }

        try {
            const url = isGroup
                ? `/api/home/group/messages`
                : `/api/home/messages`;
            const response = await fetch(url, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.error);
                return;
            }

            setError(null);
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            e.target.reset();
            if (isGroup) {
                socket.emit("send_group_message", { group: activeContact._id, message: result.data });
            } else {
                socket.emit("send_message", { to: activeContact._id, message: result.data });
            }
            setMess(prev => [...prev, result.data]);

        } catch (error) {
            console.error(error);
            setError("Unable to connect to the server.");
        }
    }

    React.useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop =
                messagesRef.current.scrollHeight;
        }
        if (fileInputRef.current) {
            fileInputRef.current.scrollTop =
                fileInputRef.current.scrollHeight;
        }
    }, [mess]);

    function goBack() {
        setActiveContactId(null);
    }

    const handleChange = (e) => {
        setSelectedFile(e.target.files[0] || null);
    }

    const joiningGroup = async () => {
        const grp_id = activeContactId

        const response = await fetch(`/api/group/addUser/${grp_id}`, {
            credentials: "include",
            method: "post"
        })

        await fetchGroups();

        if (response.ok) setGroupJoin(false)
    }

    function renderMessageFile(file) {
        if (!file || !file.path) return null;

        const url = `http://localhost:8000/${file.path.replace(/\\/g, "/")}`;

        if (file.mimetype?.startsWith("image/")) {
            return (
                <img
                    src={url}
                    alt={file.filename}
                    className="message-image"
                />
            );
        }

        return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="message-file">
                {file.filename}
            </a>
        );
    }

    function showUser() {
        setShowProfile(true)
    }

    const colors = [
        "#5FA8A8", // Cyan Teal
        "#6FBF73", // Fresh Green
        "#7C8CFF", // Indigo
        "#A970FF", // Violet
        "#F4B860", // Soft Gold
        "#E07A5F", // Coral
        "#D16BA5", // Rose
    ];

    const getUserColor = (id) => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash += id.charCodeAt(i);
        }
        return colors[hash % colors.length];
    };

    return (
        <div className={`chats ${showProfile ? "chats-collapsed-mobile" : ""}`}>
            {activeContact ? (
                <>
                    <div className="contact_nav">
                        {!isGroup ? <> <button className="back_btn" onClick={goBack} aria-label="Back to contacts">
                            ←
                        </button>
                            <img
                                src={
                                    activeContact?.profilePic?.startsWith("http")
                                        ? activeContact?.profilePic
                                        : `http://localhost:8000/${activeContact?.profilePic}`
                                }
                                alt={activeContact.name}
                            />

                            <h2 className="person_name" onClick={showUser} >
                                <span className="name_row">
                                    {activeContact?.name}
                                    {onlineUsers?.[activeContact?._id] && (
                                        <span className="online_dot"></span>
                                    )}
                                </span>

                                <p
                                    style={{
                                        fontSize: "0.85rem",
                                        color: "#888",
                                        margin: "2px 0 0",
                                    }}
                                >
                                    @{activeContact?.username}
                                </p>
                            </h2>
                        </>
                            : <>  <button className="back_btn" onClick={goBack} aria-label="Back to contacts">
                                ←
                            </button>
                                <img
                                    src={
                                        activeContact?.grpPic.startsWith("http")
                                            ? activeContact?.grpPic
                                            : `http://localhost:8000/${activeContact?.grpPic}`
                                    }
                                    alt=""
                                />

                                <h2 className="person_name" onClick={showUser} >
                                    <span className="name_row">
                                        {activeContact?.grpName}
                                    </span>
                                    <p className="group_members_row">
                                        {activeContact?.members?.map(m => `~${m.username}`).join(" , ")}
                                    </p>
                                </h2>
                            </>}
                    </div>

                    <div
                        className="messages"
                        ref={messagesRef}
                    >
                        {!isGroup ? <>
                            {mess?.map(msg => (
                                <div
                                    key={msg?._id ?? msg?.id}
                                    className={msg?.sender === loggedIn?._id ? "me" : "them"}
                                >
                                    {renderMessageFile(msg?.file)}
                                    {msg?.text && <p>{msg?.text}</p>}
                                    <p>
                                        {new Date(msg?.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            ))}</> : <>

                            {mess?.map(msg => (

                                <div
                                    key={msg?._id ?? msg?.id}
                                    className={(msg.sender?._id ?? msg.sender) === loggedIn?._id ? "me" : "them"}
                                >
                                    <p
                                        style={{
                                            fontSize: "0.75rem",
                                            color: getUserColor(msg?.sender?._id || msg?.sender?.username || ""),
                                            margin: "2px 0 6px",
                                            fontWeight: "500",
                                            fontStyle: "italic"
                                        }}
                                    >
                                        <img
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                marginRight: "6px",
                                                verticalAlign: "middle",
                                                border: "1px solid rgba(255,255,255,0.2)"
                                            }}
                                            src={
                                                msg?.sender?.profilePic?.startsWith("http")
                                                    ? msg?.sender.profilePic
                                                    : `http://localhost:8000/${msg?.sender.profilePic}`
                                            }
                                            alt={activeContact?.name}
                                        />
                                        ~{msg?.sender.name} @{msg?.sender.username}
                                    </p>
                                    {renderMessageFile(msg?.file)}
                                    {msg?.text && <p>{msg?.text}</p>}
                                    <p>
                                        {new Date(msg?.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>

                            ))}</>}

                    </div>

                    {error && (
                        <div className="chat-error" style={{ color: "red", margin: "0.5rem 0" }}>
                            {error}
                        </div>
                    )}

                    {selectedFile && (
                        <div className="file-preview">
                            {selectedFile.type.startsWith("image/") ? (
                                <img
                                    src={URL.createObjectURL(selectedFile)}
                                    alt="preview"
                                    className="message-image"
                                />
                            ) : (
                                <span>{selectedFile.name}</span>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    {!isGroup || joinGroup ?
                        <form action="" onSubmit={handleSend}>
                            <div className="chat_text">

                                <input
                                    type="text"
                                    name="msg"
                                    autoComplete="off"
                                    style={{
                                        width: "80%",
                                        fontSize: "larger",
                                    }}
                                />

                                <input
                                    type="file"
                                    name="file"
                                    ref={fileInputRef}
                                    onChange={handleChange}
                                    id="file-upload"
                                    className="file-input-hidden"
                                />
                                <label htmlFor="file-upload" className="file-upload-label">
                                    <img style={{ width: "20px", height: "20px" }} src={fileIcon} alt="file" />
                                </label>

                                <button
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        marginBottom: "10px"
                                    }}
                                    type="submit"
                                >
                                    <img src={sendIcon} alt="send" />
                                </button>

                            </div>
                        </form>

                        : <div className="join_chat"> <button onClick={joiningGroup} >Join Group</button> </div>

                    }
                </>

            ) : (

                <div className="not_selected">

                    <p>
                        Select any contact to start the CHAT!
                    </p>

                </div>

            )}

        </div>
    )
}

export default ChatWindow