import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { IoPersonOutline, IoKeyOutline, IoTrashOutline, IoCalendarOutline, IoLocationOutline, IoCallOutline, IoMailOutline, IoAlertCircleOutline } from 'react-icons/io5';

const Profile = () => {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  const toast = useToast();

  // Profile Form States
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || ''
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form States
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Profile Form Handlers
  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id]: value }));
  };

  const validateProfileForm = () => {
    const errors = {};
    if (!profileData.name.trim()) errors.name = 'Full name is required';
    if (!profileData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{7,15}$/.test(profileData.phone.replace(/[\s-]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!profileData.city.trim()) errors.city = 'City is required';

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setProfileLoading(true);
    try {
      await updateProfile(profileData);
    } catch (err) {
      console.error(err);
    } finally {
      setProfileLoading(false);
    }
  };

  // Password Form Handlers
  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({ ...prev, [id]: value }));
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setPasswordLoading(true);
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      // Clear inputs on success
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete Account Handler
  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
    } catch (err) {
      console.error(err);
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (!user) return null;

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="profile-page-wrapper container">
      <div className="profile-grid">
        
        {/* LEFT COLUMN: User Card & Navigation */}
        <aside className="profile-sidebar-col">
          <div className="user-profile-card glass-card">
            <div className="avatar-frame flex-center">
              <IoPersonOutline className="default-avatar-icon" />
            </div>
            
            <div className="user-meta-summary">
              <h2>{user.name}</h2>
              <span className="user-email-label"><IoMailOutline /> {user.email}</span>
            </div>

            <hr className="divider" />

            <ul className="profile-meta-list">
              <li>
                <IoLocationOutline />
                <div>
                  <label>City</label>
                  <span>{user.city}</span>
                </div>
              </li>
              <li>
                <IoCallOutline />
                <div>
                  <label>Phone Number</label>
                  <span>{user.phone}</span>
                </div>
              </li>
              <li>
                <IoCalendarOutline />
                <div>
                  <label>Joined On</label>
                  <span>{joinDate}</span>
                </div>
              </li>
            </ul>

            <hr className="divider" />

            <button className="btn-delete-account flex-center" onClick={() => setShowDeleteModal(true)}>
              <IoTrashOutline /> Delete My Account
            </button>
          </div>
        </aside>

        {/* RIGHT COLUMN: Settings Panels */}
        <main className="profile-settings-col">
          
          {/* Panel 1: Profile Settings */}
          <div className="settings-panel-card glass-card">
            <div className="panel-header">
              <IoPersonOutline className="panel-icon" />
              <div>
                <h3>Personal Information</h3>
                <p>Update your name, contact phone, and location city.</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="panel-form" noValidate>
              <div className="form-grid-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className={`form-input ${profileErrors.name ? 'error' : ''}`}
                    value={profileData.name}
                    onChange={handleProfileChange}
                    disabled={profileLoading}
                  />
                  {profileErrors.name && <span className="error-message">{profileErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    className={`form-input ${profileErrors.phone ? 'error' : ''}`}
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    disabled={profileLoading}
                  />
                  {profileErrors.phone && <span className="error-message">{profileErrors.phone}</span>}
                </div>

                <div className="form-group span-full">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    className={`form-input ${profileErrors.city ? 'error' : ''}`}
                    value={profileData.city}
                    onChange={handleProfileChange}
                    disabled={profileLoading}
                  />
                  {profileErrors.city && <span className="error-message">{profileErrors.city}</span>}
                </div>
              </div>

              <button type="submit" className="btn-primary submit-panel-btn" disabled={profileLoading}>
                {profileLoading ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>

          {/* Panel 2: Password Settings */}
          <div className="settings-panel-card glass-card" style={{ marginTop: '30px' }}>
            <div className="panel-header">
              <IoKeyOutline className="panel-icon" />
              <div>
                <h3>Update Password</h3>
                <p>Change your secure login password regularly.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="panel-form" noValidate>
              <div className="form-grid-row">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    placeholder="••••••••"
                    className={`form-input ${passwordErrors.currentPassword ? 'error' : ''}`}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    disabled={passwordLoading}
                  />
                  {passwordErrors.currentPassword && <span className="error-message">{passwordErrors.currentPassword}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    placeholder="Min. 8 characters"
                    className={`form-input ${passwordErrors.newPassword ? 'error' : ''}`}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    disabled={passwordLoading}
                  />
                  {passwordErrors.newPassword && <span className="error-message">{passwordErrors.newPassword}</span>}
                </div>

                <div className="form-group span-full">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Re-enter new password"
                    className={`form-input ${passwordErrors.confirmPassword ? 'error' : ''}`}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    disabled={passwordLoading}
                  />
                  {passwordErrors.confirmPassword && <span className="error-message">{passwordErrors.confirmPassword}</span>}
                </div>
              </div>

              <button type="submit" className="btn-primary submit-panel-btn" disabled={passwordLoading}>
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* Account Deletion Confirmation Dialog */}
      {showDeleteModal && (
        <div className="modal-backdrop flex-center" onClick={() => setShowDeleteModal(false)}>
          <div className="confirm-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-header flex-center">
              <IoAlertCircleOutline className="danger-icon" />
              <h3>Delete Account?</h3>
            </div>
            <p className="confirm-text">
              WARNING: This will permanently delete your AutoHub account, all vehicle listings you have posted, and all user details. This action cannot be undone.
            </p>
            <div className="confirm-actions flex-center">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-primary delete-confirm-btn" onClick={handleDeleteAccount}>
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .profile-page-wrapper {
          margin-top: 100px;
          padding-bottom: 60px;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 30px;
          align-items: start;
        }

        /* Sidebar profile card */
        .user-profile-card {
          padding: 30px 24px;
          text-align: center;
        }

        .avatar-frame {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid var(--accent-blue);
          margin: 0 auto 20px;
          box-shadow: var(--shadow-sm);
        }

        .default-avatar-icon {
          font-size: 2.8rem;
          color: var(--text-secondary);
        }

        .user-meta-summary h2 {
          font-size: 1.25rem;
          color: var(--text-primary);
        }

        .user-email-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 6px;
        }

        .divider {
          border: none;
          height: 1px;
          background: var(--border-color);
          margin: 20px 0;
        }

        .profile-meta-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }

        .profile-meta-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.85rem;
        }

        .profile-meta-list li svg {
          font-size: 1.3rem;
          color: var(--accent-blue);
          flex-shrink: 0;
        }

        .profile-meta-list label {
          display: block;
          font-size: 0.7rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .profile-meta-list span {
          font-weight: 600;
          color: var(--text-primary);
        }

        .btn-delete-account {
          width: 100%;
          padding: 10px;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--error);
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          gap: 8px;
          transition: all var(--transition-fast);
        }

        .btn-delete-account:hover {
          background: var(--error);
          color: white;
          border-color: var(--error);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
        }

        /* Settings panels (Right side) */
        .settings-panel-card {
          padding: 30px;
        }

        .panel-header {
          display: flex;
          gap: 14px;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
          margin-bottom: 24px;
        }

        .panel-icon {
          font-size: 1.8rem;
          color: var(--accent-blue);
        }

        .panel-header h3 {
          font-size: 1.2rem;
          color: var(--text-primary);
        }

        .panel-header p {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }

        .panel-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-grid-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .span-full {
          grid-column: span 2;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .form-input.error {
          border-color: var(--error);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }

        .error-message {
          font-size: 0.75rem;
          color: var(--error);
          font-weight: 500;
        }

        .submit-panel-btn {
          align-self: flex-start;
          padding: 0.75rem 2rem;
        }

        /* Confirmation dialog modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          z-index: 9999;
          padding: 20px;
        }

        .confirm-modal {
          width: 100%;
          max-width: 400px;
          padding: 30px;
          text-align: center;
          background: rgba(15, 22, 38, 0.95) !important;
          animation: confirmIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes confirmIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .confirm-header {
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .danger-icon {
          font-size: 2.8rem;
          color: var(--error);
        }

        .confirm-text {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .confirm-actions {
          gap: 12px;
          justify-content: center;
        }

        .confirm-actions button {
          flex: 1;
          padding: 0.75rem;
        }

        .delete-confirm-btn {
          background: var(--error) !important;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2) !important;
        }

        .delete-confirm-btn:hover {
          background: #dc2626 !important;
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3) !important;
        }

        /* Responsive Profile */
        @media (max-width: 992px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
          .profile-sidebar-col {
            width: 100%;
          }
        }

        @media (max-width: 600px) {
          .form-grid-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .span-full {
            grid-column: span 1;
          }
          .settings-panel-card {
            padding: 24px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
