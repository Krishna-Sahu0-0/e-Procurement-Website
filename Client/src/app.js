import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/registerpage';
import VendorLoginPage from './pages/VendorLoginPage';
import VendorDashboard from './pages/VendorDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import CreateTender from './pages/CreateTender';
import TenderList from './pages/TenderList';
import TenderDetails from './pages/TenderDetails';
import MyBids from './pages/MyBids';
import TenderBids from './pages/TenderBids';

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/vendor/login" element={<VendorLoginPage />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/tenders" element={<TenderList />} />
          <Route path="/vendor/tender/:id" element={<TenderDetails />} />
          <Route path="/vendor/my-bids" element={<MyBids />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-tender" element={<CreateTender />} />
          <Route path="/admin/tender/:id/bids" element={<TenderBids />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;