import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css"
import Dashboard from "./components/admin/dashboard";
import User from "./components/admin/user";
import Home from "./components/home";
import Register from "./components/user/register";
import Login from "./components/user/login";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} exact="true"/>
          <Route path="/dashboard" element={<Dashboard />} exact="true"/>
          <Route path="/users" element={<User />} exact="true"/>
          <Route path="/register" element={<Register />} exact="true"/>
          <Route path="/login" element={<Login />} exact="true"/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
