import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import CarCard from '../components/Car/CarCard';
import { IoAddCircleOutline, IoAlertCircleOutline, IoCarSportOutline } from 'react-icons/io5';

const MyListings = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, available, sold

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchMyListings = async () => {
    const userId = user?.id || user?._id;
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get(`/cars?sellerId=${userId}&limit=100`);
      setListings(data.cars || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedSampleListings = async () => {
    setIsSeeding(true);
    try {
      const res = await api.post('/cars/seed-my-listings');
      toast.success(res.message || 'Sample vehicles added to your listings!');
      await fetchMyListings();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to seed sample listings');
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [user]);

  // Toggle Sold Status
  const handleToggleSold = async (carId) => {
    try {
      const res = await api.patch(`/cars/${carId}/sold`);
      toast.success(res.message);
      // Update local state
      setListings(prev => prev.map(car => 
        car._id === carId ? { ...car, status: res.status } : car
      ));
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to update status');
    }
  };

  // Trigger Delete confirmation
  const triggerDelete = (carId) => {
    setCarToDelete(carId);
    setShowDeleteModal(true);
  };

  // Perform delete
  const handleDeleteCar = async () => {
    if (!carToDelete) return;
    try {
      await api.delete(`/cars/${carToDelete}`);
      toast.success('Listing deleted successfully');
      setListings(prev => prev.filter(car => car._id !== carToDelete));
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to delete listing');
    } finally {
      setShowDeleteModal(false);
      setCarToDelete(null);
    }
  };

  // Navigate to edit form
  const handleEditCar = (car) => {
    navigate('/sell', { state: { editCar: car } });
  };

  // Filter listings by tab
  const filteredListings = listings.filter(car => {
    if (activeTab === 'available') return car.status === 'available';
    if (activeTab === 'sold') return car.status === 'sold';
    return true; // all
  });

  return (
    <div className="mylistings-wrapper container">
      {/* Page Header */}
      <div className="mylistings-header">
        <div>
          <h2>My Vehicle Listings</h2>
          <p>Manage, edit, or update availability of your uploaded cars.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn-secondary add-listing-btn"
            onClick={handleSeedSampleListings}
            disabled={isSeeding}
            style={{ fontSize: '0.88rem' }}
          >
            {isSeeding ? 'Adding...' : '✨ Add Sample Vehicles'}
          </button>
          <Link to="/sell" className="btn-primary add-listing-btn">
            <IoAddCircleOutline /> Add New Listing
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-header-row glass-card">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Listings ({listings.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          Available ({listings.filter(c => c.status === 'available').length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'sold' ? 'active' : ''}`}
          onClick={() => setActiveTab('sold')}
        >
          Sold ({listings.filter(c => c.status === 'sold').length})
        </button>
      </div>

      {/* Main listings list */}
      {loading ? (
        <div className="grid-loading-skeletons">
          {[1, 2, 3].map(n => <div key={n} className="skeleton-card glass-card"></div>)}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="empty-listings-alert glass-card flex-center">
          <IoCarSportOutline />
          <h3>No Listings Found</h3>
          <p>
            {activeTab === 'all' 
              ? 'You have not uploaded any vehicles yet.' 
              : `You have no listings in the "${activeTab}" status.`
            }
          </p>
          {activeTab === 'all' && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
              <Link to="/sell" className="btn-primary">Sell Your Car Now</Link>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={handleSeedSampleListings}
                disabled={isSeeding}
                style={{ padding: '0.75rem 1.25rem' }}
              >
                {isSeeding ? 'Seeding...' : '✨ Seed Sample Vehicles in My Listings'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mylistings-grid">
          {filteredListings.map(car => (
            <CarCard 
              key={car._id} 
              car={car} 
              isOwnerCard={true}
              onEdit={handleEditCar}
              onDelete={triggerDelete}
              onToggleSold={handleToggleSold}
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {showDeleteModal && (
        <div className="modal-backdrop flex-center" onClick={() => setShowDeleteModal(false)}>
          <div className="confirm-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-header flex-center">
              <IoAlertCircleOutline className="danger-icon" />
              <h3>Delete Listing?</h3>
            </div>
            <p className="confirm-text">
              Are you sure you want to permanently delete this listing? This action is irreversible and will remove all uploaded images.
            </p>
            <div className="confirm-actions flex-center">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-primary delete-confirm-btn" onClick={handleDeleteCar}>
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .mylistings-wrapper {
          margin-top: 100px;
          padding-bottom: 60px;
        }

        .mylistings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .mylistings-header h2 {
          font-size: 1.8rem;
          color: var(--text-primary);
        }

        .add-listing-btn {
          gap: 8px;
        }

        /* Tabs list */
        .tabs-header-row {
          display: flex;
          gap: 16px;
          padding: 8px 16px;
          margin-bottom: 32px;
          border-radius: var(--radius-sm);
        }

        .tab-btn {
          padding: 8px 16px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .tab-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
        }

        .tab-btn.active {
          color: var(--text-primary);
          background: var(--bg-tertiary);
          box-shadow: var(--shadow-sm);
        }

        /* Listings grid */
        .mylistings-grid, .grid-loading-skeletons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .empty-listings-alert {
          padding: 60px 40px;
          flex-direction: column;
          gap: 16px;
          text-align: center;
        }

        .empty-listings-alert svg {
          font-size: 3.5rem;
          color: var(--accent-blue);
        }

        .empty-listings-alert h3 {
          font-size: 1.4rem;
        }

        .skeleton-card {
          height: 380px;
          animation: pulse 1.5s infinite ease-in-out;
        }

        @keyframes pulse {
          0% { background-color: rgba(255, 255, 255, 0.02); }
          50% { background-color: rgba(255, 255, 255, 0.06); }
          100% { background-color: rgba(255, 255, 255, 0.02); }
        }

        /* Confirmation Dialog Styles */
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

        @media (max-width: 992px) {
          .mylistings-grid, .grid-loading-skeletons {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .mylistings-header {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }
          
          .tabs-header-row {
            flex-direction: column;
            gap: 8px;
            padding: 8px;
          }

          .mylistings-grid, .grid-loading-skeletons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MyListings;
