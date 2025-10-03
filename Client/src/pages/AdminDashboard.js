import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';

const AdminDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vendors');
  const navigate = useNavigate();

  useEffect(() => {
    const info = localStorage.getItem('adminInfo');
    if (!info) {
      navigate('/admin/login');
    } else {
      fetchVendors();
      fetchTenders();
    }
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
        <button onClick={handleLogout} className="logout-btn">Logout</button>
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
    </div>
  );
};

export default AdminDashboard;
