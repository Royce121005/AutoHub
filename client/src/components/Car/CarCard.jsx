import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IoHeart, IoHeartOutline, IoLocationOutline, IoSpeedometerOutline, IoCalendarOutline, IoCogOutline, IoTrashOutline, IoCheckmarkDoneCircleOutline } from 'react-icons/io5';

const CarCard = ({ car, isOwnerCard = false, onEdit, onDelete, onToggleSold }) => {
  const { isFavorite, toggleFavorite, user } = useAuth();
  const navigate = useNavigate();

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(car._id);
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(car.price);

  const formattedKilometers = new Intl.NumberFormat('en-IN').format(car.kilometers);

  // Parse server image paths correctly
  const imageUrl = car.images && car.images.length > 0 
    ? (car.images[0].startsWith('/uploads') ? `http://localhost:5000${car.images[0]}` : car.images[0])
    : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop';

  return (
    <div className={`car-card glass-card ${car.status === 'sold' ? 'sold-listing' : ''}`}>
      {/* Listing Image */}
      <div className="card-image-wrapper" onClick={() => navigate(`/cars/${car._id}`)}>
        <img src={imageUrl} alt={car.title} className="card-image" loading="lazy" />
        
        {/* Sold overlay badge */}
        {car.status === 'sold' && <div className="sold-badge">SOLD</div>}

        {/* Favorite heart overlay (Only for regular view, non-owners) */}
        {!isOwnerCard && (
          <button 
            className={`card-fav-btn ${isFavorite(car._id) ? 'active' : ''}`} 
            onClick={handleFavoriteClick}
            aria-label="Add to favorites"
          >
            {isFavorite(car._id) ? <IoHeart /> : <IoHeartOutline />}
          </button>
        )}
        
        <div className="card-year-tag">{car.year}</div>
      </div>

      {/* Card Content */}
      <div className="card-content" onClick={() => navigate(`/cars/${car._id}`)}>
        <div className="card-brand-model">
          <span>{car.brand}</span>
          <h3>{car.title}</h3>
        </div>

        {/* Specs snippet */}
        <div className="card-specs">
          <span className="spec-item">
            <IoSpeedometerOutline /> {formattedKilometers} km
          </span>
          <span className="spec-item">
            <IoCogOutline /> {car.transmission}
          </span>
          <span className="spec-item">
            <IoCalendarOutline /> {car.fuelType}
          </span>
        </div>

        <div className="card-footer">
          <div className="card-price">{formattedPrice}</div>
          <div className="card-location">
            <IoLocationOutline /> {car.city}
          </div>
        </div>
      </div>

      {/* Owner specific listing tools */}
      {isOwnerCard && (
        <div className="card-actions-panel">
          <button 
            className="action-btn btn-sold" 
            onClick={(e) => { e.stopPropagation(); onToggleSold(car._id); }}
            title={car.status === 'sold' ? "Mark as Available" : "Mark as Sold"}
          >
            <IoCheckmarkDoneCircleOutline />
            <span>{car.status === 'sold' ? 'Relist' : 'Sold'}</span>
          </button>
          
          <button 
            className="action-btn btn-edit" 
            onClick={(e) => { e.stopPropagation(); onEdit(car); }}
            title="Edit Listing"
          >
            <IoCogOutline />
            <span>Edit</span>
          </button>

          <button 
            className="action-btn btn-delete" 
            onClick={(e) => { e.stopPropagation(); onDelete(car._id); }}
            title="Delete Listing"
          >
            <IoTrashOutline />
            <span>Delete</span>
          </button>
        </div>
      )}

      <style>{`
        .car-card {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          cursor: pointer;
        }

        .car-card.sold-listing {
          opacity: 0.85;
        }

        .card-image-wrapper {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #111;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .car-card:hover .card-image {
          transform: scale(1.05);
        }

        .sold-badge {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--error);
          letter-spacing: 0.05em;
          backdrop-filter: blur(2px);
        }

        .card-fav-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          background: rgba(15, 22, 38, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(4px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          font-size: 1.25rem;
          transition: all var(--transition-fast);
        }

        .card-fav-btn:hover {
          transform: scale(1.1);
          background: rgba(15, 22, 38, 0.9);
          border-color: var(--accent-pink);
          color: var(--accent-pink);
        }

        .card-fav-btn.active {
          color: var(--accent-pink);
          background: rgba(236, 72, 153, 0.1);
          border-color: var(--accent-pink);
        }

        .card-year-tag {
          position: absolute;
          bottom: 12px;
          left: 12px;
          padding: 4px 8px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 700;
        }

        .card-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-brand-model span {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--accent-blue);
          font-weight: 700;
        }

        .card-brand-model h3 {
          font-size: 1.15rem;
          margin-top: 4px;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-specs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin: 18px 0;
          padding: 10px 0;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .spec-item svg {
          color: var(--accent-blue);
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .card-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .card-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .card-location svg {
          color: var(--accent-blue);
        }

        /* Actions panel for listings manager */
        .card-actions-panel {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          border-top: 1px solid var(--border-color);
          background: rgba(255, 255, 255, 0.01);
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 6px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
          border-right: 1px solid var(--border-color);
        }

        .action-btn:last-child {
          border-right: none;
        }

        .action-btn svg {
          font-size: 1rem;
        }

        .action-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.03);
        }

        .btn-sold:hover {
          color: var(--success);
          background: rgba(16, 185, 129, 0.08);
        }

        .btn-edit:hover {
          color: var(--accent-blue);
          background: rgba(59, 130, 246, 0.08);
        }

        .btn-delete:hover {
          color: var(--error);
          background: rgba(239, 68, 68, 0.08);
        }
      `}</style>
    </div>
  );
};

export default CarCard;
