import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { IoHeart, IoHeartOutline, IoShareSocialOutline, IoLocationOutline, IoCallOutline, IoMailOutline, IoCalendarOutline, IoSpeedometerOutline, IoCogOutline, IoPersonOutline, IoChevronBackOutline, IoChevronForwardOutline, IoShieldCheckmarkOutline, IoCalculatorOutline } from 'react-icons/io5';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isFavorite, toggleFavorite } = useAuth();
  const toast = useToast();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);

  // EMI Calculator States
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(5); // in years
  const [calculatedEMI, setCalculatedEMI] = useState(0);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const data = await api.get(`/cars/${id}`);
        setCar(data.car);
        // Pre-fill loan amount to 80% of vehicle price
        setLoanAmount(Math.round(data.car.price * 0.8));
      } catch (err) {
        console.error(err);
        toast.error('Failed to load car details. It might have been deleted.');
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };
    fetchCarDetails();
  }, [id, navigate, toast]);

  // Recalculate EMI whenever inputs change
  useEffect(() => {
    if (!loanAmount) return;
    const r = interestRate / 12 / 100; // monthly rate
    const n = loanTenure * 12; // monthly tenure
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setCalculatedEMI(isNaN(emi) ? 0 : Math.round(emi));
  }, [loanAmount, interestRate, loanTenure]);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '80vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner"></div>
        <p>Loading vehicle specifications...</p>
        <style>{`
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid var(--border-color);
            border-top: 4px solid var(--accent-blue);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!car) return null;

  // Format currency
  const formatPrice = (val) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);

  // Format numbers
  const formatNum = (val) => new Intl.NumberFormat('en-IN').format(val);

  // Get image source
  const getImgSrc = (img) => {
    return img.startsWith('/uploads') ? `http://localhost:5000${img}` : img;
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Listing link copied to clipboard!');
  };

  const handleContactClick = () => {
    if (!user) {
      toast.info('Please log in to view seller contact details.');
      navigate('/login');
      return;
    }
    setShowContactModal(true);
  };

  const activeImageUrl = car.images && car.images.length > 0 ? getImgSrc(car.images[activeImageIndex]) : '';

  return (
    <div className="details-container container">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="btn-back flex-center">
        <IoChevronBackOutline /> Back to listings
      </button>

      <div className="details-grid">
        {/* LEFT COLUMN */}
        <div className="details-left">
          {/* 1. Image Gallery */}
          <div className="gallery-card glass-card">
            <div className="active-image-frame">
              <img src={activeImageUrl} alt={car.title} className="active-image" />
              
              {car.status === 'sold' && <div className="sold-overlay">SOLD</div>}

              {/* Prev / Next buttons */}
              {car.images.length > 1 && (
                <>
                  <button 
                    className="gallery-nav-btn prev"
                    onClick={() => setActiveImageIndex(prev => (prev === 0 ? car.images.length - 1 : prev - 1))}
                  >
                    <IoChevronBackOutline />
                  </button>
                  <button 
                    className="gallery-nav-btn next"
                    onClick={() => setActiveImageIndex(prev => (prev === car.images.length - 1 ? 0 : prev + 1))}
                  >
                    <IoChevronForwardOutline />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {car.images.length > 1 && (
              <div className="thumbnails-grid">
                {car.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    className={`thumbnail-btn ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={getImgSrc(img)} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Key Specifications */}
          <div className="specs-card glass-card">
            <h2>Specifications</h2>
            <div className="specs-table-grid">
              <div className="spec-table-row"><span>Brand</span><strong>{car.brand}</strong></div>
              <div className="spec-table-row"><span>Model</span><strong>{car.model}</strong></div>
              <div className="spec-table-row"><span>Variant</span><strong>{car.variant || 'N/A'}</strong></div>
              <div className="spec-table-row"><span>Year</span><strong>{car.year}</strong></div>
              <div className="spec-table-row"><span>Fuel Type</span><strong>{car.fuelType}</strong></div>
              <div className="spec-table-row"><span>Transmission</span><strong>{car.transmission}</strong></div>
              <div className="spec-table-row"><span>Ownership</span><strong>{car.owner} Owner</strong></div>
              <div className="spec-table-row"><span>Kilometers</span><strong>{formatNum(car.kilometers)} km</strong></div>
              <div className="spec-table-row"><span>Exterior Color</span><strong>{car.color}</strong></div>
              <div className="spec-table-row"><span>Registration</span><strong>{car.registrationState}</strong></div>
              <div className="spec-table-row"><span>Insurance Validity</span><strong>{car.insurance}</strong></div>
              <div className="spec-table-row"><span>City location</span><strong>{car.city}</strong></div>
            </div>
          </div>

          {/* 3. Description */}
          <div className="desc-card glass-card">
            <h2>Description</h2>
            <p className="desc-content">{car.description}</p>
          </div>

          {/* 4. Loan EMI Calculator (Optional Feature) */}
          <div className="emi-calculator-card glass-card">
            <h2 className="flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
              <IoCalculatorOutline style={{ color: 'var(--accent-blue)' }} /> Loan EMI Calculator
            </h2>
            <p style={{ marginBottom: '24px' }}>Estimate your monthly payments for this car.</p>
            
            <div className="emi-calculator-layout">
              <div className="emi-inputs-panel">
                <div className="emi-field">
                  <div className="emi-label-wrapper">
                    <span>Loan Amount (₹)</span>
                    <strong>{formatPrice(loanAmount)}</strong>
                  </div>
                  <input 
                    type="range" 
                    min={Math.round(car.price * 0.2)} 
                    max={car.price} 
                    step={10000}
                    value={loanAmount} 
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                  />
                  <div className="range-limits">
                    <span>Min: {formatPrice(car.price * 0.2)}</span>
                    <span>Max: {formatPrice(car.price)}</span>
                  </div>
                </div>

                <div className="emi-field">
                  <div className="emi-label-wrapper">
                    <span>Interest Rate (%)</span>
                    <strong>{interestRate}%</strong>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="20" 
                    step="0.1" 
                    value={interestRate} 
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                  />
                  <div className="range-limits">
                    <span>Min: 5%</span>
                    <span>Max: 20%</span>
                  </div>
                </div>

                <div className="emi-field">
                  <div className="emi-label-wrapper">
                    <span>Tenure (Years)</span>
                    <strong>{loanTenure} Years</strong>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="7" 
                    step="1" 
                    value={loanTenure} 
                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                  />
                  <div className="range-limits">
                    <span>Min: 1 Yr</span>
                    <span>Max: 7 Yrs</span>
                  </div>
                </div>
              </div>

              <div className="emi-results-panel flex-center">
                <div className="emi-result-bubble">
                  <span className="result-label">Estimated Monthly EMI</span>
                  <span className="result-value">{formatPrice(calculatedEMI)}</span>
                  <span className="result-footer">Computed at {interestRate}% for {loanTenure} years</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="details-right">
          {/* Summary Card */}
          <div className="summary-side-card glass-card">
            <span className="summary-status-tag">{car.status === 'sold' ? 'Sold' : 'For Sale'}</span>
            
            <div className="brand-badge-text">{car.brand}</div>
            <h1>{car.title}</h1>
            <p className="summary-variant">{car.variant || 'Standard Variant'}</p>

            <div className="price-tag-value">{formatPrice(car.price)}</div>

            <hr className="divider" />

            <div className="spec-shortcuts">
              <div className="shortcut-box">
                <IoCalendarOutline />
                <span>{car.year}</span>
              </div>
              <div className="shortcut-box">
                <IoSpeedometerOutline />
                <span>{formatNum(car.kilometers)} km</span>
              </div>
              <div className="shortcut-box">
                <IoCogOutline />
                <span>{car.transmission}</span>
              </div>
            </div>

            <hr className="divider" />

            <div className="location-box flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
              <IoLocationOutline style={{ color: 'var(--accent-blue)', fontSize: '1.2rem' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{car.city}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Registration: {car.registrationState}</div>
              </div>
            </div>

            <div className="action-buttons-group">
              <button className="btn-primary contact-btn" onClick={handleContactClick} disabled={car.status === 'sold'}>
                <IoCallOutline /> Contact Seller
              </button>

              <div className="sec-buttons-row">
                <button 
                  className={`btn-secondary action-btn-heart ${isFavorite(car._id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(car._id)}
                >
                  {isFavorite(car._id) ? <IoHeart /> : <IoHeartOutline />}
                  <span>{isFavorite(car._id) ? 'Liked' : 'Favorite'}</span>
                </button>

                <button className="btn-secondary action-btn-share" onClick={handleShareClick}>
                  <IoShareSocialOutline />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Quick Safety Tips */}
            <div className="safety-tips-box">
              <span className="tips-title flex-center"><IoShieldCheckmarkOutline /> Safety Tips</span>
              <p>Meet in person at public locations. Do not pay advance booking amounts online without verifying the car physically.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Contact Seller Modal */}
      {showContactModal && (
        <div className="modal-backdrop flex-center" onClick={() => setShowContactModal(false)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Seller Contact Information</h3>
              <button className="modal-close-btn" onClick={() => setShowContactModal(false)}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="seller-profile-section flex-center">
                <IoPersonOutline className="seller-avatar" />
                <div>
                  <h4>{car.sellerId?.name || 'Car Seller'}</h4>
                  <p><IoLocationOutline /> {car.sellerId?.city || car.city}</p>
                </div>
              </div>

              <div className="seller-info-list">
                <div className="info-row">
                  <IoCallOutline className="info-icon" />
                  <div>
                    <label>Phone Number</label>
                    <a href={`tel:${car.sellerId?.phone}`}>{car.sellerId?.phone}</a>
                  </div>
                </div>

                <div className="info-row">
                  <IoMailOutline className="info-icon" />
                  <div>
                    <label>Email Address</label>
                    <a href={`mailto:${car.sellerId?.email}`}>{car.sellerId?.email}</a>
                  </div>
                </div>
              </div>
            </div>

            <button className="btn-primary modal-close-action" onClick={() => setShowContactModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        .details-container {
          margin-top: 100px;
          padding-bottom: 60px;
        }

        .btn-back {
          display: inline-flex;
          gap: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: none;
          border: none;
          margin-bottom: 24px;
          cursor: pointer;
        }

        .btn-back:hover {
          color: var(--text-primary);
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr;
          gap: 30px;
          align-items: start;
        }

        /* Gallery */
        .active-image-frame {
          position: relative;
          height: 450px;
          border-radius: var(--radius-md) var(--radius-md) 0 0;
          overflow: hidden;
          background: #111;
        }

        .active-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sold-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--error);
          letter-spacing: 0.05em;
          backdrop-filter: blur(4px);
        }

        .gallery-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(15, 22, 38, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 1.4rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .gallery-nav-btn:hover {
          background: var(--accent-blue);
          border-color: var(--accent-blue);
        }

        .gallery-nav-btn.prev { left: 16px; }
        .gallery-nav-btn.next { right: 16px; }

        .thumbnails-grid {
          display: flex;
          gap: 12px;
          padding: 16px;
          overflow-x: auto;
          background: rgba(255, 255, 255, 0.01);
          border-top: 1px solid var(--border-color);
          border-radius: 0 0 var(--radius-md) var(--radius-md);
        }

        .thumbnail-btn {
          width: 80px;
          height: 60px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          flex-shrink: 0;
        }

        .thumbnail-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumbnail-btn.active {
          border-color: var(--accent-blue);
        }

        /* Cards */
        .specs-card, .desc-card, .emi-calculator-card {
          margin-top: 24px;
          padding: 30px;
        }

        .specs-card h2, .desc-card h2, .emi-calculator-card h2 {
          font-size: 1.35rem;
          margin-bottom: 20px;
          border-left: 3px solid var(--accent-blue);
          padding-left: 12px;
        }

        .specs-table-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px 40px;
        }

        .spec-table-row {
          display: flex;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.92rem;
        }

        .spec-table-row span {
          color: var(--text-secondary);
        }

        .desc-content {
          white-space: pre-line;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        /* EMI calculator layout */
        .emi-calculator-layout {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 30px;
          align-items: center;
        }

        .emi-inputs-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .emi-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .emi-label-wrapper {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }

        .emi-label-wrapper span {
          color: var(--text-secondary);
        }

        .emi-label-wrapper strong {
          color: var(--accent-blue);
          font-weight: 700;
        }

        .emi-field input[type="range"] {
          width: 100%;
          accent-color: var(--accent-blue);
          cursor: pointer;
        }

        .range-limits {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .emi-results-panel {
          padding: 24px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed var(--border-color);
        }

        .emi-result-bubble {
          text-align: center;
        }

        .result-label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 6px;
        }

        .result-value {
          display: block;
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--success);
          margin-bottom: 8px;
        }

        .result-footer {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        /* Summary Card */
        .summary-side-card {
          padding: 30px;
          position: sticky;
          top: 100px;
        }

        .summary-status-tag {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid var(--accent-blue);
          border-radius: var(--radius-sm);
          color: var(--accent-blue);
          margin-bottom: 16px;
        }

        .brand-badge-text {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--accent-blue);
          font-weight: 700;
          margin-bottom: 4px;
        }

        .summary-side-card h1 {
          font-size: 1.8rem;
          color: var(--text-primary);
          line-height: 1.25;
        }

        .summary-variant {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .price-tag-value {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 18px;
        }

        .divider {
          border: none;
          height: 1px;
          background: var(--border-color);
          margin: 20px 0;
        }

        .spec-shortcuts {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .shortcut-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .shortcut-box svg {
          font-size: 1.2rem;
          color: var(--accent-blue);
        }

        .action-buttons-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
        }

        .contact-btn {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          border-radius: var(--radius-md);
        }

        .contact-btn:disabled {
          background: var(--text-muted);
          cursor: not-allowed;
          box-shadow: none;
        }

        .sec-buttons-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .sec-buttons-row button {
          border-radius: var(--radius-md);
          padding: 0.8rem;
        }

        .action-btn-heart.active {
          color: var(--accent-pink);
          border-color: var(--accent-pink);
          background: rgba(236, 72, 153, 0.08);
        }

        .safety-tips-box {
          margin-top: 24px;
          padding: 16px;
          background: rgba(245, 158, 11, 0.03);
          border: 1px solid rgba(245, 158, 11, 0.15);
          border-radius: var(--radius-sm);
        }

        .tips-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--warning);
          justify-content: flex-start;
          gap: 6px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .safety-tips-box p {
          font-size: 0.78rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Modal Backplate */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          z-index: 9999;
          padding: 20px;
        }

        .modal-content {
          width: 100%;
          max-width: 450px;
          padding: 30px;
          background: rgba(15, 22, 38, 0.9) !important;
          border-radius: var(--radius-lg);
          animation: modalIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes modalIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 14px;
          margin-bottom: 20px;
        }

        .modal-close-btn {
          font-size: 1.8rem;
          color: var(--text-secondary);
          background: none;
          border: none;
          cursor: pointer;
        }

        .modal-close-btn:hover {
          color: var(--text-primary);
        }

        .seller-profile-section {
          justify-content: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }

        .seller-avatar {
          font-size: 3rem;
          color: var(--text-secondary);
          padding: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
        }

        .seller-profile-section h4 {
          font-size: 1.1rem;
        }

        .seller-profile-section p {
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .seller-info-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 30px;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-color);
        }

        .info-icon {
          font-size: 1.4rem;
          color: var(--accent-blue);
        }

        .info-row label {
          display: block;
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .info-row a {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .info-row a:hover {
          color: var(--accent-blue);
          text-decoration: underline;
        }

        .modal-close-action {
          width: 100%;
          padding: 0.8rem;
          border-radius: var(--radius-md);
        }

        /* Responsive Details */
        @media (max-width: 992px) {
          .details-grid {
            grid-template-columns: 1fr;
          }
          
          .active-image-frame {
            height: 350px;
          }

          .summary-side-card {
            position: static;
          }
        }

        @media (max-width: 600px) {
          .active-image-frame {
            height: 250px;
          }

          .specs-table-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .emi-calculator-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CarDetails;
