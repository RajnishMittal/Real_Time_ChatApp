import React from 'react'
import SideBar from "../MainWindow/Sidebar"
import ProfileSettings from './Settings/ProfileSettings'
import GroupSettings from './Settings/GroupSettings'
import '../css/Mainwindow/Settings.css'

function Settings() {

    const [loggedIn, setLoggedIn] = React.useState(null);

    return (
        <div className="settings_page">
            <SideBar />

            <div className="settings_scroll">
                <header className="settings_header">
                    <h1>Settings</h1>
                    <p>Manage your profile and the groups you run.</p>
                </header>
                <div className="settings_inner">
                        <ProfileSettings loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                        <GroupSettings />
                </div>
            </div>
        </div>
    )
}

export default Settings