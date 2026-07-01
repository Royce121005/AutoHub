import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline, IoPhonePortraitOutline, IoLocationOutline } from 'react-icons/io5';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    
    if (!formData.email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{7,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.city.trim()) errors.city = 'City is required';

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { name, email, phone, city, password } = formData;
      await register({ name, email, phone, city, password });
      navigate('/');
    } catch (err) {
      console.error(err);
      // Backend error toasts are processed inside the context.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper flex-center">
      <div className="auth-card register-card glass-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Register to list vehicles and save favorites</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-grid">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-with-icon">
                <IoPersonOutline className="input-icon" />
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  className={`form-input ${formErrors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.name && <span className="error-message">{formErrors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <IoMailOutline className="input-icon" />
                <input
                  type="email"
                  id="email"
                  placeholder="john@example.com"
                  className={`form-input ${formErrors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.email && <span className="error-message">{formErrors.email}</span>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="input-with-icon">
                <IoPhonePortraitOutline className="input-icon" />
                <input
                  type="tel"
                  id="phone"
                  placeholder="9876543210"
                  className={`form-input ${formErrors.phone ? 'error' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
            </div>

            {/* City */}
            <div className="form-group">
              <label htmlFor="city">City</label>
              <div className="input-with-icon">
                <IoLocationOutline className="input-icon" />
                <input
                  type="text"
                  id="city"
                  placeholder="Noida"
                  className={`form-input ${formErrors.city ? 'error' : ''}`}
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.city && <span className="error-message">{formErrors.city}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <IoLockClosedOutline className="input-icon" />
                <input
                  type="password"
                  id="password"
                  placeholder="Min. 8 characters"
                  className={`form-input ${formErrors.password ? 'error' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.password && <span className="error-message">{formErrors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-with-icon">
                <IoLockClosedOutline className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Re-enter password"
                  className={`form-input ${formErrors.confirmPassword ? 'error' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {formErrors.confirmPassword && <span className="error-message">{formErrors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="btn-primary auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Login here</Link></p>
        </div>
      </div>

      <style>{`
        .auth-page-wrapper {
          min-height: calc(100vh - 80px);
          padding: 40px 20px;
          margin-top: 80px;
          position: relative;
        }

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

        .register-card {
          width: 100%;
          max-width: 650px;
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
          gap: 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
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

        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .register-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;
