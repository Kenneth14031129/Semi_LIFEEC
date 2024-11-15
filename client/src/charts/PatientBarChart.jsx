import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";

const PatientBarChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching alert stats from backend...");

      try {
        const response = await fetch("http://localhost:3000/api/v1/emergency-alerts/stats");
        console.log("Fetch response status:", response.status);

        if (!response.ok) {
          throw new Error("Failed to fetch emergency alert data");
        }

        const data = await response.json();
        console.log("Data received from backend:", data);

        if (data.success && data.data) {
          const alertStats = data.data;
          const dates = alertStats.map((alert) => alert._id); // Date strings
          const counts = alertStats.map((alert) => alert.count); // Counts for each date

          setChartData({
            series: [
              {
                name: "Number of Emergency Alerts",
                data: counts,
              },
            ],
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
          console.error("No valid data received from the API");
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

  if (loading) {
    return <p>Loading chart...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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
