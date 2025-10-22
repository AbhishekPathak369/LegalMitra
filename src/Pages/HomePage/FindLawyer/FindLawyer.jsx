import React, { useState, useEffect } from 'react';
import './FindLawyer.css';
import lawyersData from './lawyers_dataset.json';

const FindLawyer = () => {
  const [allLawyers, setAllLawyers] = useState([]);
  const [teamLawyers, setTeamLawyers] = useState([]);
  const [otherLawyers, setOtherLawyers] = useState([]);
  const [filteredTeamLawyers, setFilteredTeamLawyers] = useState([]);
  const [filteredOtherLawyers, setFilteredOtherLawyers] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch team lawyers from backend
  const fetchTeamLawyers = async () => {
    try {
      console.log('🔄 Fetching team lawyers from API...');
      
      const response = await fetch('http://localhost:5000/api/lawyer/team-lawyers');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Team lawyers API response:', data);
      
      if (data.success && data.lawyers) {
        // Transform backend data to match frontend structure
        const transformedTeamLawyers = data.lawyers.map(lawyer => ({
          id: lawyer._id,
          name: lawyer.name,
          location: lawyer.address || 'Location not specified',
          speciality: lawyer.specialization ? [lawyer.specialization] : ['General Practice'],
          rating: 4.5, // Default high rating for team lawyers
          experience: lawyer.experience || 1,
          gender: 'M', // Default gender
          jurisdiction: 'Multiple Courts',
          clientType: 'Individual & Corporate',
          avgDaysOfCompletion: 45,
          languages: ['English', 'Hindi'],
          isTeamLawyer: true, // Flag to identify team lawyers
          barCouncilNumber: lawyer.barCouncilNumber || 'Not specified',
          joinDate: lawyer.teamJoinDate,
          email: lawyer.email,
          phone: lawyer.phone
        }));

        console.log(`✅ Transformed ${transformedTeamLawyers.length} team lawyers`);
        setTeamLawyers(transformedTeamLawyers);
        setFilteredTeamLawyers(transformedTeamLawyers);
        
        // Set other lawyers as static data
        setOtherLawyers(lawyersData);
        setFilteredOtherLawyers(lawyersData);
        
        // Combine for all lawyers view if needed
        setAllLawyers([...transformedTeamLawyers, ...lawyersData]);
      } else {
        console.warn('⚠️ No team lawyers found or API error');
        // Fallback to static data only
        setOtherLawyers(lawyersData);
        setFilteredOtherLawyers(lawyersData);
        setAllLawyers(lawyersData);
      }
    } catch (error) {
      console.error('❌ Error fetching team lawyers:', error);
      // Fallback to static data on error
      setOtherLawyers(lawyersData);
      setFilteredOtherLawyers(lawyersData);
      setAllLawyers(lawyersData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load with static data
    setOtherLawyers(lawyersData);
    setFilteredOtherLawyers(lawyersData);
    setAllLawyers(lawyersData);
    
    // Fetch team lawyers from API
    fetchTeamLawyers();
  }, []);

  // Apply filters to both sections
  useEffect(() => {
    const applyFilters = (lawyers) => {
      let filtered = [...lawyers];
      
      // Apply location filter
      if (selectedState) {
        filtered = filtered.filter(lawyer => 
          lawyer.location.toLowerCase().includes(selectedState.toLowerCase())
        );
      }
      
      // Apply speciality filter
      if (selectedSpeciality) {
        filtered = filtered.filter(lawyer => 
          lawyer.speciality.some(spec => 
            spec.toLowerCase().includes(selectedSpeciality.toLowerCase())
          )
        );
      }
      
      // Apply rating filter
      if (selectedRating) {
        filtered = filtered.filter(lawyer => 
          Math.floor(lawyer.rating) >= parseInt(selectedRating)
        );
      }
      
      // Apply sorting
      if (sortBy) {
        filtered = filtered.sort((a, b) => {
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
      } else {
        // Default sorting by rating
        filtered = filtered.sort((a, b) => b.rating - a.rating);
      }
      
      return filtered;
    };

    // Apply filters to both sections
    setFilteredTeamLawyers(applyFilters(teamLawyers));
    setFilteredOtherLawyers(applyFilters(otherLawyers));
    
  }, [selectedState, selectedSpeciality, selectedRating, sortBy, teamLawyers, otherLawyers]);

  const resetFilters = () => {
    setSelectedState('');
    setSelectedSpeciality('');
    setSelectedRating('');
    setSortBy('');
  };

  const states = [...new Set(allLawyers.map(lawyer => lawyer.location))];
  const specialities = [...new Set(allLawyers.flatMap(lawyer => lawyer.speciality))];

  const renderStars = (rating) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
        <span className="rating-text">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // Lawyer Card Component
  const LawyerCard = ({ lawyer, isTeamLawyer = false }) => (
    <div key={lawyer.id} className="dark-card">
      <div className="card-glow"></div>
      
      {/* Team Lawyer Badge */}
      {isTeamLawyer && (
        <div className="team-lawyer-badge">
          <span className="badge-icon">⭐</span>
          LegalMitra Team
        </div>
      )}
      
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
          
          {/* Team lawyer join info */}
          {isTeamLawyer && lawyer.joinDate && (
            <div className="team-join-info">
              <span className="team-icon">🤝</span>
              Team member since {new Date(lawyer.joinDate).toLocaleDateString()}
            </div>
          )}
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
          
          {/* Bar Council Number for team lawyers */}
          {isTeamLawyer && lawyer.barCouncilNumber && (
            <div className="detail-item">
              <span className="detail-label">Bar Council:</span>
              <span className="detail-value">{lawyer.barCouncilNumber}</span>
            </div>
          )}
        </div>

        <div className="languages-section">
          <h4>Languages</h4>
          <div className="language-tags">
            {lawyer.languages.map(lang => (
              <span key={lang} className="language-tag">{lang}</span>
            ))}
          </div>
        </div>

        {/* Contact info for team lawyers */}
        {isTeamLawyer && (
          <div className="contact-section">
            <h4>Contact Information</h4>
            <div className="contact-info">
              {lawyer.email && (
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <span className="contact-value">{lawyer.email}</span>
                </div>
              )}
              {lawyer.phone && (
                <div className="contact-item">
                  <span className="contact-label">Phone:</span>
                  <span className="contact-value">{lawyer.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="find-lawyer-dark">
      <div className="dark-header">
        <div className="header-content">
          <h1>Find Your Legal Expert</h1>
          <p>Connect with verified legal professionals across India</p>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-number">{teamLawyers.length + otherLawyers.length}+</span>
              <span className="stat-label">Total Lawyers</span>
            </div>
            <div className="stat">
              <span className="stat-number">{specialities.length}+</span>
              <span className="stat-label">Legal Specialities</span>
            </div>
            <div className="stat">
              <span className="stat-number">{states.length}+</span>
              <span className="stat-label">Cities Covered</span>
            </div>
            <div className="stat">
              <span className="stat-number">{teamLawyers.length}</span>
              <span className="stat-label">Team Lawyers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Filter Section */}
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
              <label>⚖ Speciality</label>
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
                <option value="">Rating (High to Low)</option>
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
              <span className="count-badge">{filteredTeamLawyers.length + filteredOtherLawyers.length}</span>
              lawyers found
              <span className="team-count"> ({filteredTeamLawyers.length} team, {filteredOtherLawyers.length} other)</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading lawyers...</p>
        </div>
      ) : (
        <>
          {/* Section 1: LegalMitra Team Lawyers */}
          <div className="lawyers-section team-lawyers-section">
            <div className="section-header">
              <h2>
                <span className="section-icon">⭐</span>
                LegalMitra Team Lawyers
              </h2>
              <p>Verified professionals who are officially part of our legal network</p>
              <div className="section-stats">
                Showing {filteredTeamLawyers.length} of {teamLawyers.length} team lawyers
              </div>
            </div>

            {filteredTeamLawyers.length > 0 ? (
              <div className="dark-grid">
                {filteredTeamLawyers.map((lawyer) => (
                  <LawyerCard key={lawyer.id} lawyer={lawyer} isTeamLawyer={true} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">👥</div>
                <h3>No team lawyers found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            )}
          </div>

          {/* Section 2: Other Verified Lawyers */}
          <div className="lawyers-section other-lawyers-section">
            <div className="section-header">
              <h2>
                <span className="section-icon">⚖️</span>
                Other Verified Lawyers
              </h2>
              <p>Additional legal professionals available for consultation</p>
              <div className="section-stats">
                Showing {filteredOtherLawyers.length} of {otherLawyers.length} lawyers
              </div>
            </div>

            {filteredOtherLawyers.length > 0 ? (
              <div className="dark-grid">
                {filteredOtherLawyers.map((lawyer) => (
                  <LawyerCard key={lawyer.id} lawyer={lawyer} isTeamLawyer={false} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No lawyers found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FindLawyer;