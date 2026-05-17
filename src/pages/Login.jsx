import React, { useState } from "react";
import './global.css'
import { Link,useNavigate } from 'react-router-dom'
import BoltIcon from '@mui/icons-material/Bolt';

function Login() {
  const navigate = useNavigate();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  function handleEmail(event){
    setEmail(event.target.value);
  }
  function handlePassword(event){
    setPassword(event.target.value);
  }
  async function signin(){
    if(!email||!password){
      alert("Please fill out all fields");
      return;
    }
    try{
      const response=await fetch(import.meta.env.VITE_API_BASE_URL+"/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({email,password})
      });
      const result=await response.json();
      if (!response.ok) {
        alert(result.message || "Something went wrong");
      } else {
        console.log("✅ Success:", result);
        setEmail("");
        setPassword("");
        alert("Login successful! ");
        localStorage.clear();
        localStorage.setItem("token", result.token); 
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("Time", Date.now().toString());
        navigate("/"); 
      }
    }catch(err){
      console.log(err);
    }
  }
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <span><BoltIcon/></span>
        </div>
        <h1>TaskFlow</h1>
        <p className="login-subtitle">Manage projects, organize work</p>

        <div className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="you@gmail.com" onChange={handleEmail} />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" onChange={handlePassword} />
          </div>

          <button className="btn-primary" onClick={signin}>Sign In</button>
          <p className="login-footer">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login;