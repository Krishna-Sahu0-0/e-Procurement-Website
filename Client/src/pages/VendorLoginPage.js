import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';

const VendorLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      const { data } = await axios.post(
        '/api/vendors/login',
        { email, password },
        config
      );
      
      // Store token and user info in localStorage
      localStorage.setItem('vendorInfo', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      
      setMessage('Login successful! Redirecting...');
      setMessageType('success');
      
      // Redirect to vendor dashboard
      setTimeout(() => {
        navigate('/vendor/dashboard');
      }, 1500);

    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Vendor Login</h1>
        {message && <div className={`message ${messageType}`}>{message}</div>}
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{ paddingRight: '45px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button type="submit" className="register-button">Login</button>
        </form>
        <div className="back-link">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default VendorLoginPage;
