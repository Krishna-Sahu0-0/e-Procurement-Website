import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md py-4 px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl md:text-3xl font-bold text-blue-600"
          >
            E-Procurement Portal
          </motion.h1>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Home
            </Link>
            <Link to="/vendor/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Vendor
            </Link>
            <Link to="/admin/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Admin
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-blue-600 block transition-all"
            />
            <motion.span
              animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-blue-600 block transition-all"
            />
            <motion.span
              animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-blue-600 block transition-all"
            />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-4 pt-4 pb-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-4 hover:bg-blue-50 rounded"
                >
                  Home
                </Link>
                <Link
                  to="/vendor/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-4 hover:bg-blue-50 rounded"
                >
                  Vendor
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-4 hover:bg-blue-50 rounded"
                >
                  Admin
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
              E-Procurement Portal
            </h1>
            <p className="text-xl md:text-2xl text-gray-600">
              Digital procurement made simple and transparent
            </p>
          </motion.div>

          {/* Card with Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8 md:p-12"
          >
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              {/* Vendor Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-full md:w-72"
              >
                <Link to="/vendor/login">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-5 px-6 rounded-lg shadow-md transition-all duration-300 text-base md:text-lg">
                    Vendor Register / Login
                  </button>
                </Link>
              </motion.div>

              {/* Admin Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-full md:w-72"
              >
                <Link to="/admin/login">
                  <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-5 px-6 rounded-lg shadow-md transition-all duration-300 text-base md:text-lg">
                    Admin Login
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Additional Info Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
            >
              <div className="p-4">
                <div className="text-4xl mb-2">🔒</div>
                <h3 className="font-semibold text-gray-800 mb-1">Secure</h3>
                <p className="text-sm text-gray-600">Enterprise-grade security</p>
              </div>
              <div className="p-4">
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-800 mb-1">Fast</h3>
                <p className="text-sm text-gray-600">Quick bid submissions</p>
              </div>
              <div className="p-4">
                <div className="text-4xl mb-2">📊</div>
                <h3 className="font-semibold text-gray-800 mb-1">Transparent</h3>
                <p className="text-sm text-gray-600">Clear evaluation process</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 py-4 text-center">
        <p className="text-gray-600 text-sm">
          © 2025 E-Procurement Portal
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
