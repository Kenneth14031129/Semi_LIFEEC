import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import PatientBarChart from "../charts/PatientBarChart";

const Dashboard = () => {
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
