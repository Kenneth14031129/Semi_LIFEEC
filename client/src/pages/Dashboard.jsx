// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Dashboard.css";
import Header from "../components/Header";
import PatientBarChart from "../charts/PatientBarChart";
import { api } from "../api/api";
import { AlertCircle, Users, Activity, Calendar, Bell, ArrowUp, ArrowDown, Clock } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [totalResidents, setTotalResidents] = useState(0);
  const [alertTrend, setAlertTrend] = useState(0);
  const [residentTrend, setResidentTrend] = useState(0);
  const [selectedTimeRange, setSelectedTimeRange] = useState('12');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Authentication functions
  const getAuthToken = () => localStorage.getItem('authToken');
  const isAuthenticated = () => !!getAuthToken();
  
  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    await fetchDashboardData();
    setLastUpdated(new Date());
    toast.success('Dashboard data refreshed');
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch total alerts
      const alertsResponse = await api.get('/emergency-alerts');
      if (alertsResponse.success) {
        setTotalAlerts(alertsResponse.data.length);
        setAlertTrend(Math.floor(Math.random() * 20) - 10);
      }
  
      // Fetch total residents
      const residentsResponse = await api.get('/patient/list');
      if (Array.isArray(residentsResponse)) {
        setTotalResidents(residentsResponse.length);
        setResidentTrend(Math.floor(Math.random() * 15));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/", { replace: true });
      toast.warn("Please login first to access dashboard");
      return;
    }

    setUser(getUser());
    fetchDashboardData();
  }, [navigate]);

  const formatLastUpdated = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="dashboard-component">
        <Header />
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-component">
      <Header />
      <section className="main-body">
        <main>
          <div className="dashboard-header">
            <div className="header-content">
              <h1>Dashboard Overview</h1>
              <p className="welcome-message">
                Real-time monitoring and analytics
              </p>
            </div>
            <div className="dashboard-actions">
              <button className="refresh-btn" onClick={handleRefresh}>
                <Activity size={16} />
                Refresh
              </button>
              <div className="last-updated">
                <Clock size={14} />
                Last updated: {formatLastUpdated(lastUpdated)}
              </div>
            </div>
          </div>
          
          <div className="quick-stats">
            <div className="stat-card alert-card">
              <div className="stat-icon">
                <AlertCircle size={24} />
              </div>
              <div className="stat-content">
                <h3>Total Alerts</h3>
                <p>{totalAlerts}</p>
              </div>
            </div>
            
            <div className="stat-card resident-card">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <h3>Total Residents</h3>
                <p>{totalResidents}</p>
              </div>
            </div>
          </div>

          <div className="charts-section">
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-title">
                  <h2>Alert Trends</h2>
                  <p className="chart-subtitle">Monthly emergency alerts overview</p>
                </div>
              </div>
              <PatientBarChart />
            </div>
          </div>
        </main>
      </section>
    </div>
  );
};

export default Dashboard;