import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { api } from "../api/api";

const PatientBarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await api.get('/emergency-alerts/stats');
        
        if (!result.success || !result.data) {
          throw new Error("Data format is invalid");
        }

        const formattedData = result.data.map(item => ({
          date: new Date(item._id).toLocaleDateString(),
          count: item.count
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Chart data fetch error:", error);
        setError(error.message || "Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="w-full h-96">
        <CardContent className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>
              {error}. Please try refreshing the page or contact support if the problem persists.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Emergency Alerts Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => value}
              />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="count" 
                fill="#3b82f6" 
                name="Number of Alerts"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientBarChart;