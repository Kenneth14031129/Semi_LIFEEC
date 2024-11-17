import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Dashboard.css";
import Header from "../components/Header";
import PatientBarChart from "../charts/PatientBarChart";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Authentication functions
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const isAuthenticated = () => {
    const token = getAuthToken();
    return !!token;
  };

  const getUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate("/", { replace: true });
      toast.warn("Please login first to access dashboard");
      return;
    }

    // Set user data
    const userData = getUser();
    setUser(userData);
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="dashboard-component">
        <Header />
        <div className="loading">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-component">
      <Header />
      <section className="main-body">
        <main>
          <h1>Dashboard</h1>
          <div className="chart-container">
            <PatientBarChart />
          </div>
        </main>
      </section>
    </div>
  );
};

export default Dashboard;