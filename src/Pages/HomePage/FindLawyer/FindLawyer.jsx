import React, { useState, useEffect } from 'react';
import './FindLawyer.css';
import lawyersData from './lawyers_dataset.json';
import { PRICING } from '../../../config/pricing'; // Adjust path as needed

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
  
  // REQUEST SYSTEM STATE
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [caseSummary, setCaseSummary] = useState('');
  const [caseType, setCaseType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // PAYMENT STATE
  const [hasPaidClient, setHasPaidClient] = useState(() => {
    const savedPaymentStatus = localStorage.getItem('userHasPaidClient');
    return savedPaymentStatus === 'true';
  });
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [showClientPayment, setShowClientPayment] = useState(false);
  const [clientPaymentLoading, setClientPaymentLoading] = useState(false);
  const [clientRequestDataBeforePayment, setClientRequestDataBeforePayment] = useState(null);
  
  // PAGINATION STATE
  const [otherLawyersToShow, setOtherLawyersToShow] = useState(10);

  // Check client payment status on component load
  const checkClientPaymentStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No token found');
        setCheckingPayment(false);
        return;
      }

      console.log('🔍 Checking client payment status from server...');
      const response = await fetch('http://localhost:5000/api/payment/client-payment-status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Client payment status response status:', response.status);
      
      const data = await response.json();
      console.log('💰 Client payment status data:', data);
      
      if (response.ok) {
        setHasPaidClient(data.hasPaid);
        localStorage.setItem('userHasPaidClient', data.hasPaid.toString());
        console.log('✅ Client payment status updated to:', data.hasPaid);
      } else {
        console.error('❌ Failed to check client payment status:', data.error);
        // Fallback to localStorage
        const savedStatus = localStorage.getItem('userHasPaidClient');
        setHasPaidClient(savedStatus === 'true');
      }
    } catch (error) {
      console.error('💥 Error checking client payment status:', error);
      // Fallback to localStorage on error
      const savedStatus = localStorage.getItem('userHasPaidClient');
      setHasPaidClient(savedStatus === 'true');
    } finally {
      setCheckingPayment(false);
    }
  };

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
        setFilteredOtherLawyers(lawyersData.slice(0, 10)); // Show only 10 initially
        
        // Combine for all lawyers view if needed
        setAllLawyers([...transformedTeamLawyers, ...lawyersData]);
      } else {
        console.warn('⚠️ No team lawyers found or API error');
        // Fallback to static data only
        setOtherLawyers(lawyersData);
        setFilteredOtherLawyers(lawyersData.slice(0, 10)); // Show only 10 initially
        setAllLawyers(lawyersData);
      }
    } catch (error) {
      console.error('❌ Error fetching team lawyers:', error);
      // Fallback to static data on error
      setOtherLawyers(lawyersData);
      setFilteredOtherLawyers(lawyersData.slice(0, 10)); // Show only 10 initially
      setAllLawyers(lawyersData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check payment status first
    checkClientPaymentStatus();
    
    // Initial load with static data
    setOtherLawyers(lawyersData);
    setFilteredOtherLawyers(lawyersData.slice(0, 10)); // Show only 10 initially
    setAllLawyers(lawyersData);
    
    // Fetch team lawyers from API
    fetchTeamLawyers();
  }, []);

  // NEW FUNCTION TO LOAD MORE OTHER LAWYERS
  const loadMoreOtherLawyers = () => {
    setOtherLawyersToShow(prev => prev + 10); // Load 10 more lawyers
  };

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
    const filteredTeam = applyFilters(teamLawyers);
    setFilteredTeamLawyers(filteredTeam);
    
    const filteredOther = applyFilters(otherLawyers);
    setFilteredOtherLawyers(filteredOther.slice(0, otherLawyersToShow)); // Apply pagination
    
  }, [selectedState, selectedSpeciality, selectedRating, sortBy, teamLawyers, otherLawyers, otherLawyersToShow]);

  // Reset pagination when filters change
  useEffect(() => {
    setOtherLawyersToShow(10);
  }, [selectedState, selectedSpeciality, selectedRating, sortBy]);

  // PAYMENT FUNCTIONS
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async (amount) => {
    try {
      const token = localStorage.getItem('token');
      console.log('💰 Creating Razorpay order for amount:', amount);
      
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          amount: amount,
          currency: 'INR'
        })
      });

      console.log('📦 Razorpay order response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        return { 
          success: false, 
          error: `Server error: ${response.status} - ${errorText}` 
        };
      }

      const data = await response.json();
      console.log('📦 Razorpay order response data:', data);
      
      if (data.order && data.order.id) {
        return { success: true, order: data.order };
      } else {
        console.error('❌ Invalid order data:', data);
        return { success: false, error: 'Invalid order data from server' };
      }
    } catch (error) {
      console.error('💥 Error creating Razorpay order:', error);
      return { 
        success: false, 
        error: `Network error: ${error.message}` 
      };
    }
  };

  const verifyClientPayment = async (paymentData) => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Verifying client payment...');
      
      const response = await fetch('http://localhost:5000/api/payment/verify-client-payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      console.log('💰 Client payment verification response:', data);

      if (data.success) {
        localStorage.setItem('userHasPaidClient', 'true');
        setHasPaidClient(true);
        console.log('✅ Client payment verified - localStorage updated');
        await checkClientPaymentStatus();
        return data;
      } else {
        return data;
      }
    } catch (error) {
      console.error('💥 Error verifying client payment:', error);
      return { success: false, error: 'Payment verification failed' };
    }
  };

  const initiateClientPayment = async (requestData) => {
    try {
      setClientPaymentLoading(true);
      
      const plan = PRICING.CLIENT.BASIC;
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        return;
      }

      const orderResponse = await createRazorpayOrder(plan.price);
      
      if (!orderResponse.success) {
        console.error('❌ Client order creation failed:', orderResponse.error);
        alert(`Failed to create payment order: ${orderResponse.error}. Please try again.`);
        return;
      }

      const razorpayKey = 'rzp_test_RTOZnKCegnEMZB';
      
      const options = {
        key: razorpayKey,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency || 'INR',
        name: 'LegalMitra Client Services',
        description: plan.description,
        order_id: orderResponse.order.id,
        handler: async function (response) {
          console.log('🎯 Client payment handler called:', response);
          
          const verificationResponse = await verifyClientPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: plan.price
          });

          if (verificationResponse.success) {
            // After successful payment, send the request
            await sendRequestToLawyer(clientRequestDataBeforePayment);
            setShowClientPayment(false);
            setClientRequestDataBeforePayment(null);
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
          contact: localStorage.getItem('userPhone') || ''
        },
        notes: {
          user_id: localStorage.getItem('userId'),
          user_role: 'client',
          payment_type: 'client_access'
        },
        theme: {
          color: '#4CAF50'
        }
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        console.error('❌ Client payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
        setClientPaymentLoading(false);
      });

      rzp.open();
      
    } catch (error) {
      console.error('💥 Error in initiateClientPayment:', error);
      alert('Error initiating payment. Please try again.');
    } finally {
      setClientPaymentLoading(false);
    }
  };

  // UPDATED SEND REQUEST FUNCTION WITH PAYMENT CHECK
  const handleSendRequest = (lawyer) => {
    console.log('🎯 === handleSendRequest FUNCTION CALLED ===');
    console.log('🎯 Lawyer received:', lawyer);
    
    // Check if client has paid
    const hasPaidFromState = hasPaidClient;
    const hasPaidFromStorage = localStorage.getItem('userHasPaidClient') === 'true';
    const hasPaid = hasPaidFromState || hasPaidFromStorage;
    
    console.log('💰 Payment status:', { hasPaidFromState, hasPaidFromStorage, hasPaid });

    if (!hasPaid) {
      console.log('💰 Payment required, showing payment modal');
      // Store request data for after payment
      setClientRequestDataBeforePayment({
        lawyer: lawyer,
        caseSummary: '',
        caseType: ''
      });
      setShowClientPayment(true);
      return;
    }

    // If already paid, open request modal directly
    setSelectedLawyer(lawyer);
    setShowRequestModal(true);
    console.log('✅ Client has paid, opening request modal');
  };

  // FUNCTION TO SEND REQUEST AFTER PAYMENT OR IF ALREADY PAID
  const sendRequestToLawyer = async (requestData) => {
    console.log('🔍 === START sendRequestToLawyer ===');
    
    if (!requestData.caseSummary?.trim()) {
      console.log('❌ Case summary is empty');
      alert('Please provide a case summary');
      return;
    }

    if (!requestData.caseType) {
      console.log('❌ Case type not selected');
      alert('Please select a case type');
      return;
    }

    if (!requestData.lawyer) {
      console.log('❌ No lawyer selected');
      alert('No lawyer selected');
      return;
    }

    console.log('✅ All validations passed');
    console.log('📤 Request data:', {
      lawyerId: requestData.lawyer.id,
      caseSummary: requestData.caseSummary,
      caseType: requestData.caseType,
      selectedLawyerName: requestData.lawyer.name
    });

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token exists:', !!token);
      
      if (!token) {
        alert('Please log in again');
        return;
      }

      const requestPayload = {
        lawyerId: requestData.lawyer.id,
        caseSummary: requestData.caseSummary,
        caseType: requestData.caseType
      };

      console.log('🚀 Sending POST request to /api/requests/send...');
      
      const response = await fetch('http://localhost:5000/api/requests/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server error response:', errorText);
        
        if (response.status === 404) {
          throw new Error('Request endpoint not found (404). Check if server routes are properly set up.');
        } else if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else {
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('📦 API Response data:', data);

      if (data.success) {
        console.log('✅ Request sent successfully!');
        alert(`✅ Request sent successfully to ${requestData.lawyer.name}! They will contact you soon.`);
        setShowRequestModal(false);
        setCaseSummary('');
        setCaseType('');
        setSelectedLawyer(null);
      } else {
        console.error('❌ API returned error:', data.error);
        throw new Error(data.error || 'Failed to send request');
      }
    } catch (error) {
      console.error('💥 Network/Request error:', error);
      alert(`❌ Failed to send request: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      console.log('🔍 === END sendRequestToLawyer ===');
    }
  };

  // UPDATED SUBMIT REQUEST HANDLER
  const handleSubmitRequest = async () => {
    const requestData = {
      lawyer: selectedLawyer,
      caseSummary: caseSummary,
      caseType: caseType
    };
    
    await sendRequestToLawyer(requestData);
  };

  // PAYMENT MODAL COMPONENT
  const renderClientPaymentScreen = () => (
    <div className="payment-overlay">
      <div className="payment-modal-new">
        <div className="container">
          <div className="header">
            <h1>One-Time Client Registration Fee</h1>
            <p>Pay ₹{PRICING.CLIENT.BASIC.price} once to send unlimited case requests to lawyers! No recurring fees.</p>
            
            {clientRequestDataBeforePayment && (
              <div className="payment-required-notice">
                <h5>💰 Payment Required to Send Request</h5>
                <p>You need to complete the one-time payment to send case requests to lawyers.</p>
                <p><strong>After payment, you can send your request to {clientRequestDataBeforePayment.lawyer.name}</strong></p>
              </div>
            )}
          </div>
          
          <div className="card pricing-card client-pricing">
            <h2>{PRICING.CLIENT.BASIC.name}</h2>
            <div className="price-tag">₹{PRICING.CLIENT.BASIC.price}</div>
            <div className="price-period">One-time payment • Lifetime access</div>
            
            <ul className="features">
              {PRICING.CLIENT.BASIC.features.map((feature, index) => (
                <li key={index}><i className="fas fa-check-circle"></i> {feature}</li>
              ))}
            </ul>
          </div>
          
          <div className="card form-card">
            <div className="payment-summary">
              <h3>Payment Summary</h3>
              <div className="payment-row">
                <span>One-time registration fee:</span>
                <span>₹{PRICING.CLIENT.BASIC.price}.00</span>
              </div>
              <div className="payment-row">
                <span>Tax:</span>
                <span>₹0.00</span>
              </div>
              <div className="payment-row total">
                <span>Total Amount:</span>
                <span>₹{PRICING.CLIENT.BASIC.price}.00</span>
              </div>
            </div>
            
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', gap: '8px', fontSize: '14px', lineHeight: '1.4' }}>
                <input type="checkbox" style={{ display: 'inline-block', width: '16px', height: '16px', minWidth: '16px', marginTop: '2px', cursor: 'pointer' }} required />
                <span style={{ flex: 1 }}>
                  I agree to the <a href="#" style={{ color: '#4CAF50', textDecoration: 'none' }}>Terms of Service</a> and <a href="#" style={{ color: '#4CAF50', textDecoration: 'none' }}>Privacy Policy</a>
                </span>
              </label>
            </div>
            
            <button 
              className="btn btn-primary client-pay-btn"
              onClick={() => initiateClientPayment(clientRequestDataBeforePayment)}
              disabled={clientPaymentLoading}
            >
              {clientPaymentLoading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Processing...
                </>
              ) : (
                `Pay Now - ₹${PRICING.CLIENT.BASIC.price}`
              )}
            </button>
          </div>
        </div>

        <button 
          className="close-btn-new"
          onClick={() => {
            setShowClientPayment(false);
            setClientRequestDataBeforePayment(null);
          }}
          disabled={clientPaymentLoading}
        >
          ✕
        </button>
      </div>
    </div>
  );

  const resetFilters = () => {
    setSelectedState('');
    setSelectedSpeciality('');
    setSelectedRating('');
    setSortBy('');
    setOtherLawyersToShow(10); // Reset pagination
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

  // Lawyer Card Component - UPDATED WITH PAYMENT CHECK
  const LawyerCard = ({ lawyer, isTeamLawyer = false, onSendRequest }) => (
    <div key={lawyer.id} className="dark-card">
      <div className="card-glow"></div>
      
      {/* Team Lawyer Badge - Only yellow badge for LegalMitra lawyers */}
      {isTeamLawyer && (
        <div className="team-lawyer-badge">
          <span className="badge-icon">⭐</span>
          LegalMitra Team
        </div>
      )}
      
      {/* Verified Badge - Only show for non-team lawyers */}
      {!isTeamLawyer && (
        <div className="verified-badge">
          <span className="badge-icon">✓</span>
          LegalMitra Verified
        </div>
      )}
      
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

        {/* SEND REQUEST BUTTON - ONLY FOR TEAM LAWYERS */}
        {isTeamLawyer && (
          <div className="action-section">
            <button
              className="send-request-btn"
              onClick={(e) => {
                e.stopPropagation();
                console.log('🟡 === SEND REQUEST BUTTON CLICKED ===');
                console.log('🟡 Lawyer:', lawyer.name);
                if (onSendRequest) {
                  console.log('🟡 Calling onSendRequest...');
                  onSendRequest(lawyer);
                } else {
                  console.log('🟥 onSendRequest is undefined!');
                }
              }}
            >
              📨 Send Request
            </button>
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

      {/* PAYMENT MODAL */}
      {showClientPayment && renderClientPaymentScreen()}

      {/* REQUEST MODAL */}
      {showRequestModal && selectedLawyer && (
        <div className="modal-overlay">
          <div className="request-modal">
            <div className="modal-header">
              <h3>Send Request to {selectedLawyer.name}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowRequestModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Case Type</label>
                <select 
                  value={caseType} 
                  onChange={(e) => setCaseType(e.target.value)}
                  className="case-type-select"
                >
                  <option value="">Select Case Type</option>
                  <option value="Civil">Civil Case</option>
                  <option value="Criminal">Criminal Case</option>
                  <option value="Family">Family Matter</option>
                  <option value="Property">Property Dispute</option>
                  <option value="Corporate">Corporate Legal</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Case Summary *</label>
                <textarea
                  value={caseSummary}
                  onChange={(e) => setCaseSummary(e.target.value)}
                  placeholder="Please describe your legal issue in detail. Include relevant facts, parties involved, and what you're seeking..."
                  rows="6"
                  className="case-summary-textarea"
                />
                <div className="char-count">{caseSummary.length}/500 characters</div>
              </div>
            </div>

            <div className="modal-actions">
          
              <button 
                className="submit-request-btn"
                onClick={handleSubmitRequest}
                disabled={isSubmitting || !caseSummary.trim()}
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading lawyers...</p>
        </div>
      ) : (
        <>
          {/* Section 1: LegalMitra Team Lawyers */}
          <div className="lawyers-section team-lawyers-section">
            <div className="section-header-wrapper">
              <div className="section-header-content">
                <h2>
                  <span className="section-icon">⭐</span>
                  LegalMitra Team Lawyers
                </h2>
                <p>Verified professionals who are officially part of our legal network</p>
                <div className="section-stats">
                  Showing {filteredTeamLawyers.length} of {teamLawyers.length} team lawyers
                </div>
              </div>
            </div>

            {filteredTeamLawyers.length > 0 ? (
              <div className="dark-grid">
                {filteredTeamLawyers.map((lawyer) => (
                  <LawyerCard key={lawyer.id} lawyer={lawyer} isTeamLawyer={true} onSendRequest={handleSendRequest} />
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
            <div className="section-header-wrapper">
              <div className="section-header-content">
                <h2>
                  <span className="section-icon">⚖️</span>
                  Other Verified Lawyers
                </h2>
                <p>Additional legal professionals available for consultation</p>
                <div className="section-stats">
                  Showing {filteredOtherLawyers.length} of {otherLawyers.length} lawyers
                </div>
              </div>
            </div>

            {filteredOtherLawyers.length > 0 ? (
               <>
                <div className="dark-grid">
                  {filteredOtherLawyers.map((lawyer) => (
                    <LawyerCard key={lawyer.id} lawyer={lawyer} isTeamLawyer={false} />
                  ))}
                </div>
                
                {/* Load More Button for Other Lawyers */}
                {filteredOtherLawyers.length < otherLawyers.length && (
                  <div className="load-more-container">
                    <button 
                      className="load-more-btn"
                      onClick={loadMoreOtherLawyers}
                    >
                      Show 10 More Lawyers ({filteredOtherLawyers.length} of {otherLawyers.length} shown)
                    </button>
                  </div>
                )}
              </>
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