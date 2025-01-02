// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Dashboard.css";
import Header from "../components/Header";
import PatientBarChart from "../charts/PatientBarChart";
import { api } from "../api/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [totalResidents, setTotalResidents] = useState(0);

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
    const fetchDashboardData = async () => {
      try {
        // Fetch total alerts
        const alertsResponse = await api.get('/emergency-alerts');
        if (alertsResponse.success) {
          setTotalAlerts(alertsResponse.data.length);
        }
    
        // Fetch total residents
        const residentsResponse = await api.get('/patient/list');
        if (Array.isArray(residentsResponse)) {
          setTotalResidents(residentsResponse.length);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    // Check authentication
    if (!isAuthenticated()) {
      navigate("/", { replace: true });
      toast.warn("Please login first to access dashboard");
      return;
    }

    // Set user data and fetch dashboard data
    const userData = getUser();
    setUser(userData);
    fetchDashboardData();
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
          <div className="stats-container">
            <div className="stat-card">
              <h3>Total Alerts</h3>
              <p>{totalAlerts}</p>
            </div>
            <div className="stat-card">
              <h3>Total Residents</h3>
              <p>{totalResidents}</p>
            </div>
          </div>
          <div className="chart-container">
            <PatientBarChart />
          </div>
        </main>
      </section>
    </div>
  );
};

export default Dashboard;