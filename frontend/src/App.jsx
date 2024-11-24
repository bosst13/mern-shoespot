import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Components/Home';
import Header from './Components/Layout/Header';
import Footer from './Components/Layout/Footer';
import Products from './Components/Product/Products';
import ProductDetail from './Components/Product/ProductDetails';
import CheckoutPage from './Components/Product/CheckoutPage';
import OrderHistory from './Components/User/OrderHistory';
import Login from './Components/User/Login';
import Register from './Components/User/Register';
import Profile from './Components/User/Profile';
import UpdateEmail from './Components/User/UpdateEmail';
import ChangePassword from './Components/User/ChangePassword';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './Components/Admin/Dashboard';
import Unauthorized from '../src/pages/Unauthorized';
import { RequireAuth } from './middleware/RequireAuth';
import './App.css';
import './Auth.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import OrdersChart from './Components/Admin/OrdersChart';
import StatusTable from './Components/Admin/StatusTable';  // Import the StatusTable component

const AppContent = () => {
  const location = useLocation(); // Track the current route
  const [currentUser, setCurrentUser] = useState(null); // Track the logged-in user
  const [orderCount, setOrderCount] = useState(0); // Track the total order count
  const [orderData, setOrderData] = useState([]);


  const fetchOrderData = async () => {
    // try {
    //   const token = await currentUser.getIdToken();
    //   const response = await axios.get(${import.meta.env.VITE_API}/admin/orders/data, {
    //     headers: {
    //       Authorization: Bearer ${token},
    //     },
    //   });
    //   setOrderData(response.data);
    // } catch (error) {
    //   console.error('Error fetching order data:', error);
    // }
  };
  
  useEffect(() => {
    if (currentUser) {
      fetchOrderData();
    }
  }, [currentUser]);





  // Fetch the order count from the backend
  const fetchOrderCount = async () => {
    try {
      if (!currentUser) {
        setOrderCount(0);
        return;
      }

      const token = await currentUser.getIdToken();
      const response = await axios.get(`${import.meta.env.VITE_API}/user-orderlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const totalOrderCount = response.data.orders.reduce(
        (acc, order) => acc + order.quantity,
        0
      );
      setOrderCount(totalOrderCount);
    } catch (error) {
      console.error('Error fetching order count:', error);
    }
  };

  // Track authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      if (!user) setOrderCount(0); // Reset order count if logged out
    });
    return () => unsubscribe();
  }, []);

  // Fetch the order count whenever the current user changes
  useEffect(() => {
    if (currentUser) fetchOrderCount();
  }, [currentUser]);

  const onUpdateOrderCount = () => {
    fetchOrderCount(); // Update the order count
  };

  // Define routes where header, footer, and background should be adjusted
  const noHeaderFooterRoutes = ['/checkout', '/login', '/register'];
  const noBackgroundRoutes = ['/checkout'];
  const hideHeaderFooter = noHeaderFooterRoutes.includes(location.pathname);

  // Dynamically adjust the <body> class based on the route
  useEffect(() => {
    if (noBackgroundRoutes.includes(location.pathname)) {
      document.body.classList.add('no-background');
    } else {
      document.body.classList.remove('no-background');
    }
  }, [location]);

  return (
    <>
      {!hideHeaderFooter && (
        <Header orderCount={orderCount} onUpdateOrderCount={onUpdateOrderCount} />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route
          path="/product/:id"
          element={<ProductDetail onUpdateOrderCount={onUpdateOrderCount} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/update-email" element={<UpdateEmail />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/orders-chart" element={<OrdersChart data={orderData} />} />
        <Route path="/admin/status-table" element={<StatusTable />} />  // Add the new route
        </Routes>
      {!hideHeaderFooter && <Footer />}
      <ToastContainer />
    </>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;