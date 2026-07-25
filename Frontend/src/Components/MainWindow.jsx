import React from "react";
import "./css/Mainwindow.css";
import { useNavigate } from "react-router-dom";

function MainWindow() {

  const navigate = useNavigate();
  // Logged in user (use later after authentication)
  const [loggedIn, setLoggedIn] = React.useState(null);

  // List of all users fetched from backend
  const [users, setUsers] = React.useState([]);

  // Messages between current user and selected user
  // For now these are local, later fetch from backend
  const [mess, setMess] = React.useState([]);

  // Stores which contact is selected
  const [activeContactId, setActiveContactId] = React.useState(null);

  const [error, setError] = React.useState(null);

  const messagesRef = React.useRef(null);

  // Find selected user
  const activeContact = users.find(
    user => user._id === activeContactId
  );

  async function handleSend(e) {
    e.preventDefault()
    const formdata = new FormData(e.target)
    const text_message = formdata.get("msg")
    if (!text_message) return null

    const newMessage = {
      id: Date.now(),
      sender: loggedIn._id,
      to: activeContact._id,
      text: text_message
    };
    console.log(newMessage)

    try {
      const response = await fetch("/api/home/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newMessage),
      });

      const result = await response.json();

      e.target.reset()

      if (!response.ok) {
        setError(result.error);
        return;
      }

      setError(null);
      const savedMessage = result.data || { ...newMessage, _id: Date.now().toString() }
      setMess(prev => [...prev, savedMessage]);

    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server.");
    }
    e.target.reset()
  }

  React.useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;
    }
  }, [mess]);

  // get all users signed up

  React.useEffect(() => {

    async function fetchData() {
      try {
        const response = await fetch("/api/home/getusers", {
          credentials: "include"
        });

        if (response.status === 401) {
          navigate("/");
          return;
        }

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          setError(errBody.error || "Failed to fetch users");
          return;
        }

        const result = await response.json();
        setUsers(result);

      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    fetchData();

  }, []);

  // get logged in user info

  React.useEffect(() => {

    async function getLoggedIn() {
      try {
        const response = await fetch("/api/home/me", {
          credentials: "include"
        });

        if (response.status === 401) {
          navigate("/");
          return;
        }

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          setError(errBody.error || "Failed to fetch");
          return;
        }

        const result = await response.json();
        setLoggedIn(result);
        console.log(result)

      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    getLoggedIn();

  }, []);

  function show_chats(id) {
    return setActiveContactId(id);
  }

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

  }, [activeContactId]);

  function goBack() {
    setActiveContactId(null);
  }

  return (

    <div className="mainWindow">

      <div className={`sidebar ${activeContactId ? "sidebar_collapsed" : ""}`}>
        <h1>1</h1>
      </div>

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
                  <p>{msg.text}</p>
                  <p>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}

            </div>
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

                <button
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                  type="submit"
                >
                  ➤
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

      <div className="profile">

        {/* Logged in user's profile later */}

        <h1>{loggedIn?.name}</h1>

      </div>

    </div>

  );

}

export default MainWindow;