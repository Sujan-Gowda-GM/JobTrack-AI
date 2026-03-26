import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./styles/navbar.css";

const Navbar = () => {
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Or however you handle your auth
    nav("/login");
  };

  return (
    <nav className="glass-nav">
      <div className="nav-logo">VISIONARY<span>.</span>ATS</div>
      <div className="nav-links">
        <NavLink to="/home" className={({ isActive }) => isActive ? "active-link" : ""}>Analyze</NavLink>
        <NavLink to="/jobboard" className={({ isActive }) => isActive ? "active-link" : ""}>Board</NavLink>
        <button onClick={handleLogout} className="logout-btn">Exit</button>
      </div>
    </nav>
  );
};

export default Navbar;