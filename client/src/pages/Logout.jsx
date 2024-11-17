import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import "../styles/Logout.css";

const Logout = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(3);
    
    useEffect(() => {
        // Clear all localStorage items
        localStorage.clear();

        // Countdown timer
        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        // Redirect after 3 seconds
        const redirect = setTimeout(() => {
            navigate("/", { replace: true });
        }, 3000);

        // Cleanup timers
        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [navigate]);

    return (
        <div className='logout-main'>
            <div className="logout-content">
                <FaSignOutAlt className="logout-icon" />
                <h1>Logout Successful!</h1>
                <p>You will be redirected to the login page in {countdown} seconds...</p>
                <div className="loading-bar">
                    <div className="loading-progress"></div>
                </div>
            </div>
        </div>
    );
};

export default Logout;