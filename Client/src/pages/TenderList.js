import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';

const TenderList = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const vendorInfo = localStorage.getItem('vendorInfo');
    if (!vendorInfo) {
      navigate('/vendor/login');
      return;
    }

    const parsedInfo = JSON.parse(vendorInfo);
    if (parsedInfo.status !== 'Approved') {
      alert('Your account is not approved yet. Please wait for admin approval.');
      navigate('/vendor/dashboard');
      return;
    }

    fetchTenders();
  }, [navigate]);

  const fetchTenders = async () => {
    try {
      const { data } = await axios.get('/api/tenders');
      const openTenders = data.filter(t => t.status === 'Open');
      setTenders(openTenders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tenders:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2>Available Tenders</h2>
        <button onClick={() => navigate('/vendor/dashboard')} className="logout-btn">
          ← Back to Dashboard
        </button>
      </nav>
      
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Browse Available Tenders</h1>
          <p>Select a tender to submit your bid</p>
        </div>

        {tenders.length === 0 ? (
          <p className="no-data">No open tenders available at the moment</p>
        ) : (
          <div className="vendor-list">
            {tenders.map((tender) => (
              <div 
                key={tender._id} 
                className="vendor-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/vendor/tender/${tender._id}`)}
              >
                <div className="vendor-info" style={{ flex: 1 }}>
                  <h3>{tender.title}</h3>
                  <p style={{ color: '#666', marginTop: '0.5rem' }}>{tender.description}</p>
                  <div style={{ marginTop: '1rem' }}>
                    <span style={{ 
                      background: '#e7f3ff', 
                      padding: '5px 15px', 
                      borderRadius: '15px', 
                      fontSize: '0.9rem',
                      marginRight: '10px'
                    }}>
                      📁 {tender.category}
                    </span>
                    <span style={{ 
                      background: '#e7ffe7', 
                      padding: '5px 15px', 
                      borderRadius: '15px', 
                      fontSize: '0.9rem'
                    }}>
                      💰 Budget: ₹{tender.budget.toLocaleString()}
                    </span>
                  </div>
                  <p className="vendor-date" style={{ marginTop: '1rem' }}>
                    📅 Deadline: {new Date(tender.deadline).toLocaleDateString()} 
                    {new Date(tender.deadline) < new Date() ? ' (Expired)' : ''}
                  </p>
                </div>
                <div>
                  <button 
                    className="card-btn" 
                    style={{ minWidth: '150px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/vendor/tender/${tender._id}`);
                    }}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenderList;
