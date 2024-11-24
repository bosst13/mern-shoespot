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
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import Toast from './Components/Layout/Toast';

// Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase App
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Messaging
const messaging = getMessaging(firebaseApp);

// Function to Request Notification Permission
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Have permission');
    } else {
      console.log('Denied permission');
    }
  } catch (error) {
    console.error('Error requesting notification permission or retrieving token:', error);
  }
};

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

  useEffect(() => {
    const initializeFCM = async () => {
      if (currentUser) {
        await requestNotificationPermission();
      
        // Listen for foreground messages
        onMessage(messaging, (payload) => {
          console.log('Foreground message received:', payload);
      
          // Display notification as a toast
          Toast(`${payload.notification.title}: ${payload.notification.body}`, "success");
        });
      }
    };

    initializeFCM();
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

  // Register the service worker manually in the app
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    // Get FCM token
    const messaging = getMessaging(firebaseApp);
    getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY })
      .then((currentToken) => {
        if (currentToken) {
          console.log('FCM Token:', currentToken);
        } else {
          console.log('No FCM token available');
        }
      })
      .catch((error) => {
        console.error('Error getting FCM token:', error);
      });
  }, []);

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