import React from "react";
import "./css/Mainwindow.css";
import userIcon from "../assets/icons/group.png"
import { useNavigate } from "react-router-dom";
import Sidebar from "./MainWindow/Sidebar";
import ContactsList from "./MainWindow/ContactsList";
import ChatWindow from "./MainWindow/ChatWindow";
import ProfilePanel from "./MainWindow/ProfilePanel";

function MainWindow() {

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [group, setGroup] = React.useState([])
  const [joinGroup, setGroupJoin] = React.useState(false)
  const [activeContactId, setActiveContactId] = React.useState(null);
  const [error, setError] = React.useState("")
  const [isGroup, setIsGroup] = React.useState(null)
  const [newGroup, setNewGroup] = React.useState(false)
  const [groupName, setGroupName] = React.useState("")
  const [grpIcon, setGrpIcon] = React.useState(userIcon)
  const [onlineUsers, setOnlineUsers] = React.useState({});

  const activeContact = isGroup
    ? group.find(g => g._id === activeContactId)
    : users.find(u => u._id === activeContactId);

  const fetchGroups = async () => {
    try {
      const response = await fetch("/api/group/getGroups", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }

      const result = await response.json();
      setGroup(result);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {

    fetchGroups();

  }, [group]);


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
        setError(null)
        setUsers(result);

      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    fetchData();

  }, []);

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
        setError(null)
        setLoggedIn(result);
        console.log(result)

      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    getLoggedIn();

  }, []);

  async function gotoMain(e) {
    e.preventDefault();

    const formdata = new FormData(e.target)

    const response = await fetch("/api/group/createGroup", {
      credentials: "include",
      method: "post",
      body: formdata
    })

    if (!response) {
      console.log("errrorororooror")
    }

    await fetchGroups();
    setGrpIcon(userIcon)
    setNewGroup(false);
  }

  return (
    <>

      {newGroup && (
        <div className="create">
          <form onSubmit={gotoMain}>
            <div className="groupCreate">

              <h1>Create New Group</h1>
              <h1 className="close" onClick={(e) => {
                setNewGroup(false);
                setGrpIcon(userIcon)
                setGroupName()
              }} >x</h1>
              <label htmlFor="groupPhoto" className="groupPhoto">
                <img src={grpIcon} alt="Group" />
              </label>

              <input
                name="grpPic"
                type="file"
                id="groupPhoto"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setGrpIcon(URL.createObjectURL(file));
                }}
              />

              <input
                type="text"
                name="grpName"
                placeholder="Enter Group Name"
                onChange={(e) => setGroupName(e.target.value)}
                required
              />

              <button type="submit">Create</button>
            </div>
          </form>
        </div>
      )}

      <div className="mainWindow">

        <Sidebar activeContactId={activeContactId} loggedIn={loggedIn} />

        <ContactsList activeContactId={activeContactId} isGroup={isGroup} setIsGroup={setIsGroup}  onlineUsers={onlineUsers} users={users} setActiveContactId={setActiveContactId} setNewGroup={setNewGroup} group={group} loggedIn={loggedIn} setGroupJoin={setGroupJoin} joinGroup={joinGroup} activeContact={activeContact} />

        <ChatWindow setActiveContactId={setActiveContactId} isGroup={isGroup} setIsGroup={setIsGroup} activeContactId={activeContactId} activeContact={activeContact} users={users} loggedIn={loggedIn} onlineUsers={onlineUsers} setOnlineUsers={setOnlineUsers} joinGroup={joinGroup} />

        <ProfilePanel loggedIn={loggedIn} activeContact={activeContact} isGroup={isGroup} group={group} activeContactId={activeContactId} onlineUsers={onlineUsers} setIsGroup={setIsGroup} setActiveContactId={setActiveContactId}/>

      </div>
    </>
  );

}

export default MainWindow;