// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Logo from "../assets/logo.png";
import "../styles/Register.css";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (name && lastname && email && password && confirmPassword) {
      if (password === confirmPassword) {
        const formData = {
          username: `${name} ${lastname}`,
          email,
          password
        };
        try {
          await axios.post("http://localhost:3000/api/v1/register", formData);
          toast.success("Registration successful");
          navigate("/login");
        } catch (err) {
          toast.error(err.response?.data?.message || "Registration failed");
        }
      } else {
        toast.error("Passwords don't match");
      }
    } else {
      toast.error("Please fill all inputs");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      toast.info("You are already logged in");
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="register-container">
      <div className="register-form-container">
        <img src={Logo} alt="Logo" className="register-logo" />
        <h2>Create an Account</h2>
        <p>Please enter your details to sign up</p>
        <form onSubmit={handleRegisterSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit" className="register-button">
            Sign Up
          </button>
          <button type="button" className="google-register-button">
            <FaGoogle /> Sign Up with Google
          </button>
        </form>
        <p className="login-prompt">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;