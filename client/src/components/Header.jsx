// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaHome, FaUserPlus, FaList, FaHeartbeat, FaUtensils, FaCalendarAlt, FaUserCircle, FaCaretDown, FaUserNurse } from 'react-icons/fa';
import "../styles/Header.css";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle profile dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      {/* Branding Section */}
      <div className="brand">
        <h1 className="brand-text">LifeEC</h1>
      </div>

      {/* Navigation Links */}
      <nav className="header-menu">
        <ul>
          <li>
            <NavLink to="/dashboard" className="nav-item" activeClassName="active">
              <FaHome className="nav-icon" /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/basicInformation" className="nav-item" activeClassName="active">
              <FaUserPlus className="nav-icon" /> Add Resident
            </NavLink>
          </li>
          <li>
            <NavLink to="/residentList" className="nav-item" activeClassName="active">
              <FaList className="nav-icon" /> Resident List
            </NavLink>
          </li>
          <li>
            <NavLink to="/addUser" className="nav-item" activeClassName="active">
              <FaUserNurse className="nav-icon" /> Add User
            </NavLink>
          </li>
          <li>
            <NavLink to="/healthManagement" className="nav-item" activeClassName="active">
              <FaHeartbeat className="nav-icon" /> Health Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/mealManagement" className="nav-item" activeClassName="active">
              <FaUtensils className="nav-icon" /> Meal Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/activities" className="nav-item" activeClassName="active">
              <FaCalendarAlt className="nav-icon" /> Activities
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Admin Profile Section */}
      <div className="profile">
        <div className="profile-info" onClick={toggleDropdown}>
          <FaUserCircle className="profile-icon" />
          <FaCaretDown className="caret-icon" />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/messages" className="dropdown-item">Messages</Link>
            <Link to="/settings" className="dropdown-item">Settings</Link>
            <Link to="/logout" className="dropdown-item">Logout</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
