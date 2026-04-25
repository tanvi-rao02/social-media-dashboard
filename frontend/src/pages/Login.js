import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const API = 'https://social-media-dashboard-lrbf.onrender.com/api';


function Login() {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isRegister) {
                const res = await axios.post(`${API}/auth/register`, formData);
                setMessage('✅ ' + res.data.message + ' Please login.');
                setIsRegister(false);
            } else {
                const res = await axios.post(`${API}/auth/login`, {
                    email: formData.email,
                    password: formData.password
                });
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/dashboard');
            }
        } catch (error) {
            setMessage('❌ ' + (error.response?.data?.message || 'Something went wrong'));
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>📊 Social Analytics</h1>
                    <p>Track your social media performance</p>
                </div>

                <div className="tab-buttons">
                    <button
                        className={!isRegister ? 'active' : ''}
                        onClick={() => setIsRegister(false)}
                    >Login</button>
                    <button
                        className={isRegister ? 'active' : ''}
                        onClick={() => setIsRegister(true)}
                    >Register</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {message && <div className="message">{message}</div>}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Login')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
