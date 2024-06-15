import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import AdminLogin from './components/AdminLogin';
import UserLogin from './components/UserLogin';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import UserSignup from './components/UserSignup';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const RequireAuth = ({ children }) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      return <Navigate to="/user-login" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-signup" element={<UserSignup />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="/user-dashboard"
            element={
              <RequireAuth>
                <UserDashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
