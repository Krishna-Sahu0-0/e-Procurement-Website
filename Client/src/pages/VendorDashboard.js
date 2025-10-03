import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const VendorDashboard = () => {
  const [vendorInfo, setVendorInfo] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const info = localStorage.getItem('vendorInfo');
    if (!info) {
      navigate('/vendor/login');
    } else {
      setVendorInfo(JSON.parse(info));
    }
    
    const savedPhoto = localStorage.getItem('profilePhoto');
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('vendorInfo');
    localStorage.removeItem('token');
    localStorage.removeItem('profilePhoto');
    navigate('/');
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoUrl = e.target.result;
        setProfilePhoto(photoUrl);
        localStorage.setItem('profilePhoto', photoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'V';
  };

  if (!vendorInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2>E-Procurement Portal</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Profile Dropdown */}
          <div className="profile-dropdown-container" style={{ position: 'relative' }}>
            <div
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                background: profilePhoto ? `url(${profilePhoto})` : '#667eea',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                border: '3px solid white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              {!profilePhoto && getInitials(vendorInfo?.companyName)}
            </div>
            
            {showProfileDropdown && (
              <div style={{
                position: 'absolute',
                top: '55px',
                right: '0',
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                minWidth: '220px',
                padding: '1rem',
                zIndex: 1000,
                border: '1px solid #e0e0e0'
              }}>
                <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                  <h4 style={{ margin: '0', color: '#333' }}>{vendorInfo?.companyName}</h4>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>{vendorInfo?.email}</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    fontSize: '0.95rem'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    📷 Update Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    fontSize: '0.95rem'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    🔒 Change Password
                  </div>
                  
                  <div 
                    onClick={() => navigate('/vendor/my-bids')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                      fontSize: '0.95rem'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    📊 Your Bids
                  </div>
                  
                  <div 
                    onClick={() => navigate('/vendor/tenders')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                      fontSize: '0.95rem'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f8f9fa'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    📋 Tenders Section
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>
      
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome, {vendorInfo.companyName}!</h1>
          <div className={`status-badge ${vendorInfo.status.toLowerCase()}`}>
            Status: {vendorInfo.status}
          </div>
        </div>

        {vendorInfo.status === 'Pending' && (
          <div className="info-card warning">
            <h3>⏳ Account Pending Approval</h3>
            <p>Your account is currently under review by our administrators. You will be able to participate in tenders once your account is approved.</p>
          </div>
        )}

        {vendorInfo.status === 'Approved' && (
          <div className="dashboard-grid">
            <div className="info-card">
              <h3>📋 Available Tenders</h3>
              <p>Browse and bid on available tenders</p>
              <button 
                className="card-btn"
                onClick={() => navigate('/vendor/tenders')}
              >
                View Tenders
              </button>
            </div>
            
            <div className="info-card">
              <h3>📊 My Bids</h3>
              <p>Track your submitted bids</p>
              <button 
                className="card-btn"
                onClick={() => navigate('/vendor/my-bids')}
              >
                View My Bids
              </button>
            </div>
          </div>
        )}

        {vendorInfo.status === 'Rejected' && (
          <div className="info-card error">
            <h3>❌ Account Rejected</h3>
            <p>Unfortunately, your account application was not approved. Please contact support for more information.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
