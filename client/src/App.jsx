import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signin from './pages/Signin'
import AdminHomePage from './pages/AdminHomePage'
import AgentsHomePage from './pages/AgentsHomePage'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'

const App = () => {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/admin' element={<AdminHomePage/>}/>
        <Route path='/agent' element={<AgentsHomePage/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
