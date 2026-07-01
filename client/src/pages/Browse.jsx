import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import CarCard from '../components/Car/CarCard';
import { IoFunnelOutline, IoChevronBackOutline, IoChevronForwardOutline, IoCloseOutline } from 'react-icons/io5';

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'];
const TRANSMISSIONS = ['Manual', 'Automatic'];
const OWNERS = ['First', 'Second', 'Third', 'Fourth & Above'];

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination metadata
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter Panel States
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [model, setModel] = useState(searchParams.get('model') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [fuelType, setFuelType] = useState(searchParams.get('fuelType') || '');
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || '');
  const [owner, setOwner] = useState(searchParams.get('owner') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch cars from API
  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      // Build query string matching URL params
      const queryParams = new URLSearchParams(searchParams);
      queryParams.set('page', currentPage);
      queryParams.set('limit', 9); // 9 cars per page

      const data = await api.get(`/cars?${queryParams.toString()}`);
      setCars(data.cars);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error('Error fetching cars list:', err.message);
    } finally {
      setLoading(false);
    }
  }, [searchParams, currentPage]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Sync state filters to searchParams when submitted
  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    
    const params = {};
    if (brand) params.brand = brand;
    if (model) params.model = model;
    if (city) params.city = city;
    if (fuelType) params.fuelType = fuelType;
    if (transmission) params.transmission = transmission;
    if (owner) params.owner = owner;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sort) params.sort = sort;
    
    const keyword = searchParams.get('search');
    if (keyword) params.search = keyword;

    setCurrentPage(1); // reset to page 1
    setSearchParams(params);
    setShowMobileFilters(false);
  };

  const handleClearFilters = () => {
    setBrand('');
    setModel('');
    setCity('');
    setFuelType('');
    setTransmission('');
    setOwner('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setCurrentPage(1);
    
    // Clear search term too
    setSearchParams({});
  };

  // Sync sorting option instantly
  const handleSortChange = (e) => {
    const nextSort = e.target.value;
    setSort(nextSort);
    
    const currentParams = Object.fromEntries([...searchParams]);
    currentParams.sort = nextSort;
    setSearchParams(currentParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const keyword = searchParams.get('search');

  return (
    <div className="browse-page-wrapper container">
      {/* Search status / keyword banner */}
      {keyword && (
        <div className="search-status-banner glass-card">
          <p>Showing search results for keyword: <strong>"{keyword}"</strong></p>
          <button onClick={() => {
            const copy = Object.fromEntries([...searchParams]);
            delete copy.search;
            setSearchParams(copy);
          }} className="btn-close-search"><IoCloseOutline /></button>
        </div>
      )}

      <div className="browse-layout">
        {/* 1. Sidebar Filters (Desktop) */}
        <aside className={`filters-sidebar glass-card ${showMobileFilters ? 'active' : ''}`}>
          <div className="sidebar-header">
            <h3><IoFunnelOutline /> Filters</h3>
            <button className="mobile-close-btn" onClick={() => setShowMobileFilters(false)}>
              <IoCloseOutline />
            </button>
            <button className="clear-btn" onClick={handleClearFilters}>Clear All</button>
          </div>

          <form onSubmit={handleApplyFilters} className="filters-form">
            {/* Brand */}
            <div className="filter-group">
              <label htmlFor="brand">Brand</label>
              <input 
                type="text" 
                id="brand" 
                placeholder="e.g. Honda" 
                className="form-input"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            {/* Model */}
            <div className="filter-group">
              <label htmlFor="model">Model</label>
              <input 
                type="text" 
                id="model" 
                placeholder="e.g. City" 
                className="form-input"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>

            {/* City */}
            <div className="filter-group">
              <label htmlFor="city">City</label>
              <input 
                type="text" 
                id="city" 
                placeholder="e.g. Noida" 
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label>Price Range (₹)</label>
              <div className="price-inputs">
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="form-input"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span className="range-to">to</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="form-input"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Fuel Type */}
            <div className="filter-group">
              <label htmlFor="fuelType">Fuel Type</label>
              <select 
                id="fuelType" 
                className="form-input select-field"
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
              >
                <option value="">Any Fuel</option>
                {FUEL_TYPES.map(fuel => <option key={fuel} value={fuel}>{fuel}</option>)}
              </select>
            </div>

            {/* Transmission */}
            <div className="filter-group">
              <label htmlFor="transmission">Transmission</label>
              <select 
                id="transmission" 
                className="form-input select-field"
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
              >
                <option value="">Any Transmission</option>
                {TRANSMISSIONS.map(trans => <option key={trans} value={trans}>{trans}</option>)}
              </select>
            </div>

            {/* Ownership */}
            <div className="filter-group">
              <label htmlFor="owner">Ownership</label>
              <select 
                id="owner" 
                className="form-input select-field"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
              >
                <option value="">Any Owner</option>
                {OWNERS.map(own => <option key={own} value={own}>{own}</option>)}
              </select>
            </div>

            <button type="submit" className="btn-primary apply-filters-btn">
              Apply Filters
            </button>
          </form>
        </aside>

        {/* 2. Results Section */}
        <main className="results-section">
          {/* Header with Sort and Count */}
          <div className="results-header glass-card">
            <div className="results-count">
              <p>Found <strong>{totalCount}</strong> vehicles listed</p>
            </div>

            <div className="controls-right">
              {/* Mobile Filter Toggle Button */}
              <button className="mobile-filter-toggle btn-secondary" onClick={() => setShowMobileFilters(true)}>
                <IoFunnelOutline /> Filters
              </button>

              <div className="sort-wrapper">
                <label htmlFor="sort-select">Sort By</label>
                <select 
                  id="sort-select" 
                  className="form-input sort-select"
                  value={sort}
                  onChange={handleSortChange}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="yearNewToOld">Year: Newest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="browse-grid-skeleton">
              {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="skeleton-card glass-card"></div>)}
            </div>
          ) : cars.length === 0 ? (
            <div className="empty-results glass-card flex-center">
              <h3>No Vehicles Match Your Search</h3>
              <p>Try modifying your sidebar filter values or clearing keywords.</p>
              <button onClick={handleClearFilters} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="browse-cars-grid">
                {cars.map(car => (
                  <CarCard key={car._id} car={car} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-bar">
                  <button 
                    className="pagination-btn flex-center"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <IoChevronBackOutline />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button 
                    className="pagination-btn flex-center"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <IoChevronForwardOutline />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <style>{`
        .browse-page-wrapper {
          margin-top: 110px;
          padding-bottom: 60px;
        }

        .search-status-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          margin-bottom: 24px;
          border-left: 4px solid var(--accent-blue) !important;
        }

        .btn-close-search {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 1.4rem;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .btn-close-search:hover {
          color: var(--error);
        }

        .browse-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 30px;
          align-items: start;
        }

        /* Sidebar Styling */
        .filters-sidebar {
          padding: 24px;
          position: sticky;
          top: 100px;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 16px;
          margin-bottom: 20px;
        }

        .sidebar-header h3 {
          font-size: 1.15rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mobile-close-btn {
          display: none;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .clear-btn {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--accent-blue);
          cursor: pointer;
        }

        .clear-btn:hover {
          color: var(--text-primary);
        }

        .filters-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-group label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .range-to {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .select-field {
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
        }

        .select-field option {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .apply-filters-btn {
          width: 100%;
          padding: 0.75rem;
          margin-top: 10px;
        }

        /* Results panel styling */
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          margin-bottom: 24px;
        }

        .controls-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mobile-filter-toggle {
          display: none;
        }

        .sort-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sort-wrapper label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .sort-select {
          padding: 0.5rem 1rem;
          width: 180px;
          font-size: 0.88rem;
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
        }

        .sort-select option {
          background: var(--bg-secondary);
        }

        .browse-cars-grid, .browse-grid-skeleton {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .empty-results {
          padding: 60px 40px;
          flex-direction: column;
          gap: 16px;
          text-align: center;
        }

        .empty-results h3 {
          font-size: 1.4rem;
        }

        /* Pagination style */
        .pagination-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 48px;
        }

        .pagination-btn, .pagination-number {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--glass-bg);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .pagination-btn:hover:not(:disabled), .pagination-number:hover {
          border-color: var(--accent-blue);
          color: var(--text-primary);
          background: rgba(59, 130, 246, 0.1);
        }

        .pagination-number.active {
          background: var(--accent-gradient);
          color: #ffffff;
          border: none;
        }

        .pagination-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1200px) {
          .browse-cars-grid, .browse-grid-skeleton {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 992px) {
          .browse-layout {
            grid-template-columns: 1fr;
          }

          .mobile-filter-toggle {
            display: inline-flex;
            padding: 0.5rem 1rem;
            font-size: 0.88rem;
          }

          /* Slide-in Mobile Drawer Filters */
          .filters-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 320px;
            height: 100vh;
            z-index: 2000;
            border-radius: 0;
            border-left: none;
            border-right: 1px solid var(--border-color);
            transform: translateX(-100%);
            transition: transform var(--transition-normal);
            overflow-y: auto;
            background: var(--bg-secondary) !important;
          }

          .filters-sidebar.active {
            transform: translateX(0);
          }

          .mobile-close-btn {
            display: block;
          }
        }

        @media (max-width: 600px) {
          .browse-cars-grid, .browse-grid-skeleton {
            grid-template-columns: 1fr;
          }

          .results-header {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            padding: 16px;
          }

          .controls-right {
            justify-content: space-between;
          }
          
          .sort-select {
            width: 140px;
          }
        }
      `}</style>
    </div>
  );
};

export default Browse;
