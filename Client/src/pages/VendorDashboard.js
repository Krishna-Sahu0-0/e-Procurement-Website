import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';

const VendorDashboard = () => {
  const [vendorInfo, setVendorInfo] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  
  // Modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  
  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Message states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const info = localStorage.getItem('vendorInfo');
    if (!info) {
      navigate('/vendor/login');
    } else {
      const parsedInfo = JSON.parse(info);
      setVendorInfo(parsedInfo);
      setProfilePhoto(parsedInfo.profilePhoto || null);
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
    navigate('/');
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        setTimeout(() => setError(''), 3000);
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const photoUrl = e.target.result;
        
        try {
          const token = localStorage.getItem('token');
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          };

          const { data } = await axios.put(
            '/api/vendors/upload-photo',
            { profilePhoto: photoUrl },
            config
          );

          setProfilePhoto(data.profilePhoto);
          
          // Update vendorInfo in localStorage
          const updatedInfo = { ...vendorInfo, profilePhoto: data.profilePhoto };
          setVendorInfo(updatedInfo);
          localStorage.setItem('vendorInfo', JSON.stringify(updatedInfo));
          
          setSuccess('Profile photo updated successfully!');
          setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to upload photo');
          setTimeout(() => setError(''), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        '/api/vendors/change-password',
        { currentPassword, newPassword },
        config
      );

      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setSuccess('');
        setShowPasswordModal(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newEmail || !newEmail.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        '/api/vendors/change-email',
        { currentPassword, newEmail },
        config
      );

      setSuccess('Email changed successfully!');
      
      // Update vendorInfo in localStorage
      const updatedInfo = { ...vendorInfo, email: data.email };
      setVendorInfo(updatedInfo);
      localStorage.setItem('vendorInfo', JSON.stringify(updatedInfo));
      
      setCurrentPassword('');
      setNewEmail('');
      setTimeout(() => {
        setSuccess('');
        setShowEmailModal(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change email');
    } finally {
      setLoading(false);
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
                  onMouseEnter={(e) => e.target.style.background = '#e9ecef'}
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
                  
                  <div 
                    onClick={() => {
                      setShowPasswordModal(true);
                      setShowProfileDropdown(false);
                    }}
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
                  onMouseEnter={(e) => e.target.style.background = '#e9ecef'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    🔒 Change Password
                  </div>
                  
                  <div 
                    onClick={() => {
                      setShowEmailModal(true);
                      setShowProfileDropdown(false);
                    }}
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
                  onMouseEnter={(e) => e.target.style.background = '#e9ecef'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    ✉️ Change Email
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
                    onMouseEnter={(e) => e.target.style.background = '#e9ecef'}
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
                    onMouseEnter={(e) => e.target.style.background = '#e9ecef'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    📋 Tenders Section
                  </div>
                  
                  <div 
                    onClick={handleLogout}
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                    fontSize: '0.95rem',
                    color: '#dc3545',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#e9ecef'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    🚪 Logout
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button onClick={handleLogout} className="logout-btn desktop-only">Logout</button>
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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Change Password</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <span 
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      userSelect: 'none'
                    }}
                  >
                    {showCurrentPassword ? '👁️' : '🙈'}
                  </span>
                </div>
              </div>
              
              <div className="form-group">
                <label>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength="6"
                    style={{ paddingRight: '40px' }}
                  />
                  <span 
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      userSelect: 'none'
                    }}
                  >
                    {showNewPassword ? '👁️' : '🙈'}
                  </span>
                </div>
              </div>
              
              <div className="form-group">
                <label>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                    style={{ paddingRight: '40px' }}
                  />
                  <span 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      userSelect: 'none'
                    }}
                  >
                    {showConfirmPassword ? '👁️' : '🙈'}
                  </span>
                </div>
              </div>
              
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Change Modal */}
      {showEmailModal && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Change Email</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <form onSubmit={handleEmailChange}>
              <div className="form-group">
                <label>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    style={{ paddingRight: '40px' }}
                  />
                  <span 
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      userSelect: 'none'
                    }}
                  >
                    {showCurrentPassword ? '👁️' : '🙈'}
                  </span>
                </div>
              </div>
              
              <div className="form-group">
                <label>New Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowEmailModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Changing...' : 'Change Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
