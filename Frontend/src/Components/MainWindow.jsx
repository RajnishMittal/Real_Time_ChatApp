import React from "react";
import "./css/Mainwindow.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "./MainWindow/Sidebar";
import ContactsList from "./MainWindow/ContactsList";
import ChatWindow from "./MainWindow/ChatWindow";
import ProfilePanel from "./MainWindow/ProfilePanel";

function MainWindow() {

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [activeContactId, setActiveContactId] = React.useState(null);

  const activeContact = users.find(
    user => user._id === activeContactId
  );

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

  return (

    <div className="mainWindow">

      <Sidebar activeContactId={activeContactId} />

      <ContactsList activeContactId={activeContactId} users={users} setActiveContactId={setActiveContactId} />

      <ChatWindow setActiveContactId={setActiveContactId} activeContactId={activeContactId} activeContact={activeContact} users={users} loggedIn={loggedIn} />

      <ProfilePanel loggedIn={loggedIn} activeContact={activeContact} />

    </div>

  );

}

export default MainWindow;