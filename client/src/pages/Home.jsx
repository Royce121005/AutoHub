import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import CarCard from '../components/Car/CarCard';
import { IoSearchOutline, IoSparklesOutline, IoShieldCheckmarkOutline, IoSpeedometerOutline, IoThumbsUpOutline, IoChevronForwardOutline } from 'react-icons/io5';

const BRANDS = [
  { name: 'Maruti Suzuki', logo: 'https://cdn.svgporn.com/logos/suzuki.svg' },
  { name: 'Hyundai', logo: 'https://cdn.svgporn.com/logos/hyundai.svg' },
  { name: 'Honda', logo: 'https://cdn.svgporn.com/logos/honda.svg' },
  { name: 'Toyota', logo: 'https://cdn.svgporn.com/logos/toyota.svg' },
  { name: 'Tata', logo: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=100' }, // fallback icon text
  { name: 'Mahindra', logo: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=100' }
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [featuredCars, setFeaturedCars] = useState([]);
  const [latestCars, setLatestCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch featured (highest price first as featured)
        const featuredData = await api.get('/cars?limit=3&sort=priceHighToLow');
        setFeaturedCars(featuredData.cars);

        // Fetch latest listings
        const latestData = await api.get('/cars?limit=3&sort=newest');
        setLatestCars(latestData.cars);
      } catch (err) {
        console.error('Error fetching home listings:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim() && !cityQuery.trim()) return;

    let url = '/browse?';
    if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery)}`;
    if (cityQuery.trim()) url += `${searchQuery.trim() ? '&' : ''}city=${encodeURIComponent(cityQuery)}`;
    
    navigate(url);
  };

  const handleBrandClick = (brandName) => {
    navigate(`/browse?brand=${encodeURIComponent(brandName)}`);
  };

  return (
    <div className="home-container">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-content container">
          <div className="hero-text-block">
            <span className="hero-tagline"><IoSparklesOutline /> Instant Car Buying & Selling</span>
            <h1>Find Your Dream Car <br /><span className="glow-text">Verified & Affordable</span></h1>
            <p>Explore thousands of certified used cars near you. Transparent deals, verified owners, and smooth transactions.</p>
          </div>

          {/* Search Bar Panel */}
          <form onSubmit={handleSearchSubmit} className="hero-search-card glass-card">
            <div className="search-inputs">
              <div className="search-field">
                <label htmlFor="searchQuery">Search vehicle</label>
                <div className="search-input-wrapper">
                  <IoSearchOutline className="search-icon" />
                  <input 
                    type="text" 
                    id="searchQuery" 
                    placeholder="Brand, model, or keyword..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="divider-y"></div>

              <div className="search-field">
                <label htmlFor="cityQuery">Location</label>
                <div className="search-input-wrapper">
                  <IoSearchOutline className="search-icon" />
                  <input 
                    type="text" 
                    id="cityQuery" 
                    placeholder="Enter City..." 
                    value={cityQuery}
                    onChange={(e) => setCityQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary hero-submit-btn">
              Search Cars
            </button>
          </form>
        </div>
      </section>

      {/* 2. Popular Brands */}
      <section className="brands-section container">
        <div className="section-header">
          <h2>Popular Brands</h2>
          <p>Direct search by manufacture names</p>
        </div>
        <div className="brands-grid">
          {BRANDS.map((brand, i) => (
            <button key={i} className="brand-badge glass-card" onClick={() => handleBrandClick(brand.name)}>
              <span className="brand-name">{brand.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Featured Cars */}
      <section className="listings-section container">
        <div className="section-header">
          <div>
            <h2>Featured Vehicles</h2>
            <p>Top tier quality options curated for you</p>
          </div>
          <Link to="/browse?sort=priceHighToLow" className="see-all-link">
            See All <IoChevronForwardOutline />
          </Link>
        </div>
        
        {loading ? (
          <div className="cars-grid-skeleton">
            {[1, 2, 3].map(n => <div key={n} className="skeleton-card glass-card"></div>)}
          </div>
        ) : featuredCars.length === 0 ? (
          <div className="empty-home-listings glass-card flex-center">
            <p>No listings available. Be the first to list a car!</p>
            <Link to="/sell" className="btn-primary">Sell Your Car</Link>
          </div>
        ) : (
          <div className="cars-grid">
            {featuredCars.map(car => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Latest Listings */}
      <section className="listings-section container">
        <div className="section-header">
          <div>
            <h2>Newly Listed</h2>
            <p>Fresh cars uploaded recently</p>
          </div>
          <Link to="/browse?sort=newest" className="see-all-link">
            See All <IoChevronForwardOutline />
          </Link>
        </div>

        {loading ? (
          <div className="cars-grid-skeleton">
            {[1, 2, 3].map(n => <div key={n} className="skeleton-card glass-card"></div>)}
          </div>
        ) : latestCars.length === 0 ? (
          <div className="empty-home-listings glass-card flex-center">
            <p>No listings available.</p>
          </div>
        ) : (
          <div className="cars-grid">
            {latestCars.map(car => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Why Choose Us */}
      <section className="why-us-section">
        <div className="container">
          <div className="section-header center-align">
            <h2>Why Choose AutoHub</h2>
            <p>We simplify the process of buying and selling used cars with trust and ease.</p>
          </div>

          <div className="why-us-grid">
            <div className="why-us-card glass-card">
              <div className="why-icon-box"><IoShieldCheckmarkOutline /></div>
              <h3>Verified Listings</h3>
              <p>Every single listing has complete technical specs, seller phone numbers, and location details.</p>
            </div>

            <div className="why-us-card glass-card">
              <div className="why-icon-box"><IoSpeedometerOutline /></div>
              <h3>Zero Brokerage</h3>
              <p>Connect directly with the buyers or sellers without paying middleman fees or commissions.</p>
            </div>

            <div className="why-us-card glass-card">
              <div className="why-icon-box"><IoThumbsUpOutline /></div>
              <h3>Instant Management</h3>
              <p>Create lists, mark listings as sold, save your favorite cars, and update your profiles on the fly.</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-container {
          margin-top: 80px;
          padding-bottom: 60px;
        }

        /* Hero styling */
        .hero-section {
          position: relative;
          padding: 80px 0 100px;
          background: radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 60%),
                      radial-gradient(circle at 10% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%);
          border-bottom: 1px solid var(--border-color);
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 48px;
        }

        .hero-text-block {
          max-width: 750px;
        }

        .hero-tagline {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent-blue);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 6px 14px;
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.15);
          border-radius: var(--radius-full);
          margin-bottom: 24px;
        }

        .hero-text-block h1 {
          font-size: 3.5rem;
          margin-bottom: 20px;
          line-height: 1.15;
          letter-spacing: -0.03em;
        }

        .hero-text-block p {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        /* Search Card in Hero */
        .hero-search-card {
          width: 100%;
          max-width: 850px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(15, 22, 38, 0.75) !important;
          border-radius: var(--radius-lg);
        }

        .search-inputs {
          display: flex;
          flex: 1;
          gap: 16px;
          align-items: center;
          text-align: left;
        }

        .search-field {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 4px 12px;
        }

        .search-field label {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .search-icon {
          color: var(--accent-blue);
          font-size: 1.1rem;
        }

        .search-field input {
          font-size: 0.95rem;
          width: 100%;
          color: var(--text-primary);
        }

        .search-field input::placeholder {
          color: var(--text-muted);
        }

        .divider-y {
          width: 1px;
          height: 40px;
          background: var(--border-color);
        }

        .hero-submit-btn {
          padding: 0.9rem 2.2rem;
          border-radius: var(--radius-md);
        }

        /* Brand list */
        .brands-section {
          padding: 60px 0;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 36px;
        }

        .section-header.center-align {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .section-header h2 {
          font-size: 1.8rem;
          color: var(--text-primary);
        }

        .section-header p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        .see-all-link {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--accent-blue);
        }

        .see-all-link:hover {
          color: var(--text-primary);
        }

        .brands-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 20px;
        }

        .brand-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          height: 70px;
          background: rgba(255, 255, 255, 0.02) !important;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.95rem;
        }

        .brand-badge:hover {
          background: rgba(255, 255, 255, 0.04) !important;
          border-color: var(--accent-blue);
          color: var(--accent-blue);
          transform: translateY(-4px);
        }

        /* Listings layouts */
        .listings-section {
          padding: 40px 0;
        }

        .cars-grid, .cars-grid-skeleton {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .empty-home-listings {
          min-height: 200px;
          flex-direction: column;
          gap: 16px;
          padding: 40px;
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

        /* Why us section */
        .why-us-section {
          background: rgba(255, 255, 255, 0.01);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          padding: 80px 0;
          margin-top: 60px;
        }

        .why-us-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 48px;
        }

        .why-us-card {
          padding: 40px 30px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .why-icon-box {
          font-size: 2.2rem;
          color: var(--accent-blue);
          margin-bottom: 20px;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
        }

        .why-us-card h3 {
          font-size: 1.25rem;
          margin-bottom: 12px;
        }

        .why-us-card p {
          font-size: 0.9rem;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .hero-text-block h1 {
            font-size: 2.8rem;
          }
          
          .hero-search-card {
            flex-direction: column;
            width: 100%;
            padding: 20px;
          }
          
          .search-inputs {
            flex-direction: column;
            width: 100%;
            gap: 12px;
          }
          
          .divider-y {
            width: 100%;
            height: 1px;
          }
          
          .search-field {
            width: 100%;
            padding: 0;
          }
          
          .hero-submit-btn {
            width: 100%;
          }

          .brands-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .cars-grid, .cars-grid-skeleton {
            grid-template-columns: repeat(2, 1fr);
          }

          .why-us-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .hero-text-block h1 {
            font-size: 2.2rem;
          }
          
          .brands-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cars-grid, .cars-grid-skeleton {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
