import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../api/api";
import Logo from "../assets/logo.jpg";
import "../styles/Login.css";

// Custom error class to maintain consistency with existing error handling
class AuthError extends Error {
  constructor(message, code = 'AUTH_ERROR') {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

// Define role-based constants
const USER_ROLES = {
  OWNER: 'Owner',
  ADMIN: 'Admin'  // Changed from SUPER_ADMIN to ADMIN
};

const Landing = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = JSON.parse(localStorage.getItem("authToken"));
        const user = JSON.parse(localStorage.getItem("user"));
        
        if (token && user?.userType) {
          const userRole = user.userType;
          
          // Validate allowed roles
          if ([USER_ROLES.OWNER, USER_ROLES.ADMIN].includes(userRole)) {  // Updated role check
            navigate("/dashboard", { replace: true });
          }
        }
      } catch {
        // Clear invalid data
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const getErrorMessage = (err) => {
    switch (err.code) {
      case 'SERVER_UNREACHABLE':
        return 'Cannot connect to the server. Please check your internet connection and try again.';
      case 'REQUEST_TIMEOUT':
        return 'The request took too long. Please try again.';
      case 'INVALID_CREDENTIALS':
        return 'Invalid email or password.';
      case 'UNAUTHORIZED_ROLE':
        return 'Access denied: Only Admin and Owner accounts can log in.';  // Updated error message
      case 'ACCOUNT_LOCKED':
        return 'This account has been locked. Please contact support.';
      case 'VALIDATION_ERROR':
        return 'Please fill in all fields correctly.';
      default:
        return err.message || 'An unexpected error occurred. Please try again.';
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.token && response.user) {
        const userRole = response.user.userType;

        // Validate user role
        if (![USER_ROLES.OWNER, USER_ROLES.ADMIN].includes(userRole)) {  // Updated role check
          throw new AuthError('Access denied: Only Admin and Owner can log in.', 'UNAUTHORIZED_ROLE');
        }

        // Create user object with email
        const userData = {
          ...response.user,
          email: email // Explicitly include email
        };

        // Store auth data
        localStorage.setItem("authToken", JSON.stringify(response.token));
        localStorage.setItem("userId", JSON.stringify(response.user._id));
        localStorage.setItem("user", JSON.stringify(userData)); // Store complete user data including email
        
        toast.success(`Welcome ${userRole}!`);
        navigate("/dashboard", { replace: true });
      } else {
        throw new AuthError('Invalid server response: Missing token or user data', 'INVALID_RESPONSE');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Clean up any partial data
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("user");

      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={Image} alt="" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="" />
          </div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLoginSubmit}>
              <input 
                type="email" 
                placeholder="Email" 
                name="email"
                required 
                disabled={isLoading}
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  required
                  disabled={isLoading}
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
              <div className="login-center-options">
                <div className="remember-div">
                  <input 
                    type="checkbox" 
                    id="remember-checkbox"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember-checkbox">
                    Remember for 30 days
                  </label>
                </div>
                <a href="#" className="forgot-pass-link">
                  Forgot password?
                </a>
              </div>
              <div className="login-center-buttons">
                <button 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;