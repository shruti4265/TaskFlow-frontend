import React from 'react'
import { Routes, Route } from "react-router-dom";
import './App.css'
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Board from './pages/Board';
import Profile from './pages/Profile';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Dashboard/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/board/:id' element={<Board/>}/>
      <Route path='/profile' element={<Profile/>}/>
    </Routes>
  )
}

export default App
