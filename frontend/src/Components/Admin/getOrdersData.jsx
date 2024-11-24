// src/components/OrdersChart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrdersChart = () => {
  const [orderData, setOrderData] = useState([]);
  const [chartData, setChartData] = useState({});

  // Fetch the orders data from the API
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/orders/status');
        setOrderData(response.data);
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrderData();
  }, []);

  // Transform the fetched data into chart data format
  useEffect(() => {
    if (orderData.length > 0) {
      const labels = orderData.map(order => order._id);  // Status categories (e.g., 'shipping', 'completed', etc.)
      const counts = orderData.map(order => order.count);  // The count for each status

      setChartData({
        labels: labels,
        datasets: [
          {
            label: 'Orders by Status',
            data: counts,
            backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(153, 102, 255, 0.5)'],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [orderData]);

  return (
    <div>
      <h2>Orders by Status</h2>
      {orderData.length > 0 ? (
        <Bar data={chartData} options={{ responsive: true }} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default OrdersChart;