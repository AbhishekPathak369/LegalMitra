// src/Components/Footer/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-columns">
          {/* Helpdesk Section */}
          <div className="footer-column">
            <h4>Helpdesk</h4>
            <div className="footer-links">
              <a href="/contact">📞 Contact Us</a>
              <a href="/support">💬 Support</a>
              <a href="/faq">❓ FAQ</a>
            </div>
          </div>

          {/* Important Links Section */}
          <div className="footer-column">
            <h4>Important Links</h4>
            <div className="footer-links">
              <a href="https://legalaffairs.gov.in/">🏛️ Ministry of Law & Justice</a>
              <a href="https://districts.ecourts.gov.in/">⚖️ eCourts Services</a>
              <a href="https://www.legalservicesindia.com/">📜 Legal Services India</a>
              <a href="https://nalsa.gov.in/">🛡️ NALSA</a>
              <a href="https://main.sci.gov.in/">🏛️ Supreme Court of India</a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="footer-column">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <a href="mailto:pathakabhi290@gmail.com" className="contact-link">
                📧 pathakabhi290@gmail.com
              </a>
              <a href="mailto:anuragmishra5433@gmail.com" className="contact-link">
                📧 anuragmishra5433@gmail.com
              </a>
              <a href="tel:+917017331435" className="contact-link">
                📱 +91-7017331435
              </a>
              <a href="tel:+919267918534" className="contact-link">
                📱 +91-9267918534
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="footer-column">
            <h4>Connect With Us</h4>
            <div className="social-links">
              <a href="https://linkedin.com/in/abhishekpathakofficial">💼 LinkedIn</a>
              <a href="https://github.com/AbhishekPathak369">🐱 GitHub</a>
              <a href="https://twitter.com/yourprofile">🐦 Twitter</a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="footer-bottom">
          <div className="footer-legal">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#cookies">Cookies</a>
          </div>
          <p className="copyright">© 2025 LegalMitra | Justice Made Accessible</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;