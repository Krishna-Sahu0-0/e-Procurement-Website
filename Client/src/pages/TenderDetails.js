import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';
import './register.css';

const TenderDetails = () => {
  const { id } = useParams();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [proposal, setProposal] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const vendorInfo = localStorage.getItem('vendorInfo');
    if (!vendorInfo) {
      navigate('/vendor/login');
      return;
    }

    fetchTenderDetails();
  }, [id, navigate]);

  const fetchTenderDetails = async () => {
    try {
      const { data } = await axios.get(`/api/tenders/${id}`);
      setTender(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tender:', error);
      setLoading(false);
    }
  };

  const submitBid = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(
        '/api/bids',
        {
          tenderId: id,
          bidAmount: parseFloat(bidAmount),
          proposal,
          deliveryTime: parseInt(deliveryTime),
        },
        config
      );

      setMessage('Bid submitted successfully!');
      setMessageType('success');
      setBidAmount('');
      setProposal('');
      setDeliveryTime('');
      setShowBidForm(false);

      setTimeout(() => {
        navigate('/vendor/my-bids');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to submit bid');
      setMessageType('error');
    }
  };

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  if (!tender) {
    return <div className="dashboard-container">Tender not found</div>;
  }

  const isExpired = new Date(tender.deadline) < new Date();

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2>Tender Details</h2>
        <button onClick={() => navigate('/vendor/tenders')} className="logout-btn">
          ← Back to Tenders
        </button>
      </nav>

      <div className="dashboard-content">
        {message && (
          <div className={`message ${messageType}`} style={{ marginBottom: '2rem' }}>
            {message}
          </div>
        )}

        <div className="info-card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{ marginBottom: '1rem' }}>{tender.title}</h1>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span className="status-badge" style={{ background: '#e7f3ff', color: '#0066cc', border: 'none' }}>
                  📁 {tender.category}
                </span>
                <span className="status-badge" style={{ background: '#e7ffe7', color: '#006600', border: 'none' }}>
                  💰 Budget: ₹{tender.budget.toLocaleString()}
                </span>
                <span className={`status-badge ${tender.status.toLowerCase()}`}>
                  {tender.status}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Description</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>{tender.description}</p>
          </div>

          {tender.requirements && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Additional Requirements</h3>
              <p style={{ color: '#666', lineHeight: '1.6' }}>{tender.requirements}</p>
            </div>
          )}

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '10px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Important Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <p style={{ color: '#999', fontSize: '0.9rem' }}>Deadline</p>
                <p style={{ fontWeight: '600', color: isExpired ? '#dc3545' : '#333' }}>
                  {new Date(tender.deadline).toLocaleDateString()}
                  {isExpired && ' (Expired)'}
                </p>
              </div>
              <div>
                <p style={{ color: '#999', fontSize: '0.9rem' }}>Posted On</p>
                <p style={{ fontWeight: '600' }}>{new Date(tender.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p style={{ color: '#999', fontSize: '0.9rem' }}>Status</p>
                <p style={{ fontWeight: '600' }}>{tender.status}</p>
              </div>
            </div>
          </div>

          {!isExpired && tender.status === 'Open' && !showBidForm && (
            <button
              onClick={() => setShowBidForm(true)}
              className="card-btn"
              style={{ marginTop: '2rem', maxWidth: '300px' }}
            >
              📝 Submit Your Bid
            </button>
          )}

          {isExpired && (
            <div className="info-card warning" style={{ marginTop: '2rem' }}>
              <p>⏰ This tender has expired and is no longer accepting bids.</p>
            </div>
          )}
        </div>

        {showBidForm && (
          <div className="info-card">
            <h2 style={{ marginBottom: '1.5rem' }}>Submit Your Bid</h2>
            <form onSubmit={submitBid}>
              <div className="form-group">
                <label>Bid Amount (₹) *</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                  placeholder="Enter your bid amount"
                  min="0"
                  step="0.01"
                  max={tender.budget}
                />
                <small style={{ color: '#999' }}>Maximum budget: ₹{tender.budget.toLocaleString()}</small>
              </div>

              <div className="form-group">
                <label>Delivery Time (Days) *</label>
                <input
                  type="number"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  required
                  placeholder="Number of days to complete"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Proposal *</label>
                <textarea
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  required
                  placeholder="Describe your approach, expertise, and why you're the best fit for this project"
                  rows="6"
                  style={{
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    width: '100%'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="register-button" style={{ flex: 1 }}>
                  Submit Bid
                </button>
                <button
                  type="button"
                  onClick={() => setShowBidForm(false)}
                  className="register-button"
                  style={{ flex: 1, background: '#6c757d' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenderDetails;
