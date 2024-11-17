import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthService from "../../../services/authService";
import Logo from "../assets/logo.jpg";
import "../styles/Login.css";

const Landing = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
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
        return 'Access denied: Only Admin and Owner accounts can log in.';
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
      const { user } = await AuthService.login(email, password);
      toast.success("Login successful");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error('Login error:', err);
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