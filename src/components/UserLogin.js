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
            const response = await axios.post('http://localhost:3000/api/auth_cust', { email, password });
            if (response.data.userID > 0) {
                navigate('/user-dashboard');
            } else if (response.data.status === 401) {
                alert('Invalid credentials');
            }
            else {
                alert('An error occurred');
            }
        } catch (error) {
            if (error.response.status === 500) {
                alert('Internal server error');
            }
            if (error.response.status === 401) {
                alert('Invalid credentials');
            }
        }


    };

    return (
        <div className="user-login-container">
            <div className="user-login-card">
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
            </div>
        </div>
    );
}

export default UserLogin;
