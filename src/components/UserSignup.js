import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserSignup.css';

function UserSignup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isPro, setIsPro] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async () => {

        try {
            const response = await axios.post(`${process.env.REACT_APP_DOMAIN}/api/new_user`, {
                first_name: firstName,
                last_name: lastName,
                user_address: address,
                email_id: email,
                phone_number: phone,
                pass: password,
                priviledge_status: isPro ? 'pro' : 'normal'
            });
            if (response.data.userID > 0) {
                alert('Signup successful. Please login to continue.');
                navigate('/user-dashboard');
            } else if (response.data.status === 409) {
                alert('Email or phone number already in use');
            } else {
                alert('An error occurred');
            }
        } catch (error) {
            if (error.response.status === 500) {
                alert('Internal server error');
            }
            if (error.response.status === 409) {
                alert('Email or phone number already in use');
            }
        }
    }

    return (
        <div className="user-signup-container">
            <div className="user-signup-card">
                <button className="back-arrow" onClick={() => navigate('/user-login')}>
                    <i className="fas fa-arrow-left"></i>
                </button>
                <h2>User Signup</h2>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="user-signup-input"
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="user-signup-input"
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="user-signup-input"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="user-signup-input"
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="user-signup-input"
                />
                <div className="password-input-container">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="user-signup-input"
                    />
                    <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="show-password-button"
                    >
                        <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                    </button>
                </div>
                <div
                    className="privilege-status-container"
                    style={{
                        marginTop: '10px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '100px',
                    }}
                >
                    <label> Privilege Status: </label>
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={isPro}
                            onChange={(e) => setIsPro(e.target.checked)}
                        />
                        Pro
                    </label>
                </div>

                <button onClick={handleSignup} className="user-signup-button">Signup</button>
            </div>
        </div>
    );
}

export default UserSignup;
