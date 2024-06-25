import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserLogin.css';

function UserLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {

        try {
            const response = await axios.post('http://${process.env.domain}/api/auth_cust', { email, password });
            if (response.data.userID > 0) {
                localStorage.setItem('userID', response.data.userID); // Store userID in localStorage
                navigate('/user-dashboard');
            } else if (response.data.status === 401) {
                alert('Invalid credentials');
            } else {
                alert('An error occurred');
            }
        } catch (error) {
            if (error.response && error.response.status === 500) {
                alert('Internal server error');
            } else if (error.response && error.response.status === 401) {
                alert('Invalid credentials');
            } else {
                alert('An error occurred');
            }
        }

    };

    return (
        <div className="user-login-container">
            <div className="user-login-card">
                <button className="back-arrow" onClick={() => navigate('/')}>
                    <i className="fas fa-arrow-left"></i>
                </button>
                <h2>User Login</h2>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="user-login-input"
                />
                <div className="password-input-container">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="user-login-input"
                    />
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="show-password-button"
                    >
                        <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    </button>
                </div>
                <button onClick={handleLogin} className="user-login-button">Login</button>
                <label className="user-signup-label">Don't have an account?</label>
                <button onClick={() => navigate('/user-signup')} className="user-signup-button">Sign Up</button>
            </div>
        </div>
    );
}

export default UserLogin;
