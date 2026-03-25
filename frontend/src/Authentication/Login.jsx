import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../API/auth";
import "./styles/login.css";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function login() {
    if (!username.trim() || !password.trim()) {
      alert("Please enter all the credentials.");
      return;
    } else {
      try {
        const result = await loginUser({
          username: username,
          password: password,
        });
        localStorage.setItem("access-token", result.data.access);
        localStorage.setItem("refresh-token", result.data.refresh);
        alert("User verified Successfully.");
        nav("/home");
      } catch (err) {
        if (err.response || err.response.data) {
          if (err.response.status === 401) {
            alert("Invalid Username or Password.");
          } else {
            alert("Something went wrong. Please check your credentials.");
          }
        } else {
          alert("Server is unreachable. Please try again later.");
        }
      }
    }
  }
  return (
    <div className="login-form">
      <h2>Login</h2>
      <div className="username">
        <input
          type="text"
          placeholder="Enter the Username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>

      <div className="password">
        <input
          type="password"
          placeholder="Enter the Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <div className="login-button">
        {/* Added onClick here */}
        <button onClick={login}>Login</button>
      </div>
      <div className="Signup-form">
         <Link to={'/'}>

         <div>
            New User?..Please Register
          </div>
         </Link > 
      </div>
    </div>
  );
};

export default Login;
