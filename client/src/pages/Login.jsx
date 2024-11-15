import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleSvg from "../assets/icons8-google.svg";
import Logo from "../assets/logo.jpg";
import "../styles/Login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("auth")) || "";
    const userId = JSON.parse(localStorage.getItem("userId")) || "";

    if (token && userId) {
      toast.success("You are already logged in", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/dashboard");
    }
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email && password) {
      const formData = { email, password };
      try {
        const response = await axios.post(
          "http://localhost:3000/api/v1/auth/login",
          formData
        );

        const { token, user } = response.data;
        if (user.userType === "Admin" || user.userType === "Owner") {
          // Save token and user ID to localStorage
          localStorage.setItem("auth", JSON.stringify(token));
          localStorage.setItem("userId", JSON.stringify(user._id));
          toast.success("Login successful", {
            position: "top-right",
            autoClose: 3000,
          });
          navigate("/dashboard");
        } else {
          toast.error("Access denied: Only Admin and Owner can log in.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Login failed. Please check your credentials.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } else {
      toast.error("Please fill in all fields", {
        position: "top-right",
        autoClose: 3000,
      });
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
              <input type="email" placeholder="Email" name="email" />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                />
                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
              <div className="login-center-options">
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

export default Login;
