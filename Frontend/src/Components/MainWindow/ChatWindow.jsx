import React from 'react'
import { useNavigate } from 'react-router-dom'
import io from "socket.io-client"
import sendIcon from "../../assets/icons/send.png";
import fileIcon from "../../assets/icons/file.png";

function ChatWindow({ setActiveContactId, activeContactId, activeContact, loggedIn }) {

    const [error, setError] = React.useState(null);
    const [mess, setMess] = React.useState([]);
    const [selectedFile, setSelectedFile] = React.useState(null)
    const messagesRef = React.useRef(null);
    const fileInputRef = React.useRef(null);
    const socketRef = React.useRef(null);
    const navigate = useNavigate();

    if (!socketRef.current) socketRef.current = io("http://localhost:8000");
    const socket = socketRef.current;

    React.useEffect(() => {
        if (loggedIn?._id) {
            socket.emit("join", loggedIn._id);
        }
    }, [loggedIn]);

    React.useEffect(() => {
        function onReceive(msg) {
            if (msg.sender === activeContactId || msg.to === activeContactId) {
                setMess(prev => [...prev, msg]);
            }
        }
        socket.on("receive_message", onReceive);
        return () => socket.off("receive_message", onReceive);
    }, [activeContactId]);

    React.useEffect(() => {
        if (!activeContactId) return;

        async function fetchMessages() {
            try {
                const response = await fetch(`/api/home/messages/${activeContactId}`, {
                    credentials: "include",
                });

                if (response.status === 401) {
                    navigate("/");
                    return;
                }

                if (!response.ok) {
                    const errBody = await response.json().catch(() => ({}));
                    setError(errBody.error || "Failed to fetch messages");
                    return;
                }

                const result = await response.json();
                setMess(result);

            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        }

        fetchMessages();

    }, [activeContactId, navigate]);

    async function handleSend(e) {
        e.preventDefault()
        const formdata = new FormData(e.target)
        const text_message = formdata.get("msg")

        if (!text_message && !selectedFile) return;

        const formData = new FormData();

        formData.append("sender", loggedIn._id);
        formData.append("to", activeContact._id);
        formData.append("text", text_message);

        if (selectedFile) {
            formData.append("file", selectedFile);
        }

        try {
            const response = await fetch("/api/home/messages", {
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
            socket.emit("send_message", { to: activeContact._id, message: result.data });
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
    }, [mess]);

    function goBack() {
        setActiveContactId(null);
    }

    const handleChange = (e) => {
        setSelectedFile(e.target.files[0] || null);
    }

    function renderMessageFile(file) {
        if (!file || !file.path) return null;

        const normalizedPath = file.path.replace(/\\/g, "/");
        const url = normalizedPath.startsWith("/")
            ? normalizedPath
            : `/${normalizedPath}`;

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

    return (
        <div className="chats">

            {activeContact ? (

                <>

                    <div className="contact_nav">

                        <button className="back_btn" onClick={goBack} aria-label="Back to contacts">
                            ←
                        </button>
                        <img src={activeContact.profilePic} />

                        <h2 className="person_name">
                            {activeContact.name} <br />
                            <p
                                style={{
                                    fontSize: "0.85rem",
                                    color: "#888",
                                    margin: "2px 0 0",
                                }}
                            >
                                @{activeContact.username}
                            </p>
                        </h2>

                    </div>

                    <div
                        className="messages"
                        ref={messagesRef}
                    >

                        {mess.map(msg => (
                            <div
                                key={msg._id ?? msg.id}
                                className={msg.sender === loggedIn?._id ? "me" : "them"}
                            >
                                {renderMessageFile(msg.file)}
                                {msg.text && <p>{msg.text}</p>}
                                <p>
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        ))}

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