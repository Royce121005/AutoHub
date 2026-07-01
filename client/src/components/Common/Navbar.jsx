import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IoCarSport, IoMenu, IoClose, IoHeart, IoPersonCircle, IoLogOut, IoAddCircle, IoSearch } from 'react-icons/io5';

const Navbar = () => {
  const { user, logout, favoriteIds } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route changes
  useEffect(() => {
    closeMenu();
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <IoCarSport className="logo-icon" />
          <span>Auto<span className="logo-accent">Hub</span></span>
        </Link>

        {/* Hamburger Menu (Mobile Only) */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
          {isOpen ? <IoClose /> : <IoMenu />}
        </button>

        {/* Desktop Nav Links */}
        <div className={`nav-menu-wrapper ${isOpen ? 'active' : ''}`}>
          <ul className="nav-menu">
            <li className="nav-item">
              <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/browse" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Browse Cars
              </NavLink>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <NavLink to="/sell" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <IoAddCircle className="nav-icon" /> Sell Car
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/my-listings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    My Listings
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/favorites" className={({ isActive }) => `nav-link fav-nav ${isActive ? 'active' : ''}`}>
                    <IoHeart className="nav-icon-fav" /> Favorites
                    {favoriteIds.size > 0 && <span className="fav-badge">{favoriteIds.size}</span>}
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Auth Section */}
          <div className="auth-buttons">
            {user ? (
              <div className="user-profile-menu">
                <Link to="/profile" className="profile-link">
                  {user.profileImage.startsWith('/uploads') ? (
                    <img 
                      src={user.profileImage.startsWith('/') ? `http://localhost:5000${user.profileImage}` : user.profileImage} 
                      alt={user.name} 
                      className="nav-avatar"
                    />
                  ) : (
                    <IoPersonCircle className="default-nav-avatar" />
                  )}
                  <span className="nav-username">{user.name.split(' ')[0]}</span>
                </Link>
                <button className="btn-logout" onClick={handleLogout} title="Log Out">
                  <IoLogOut />
                </button>
              </div>
            ) : (
              <div className="guest-links">
                <Link to="/login" className="nav-link login-btn">Login</Link>
                <Link to="/register" className="btn-primary register-btn">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          z-index: 1000;
          display: flex;
          align-items: center;
          background: rgba(8, 12, 20, 0.5);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          transition: all var(--transition-normal);
        }

        .navbar.scrolled {
          height: 70px;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border-bottom: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
        }

        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.03em;
        }

        .logo-icon {
          font-size: 2rem;
          color: var(--accent-blue);
          filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
        }

        .logo-accent {
          background: var(--text-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .menu-toggle {
          display: none;
          font-size: 1.8rem;
          color: var(--text-primary);
          background: none;
          border: none;
          cursor: pointer;
        }

        .nav-menu-wrapper {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .nav-menu {
          display: flex;
          list-style: none;
          gap: 24px;
          align-items: center;
        }

        .nav-link {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .nav-link:hover, .nav-link.active {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-icon {
          font-size: 1.1rem;
          color: var(--accent-blue);
        }

        .nav-icon-fav {
          font-size: 1.1rem;
          color: var(--accent-pink);
        }

        .fav-nav {
          position: relative;
        }

        .fav-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--accent-pink);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 8px rgba(236, 72, 153, 0.5);
        }

        .auth-buttons {
          display: flex;
          align-items: center;
        }

        .guest-links {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .login-btn {
          border: 1px solid transparent;
        }

        .login-btn:hover {
          border-color: var(--border-color);
        }

        .register-btn {
          padding: 0.55rem 1.2rem;
          font-size: 0.9rem;
        }

        .user-profile-menu {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
        }

        .profile-link {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nav-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--accent-blue);
        }

        .default-nav-avatar {
          font-size: 2rem;
          color: var(--text-secondary);
        }

        .nav-username {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .btn-logout {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 50%;
          transition: all var(--transition-fast);
        }

        .btn-logout:hover {
          color: var(--error);
          background: rgba(239, 68, 68, 0.1);
        }

        /* Responsive Breakpoints */
        @media (max-width: 992px) {
          .menu-toggle {
            display: block;
          }

          .nav-menu-wrapper {
            position: fixed;
            top: 80px;
            left: 0;
            width: 100%;
            height: calc(100vh - 80px);
            background: var(--bg-primary);
            flex-direction: column;
            align-items: stretch;
            padding: 40px var(--container-padding, 5%);
            gap: 32px;
            transform: translateX(100%);
            transition: transform var(--transition-normal);
            overflow-y: auto;
          }

          .navbar.scrolled .nav-menu-wrapper {
            top: 70px;
            height: calc(100vh - 70px);
          }

          .nav-menu-wrapper.active {
            transform: translateX(0);
          }

          .nav-menu {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .nav-link {
            font-size: 1.1rem;
            padding: 12px 16px;
            width: 100%;
          }

          .auth-buttons {
            width: 100%;
            margin-top: 20px;
          }

          .guest-links {
            flex-direction: column;
            width: 100%;
            gap: 12px;
          }

          .login-btn {
            width: 100%;
            justify-content: center;
          }

          .register-btn {
            width: 100%;
            justify-content: center;
            padding: 0.75rem;
          }

          .user-profile-menu {
            width: 100%;
            border-radius: var(--radius-md);
            justify-content: space-between;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
