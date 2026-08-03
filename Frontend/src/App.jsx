import React from 'react'
import './App.css'
import LoginPage from './Components/LoginPage'
import SignUp from './Components/SignUp'
import MainWindow from './Components/MainWindow'
import Profile from './Components/Profile'
import ProfileUser from './Components/SideBar/ProfileUser'
import Settings from './Components/SideBar/Settings'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/linksync" element={<MainWindow />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/UserProfile" element={<ProfileUser />} />
      <Route path="/Settings" element={<Settings />} />
    </Routes>
  )
}

export default App