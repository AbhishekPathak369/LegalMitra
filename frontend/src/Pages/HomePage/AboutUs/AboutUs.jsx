import React, { useState } from 'react';
import './AboutUs.css';
import ContactForm from './ContactForm';
const API_BASE_URL = import.meta.env.VITE_API_URL;

const AboutUs = () => {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  const openContactForm = () => setIsContactFormOpen(true);
  const closeContactForm = () => setIsContactFormOpen(false);

  const founders = [
    {
      id: 'abhishek',
      name: 'Abhishek Pathak',
      role: 'Co-Founder & Backend Architect',
      tagline: 'Building the Brain',
      description: 'Architect of LegalMitra platform with deep expertise in scalable backend systems, Generative AI integration, and cloud infrastructure. Abhishek has built the intelligent core that powers all AI workflows including Bail Prediction and Legal Assistant features.',
      github: 'https://github.com/AbhishekPathak369',
      githubUsername: 'AbhishekPathak369',
      linkedin: 'https://linkedin.com/in/abhishekpathakofficial',
      email: 'pathakabhi290@gmail.com',
      location: 'Lucknow, India',
          education: 'B.Tech in Information Technology - AKTU (Currently Pursuing)',
      experience: '2+ years',
      expertise: [
        'Backend Development',
        'Node.js & Express',
        'Generative AI',
    'RESTful APIs',
    'Database Design',
    'Server Architecture',
    'Authentication & Security'
    
      ],
      achievements: [
        'Built scalable AI platform for legal assistance',
        'LangChain & Groq integration expert',
        'Specialization in AI & Machine Learning',
        'Legal Technology Research Enthusiast'
      ],
      color: '#60a5fa',
      gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'
    },
    {
      id: 'anurag',
      name: 'Anurag Mishra',
      role: 'Co-Founder & Frontend Innovator',
      tagline: 'Crafting the Experience',
      description: 'Visionary frontend architect and UI/UX designer specializing in React ecosystems and creating intuitive user experiences. Anurag transforms complex legal data into seamless interfaces that make legal technology accessible to everyone.',
      github: 'https://github.com/AnuragMishra88',
      githubUsername: 'AnuragMishra88',
      linkedin: 'https://linkedin.com/in/anuragmishra',
      email: 'anuragmishra5433@gmail.com',
      location: 'Lucknow, India',
      education: 'B.Tech in Information Technology - AKTU (Currently Pursuing)',
      experience: '2+ years',
      expertise: [
        'React.js & Modern JavaScript',
      'UI/UX Design',
        'Generative AI',
      'Responsive Web Design',
      'Frontend Architecture',
      'State Management',
      'Performance Optimization'
      ],
      achievements: [
        'Designed intuitive UX for LegalMitra platform',
        'Data Analytics specialist for legal data',
        'Legal Process Automation Expert',
        'Improved user engagement by 40%'
      ],
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
    }
  ];

  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">About LegalMitra</h1>
            <p className="hero-subtitle">
              Your Trusted Partner in Legal Innovation and Digital Justice Solutions
            </p>
            <div className="hero-decoration">
              <div className="decoration-line"></div>
              <div className="decoration-dot"></div>
              <div className="decoration-line"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Brief Section */}
      <section className="mission-brief">
        <div className="container">
          <div className="brief-content">
            <h2>Democratizing Legal Access Through Technology</h2>
            <p>
              LegalMitra bridges the gap between complex legal systems and everyday users by 
              providing intelligent tools, comprehensive legal databases, and seamless connections 
              between legal professionals and those seeking justice.
            </p>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="founders-section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', width: '100%' }}>
            <h2 style={{ textAlign: 'center', margin: '0 auto', width: '100%' }}>Our Founders</h2>
          </div>
          
          <div className="founders-grid">
            {founders.map((founder) => (
              <div key={founder.id} className="founder-card" style={{ borderTop: `4px solid ${founder.color}` }}>
                <div className="founder-image">
                  <div className="image-placeholder">
                    <img 
                      src={`https://github.com/${founder.githubUsername}.png`}
                      alt={founder.name}
                      className="founder-photo"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <span className="initials" style={{display: 'none'}}>
                      {founder.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="founder-badge" style={{ background: founder.gradient }}>
                    Co-Founder
                  </div>
                </div>
                
                <div className="founder-info">
                  <h3>{founder.name}</h3>
                  <p className="founder-role" style={{ color: founder.color }}>{founder.role}</p>
                  
                  <div className="education-details">
                    <h4>Education</h4>
                    <ul>
                      <li>{founder.education}</li>
                      {founder.id === 'abhishek' && (
                        <>
                          <li>Specialization in AI & Machine Learning</li>
                          <li>Legal Technology Research Enthusiast</li>
                        </>
                      )}
                      {founder.id === 'anurag' && (
                        <>
                          <li>Specialization in Data Analytics</li>
                          <li>Legal Process Automation Expert</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="expertise">
                    <h4>Areas of Expertise</h4>
                    <div className="expertise-tags">
                      {founder.expertise.map((skill, idx) => (
                        <span key={idx} className="tag" style={{ 
                          background: `${founder.color}15`, 
                          color: founder.color,
                          borderColor: `${founder.color}30`
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="founder-description" style={{ color: '#cbd5e1', lineHeight: '1.6', marginTop: '1.5rem' }}>
                    {founder.description}
                  </p>

                  {/* GitHub Profile Link */}
                  <a 
                    href={founder.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="github-profile-link"
                    style={{ 
                      background: `${founder.color}10`,
                      border: `1px solid ${founder.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.8rem 1rem',
                      borderRadius: '8px',
                      marginTop: '1.5rem',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <svg className="github-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: founder.color }}>
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                    <span className="github-username" style={{ color: '#e2e8f0', fontWeight: '500' }}>
                      @{founder.githubUsername}
                    </span>
                    <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginLeft: 'auto', color: founder.color }}>
                      <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width Focus Sections */}
      <section className="focus-sections">
        {/* Our Focus */}
        <div className="focus-block focus-primary">
          <div className="container">
            <div className="focus-content">
              <div className="focus-icon">🎯</div>
              <h2>Our Focus</h2>
              <p>
                To simplify legal access and empower users with reliable, AI-driven legal tools 
                and verified data. We believe that everyone deserves equal access to justice 
                and legal information, regardless of their background or technical expertise.
              </p>
              <div className="focus-features">
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Instant Legal Assistance</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <span>Verified Legal Data</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🌐</span>
                  <span>Accessible to All</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Goal */}
        <div className="focus-block focus-secondary">
          <div className="container">
            <div className="focus-content">
              <div className="focus-icon">🎯</div>
              <h2>Our Goal</h2>
              <p>
                To become India's most trusted legal assistant platform, serving millions of 
                students, legal professionals, and citizens with accurate, timely, and 
                comprehensive legal solutions.
              </p>
              <div className="goal-metrics">
                <div className="metric">
                  <span className="metric-number">10M+</span>
                  <span className="metric-label">Users</span>
                </div>
                <div className="metric">
                  <span className="metric-number">50K+</span>
                  <span className="metric-label">Legal Professionals</span>
                </div>
                <div className="metric">
                  <span className="metric-number">95%</span>
                  <span className="metric-label">Accuracy Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Vision */}
        <div className="focus-block focus-tertiary">
          <div className="container">
            <div className="focus-content">
              <div className="focus-icon">🚀</div>
              <h2>Our Future Vision</h2>
              <p>
                We're building the future of legal technology with ambitious plans to transform 
                how India accesses and interacts with the legal system.
              </p>
              <div className="vision-roadmap">
                <div className="roadmap-item">
                  <h4>Multilingual Support</h4>
                  <p>Expanding access to legal information in all major Indian languages</p>
                </div>
                <div className="roadmap-item">
                  <h4>Expanded Lawyer Network</h4>
                  <p>Growing our verified network to cover every district and high court</p>
                </div>
                <div className="roadmap-item">
                  <h4>Predictive Legal Analytics</h4>
                  <p>Advanced AI models for case outcome predictions and legal strategy</p>
                </div>
                <div className="roadmap-item">
                  <h4>Personalized Dashboards</h4>
                  <p>Custom interfaces for students, lawyers, judges, and general users</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="features-showcase">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', width: '100%' }}>
            <h2 style={{ textAlign: 'center', margin: '0 auto', width: '100%' }}>What Makes LegalMitra Unique</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Bail Prediction</h3>
              <p>Advanced algorithms analyze case patterns to predict bail eligibility based on historical data and judicial trends</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>BNS Rule Descriptions</h3>
              <p>Complete explanations of Bharatiya Nyaya Sanhita sections with practical examples and interpretations</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍💼</div>
              <h3>Lawyer Directory</h3>
              <p>Find verified legal professionals by specialization, location, experience, and availability</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Secure Login System</h3>
              <p>Enterprise-grade security ensuring your legal data remains private and protected</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>User Dashboard</h3>
              <p>Personalized interfaces for lawyers, students, and judges to manage cases and research</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏛</div>
              <h3>Legal Knowledge Hub</h3>
              <p>Access to comprehensive case databases and legal research materials across India</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Join the Legal Revolution</h2>
            <p>Be part of India's growing community of legal innovators and empowered citizens</p>
            <div className="cta-buttons">
              <button className="cta-btn secondary" onClick={openContactForm}>
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Popup */}
      <ContactForm isOpen={isContactFormOpen} onClose={closeContactForm} />
    </div>
  );
};

export default AboutUs;