import React from 'react';
import { Link } from 'react-router-dom';
import { IoCarSport, IoLogoFacebook, IoLogoTwitter, IoLogoInstagram, IoLogoYoutube, IoMailOutline, IoCall, IoLocation } from 'react-icons/io5';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top container">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            <IoCarSport className="logo-icon" />
            <span>Auto<span className="logo-accent">Hub</span></span>
          </Link>
          <p className="footer-desc">
            AutoHub is the ultimate destination to browse, buy, and sell verified pre-owned cars. Finding your next ride is just a click away.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Facebook"><IoLogoFacebook /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Twitter"><IoLogoTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram"><IoLogoInstagram /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="Youtube"><IoLogoYoutube /></a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/browse">Browse Cars</Link></li>
            <li><Link to="/sell">Sell Your Car</Link></li>
            <li><Link to="/profile">My Account</Link></li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="footer-col">
          <h3>Contact Us</h3>
          <ul className="contact-list">
            <li>
              <IoLocation className="contact-icon" />
              <span>102 Auto Plaza, Sector 62, Noida, India</span>
            </li>
            <li>
              <IoCall className="contact-icon" />
              <a href="tel:+919876543210">+91 98765 43210</a>
            </li>
            <li>
              <IoMailOutline className="contact-icon" />
              <a href="mailto:support@autohub.com">support@autohub.com</a>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="footer-col newsletter-col">
          <h3>Newsletter</h3>
          <p>Subscribe to our newsletter for latest updates on newly listed vehicles.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your Email Address" className="form-input" required />
            <button type="submit" className="btn-primary">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} AutoHub Used Car Marketplace. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms & Conditions</a>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: #06090f;
          border-top: 1px solid var(--border-color);
          padding-top: 60px;
          margin-top: auto;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 2.2fr 1fr 1.5fr 1.8fr;
          gap: 40px;
          padding-bottom: 40px;
        }

        .footer-col h3 {
          font-size: 1.15rem;
          margin-bottom: 24px;
          color: var(--text-primary);
          position: relative;
        }

        .footer-col h3::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -8px;
          width: 30px;
          height: 2px;
          background: var(--accent-blue);
        }

        .brand-col .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .brand-col .logo-icon {
          font-size: 1.8rem;
          color: var(--accent-blue);
        }

        .brand-col .logo-accent {
          background: var(--text-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .footer-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .social-links {
          display: flex;
          gap: 12px;
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: 50%;
          color: var(--text-secondary);
          font-size: 1.1rem;
          transition: all var(--transition-fast);
        }

        .social-icon:hover {
          color: var(--text-primary);
          background: var(--accent-blue);
          border-color: var(--accent-blue);
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links a {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .footer-links a:hover {
          color: var(--text-primary);
          padding-left: 4px;
        }

        .contact-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contact-list li {
          display: flex;
          gap: 12px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .contact-icon {
          font-size: 1.2rem;
          color: var(--accent-blue);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .contact-list a:hover {
          color: var(--text-primary);
        }

        .newsletter-col p {
          font-size: 0.9rem;
          margin-bottom: 16px;
        }

        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .newsletter-form .form-input {
          background: rgba(255, 255, 255, 0.02);
        }

        .newsletter-form .btn-primary {
          padding: 0.65rem;
          font-size: 0.9rem;
        }

        .footer-bottom {
          border-top: 1px solid var(--border-color);
          padding: 24px 0;
          background: #04060a;
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .footer-bottom-links {
          display: flex;
          gap: 20px;
        }

        .footer-bottom-links a:hover {
          color: var(--text-primary);
        }

        /* Responsive */
        @media (max-width: 992px) {
          .footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }
        }

        @media (max-width: 576px) {
          .footer-top {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .footer-bottom-content {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
