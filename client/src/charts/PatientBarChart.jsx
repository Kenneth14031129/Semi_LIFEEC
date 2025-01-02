// PatientBarChart.jsx
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
        const response = await api.get('/emergency-alerts');

        if (response.success) {
          // Group alerts by month
          const monthCounts = Array(12).fill(0);
          
          response.data.forEach(alert => {
            const date = new Date(alert.timestamp);
            const monthIndex = date.getMonth();
            monthCounts[monthIndex]++;
          });

          const monthNames = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
          ];

          const transformedResult = monthCounts.map((count, index) => ({
            _id: monthNames[index],
            count: count
          }));

          if (transformedResult.length > 0) {
            const months = transformedResult.map((item) => item._id);
            const counts = transformedResult.map((item) => item.count);

            // Calculate appropriate y-axis max and intervals
            const maxValue = Math.max(...counts);
            const yAxisMax = Math.ceil(maxValue / 5) * 5;
            const interval = Math.max(1, Math.ceil(yAxisMax / 10));

            setChartData({
              series: [
                {
                  name: "Emergency Alerts",
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
                    speed: 1000,
                  },
                  background: "#2E3B4E",
                  toolbar: {
                    show: true,
                    tools: {
                      download: true,
                      selection: false,
                      zoom: false,
                      zoomin: false,
                      zoomout: false,
                      pan: false,
                    },
                  },
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                    borderRadius: 4,
                    columnWidth: "60%",
                    dataLabels: {
                      position: 'top',
                    },
                  },
                },
                fill: {
                  type: "gradient",
                  gradient: {
                    shade: "dark",
                    gradientToColors: ["#004DFF"],
                    inverseColors: false,
                    opacityFrom: 0.9,
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
                  offsetY: -20,
                  style: {
                    colors: ["#ffffff"],
                    fontSize: '12px',
                    fontWeight: 600,
                  },
                  formatter: function (val) {
                    return val.toFixed(0);
                  },
                },
                grid: {
                  show: true,
                  borderColor: "#404040",
                  strokeDashArray: 5,
                  position: 'back',
                  yaxis: {
                    lines: {
                      show: true,
                    },
                  },
                },
                xaxis: {
                  categories: months,
                  title: {
                    text: "Month",
                    style: {
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 600,
                    },
                  },
                  labels: {
                    style: {
                      colors: "#ffffff",
                      fontSize: "12px",
                    },
                    rotateAlways: false,
                    rotate: -45,
                  },
                  axisBorder: {
                    show: true,
                    color: '#404040',
                  },
                  axisTicks: {
                    show: true,
                    color: '#404040',
                  },
                },
                yaxis: {
                  title: {
                    text: "Number of Emergency Alerts",
                    style: {
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 600,
                    },
                  },
                  labels: {
                    style: {
                      colors: "#ffffff",
                      fontSize: "12px",
                    },
                    formatter: function (value) {
                      return Math.floor(value);
                    },
                  },
                  min: 0,
                  max: yAxisMax,
                  tickAmount: yAxisMax / interval,
                  forceNiceScale: true,
                  axisBorder: {
                    show: true,
                    color: '#404040',
                  },
                  axisTicks: {
                    show: true,
                    color: '#404040',
                  },
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
                legend: {
                  show: true,
                  position: "top",
                  horizontalAlign: "center",
                  floating: true,
                  labels: {
                    colors: "#ffffff",
                  },
                },
                tooltip: {
                  enabled: true,
                  theme: "dark",
                  x: {
                    show: true,
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