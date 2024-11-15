import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";

const BASE_URL = window.location.origin.includes('localhost') 
 ? 'http://localhost:3000/api/v1'
 : 'https://semi-lifeec.onrender.com/api/v1';

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
       const response = await fetch(`${BASE_URL}/emergency-alerts/stats`);
       if (!response.ok) throw new Error("Failed to fetch emergency alert data");
       
       const data = await response.json();
       
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