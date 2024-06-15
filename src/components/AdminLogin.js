import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Requesting backend to authenticate admin");

    try {
      const response = await axios.post('http://localhost:3000/api/auth_admin', { username, password });
      // console.log("Response from backend", response.data);
      if (response.data.adminID > 0) {
        localStorage.setItem('adminID', response.data.adminID);
        navigate('/admin-dashboard');
      } else if (response.data.status === 401) {
        alert('Invalid credentials');
      } else {
        alert('An error occurred');
      }
    } catch (error) {
      //if status is 500, then it is an internal server error
      if (error.response.status === 500) {
        alert('Internal server error');
      }
      if (error.response.status === 401) {
        alert('Invalid credentials');
      }

    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <button className="back-arrow" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2>Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="admin-login-input"
        />
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-login-input"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="show-password-button"
          >
            <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
          </button>
        </div>
        <button onClick={handleLogin} className="admin-login-button">
          Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
