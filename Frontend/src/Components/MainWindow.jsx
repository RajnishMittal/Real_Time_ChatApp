import React from "react";
import io from "socket.io-client";
import "./css/Mainwindow.css";
import { FiPlus } from "react-icons/fi";
import userIcon from "../assets/icons/group.png"
import { useNavigate } from "react-router-dom";
import Sidebar from "./MainWindow/Sidebar";
import ContactsList from "./MainWindow/ContactsList";
import ChatWindow from "./MainWindow/ChatWindow";
import ProfilePanel from "./MainWindow/ProfilePanel";

function MainWindow() {

  const navigate = useNavigate();
  const [socket, setSocket] = React.useState(null)
  const [loggedIn, setLoggedIn] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [friends, setFriends] = React.useState([])
  const [group, setGroup] = React.useState([])
  const [groupJoined, setGroupsJoined] = React.useState([])
  const [mess, setMess] = React.useState([]);
  const [joinGroup, setGroupJoin] = React.useState(false)
  const [activeContactId, setActiveContactId] = React.useState(null);
  const [error, setError] = React.useState("")
  const [isGroup, setIsGroup] = React.useState(null)
  const [newGroup, setNewGroup] = React.useState(false)
  const [groupName, setGroupName] = React.useState("")
  const [grpIcon, setGrpIcon] = React.useState(userIcon)
  const [onlineUsers, setOnlineUsers] = React.useState({});
  const [showProfile, setShowProfile] = React.useState(false)
  const [isPrivate, setIsPrivate] = React.useState(false)

  React.useEffect(() => {
    const s = io(import.meta.env.VITE_API_URL);

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (!socket) return;

    const handleFriendAdded = () => {
      fetchFriends();
    };

    socket.on("friend_added", handleFriendAdded);

    return () => {
      socket.off("friend_added", handleFriendAdded);
    };
  }, [socket]);

  React.useEffect(() => {
    if (!socket || !loggedIn?._id) return;

    socket.emit("join", loggedIn._id);
  }, [socket, loggedIn]);

  const [userChatData, setUserChatData] = React.useState({
    number_of_unreadMsg: {},
    lastUnread: {},
    lastOnline: null,
  });

  const [othersChatData, setOthersChatData] = React.useState({
    number_of_unreadMsg: {},
    lastUnread: {},
    lastOnline: null,
  });

  const activeContact = isGroup
    ? group.find(g => g._id === activeContactId)
    : users.find(u => u._id === activeContactId);


  const setUnreadCounts = React.useCallback((updater) => {
    setUserChatData(prev => ({
      ...prev,
      number_of_unreadMsg: typeof updater === "function"
        ? updater(prev.number_of_unreadMsg || {})
        : updater,
    }));
  }, []);

  const setLastUnread = React.useCallback((updater) => {
    setUserChatData(prev => ({
      ...prev,
      lastUnread: typeof updater === "function"
        ? updater(prev.lastUnread || {})
        : updater,
    }));
  }, []);

  const fetchMeta = React.useCallback(async () => {
    if (!loggedIn?._id) return;
    try {
      const response = await fetch("/api/home/userMeta", {
        credentials: "include"
      });
      if (!response.ok) return;
      const { data } = await response.json();
      setUserChatData({
        number_of_unreadMsg: data.number_of_unreadMsg || {},
        lastUnread: data.lastUnread || {},
        lastOnline: data.lastOnline || null,
      });
    } catch (err) {
      console.error(err);
    }
  }, [loggedIn]);

  React.useEffect(() => {
    fetchMeta();
  }, [fetchMeta]);


  React.useEffect(() => {
    if (!loggedIn?._id) return;

    async function fetchMeta() {
      try {
        const response = await fetch(`/api/home/userMeta/${activeContactId}`, {
          credentials: "include"
        });
        if (!response.ok) return;
        const { data } = await response.json();
        setOthersChatData({
          number_of_unreadMsg: data.number_of_unreadMsg || {},
          lastUnread: data.lastUnread || {},
          lastOnline: data.lastOnline || null,
        });
      } catch (err) {
        console.error(err);
      }
    }

    fetchMeta();
  }, [activeContactId]);


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
  }, []);


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
        setError(err.message);
      }
    }

    fetchData();

  }, []);

  const fetchFriends = async () => {
    try {
      const response = await fetch("/api/connections/friends", {
        credentials: "include"
      });

      if (response.status === 401) {
        navigate("/");
        return;
      }

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        setError(errBody.error || "Failed to fetch friends");
        return;
      }

      const result = await response.json();

      setError(null);
      setFriends(result.data || []);

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  React.useEffect(() => {
    if (loggedIn?._id) {
      fetchFriends();
    }
  }, [loggedIn]);

  const fetchJoinedGroups = async () => {
    try {
      const response = await fetch("/api/connections/joinedGroups", {
        credentials: "include"
      });

      if (response.status === 401) {
        navigate("/");
        return;
      }

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        setError(errBody.error || "Failed to fetch joined groups");
        return;
      }

      const result = await response.json();

      setError(null);
      setGroupsJoined(result.data || []);

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  React.useEffect(() => {
    if (loggedIn?._id) {
      fetchJoinedGroups();
    }
  }, [loggedIn]);

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
        setLoggedIn(result)

      } catch (err) {
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
      console.error("error")
    }

    await fetchGroups();
    setGrpIcon(userIcon)
    setNewGroup(false);
  }

  React.useEffect(() => {
    if (!activeContactId || isGroup) return;

    async function getPrivateStatus() {
      try {
        const response = await fetch(
          `/api/connections/privateConnection/${activeContactId}`,
          {
            credentials: "include"
          }
        );

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          setError(errBody.error || "Failed to fetch privacy status");
          return;
        }

        const result = await response.json();

        setIsPrivate(result.data);

      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    getPrivateStatus();
  }, [activeContactId, isGroup]);


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
              }} ><FiPlus size={22} style={{ transform: "rotate(45deg)" }} /></h1>
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

        <Sidebar
          activeContactId={activeContactId}
          loggedIn={loggedIn}
        />

        <ContactsList
          userChatData={userChatData}
          mess={mess}
          activeContactId={activeContactId}
          isGroup={isGroup}
          setIsGroup={setIsGroup}
          onlineUsers={onlineUsers}
          users={users}
          setActiveContactId={setActiveContactId}
          setNewGroup={setNewGroup}
          group={group}
          loggedIn={loggedIn}
          setGroupJoin={setGroupJoin}
          joinGroup={joinGroup}
          activeContact={activeContact}
          friends={friends}
          othersChatData={othersChatData}
          groupJoined={groupJoined}
        />

        <ChatWindow
          setLastUnread={setLastUnread}
          setUnreadCounts={setUnreadCounts}
          mess={mess}
          setMess={setMess}
          setShowProfile={setShowProfile}
          showProfile={showProfile}
          setActiveContactId={setActiveContactId}
          isGroup={isGroup}
          setIsGroup={setIsGroup}
          activeContactId={activeContactId}
          activeContact={activeContact}
          users={users}
          loggedIn={loggedIn}
          onlineUsers={onlineUsers}
          setOnlineUsers={setOnlineUsers}
          joinGroup={joinGroup}
          setGroupJoin={setGroupJoin}
          fetchGroups={fetchGroups}
          othersChatData={othersChatData}
          isPrivate={isPrivate}
          friends={friends}
          fetchMeta={fetchMeta}
          fetchJoinedGroups={fetchJoinedGroups}
        />

        <ProfilePanel
          setShowProfile={setShowProfile}
          showProfile={showProfile}
          loggedIn={loggedIn}
          activeContact={activeContact}
          isGroup={isGroup}
          group={group}
          activeContactId={activeContactId}
          onlineUsers={onlineUsers}
          setIsGroup={setIsGroup}
          setActiveContactId={setActiveContactId}
        />

      </div>
    </>
  );

}

export default MainWindow;