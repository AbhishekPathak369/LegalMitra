// src/Components/Footer/Footer.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';
const API_BASE_URL = import.meta.env.VITE_API_URL;

const Footer = () => {
  const navigate = useNavigate();

  const handleAdminLoginClick = (e) => {
    e.preventDefault();
    console.log('Footer: Admin login clicked');
    navigate('/admin-login');
  };

  const handleInternalLinkClick = (path, e) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-columns">
          {/* Helpdesk Section */}
          <div className="footer-column">
            <h4>Helpdesk</h4>
            <div className="footer-links">
              <a 
                href="/contact" 
                onClick={(e) => handleInternalLinkClick('/contact', e)}
              >
                <span className="link-icon">📞</span>
                Contact Us
              </a>
              <a 
                href="/support" 
                onClick={(e) => handleInternalLinkClick('/support', e)}
              >
                <span className="link-icon">💬</span>
                Support
              </a>
              <a 
                href="/faq" 
                onClick={(e) => handleInternalLinkClick('/faq', e)}
              >
                <span className="link-icon">❓</span>
                FAQ
              </a>
            </div>
          </div>

          {/* Important Links Section */}
          <div className="footer-column">
            <h4>Important Links</h4>
            <div className="footer-links">
              <a href="https://legalaffairs.gov.in/" target="_blank" rel="noopener noreferrer">
                <span className="link-icon">🏛️</span>
                Ministry of Law & Justice
              </a>
              <a href="https://districts.ecourts.gov.in/" target="_blank" rel="noopener noreferrer">
                <span className="link-icon">⚖️</span>
                eCourts Services
              </a>
              <a href="https://www.legalservicesindia.com/" target="_blank" rel="noopener noreferrer">
                <span className="link-icon">📜</span>
                Legal Services India
              </a>
              <a href="https://nalsa.gov.in/" target="_blank" rel="noopener noreferrer">
                <span className="link-icon">🛡️</span>
                NALSA
              </a>
              <a href="https://main.sci.gov.in/" target="_blank" rel="noopener noreferrer">
                <span className="link-icon">🏛️</span>
                Supreme Court of India
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="footer-column">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <a href="mailto:pathakabhi290@gmail.com" className="contact-link">
                <span className="contact-icon">📧</span>
                pathakabhi290@gmail.com
              </a>
              <a href="mailto:anuragmishra5433@gmail.com" className="contact-link">
                <span className="contact-icon">📧</span>
                anuragmishra5433@gmail.com
              </a>
              <a href="tel:+917017331435" className="contact-link">
                <span className="contact-icon">📱</span>
                +91-7017331435
              </a>
              <a href="tel:+919267918534" className="contact-link">
                <span className="contact-icon">📱</span>
                +91-9267918534
              </a>
            </div>
          </div>

          {/* Social Links - Professional Logos */}
          <div className="footer-column">
            <h4>Connect With Us</h4>
            <div className="social-links">
              <a 
                href="https://linkedin.com/in/abhishekpathakofficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link linkedin"
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
              
              <a 
                href="https://github.com/AbhishekPathak369" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link github"
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                <span>GitHub</span>
              </a>
              
              <a 
                href="https://twitter.com/yourprofile" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link twitter"
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.76-12.293 10.025 10.025 0 002.46-2.546l-.047-.02z"/>
                </svg>
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="footer-bottom">
          <div className="footer-legal">
            <a 
              href="#privacy" 
              onClick={(e) => handleInternalLinkClick('/privacy', e)}
            >
              Privacy Policy
            </a>
            <a 
              href="#terms" 
              onClick={(e) => handleInternalLinkClick('/terms', e)}
            >
              Terms of Service
            </a>
            <a 
              href="#cookies" 
              onClick={(e) => handleInternalLinkClick('/cookies', e)}
            >
              Cookie Policy
            </a>
          </div>
          <p className="copyright">© 2025 LegalMitra. All rights reserved. | Justice Made Accessible</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;