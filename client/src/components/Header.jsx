import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { 
  FaHome, 
  FaUserPlus, 
  FaList, 
  FaHeartbeat, 
  FaUtensils, 
  FaCalendarAlt, 
  FaUserCircle, 
  FaCaretDown, 
  FaUserNurse,
  FaBell,
  FaEnvelope,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';
import "../styles/Header.css";

const BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000/api/v1'
  : 'https://semi-lifeec.onrender.com/api/v1';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const isWithin24Hours = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = (now - notificationTime) / (1000 * 60 * 60);
    return diffInHours <= 24;
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${BASE_URL}/emergency-alerts`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      
      if (data.success) {
        const activeAlerts = data.data.filter(alert => isWithin24Hours(alert.timestamp));
        
        const sortedAlerts = activeAlerts.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        setNotifications(sortedAlerts);
        setNotificationCount(sortedAlerts.length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 300000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = Math.floor((now - notificationTime) / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInHours >= 1) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
    fetchNotifications();
  };

  return (
    <header className="header">
      <div className="brand">
        <h1 className="brand-text">LifeEC</h1>
      </div>

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
              <FaList className="nav-icon" /> Residents List
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

      <div className="header-actions">
        <div className="notifications">
          <div className="notification-icon" onClick={toggleNotifications}>
            <FaBell className="bell-icon" />
            {notificationCount > 0 && (
              <span className="notification-badge">{notificationCount}</span>
            )}
          </div>
          
          {isNotificationsOpen && (
            <div className="notifications-dropdown">
              {notifications.length > 0 ? (
                notifications.map((alert, index) => (
                  <div key={alert._id || index} className="notification-item">
                    <p>{alert.message}</p>
                    <span className="notification-time">
                      {formatTimeAgo(alert.timestamp)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="notification-item">
                  <p>No new notifications</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="profile">
          <div className="profile-info" onClick={toggleDropdown}>
            <FaUserCircle className="profile-icon" />
            <FaCaretDown className="caret-icon" />
          </div>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              {/* Profile Section */}
              <div className="profile-section">
                <FaUser className="profile-section-icon" />
                <div className="profile-details">
                  <span className="user-email">{user.email || 'User'}</span>
                  <span className="user-role">{user.userType}</span>
                </div>
              </div>
              
              {/* Menu Items */}
              {user.userType === 'Admin' && (
                <Link to="/messages" className="dropdown-item">
                  <FaEnvelope className="dropdown-icon" />
                  <span>Messages</span>
                </Link>
              )}
              <Link to="/logout" className="dropdown-item">
                <FaSignOutAlt className="dropdown-icon" />
                <span>Logout</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
