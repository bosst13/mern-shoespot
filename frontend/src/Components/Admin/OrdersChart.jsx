import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography, TextField, Box } from '@mui/material';

const OrdersChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="quantity" fill="#0000FF" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const OrdersChartContainer = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchOrdersStatusData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/orders', {
          params: { startDate, endDate }
        });
        const processedData = response.data.map(order => ({
          month: order.month,
          quantity: order.quantity
        }));
        setChartData(processedData);
      } catch (error) {
        console.error('Error fetching orders status data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersStatusData();
  }, [startDate, endDate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          ShoeSpot Orders Chart
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <OrdersChart data={chartData} />
      </CardContent>
    </Card>
  );
};

export default OrdersChartContainer;