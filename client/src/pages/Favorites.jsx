import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CarCard from '../components/Car/CarCard';
import { IoHeartOutline, IoCompassOutline } from 'react-icons/io5';

const Favorites = () => {
  const { favorites, refreshFavorites, loading } = useAuth();

  useEffect(() => {
    // Refresh favorites list on mount
    refreshFavorites();
  }, [refreshFavorites]);

  return (
    <div className="favorites-page-wrapper container">
      {/* Header */}
      <div className="favorites-header">
        <h2>My Saved Vehicles</h2>
        <p>You have saved <strong>{favorites.length}</strong> cars to your favorites.</p>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="favorites-skeletons">
          {[1, 2, 3].map(n => <div key={n} className="skeleton-card glass-card"></div>)}
        </div>
      ) : favorites.length === 0 ? (
        <div className="empty-favorites glass-card flex-center">
          <IoHeartOutline className="heart-empty-icon" />
          <h3>No Favorites Added Yet</h3>
          <p>Explore our marketplace listings and tap the heart icon on any vehicle card to save it here.</p>
          <Link to="/browse" className="btn-primary browse-cta-btn">
            <IoCompassOutline /> Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(fav => (
            <CarCard key={fav._id} car={fav.carId} />
          ))}
        </div>
      )}

      <style>{`
        .favorites-page-wrapper {
          margin-top: 100px;
          padding-bottom: 60px;
        }

        .favorites-header {
          margin-bottom: 36px;
        }

        .favorites-header h2 {
          font-size: 1.8rem;
          color: var(--text-primary);
        }

        .favorites-header p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .favorites-grid, .favorites-skeletons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .empty-favorites {
          padding: 60px 40px;
          flex-direction: column;
          gap: 16px;
          text-align: center;
        }

        .heart-empty-icon {
          font-size: 3.5rem;
          color: var(--accent-pink);
          filter: drop-shadow(0 0 10px rgba(236, 72, 153, 0.25));
        }

        .empty-favorites h3 {
          font-size: 1.4rem;
        }

        .browse-cta-btn {
          gap: 8px;
          margin-top: 10px;
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

        @media (max-width: 992px) {
          .favorites-grid, .favorites-skeletons {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .favorites-grid, .favorites-skeletons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Favorites;
