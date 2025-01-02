import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { api } from "../api/api";
import { AlertCircle } from 'lucide-react';

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
          const monthCounts = Array(12).fill(0);
          
          response.data.forEach(alert => {
            const date = new Date(alert.timestamp);
            const monthIndex = date.getMonth();
            monthCounts[monthIndex]++;
          });

          const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ];

          const months = monthNames;
          const counts = monthCounts;

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
                fontFamily: 'Inter, sans-serif',
                animations: {
                  enabled: true,
                  easing: "easeinout",
                  speed: 800,
                  animateGradually: {
                    enabled: true,
                    delay: 150
                  },
                  dynamicAnimation: {
                    enabled: true,
                    speed: 350
                  }
                },
                background: "transparent",
                toolbar: {
                  show: false
                },
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  borderRadius: 8,
                  columnWidth: "60%",
                  dataLabels: {
                    position: 'top',
                  },
                  distributed: false
                },
              },
              colors: ['#4a90e2'],
              fill: {
                type: "gradient",
                gradient: {
                  type: "vertical",
                  shade: "light",
                  shadeIntensity: 0.2,
                  gradientToColors: ['#50c878'],
                  inverseColors: false,
                  opacityFrom: 0.85,
                  opacityTo: 0.55,
                  stops: [0, 100]
                }
              },
              stroke: {
                show: true,
                width: 2,
                colors: ["transparent"],
              },
              dataLabels: {
                enabled: true,
                offsetY: -20,
                style: {
                  colors: ["#ffffff"],
                  fontSize: '12px',
                  fontWeight: 600,
                  textShadow: '0px 0px 4px rgba(0,0,0,0.5)'
                },
                formatter: function (val) {
                  return val.toFixed(0);
                },
              },
              grid: {
                show: true,
                borderColor: "rgba(255,255,255,0.1)",
                strokeDashArray: 5,
                position: 'back',
                xaxis: {
                  lines: {
                    show: false
                  }
                },
                yaxis: {
                  lines: {
                    show: true,
                  },
                },
                padding: {
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0
                }
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
                  color: 'rgba(255,255,255,0.2)',
                },
                axisTicks: {
                  show: true,
                  color: 'rgba(255,255,255,0.2)',
                },
              },
              yaxis: {
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
              },
              tooltip: {
                enabled: true,
                theme: "dark",
                style: {
                  fontSize: '12px',
                },
                y: {
                  formatter: function (val) {
                    return val + " alerts";
                  },
                },
                marker: {
                  show: true,
                },
              },
            },
          });
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
    return (
      <div className="chart-loading">
        <div className="loading-spinner"></div>
        <p>Loading chart data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-error">
        <AlertCircle size={24} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="chart-wrapper">
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