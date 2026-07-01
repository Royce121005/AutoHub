import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import RouteGuard from './components/RouteGuard/ProtectedRoute';
import PublicRoute from './components/RouteGuard/PublicRoute';
import ProtectedRoute from './components/RouteGuard/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Browse from './pages/Browse';
import CarDetails from './pages/CarDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import SellCar from './pages/SellCar';
import MyListings from './pages/MyListings';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';

import './styles/global.css';
import { IoCompassOutline, IoWarningOutline } from 'react-icons/io5';

// User-friendly 404 Page Component
const NotFound = () => (
  <div className="flex-center not-found-wrapper">
    <div className="not-found-card glass-card">
      <IoWarningOutline className="warning-icon" />
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist or has been moved to another URL.</p>
      <Link to="/" className="btn-primary back-home-btn">
        <IoCompassOutline /> Back to Homepage
      </Link>
    </div>
    <style>{`
      .not-found-wrapper {
        min-height: calc(100vh - 160px);
        padding: 40px 20px;
        margin-top: 80px;
      }
      .not-found-card {
        max-width: 480px;
        width: 100%;
        padding: 40px;
        text-align: center;
      }
      .not-found-card .warning-icon {
        font-size: 3.5rem;
        color: var(--warning);
        margin-bottom: 20px;
      }
      .not-found-card h2 {
        margin-bottom: 12px;
      }
      .not-found-card p {
        margin-bottom: 24px;
        font-size: 0.95rem;
      }
      .back-home-btn {
        gap: 8px;
        display: inline-flex;
      }
    `}</style>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <main style={{ flex: '1 0 auto' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/cars/:id" element={<CarDetails />} />

              {/* Guest Only Routes */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

              {/* Private Protected Routes */}
              <Route path="/sell" element={<ProtectedRoute><SellCar /></ProtectedRoute>} />
              <Route path="/my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
