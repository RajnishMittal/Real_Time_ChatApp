import React from 'react'
import './App.css'
import LoginPage from './Components/LoginPage'
import SignUp from './Components/SignUp'
import MainWindow from './Components/MainWindow'
import Profile from './Components/Profile'
import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/linksync" element={<MainWindow />} />
      <Route path="/Profile" element={<Profile />} />
    </Routes>
  )
}

export default App