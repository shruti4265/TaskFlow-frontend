import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './global.css';
import BoltIcon from '@mui/icons-material/Bolt';

function Register() {
    const navigate = useNavigate();
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [error,setError]=useState("");
    const [loading, setLoading] = useState(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    function handle_name(event){
        setUsername(event.target.value);
    }
    function handle_email(event){
        setEmail(event.target.value);
    }
    function handle_password(event){
        setPassword(event.target.value);
    }
    function handle_confirmedPassword(event){
        setConfirmPassword(event.target.value);
    }
    async function signup(){
        if(!username || !email || !password || !confirmPassword){
            alert("Please fill out all fields");
            return;
        }
        if(!emailRegex.test(email)){
          alert("Please enter a valid email address");
          return;
        }
        if(password.length < 8){
          alert("Password must be at least 8 characters");
          return;
        }
        if(!/[A-Z]/.test(password)){
            alert("Password must contain at least one uppercase letter");
            return;
        }
        if(!/[0-9]/.test(password)){
            alert("Password must contain at least one number");
            return;
        }
        if(password !== confirmPassword){
            alert("Passwords don't match");
            return;
        }
        try{
            setLoading(true); 
            const response = await fetch(import.meta.env.VITE_API_BASE_URL+"/register",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({name:username,email,password}),
            });
            const result = await response.json();
            if (!response.ok) {
                alert(result.message || "Something went wrong");
                console.log(error);
            } else {
                setError(""); 
                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                alert("Registration successful! ");
                localStorage.clear();
                localStorage.setItem("token", result.token); 
                localStorage.setItem("user", JSON.stringify(result.user));
                localStorage.setItem("Time", Date.now().toString());
                navigate("/"); 
            }
        }catch(err){
            console.log(err);
        } finally{
          setLoading(false);
        }
        
    }
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <span><BoltIcon/></span>
        </div>
        <h1>TaskFlow</h1>
        <p className="login-subtitle">Create your account</p>

        <div className="login-form">
          <div className="input-group">
            <label>Username</label>
            <input type="text" placeholder="Username" onChange={handle_name} />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="you@gmail.com "onChange={handle_email} />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••"onChange={handle_password} />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="••••••••"onChange={handle_confirmedPassword} />
          </div>

          <button className="btn-primary" onClick={signup} disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="login-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register;