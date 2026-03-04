import React, { useState } from "react";
import { registerUser } from "../API/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function register() {
    if (username === " " || email === " " || password === " ") {
      alert("Please enter all the credentials.");
      return;
    } else {
      try {
        await registerUser({
          username: username,
          email: email,
          password: password,
        });
        alert("Registration successful! Please login.");
        nav("/login");
      } catch (err) {
        if (err.response || err.response.data) {
          if (err.response.data.username) {
            alert("User already exists or is invalid.");
          } else if (err.response.data.email) {
            alert("Email already exists or is invalid.");
          } else {
            alert("Something went wrong.");
          }
        } else {
          alert("Server is unreachable. Please try again later.");
        }
      }
    }
  }

  return (
    <div className="register-form">
      <h2>Sign Up</h2>
      <div className="username">
        <input
          type="text"
          placeholder="Enter the Username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      <div className="email">
        <input
          type="text"
          placeholder="Enter the Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
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
      <div className="register-button">
        {/* Added onClick here */}
        <button onClick={register}>Register</button>
      </div>
    </div>
  );
};

export default Register;
