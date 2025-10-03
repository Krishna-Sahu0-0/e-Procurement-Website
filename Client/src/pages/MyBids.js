import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const vendorInfo = localStorage.getItem('vendorInfo');
    if (!vendorInfo) {
      navigate('/vendor/login');
      return;
    }

    fetchMyBids();
  }, [navigate]);

  const fetchMyBids = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get('/api/bids/my-bids', config);
      setBids(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bids:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted':
        return { bg: '#fff3cd', color: '#856404', border: '#ffc107' };
      case 'Under Review':
        return { bg: '#d1ecf1', color: '#0c5460', border: '#17a2b8' };
      case 'Accepted':
        return { bg: '#d4edda', color: '#155724', border: '#28a745' };
      case 'Rejected':
        return { bg: '#f8d7da', color: '#721c24', border: '#dc3545' };
      default:
        return { bg: '#e2e3e5', color: '#383d41', border: '#6c757d' };
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2>My Bids</h2>
        <button onClick={() => navigate('/vendor/dashboard')} className="logout-btn">
          ← Back to Dashboard
        </button>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>My Submitted Bids</h1>
          <p>Track all your bid submissions and their status</p>
        </div>

        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card" style={{ borderLeftColor: '#ffc107' }}>
            <h3>{bids.filter(b => b.status === 'Submitted').length}</h3>
            <p>Submitted</p>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#17a2b8' }}>
            <h3>{bids.filter(b => b.status === 'Under Review').length}</h3>
            <p>Under Review</p>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#28a745' }}>
            <h3>{bids.filter(b => b.status === 'Accepted').length}</h3>
            <p>Accepted</p>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#dc3545' }}>
            <h3>{bids.filter(b => b.status === 'Rejected').length}</h3>
            <p>Rejected</p>
          </div>
        </div>

        {bids.length === 0 ? (
          <div className="info-card">
            <h3>No Bids Yet</h3>
            <p>You haven't submitted any bids yet. Browse available tenders and submit your first bid!</p>
            <button
              className="card-btn"
              onClick={() => navigate('/vendor/tenders')}
              style={{ marginTop: '1rem', maxWidth: '250px' }}
            >
              Browse Tenders
            </button>
          </div>
        ) : (
          <div className="vendor-list">
            {bids.map((bid) => {
              const statusStyle = getStatusColor(bid.status);
              return (
                <div key={bid._id} className="vendor-card">
                  <div className="vendor-info" style={{ flex: 1 }}>
                    <h3>{bid.tender.title}</h3>
                    <p style={{ color: '#666', marginTop: '0.5rem' }}>
                      📁 {bid.tender.category} | 💰 Tender Budget: ₹{bid.tender.budget.toLocaleString()}
                    </p>
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{
                        background: '#e7ffe7',
                        padding: '5px 15px',
                        borderRadius: '15px',
                        fontSize: '0.9rem'
                      }}>
                        💵 Your Bid: ₹{bid.bidAmount.toLocaleString()}
                      </span>
                      <span style={{
                        background: '#e7f3ff',
                        padding: '5px 15px',
                        borderRadius: '15px',
                        fontSize: '0.9rem'
                      }}>
                        ⏱️ Delivery: {bid.deliveryTime} days
                      </span>
                    </div>
                    <p className="vendor-date" style={{ marginTop: '1rem' }}>
                      📅 Submitted: {new Date(bid.createdAt).toLocaleDateString()}
                    </p>
                    <details style={{ marginTop: '1rem' }}>
                      <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#667eea' }}>
                        View Proposal
                      </summary>
                      <p style={{ marginTop: '0.5rem', color: '#666', lineHeight: '1.6' }}>
                        {bid.proposal}
                      </p>
                    </details>
                  </div>
                  <div className="vendor-status">
                    <span
                      className="status-badge"
                      style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        border: `2px solid ${statusStyle.border}`
                      }}
                    >
                      {bid.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBids;
