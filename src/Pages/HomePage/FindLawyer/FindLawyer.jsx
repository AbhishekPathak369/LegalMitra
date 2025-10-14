import React, { useState, useEffect } from 'react';
import './FindLawyer.css';
import lawyersData from './lawyers_dataset.json';

const FindLawyer = () => {
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    setLawyers(lawyersData);
    setFilteredLawyers(lawyersData);
  }, []);

  const states = [...new Set(lawyers.map(lawyer => lawyer.location))];
  const specialities = [...new Set(lawyers.flatMap(lawyer => lawyer.speciality))];

  useEffect(() => {
    let filtered = lawyers;
    if (selectedState) filtered = filtered.filter(lawyer => lawyer.location === selectedState);
    if (selectedSpeciality) filtered = filtered.filter(lawyer => lawyer.speciality.includes(selectedSpeciality));
    if (selectedRating) filtered = filtered.filter(lawyer => Math.floor(lawyer.rating) >= parseInt(selectedRating));
    
    // Apply sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'experience-high':
            return b.experience - a.experience;
          case 'experience-low':
            return a.experience - b.experience;
          case 'rating-high':
            return b.rating - a.rating;
          case 'rating-low':
            return a.rating - b.rating;
          default:
            return 0;
        }
      });
    }
    
    setFilteredLawyers(filtered);
  }, [selectedState, selectedSpeciality, selectedRating, sortBy, lawyers]);

  const resetFilters = () => {
    setSelectedState('');
    setSelectedSpeciality('');
    setSelectedRating('');
    setSortBy('');
  };

  const renderStars = (rating) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={`star ${star <= rating ? 'filled' : ''}`}>
            ★
          </span>
        ))}
        <span className="rating-text">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="find-lawyer-dark">
      <div className="dark-header">
        <div className="header-content">
          <h1>Find Your Legal Expert</h1>
          <p>Connect with verified legal professionals across India</p>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-number">1237+</span>
              <span className="stat-label">Verified Lawyers</span>
            </div>
            <div className="stat">
              <span className="stat-number">{specialities.length}+</span>
              <span className="stat-label">Legal Specialities</span>
            </div>
            <div className="stat">
              <span className="stat-number">{states.length}+</span>
              <span className="stat-label">Cities Covered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dark-filter-section">
        <div className="filter-container">
          <div className="filter-row">
            <div className="filter-group">
              <label>📍 Location</label>
              <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                <option value="">All Locations</option>
                {states.map(state => <option key={state} value={state}>{state}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label>⚖️ Speciality</label>
              <select value={selectedSpeciality} onChange={(e) => setSelectedSpeciality(e.target.value)}>
                <option value="">All Specialities</option>
                {specialities.map(spec => <option key={spec} value={spec}>{spec}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label>⭐ Rating</label>
              <select value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)}>
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>

            <div className="filter-group">
              <label>📊 Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Default</option>
                <option value="experience-high">Experience (High to Low)</option>
                <option value="experience-low">Experience (Low to High)</option>
                <option value="rating-high">Rating (High to Low)</option>
                <option value="rating-low">Rating (Low to High)</option>
              </select>
            </div>
          </div>

          <div className="action-row">
            <button className="reset-btn" onClick={resetFilters}>
              Reset All Filters
            </button>
            <div className="results-count">
              <span className="count-badge">{filteredLawyers.length}</span>
              lawyers found
            </div>
          </div>
        </div>
      </div>

      <div className="dark-grid">
        {filteredLawyers.map((lawyer) => (
          <div key={lawyer.id} className="dark-card">
            <div className="card-glow"></div>
            <div className="verified-badge">
              <span className="badge-icon">✓</span>
              LegalMitra Verified
            </div>
            
            <div className="card-header">
              <div className="avatar-container">
                <div className="avatar">
                  {lawyer.gender === 'F' ? (
                    <div className="female-avatar">
                      <span className="gender-icon">♀</span>
                    </div>
                  ) : (
                    <div className="male-avatar">
                      <span className="gender-icon">♂</span>
                    </div>
                  )}
                  <div className="experience-tag">{lawyer.experience}+ years</div>
                </div>
              </div>
              
              <div className="lawyer-main-info">
                <h3 className="lawyer-name">{lawyer.name}</h3>
                <div className="location-info">
                  <span className="location-icon">📍</span>
                  {lawyer.location}
                </div>
                {renderStars(lawyer.rating)}
              </div>
            </div>

            <div className="card-body">
              <div className="expertise-section">
                <h4>Areas of Expertise</h4>
                <div className="expertise-tags">
                  {lawyer.speciality.map(spec => (
                    <span key={spec} className="expertise-tag">{spec}</span>
                  ))}
                </div>
              </div>

              <div className="details-section">
                <div className="detail-item">
                  <span className="detail-label">Jurisdiction:</span>
                  <span className="detail-value">{lawyer.jurisdiction}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Client Type:</span>
                  <span className="detail-value">{lawyer.clientType}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Avg Case Duration:</span>
                  <span className="detail-value">{lawyer.avgDaysOfCompletion} days</span>
                </div>
              </div>

              <div className="languages-section">
                <h4>Languages</h4>
                <div className="language-tags">
                  {lawyer.languages.map(lang => (
                    <span key={lang} className="language-tag">{lang}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLawyers.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No lawyers found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default FindLawyer;