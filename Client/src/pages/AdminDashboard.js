import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';

const AdminDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vendors');
  const [adminInfo, setAdminInfo] = useState(null);
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
  const [formLoading, setFormLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const info = localStorage.getItem('adminInfo');
    if (!info) {
      navigate('/admin/login');
    } else {
      const parsedInfo = JSON.parse(info);
      setAdminInfo(parsedInfo);
      setProfilePhoto(parsedInfo.profilePhoto || null);
      fetchVendors();
      fetchTenders();
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

  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get('/api/admin/vendors', config);
      setVendors(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setLoading(false);
    }
  };

  const fetchTenders = async () => {
    try {
      const { data } = await axios.get('/api/tenders');
      setTenders(data);
    } catch (error) {
      console.error('Error fetching tenders:', error);
    }
  };

  const updateVendorStatus = async (vendorId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`/api/admin/vendors/${vendorId}`, { status }, config);
      // Refresh vendor list
      fetchVendors();
      alert(`Vendor ${status.toLowerCase()} successfully!`);
    } catch (error) {
      console.error('Error updating vendor:', error);
      alert('Failed to update vendor status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo');
    localStorage.removeItem('adminToken');
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
          const token = localStorage.getItem('adminToken');
          
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          };

          const { data } = await axios.put(
            '/api/admin/upload-photo',
            { profilePhoto: photoUrl },
            config
          );

          setProfilePhoto(data.profilePhoto);
          
          // Update adminInfo in localStorage
          const updatedInfo = { ...adminInfo, profilePhoto: data.profilePhoto };
          setAdminInfo(updatedInfo);
          localStorage.setItem('adminInfo', JSON.stringify(updatedInfo));
          
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

    setFormLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        '/api/admin/change-password',
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
      setFormLoading(false);
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

    setFormLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        '/api/admin/change-email',
        { currentPassword, newEmail },
        config
      );

      setSuccess('Email changed successfully!');
      
      // Update adminInfo in localStorage
      const updatedInfo = { ...adminInfo, email: data.email };
      setAdminInfo(updatedInfo);
      localStorage.setItem('adminInfo', JSON.stringify(updatedInfo));
      
      setCurrentPassword('');
      setNewEmail('');
      setTimeout(() => {
        setSuccess('');
        setShowEmailModal(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change email');
    } finally {
      setFormLoading(false);
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'A';
  };

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  const pendingVendors = vendors.filter(v => v.status === 'Pending');
  const approvedVendors = vendors.filter(v => v.status === 'Approved');
  const rejectedVendors = vendors.filter(v => v.status === 'Rejected');
  const openTenders = tenders.filter(t => t.status === 'Open');
  const closedTenders = tenders.filter(t => t.status === 'Closed');
  const awardedTenders = tenders.filter(t => t.status === 'Awarded');

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h2>Admin Dashboard</h2>
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
              {!profilePhoto && getInitials(adminInfo?.name)}
            </div>
            
            {showProfileDropdown && (
              <div className="profile-dropdown-menu" style={{
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
                  <h4 style={{ margin: '0', color: '#333' }}>{adminInfo?.name}</h4>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem' }}>{adminInfo?.email}</p>
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
          <h1>Welcome, Admin!</h1>
          <p>Manage vendors and tenders</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>{pendingVendors.length}</h3>
            <p>Pending Approvals</p>
          </div>
          <div className="stat-card approved">
            <h3>{approvedVendors.length}</h3>
            <p>Approved Vendors</p>
          </div>
          <div className="stat-card rejected">
            <h3>{rejectedVendors.length}</h3>
            <p>Rejected Vendors</p>
          </div>
        </div>

        <div className="tabs">
          <button 
            className={activeTab === 'vendors' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('vendors')}
          >
            Vendor Management
          </button>
          <button 
            className={activeTab === 'tenders' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('tenders')}
          >
            Tender Management
          </button>
        </div>

        {activeTab === 'vendors' && (
          <div className="vendors-section">
            <h2>Pending Vendor Approvals</h2>
            {pendingVendors.length === 0 ? (
              <p className="no-data">No pending vendor approvals</p>
            ) : (
              <div className="vendor-list">
                {pendingVendors.map((vendor) => (
                  <div key={vendor._id} className="vendor-card">
                    <div className="vendor-info">
                      <h3>{vendor.companyName}</h3>
                      <p>📧 {vendor.email}</p>
                      <p className="vendor-date">Registered: {new Date(vendor.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="vendor-actions">
                      <button 
                        className="approve-btn"
                        onClick={() => updateVendorStatus(vendor._id, 'Approved')}
                      >
                        ✓ Approve
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => updateVendorStatus(vendor._id, 'Rejected')}
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h2 style={{ marginTop: '3rem' }}>All Vendors</h2>
            <div className="vendor-list">
              {vendors.map((vendor) => (
                <div key={vendor._id} className={`vendor-card ${vendor.status.toLowerCase()}`}>
                  <div className="vendor-info">
                    <h3>{vendor.companyName}</h3>
                    <p>📧 {vendor.email}</p>
                    <p className="vendor-date">Registered: {new Date(vendor.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="vendor-status">
                    <span className={`status-badge ${vendor.status.toLowerCase()}`}>
                      {vendor.status}
                    </span>
                    {vendor.status === 'Rejected' && (
                      <button 
                        className="approve-btn"
                        style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}
                        onClick={() => {
                          if (window.confirm('Are you sure you want to re-approve this vendor?')) {
                            updateVendorStatus(vendor._id, 'Approved');
                          }
                        }}
                      >
                        ✓ Re-approve
                      </button>
                    )}
                    {vendor.status === 'Approved' && (
                      <button 
                        className="reject-btn"
                        style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}
                        onClick={() => {
                          if (window.confirm('Are you sure you want to reject this vendor?')) {
                            updateVendorStatus(vendor._id, 'Rejected');
                          }
                        }}
                      >
                        ✗ Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tenders' && (
          <div className="tenders-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Tender Management</h2>
              <button 
                className="card-btn" 
                style={{ maxWidth: '250px' }}
                onClick={() => navigate('/admin/create-tender')}
              >
                + Create New Tender
              </button>
            </div>

            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              <div className="stat-card" style={{ borderLeftColor: '#28a745' }}>
                <h3>{openTenders.length}</h3>
                <p>Open Tenders</p>
              </div>
              <div className="stat-card" style={{ borderLeftColor: '#ffc107' }}>
                <h3>{closedTenders.length}</h3>
                <p>Closed Tenders</p>
              </div>
              <div className="stat-card" style={{ borderLeftColor: '#667eea' }}>
                <h3>{awardedTenders.length}</h3>
                <p>Awarded Tenders</p>
              </div>
            </div>

            {tenders.length === 0 ? (
              <p className="no-data">No tenders created yet. Create your first tender!</p>
            ) : (
              <div className="vendor-list">
                {tenders.map((tender) => (
                  <div 
                    key={tender._id} 
                    className={`vendor-card ${tender.status.toLowerCase()}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/admin/tender/${tender._id}/bids`)}
                  >
                    <div className="vendor-info" style={{ flex: 1 }}>
                      <h3>{tender.title}</h3>
                      <p>📁 {tender.category} | 💰 Budget: ₹{tender.budget.toLocaleString()}</p>
                      <p>📅 Deadline: {new Date(tender.deadline).toLocaleDateString()}</p>
                      <p className="vendor-date">Created: {new Date(tender.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="vendor-status">
                      <span className={`status-badge ${tender.status.toLowerCase()}`}>
                        {tender.status}
                      </span>
                      <button 
                        className="card-btn" 
                        style={{ marginTop: '1rem', minWidth: '150px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/tender/${tender._id}/bids`);
                        }}
                      >
                        View Bids →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                <button type="submit" className="btn-submit" disabled={formLoading}>
                  {formLoading ? 'Changing...' : 'Change Password'}
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
                <button type="submit" className="btn-submit" disabled={formLoading}>
                  {formLoading ? 'Changing...' : 'Change Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
