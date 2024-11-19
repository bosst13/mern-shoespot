import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css"
//import Sidenav from "./components/Sidenav";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
//import Navbar from "./components/Navbar";
import Dashboard from "./components/admin/dashboard";
import User from "./components/admin/user";
import Home from "./components/home";
import Register from "./components/user/register";
import Login from "./components/user/login";
import SupplierList from "./components/supplier/SupplierList";
// import Sidebar from "./components/admin/sidebar";

function App() {
  return (
    <div className="App">
      <Router>
        {/* <Sidebar /> */}
        <Routes>
          <Route path="/" element={<Home />} exact="true"/>
          <Route path="/dashboard" element={<Dashboard />} exact="true"/>
          <Route path="/users" element={<User />} exact="true"/>
          <Route path="/register" element={<Register />} exact="true"/>
          <Route path="/login" element={<Login />} exact="true"/>
          <Route path="/supplier" element={<SupplierList />} exact="true"/>
          {/* <Route path="/sidebar" element={<Sidebar />} exact="true"/> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
