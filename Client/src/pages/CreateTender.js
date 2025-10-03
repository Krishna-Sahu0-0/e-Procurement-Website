import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.css';

const CreateTender = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [requirements, setRequirements] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.post(
        '/api/tenders',
        { title, description, category, budget: parseFloat(budget), deadline, requirements },
        config
      );
      
      setMessage('Tender created successfully!');
      setMessageType('success');
      
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);

    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to create tender');
      setMessageType('error');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box" style={{ maxWidth: '600px' }}>
        <h1>Create New Tender</h1>
        {message && <div className={`message ${messageType}`}>{message}</div>}
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>Tender Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter tender title"
            />
          </div>
          
          <div className="form-group">
            <label>Category *</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{ 
                padding: '12px', 
                border: '2px solid #e0e0e0', 
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="">Select category</option>
              <option value="IT Services">IT Services</option>
              <option value="Construction">Construction</option>
              <option value="Consulting">Consulting</option>
              <option value="Supply">Supply</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Budget (₹) *</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
              placeholder="Enter budget amount"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Deadline *</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe the tender requirements"
              rows="4"
              style={{ 
                padding: '12px', 
                border: '2px solid #e0e0e0', 
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div className="form-group">
            <label>Additional Requirements</label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Any additional requirements or specifications"
              rows="3"
              style={{ 
                padding: '12px', 
                border: '2px solid #e0e0e0', 
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <button type="submit" className="register-button">Create Tender</button>
          <button 
            type="button" 
            onClick={() => navigate('/admin/dashboard')}
            className="register-button"
            style={{ background: '#6c757d', marginTop: '10px' }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTender;
