import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';

const TenderBids = () => {
  const { id } = useParams();
  const [tender, setTender] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (!adminInfo) {
      navigate('/admin/login');
      return;
    }

    fetchTenderAndBids();
  }, [id, navigate]);

  const fetchTenderAndBids = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [tenderRes, bidsRes] = await Promise.all([
        axios.get(`/api/tenders/${id}`),
        axios.get(`/api/tenders/${id}/bids`, config)
      ]);

      setTender(tenderRes.data);
      setBids(bidsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const updateBidStatus = async (bidId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`/api/bids/${bidId}`, { status }, config);
      
      alert(`Bid ${status.toLowerCase()} successfully!`);
      
      // Refresh the bids
      fetchTenderAndBids();
    } catch (error) {
      console.error('Error updating bid:', error);
      alert('Failed to update bid status');
    }
  };

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  if (!tender) {
    return <div className="dashboard-container">Tender not found</div>;
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

  const sortedBids = [...bids].sort((a, b) => a.bidAmount - b.bidAmount);
  const lowestBid = sortedBids[0];

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2>Evaluate Bids</h2>
        <button onClick={() => navigate('/admin/dashboard')} className="logout-btn">
          ← Back to Dashboard
        </button>
      </nav>

      <div className="dashboard-content">
        {/* Tender Information */}
        <div className="info-card" style={{ marginBottom: '2rem' }}>
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
          <p style={{ color: '#666' }}>{tender.description}</p>
        </div>

        {/* Bid Statistics */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card" style={{ borderLeftColor: '#667eea' }}>
            <h3>{bids.length}</h3>
            <p>Total Bids</p>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#ffc107' }}>
            <h3>{bids.filter(b => b.status === 'Submitted').length}</h3>
            <p>Pending Review</p>
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

        <h2 style={{ marginBottom: '1.5rem' }}>Submitted Bids</h2>

        {bids.length === 0 ? (
          <div className="info-card">
            <h3>No Bids Yet</h3>
            <p>No vendors have submitted bids for this tender yet.</p>
          </div>
        ) : (
          <div className="vendor-list">
            {sortedBids.map((bid) => {
              const statusStyle = getStatusColor(bid.status);
              const isLowest = bid._id === lowestBid._id;

              return (
                <div 
                  key={bid._id} 
                  className="vendor-card"
                  style={{ 
                    border: isLowest ? '3px solid #28a745' : undefined,
                    position: 'relative'
                  }}
                >
                  {isLowest && (
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '20px',
                      background: '#28a745',
                      color: 'white',
                      padding: '5px 15px',
                      borderRadius: '15px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      🏆 Lowest Bid
                    </div>
                  )}

                  <div className="vendor-info" style={{ flex: 1 }}>
                    <h3>{bid.vendor.companyName}</h3>
                    <p style={{ color: '#666' }}>📧 {bid.vendor.email}</p>

                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span style={{
                        background: '#e7ffe7',
                        padding: '8px 20px',
                        borderRadius: '15px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#006600'
                      }}>
                        💵 Bid: ₹{bid.bidAmount.toLocaleString()}
                      </span>
                      <span style={{
                        background: '#e7f3ff',
                        padding: '8px 20px',
                        borderRadius: '15px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#0066cc'
                      }}>
                        ⏱️ Delivery: {bid.deliveryTime} days
                      </span>
                      <span
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          border: `2px solid ${statusStyle.border}`,
                          padding: '8px 20px',
                          borderRadius: '15px',
                          fontSize: '1rem',
                          fontWeight: '600'
                        }}
                      >
                        {bid.status}
                      </span>
                    </div>

                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      <h4 style={{ marginBottom: '0.5rem' }}>Proposal:</h4>
                      <p style={{ color: '#666', lineHeight: '1.6' }}>{bid.proposal}</p>
                    </div>

                    <p className="vendor-date" style={{ marginTop: '1rem' }}>
                      📅 Submitted: {new Date(bid.createdAt).toLocaleDateString()}
                    </p>

                    {/* Action Buttons */}
                    {bid.status !== 'Accepted' && bid.status !== 'Rejected' && (
                      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <button
                          className="approve-btn"
                          onClick={() => updateBidStatus(bid._id, 'Under Review')}
                        >
                          🔍 Mark Under Review
                        </button>
                        <button
                          className="approve-btn"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to accept this bid? This will mark the tender as "Awarded".')) {
                              updateBidStatus(bid._id, 'Accepted');
                            }
                          }}
                        >
                          ✓ Accept Bid
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to reject this bid?')) {
                              updateBidStatus(bid._id, 'Rejected');
                            }
                          }}
                        >
                          ✗ Reject Bid
                        </button>
                      </div>
                    )}

                    {bid.status === 'Accepted' && (
                      <div className="info-card" style={{ 
                        marginTop: '1rem', 
                        background: '#d4edda', 
                        border: '2px solid #28a745',
                        padding: '1rem'
                      }}>
                        <p style={{ margin: 0, fontWeight: '600', color: '#155724' }}>
                          🎉 This bid has been accepted and the tender has been awarded!
                        </p>
                      </div>
                    )}
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

export default TenderBids;
