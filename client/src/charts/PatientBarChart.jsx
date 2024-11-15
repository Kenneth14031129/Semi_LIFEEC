import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { api } from '../api/api';

const PatientBarChart = () => {
  const [chartData, setChartData] = useState({ series: [], options: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.get('/emergency-alerts/stats');
        
        if (data.success && data.data) {
          const alertStats = data.data;
          const dates = alertStats.map((alert) => alert._id);
          const counts = alertStats.map((alert) => alert.count);

          setChartData({
            series: [{
              name: "Number of Emergency Alerts",
              data: counts,
            }],
            options: {
              chart: {
                type: "bar",
                height: 350,
              },
              xaxis: {
                categories: dates,
              },
            },
          });
        } else {
          setError("No data available.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <ApexCharts
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={400}
      />
    </div>
  );
};

export default PatientBarChart;