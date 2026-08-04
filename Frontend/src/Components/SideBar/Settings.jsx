import React from 'react'
import { useNavigate } from 'react-router-dom'
import SideBar from "../MainWindow/Sidebar"
import ProfileSettings from './Settings/ProfileSettings'
import GroupSettings from './Settings/GroupSettings'
import '../css/Mainwindow/Settings.css'

function Settings() {

    const navigate = useNavigate();

    const [loggedIn, setLoggedIn] = React.useState(null);

    return (
        <div className='profile_settings'>
            <SideBar />

            <ProfileSettings loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

            <GroupSettings/>

        </div>
    )
}

export default Settings
