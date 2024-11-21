import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Components/Home';
import Header from './Components/Layout/Header';
import Footer from './Components/Layout/Footer';
import Products from './Components/Product/Products';
import ProductDetail from './Components/Product/ProductDetails';
import Login from './Components/User/Login';
import Register from './Components/User/Register';
import Profile from './Components/User/Profile';
import UpdateEmail from './Components/User/UpdateEmail';
import ChangePassword from './Components/User/ChangePassword';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import './Auth.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Components/Admin/Dashboard';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Header /> {/* Render Header outside of Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          <Route path="/update-email" element={<UpdateEmail />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          </Routes>
          <Footer /> {/* Render Footer outside of Routes */}
          <ToastContainer />
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
