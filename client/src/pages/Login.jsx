import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate('/');
    } catch (err) {
      console.error(err);
      // AuthContext handles triggering the toast alert
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setFormErrors({});
    setIsSubmitting(true);
    try {
      await login(demoEmail, demoPassword);
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper flex-center">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to manage your listings and saved cars</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <IoMailOutline className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="name@example.com"
                className={`form-input ${formErrors.email ? 'error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            {formErrors.email && <span className="error-message">{formErrors.email}</span>}
          </div>

          {/* Password field */}
          <div className="form-group">
            <div className="password-label-wrapper">
              <label htmlFor="password">Password</label>
              <a href="#forgot" className="forgot-link">Forgot?</a>
            </div>
            <div className="input-with-icon">
              <IoLockClosedOutline className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                className={`form-input ${formErrors.password ? 'error' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                style={{ paddingRight: '42px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted, #94a3b8)',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
            {formErrors.password && <span className="error-message">{formErrors.password}</span>}
          </div>

          <button type="submit" className="btn-primary auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
            <button
              type="button"
              className="auth-demo-btn"
              disabled={isSubmitting}
              onClick={() => handleQuickLogin('dealer@autohub.com', 'password123')}
            >
              ⚡ Dealer Demo
            </button>
            <button
              type="button"
              className="auth-demo-btn"
              disabled={isSubmitting}
              onClick={() => handleQuickLogin('rance@autohub.com', 'password123')}
            >
              👤 Rance D'monte
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Register here</Link></p>
        </div>
      </div>

      <style>{`
        .auth-page-wrapper {
          min-height: calc(100vh - 80px);
          padding: 40px 20px;
          margin-top: 80px;
          position: relative;
        }

        /* Decorative background glow */
        .auth-page-wrapper::before {
          content: '';
          position: absolute;
          width: 350px;
          height: 350px;
          background: rgba(59, 130, 246, 0.12);
          border-radius: 50%;
          filter: blur(80px);
          top: 15%;
          left: 20%;
          z-index: -1;
        }

        .auth-page-wrapper::after {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          background: rgba(236, 72, 153, 0.08);
          border-radius: 50%;
          filter: blur(80px);
          bottom: 15%;
          right: 20%;
          z-index: -1;
        }

        .auth-card {
          width: 100%;
          max-width: 450px;
          padding: 40px;
          background: rgba(15, 22, 38, 0.7) !important;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .auth-header h2 {
          font-size: 1.8rem;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .auth-header p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .password-label-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .forgot-link {
          font-size: 0.8rem;
          color: var(--accent-blue);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          font-size: 1.15rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-with-icon .form-input {
          padding-left: 42px;
        }

        .form-input.error {
          border-color: var(--error);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }

        .error-message {
          font-size: 0.78rem;
          color: var(--error);
          font-weight: 500;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 0.85rem;
          margin-top: 10px;
        }

        .auth-demo-btn {
          width: 100%;
          padding: 0.75rem;
          margin-top: 8px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px dashed rgba(59, 130, 246, 0.4);
          color: var(--accent-blue);
          border-radius: var(--radius-md, 8px);
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .auth-demo-btn:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: var(--accent-blue);
        }

        .auth-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 0.9rem;
        }

        .auth-link {
          color: var(--accent-blue);
          font-weight: 600;
        }

        .auth-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
