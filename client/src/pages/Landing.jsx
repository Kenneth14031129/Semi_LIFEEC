import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthService from "../../../services/authService";
import Logo from "../assets/logo.jpg";
import "../styles/Login.css";

const Landing = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { user } = await AuthService.login(email, password);

      if (user.userType === "Admin" || user.userType === "Owner") {
        toast.success("Login successful");
        navigate("/dashboard", { replace: true }); // Added replace: true
      } else {
        toast.error("Access denied: Only Admin and Owner can log in.");
        AuthService.logout();
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.message || "Login failed");
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
            <form onSubmit={handleLoginSubmit}>
              <input 
                type="email" 
                placeholder="Email" 
                name="email"
                required 
              />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  required
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">
                    Remember for 30 days
                  </label>
                </div>
                <a href="#" className="forgot-pass-link">
                  Forgot password?
                </a>
              </div>
              <div className="login-center-buttons">
                <button type="submit">Log In</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;