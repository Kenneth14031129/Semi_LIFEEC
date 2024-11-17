import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { api } from "../api/api";

const PatientBarChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use your API service instead of axios
        const response = await api.get('/emergency-alerts');

        if (response.success) {
          // Group alerts by month
          const monthCounts = Array(12).fill(0); // Initialize array for all 12 months
          
          response.data.forEach(alert => {
            const date = new Date(alert.timestamp);
            const monthIndex = date.getMonth();
            monthCounts[monthIndex]++;
          });

          const result = monthCounts.map((count, index) => ({
            _id: index + 1,
            count: count
          }));

          const monthNames = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
          ];

          const transformedResult = result.map((item) => {
            const monthIndex = item._id !== null ? parseInt(item._id) - 1 : null;
            const monthName = monthIndex !== null && monthIndex >= 0 && monthIndex < 12 
              ? monthNames[monthIndex] 
              : "January";

            return {
              ...item,
              _id: monthName,
            };
          });

          if (transformedResult && transformedResult.length > 0) {
            const months = transformedResult.map((item) => item._id);
            const counts = transformedResult.map((item) => item.count);

            setChartData({
              series: [
                {
                  name: "Number of Emergency Alert",
                  data: counts,
                },
              ],
              options: {
                chart: {
                  type: "bar",
                  height: 350,
                  animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 1500,
                  },
                  background: "#2E3B4E",
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    borderRadius: 4,
                    columnWidth: "50%",
                  },
                },
                fill: {
                  type: "gradient",
                  gradient: {
                    shade: "dark",
                    gradientToColors: ["#004DFF", "#FF0000"],
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.7,
                    stops: [0, 100],
                  },
                },
                stroke: {
                  show: true,
                  width: 2,
                  colors: ["#fff"],
                },
                dataLabels: {
                  enabled: true,
                  style: {
                    colors: ["#ffffff"],
                  },
                  formatter: function (val) {
                    return Math.round(val);
                  },
                },
                grid: {
                  show: true,
                  borderColor: "#444",
                  strokeDashArray: 5,
                },
                xaxis: {
                  categories: months,
                  title: {
                    text: "Month",
                    style: {
                      color: "#ffffff",
                      fontSize: "14px",
                    },
                  },
                  labels: {
                    style: {
                      colors: "#ffffff",
                      fontSize: "12px",
                    },
                  },
                },
                yaxis: {
                  title: {
                    text: "Number of Emergency Alert",
                    style: {
                      color: "#ffffff",
                      fontSize: "14px",
                    },
                  },
                  labels: {
                    style: {
                      colors: "#ffffff",
                      fontSize: "12px",
                    },
                    formatter: function (value) {
                      return Math.round(value);
                    },
                  },
                  min: 0,
                  max: Math.max(...counts) + 2,
                  tickAmount: 5,
                },
                title: {
                  text: "Resident Health Stats",
                  align: "center",
                  style: {
                    color: "#ffffff",
                    fontSize: "20px",
                    fontWeight: "bold",
                  },
                },
                colors: ["#007BFF"],
                legend: {
                  show: true,
                  position: "top",
                  horizontalAlign: "center",
                  floating: true,
                  labels: {
                    colors: "#ffffff",
                    useSeriesColors: true,
                  },
                },
                tooltip: {
                  enabled: true,
                  theme: "dark",
                  x: {
                    show: true,
                    format: "MMM",
                  },
                  y: {
                    formatter: function (val) {
                      return val + " alerts";
                    },
                  },
                },
              },
            });
          }
        } else {
          console.error("No valid data received from the API");
          setError("No data available.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load data.");
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