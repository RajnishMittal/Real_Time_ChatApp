import React from 'react'
import SideBar from "../MainWindow/Sidebar"
import ProfileSettings from './Settings/ProfileSettings'
import GroupSettings from './Settings/GroupSettings'
import ColorTheme from './Settings/ColorTheme'
import '../css/Mainwindow/Settings.css'

function Settings() {

    const [loggedIn, setLoggedIn] = React.useState(null);

    return (
        <div className="settings_page">
            <SideBar />

            <div className="settings_scroll">
                <div className="settings_inner">
                        <ProfileSettings loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
                        <div className="row_settings">
                            <GroupSettings />
                            <ColorTheme/>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default Settings