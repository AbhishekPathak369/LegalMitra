import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './MyCollection.css';
import userAvatar from '../../../assets/default-avatar.png';

const MyCollection = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [expandedCase, setExpandedCase] = useState(null);
  const [caseNotes, setCaseNotes] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasPaid, setHasPaid] = useState(() => {
    // Check localStorage first for payment status
    const savedPaymentStatus = localStorage.getItem('userHasPaid');
    return savedPaymentStatus === 'true';
  });
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [showSolvedCases, setShowSolvedCases] = useState(false);
  const [showClientCaseForm, setShowClientCaseForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [caseDataBeforePayment, setCaseDataBeforePayment] = useState(null);
  const [lawyerCases, setLawyerCases] = useState([]);
  const [clientCases, setClientCases] = useState([]);
const [showProfileCard, setShowProfileCard] = useState(false);
// In your existing state declarations, add these:
const [callLogs, setCallLogs] = useState({});
const [showCallModal, setShowCallModal] = useState(false);
const [selectedCaseForCall, setSelectedCaseForCall] = useState(null);
  const [newClientCase, setNewClientCase] = useState({
    caseName: '',
    caseType: '',
    caseNumber: '',
    courtName: '',
    filingDate: '',
    nextHearing: '',
    caseDescription: '',
    lawyerName: '',
    lawyerEmail: '',
    lawyerPhone: '',
    status: 'ongoing'
  });

  const [newCase, setNewCase] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    caseName: '',
    caseType: '',
    caseNumber: '',
    courtName: '',
    filingDate: '',
    nextHearing: '',
    caseValue: '',
    opponentName: '',
    opponentLawyer: '',
    description: '',
    priority: 'medium',
    status: 'ongoing'
  });

  // Check payment status for lawyers - FIXED VERSION
  useEffect(() => {
    const initializeData = async () => {
      if (user) {
        console.log('🔄 Initializing data for user:', user.role);
        
        if (user.role === 'lawyer') {
          await checkPaymentStatus();
          await fetchLawyerCases(); // CALL BOTH FUNCTIONS
        } else if (user.role === 'client') {
          await fetchClientCases();
          setCheckingPayment(false);
        }
      }
    };

    initializeData();
  }, [user]); // Only depend on user


  const checkPaymentStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No token found');
      setCheckingPayment(false);
      return;
    }

    console.log('🔍 Checking payment status from server...');
    const response = await fetch('http://localhost:5000/api/payment/payment-status', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Payment status response status:', response.status);
    
    const data = await response.json();
    console.log('💰 Payment status data:', data);
    
    if (response.ok) {
      // ✅ SYNC localStorage with server state
      setHasPaid(data.hasPaid);
      localStorage.setItem('userHasPaid', data.hasPaid.toString());
      console.log('✅ Payment status updated to:', data.hasPaid, '(localStorage synced)');
    } else {
      console.error('❌ Failed to check payment status:', data.error);
      setHasPaid(false);
      localStorage.setItem('userHasPaid', 'false'); // ✅ Sync on error too
    }
  } catch (error) {
    console.error('💥 Error checking payment status:', error);
    setHasPaid(false);
    localStorage.setItem('userHasPaid', 'false'); // ✅ Sync on error too
  } finally {
    setCheckingPayment(false);
  }
};
  const fetchLawyerCases = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('🔍 Fetching lawyer cases...');
      const response = await fetch('http://localhost:5000/api/cases/my-cases', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('📦 Lawyer cases response:', data);

      if (response.ok) {
        setLawyerCases(data.cases || []);
        console.log('✅ Lawyer cases loaded:', data.cases?.length || 0);
      } else {
        console.error('❌ Failed to fetch cases:', data.error);
        setLawyerCases([]);
      }
    } catch (error) {
      console.error('💥 Error fetching cases:', error);
      setLawyerCases([]);
    } finally {
      setIsLoading(false);
    }
  };
// Call client directly
const callClient = (caseItem) => {
  const phoneNumber = caseItem.clientPhone;
  
  if (!phoneNumber) {
    alert('❌ No phone number available for this client');
    return;
  }

  // Format phone number
  const formattedNumber = phoneNumber.replace(/\D/g, '');
  
  // Create call log
  const callLog = {
    caseId: caseItem._id,
    clientName: caseItem.clientName,
    phoneNumber: formattedNumber,
    timestamp: new Date().toISOString(),
    type: 'outgoing'
  };

  // Save call log
  saveCallLog(callLog);
  
  // Open phone app
  window.open(`tel:${formattedNumber}`, '_self');
};

// Open call options modal
const openCallOptions = (caseItem) => {
  setSelectedCaseForCall(caseItem);
  setShowCallModal(true);
};

// Send SMS to client
const sendSMS = (caseItem) => {
  const phoneNumber = caseItem.clientPhone;
  
  if (!phoneNumber) {
    alert('❌ No phone number available for this client');
    return;
  }

  const formattedNumber = phoneNumber.replace(/\D/g, '');
  const message = `Hello ${caseItem.clientName}, this is ${user?.name} from LegalMitra regarding your case: ${caseItem.caseName}.`;
  
  // Create call log for SMS
  const callLog = {
    caseId: caseItem._id,
    clientName: caseItem.clientName,
    phoneNumber: formattedNumber,
    timestamp: new Date().toISOString(),
    type: 'sms'
  };

  // Save call log
  saveCallLog(callLog);
  
  // Open SMS app
  window.open(`sms:${formattedNumber}?body=${encodeURIComponent(message)}`, '_self');
};

// Save call log to localStorage
const saveCallLog = (callLog) => {
  const existingLogs = JSON.parse(localStorage.getItem('callLogs') || '{}');
  const caseLogs = existingLogs[callLog.caseId] || [];
  
  const updatedLogs = {
    ...existingLogs,
    [callLog.caseId]: [...caseLogs, callLog]
  };
  
  localStorage.setItem('callLogs', JSON.stringify(updatedLogs));
  setCallLogs(updatedLogs);
};

// Get call logs for a case
const getCallLogs = (caseId) => {
  const allLogs = JSON.parse(localStorage.getItem('callLogs') || '{}');
  return allLogs[caseId] || [];
};

   const fetchClientCases = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('🔍 Fetching client cases...');
      const response = await fetch('http://localhost:5000/api/cases/my-cases', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('📦 Client cases response:', data);

      if (response.ok) {
        setClientCases(data.cases || []);
        console.log('✅ Client cases loaded:', data.cases?.length || 0);
      } else {
        console.error('❌ Failed to fetch cases:', data.error);
        setClientCases([]);
      }
    } catch (error) {
      console.error('💥 Error fetching cases:', error);
      setClientCases([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Payment Functions - UPDATED with better status handling
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  const downloadProfileAsPNG = async () => {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const cardElement = document.getElementById('lawyerProfileCard');
    
    if (cardElement) {
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = `${user?.name || 'lawyer'}-profile-card.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      alert('✅ Profile card downloaded as PNG!');
    }
  } catch (error) {
    console.error('Error downloading PNG:', error);
    alert('❌ Failed to download PNG. Please try again.');
  }
};

const downloadProfileAsPDF = async () => {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    
    const cardElement = document.getElementById('lawyerProfileCard');
    
    if (cardElement) {
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${user?.name || 'lawyer'}-profile-card.pdf`);
      alert('✅ Profile card downloaded as PDF!');
    }
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('❌ Failed to download PDF. Please try again.');
  }
};
const renderCallModal = () => {
  if (!selectedCaseForCall) return null;

  return (
    <div className="call-modal-overlay">
      <div className="call-modal">
        <div className="call-modal-header">
          <h3>Contact Client</h3>
          <button 
            className="close-btn"
            onClick={() => setShowCallModal(false)}
          >
            ✕
          </button>
        </div>

        <div className="call-client-info">
          <div className="client-avatar">
            {selectedCaseForCall.clientName?.charAt(0) || 'C'}
          </div>
          <div className="client-details">
            <h4>{selectedCaseForCall.clientName}</h4>
            <p className="client-case">{selectedCaseForCall.caseName}</p>
            <p className="client-phone">
              📞 {selectedCaseForCall.clientPhone || 'No phone number'}
            </p>
          </div>
        </div>

        <div className="call-options">
          <button 
            className="call-option-btn call"
            onClick={() => {
              callClient(selectedCaseForCall);
              setShowCallModal(false);
            }}
            disabled={!selectedCaseForCall.clientPhone}
          >
            <span className="call-icon">📞</span>
            <span>Call Now</span>
          </button>

          <button 
            className="call-option-btn sms"
            onClick={() => {
              sendSMS(selectedCaseForCall);
              setShowCallModal(false);
            }}
            disabled={!selectedCaseForCall.clientPhone}
          >
            <span className="call-icon">💬</span>
            <span>Send SMS</span>
          </button>
        </div>

        {/* Call History */}
        <div className="call-history">
          <h4>Recent Communications</h4>
          {getCallLogs(selectedCaseForCall._id).length > 0 ? (
            <div className="call-log-list">
              {getCallLogs(selectedCaseForCall._id)
                .slice(-3)
                .reverse()
                .map((log, index) => (
                <div key={index} className="call-log-item">
                  <span className={`log-type ${log.type}`}>
                    {log.type === 'outgoing' ? '📞' : '💬'}
                  </span>
                  <span className="log-time">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                  <span className="log-duration">{log.type}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-calls">No recent communications</p>
          )}
        </div>
      </div>
    </div>
  );
};



const copyProfileShareableLink = async () => {
  try {
    const profileText = `
👨‍⚖️ ${user?.name || 'Lawyer Name'}
📊 ${roleData.stats.total} Total Cases | ${roleData.stats.solved} Solved | ${Math.round((roleData.stats.solved / roleData.stats.total) * 100) || 0}% Success Rate
⚖️ Specialized in Criminal, Family & Corporate Law
📧 ${user?.email || 'Contact for details'}

Generated via LegalMitra Case Management System
    `.trim();

    await navigator.clipboard.writeText(profileText);
    alert('✅ Profile information copied to clipboard! Share this with your clients.');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    const textArea = document.createElement('textarea');
    textArea.value = `Lawyer: ${user?.name}\nCases: ${roleData.stats.total}\nSuccess Rate: ${Math.round((roleData.stats.solved / roleData.stats.total) * 100) || 0}%\nContact: ${user?.email}`;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('✅ Profile information copied to clipboard!');
  }
};
  const renderProfileCardModal = () => (
  <div className="profile-card-overlay">
    <div className="profile-card-modal">
      <div className="profile-card-header">
        <h3>Your Professional Profile Card</h3>
        <button 
          className="close-btn"
          onClick={() => setShowProfileCard(false)}
        >
          ✕
        </button>
      </div>
      
      <div className="profile-card-content">
        {/* Profile Card Preview */}
        <div className="lawyer-profile-card" id="lawyerProfileCard">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.name?.charAt(0) || 'L'}
            </div>
            <div className="profile-info">
              <h2>{user?.name || 'Lawyer Name'}</h2>
              <p className="profile-title">Senior Legal Counsel</p>
              <div className="rating">
                <span className="stars">⭐⭐⭐⭐⭐</span>
                <span className="rating-text">4.8 (120 reviews)</span>
              </div>
            </div>
          </div>

          <div className="profile-stats">
            <h4>📊 Case Statistics</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{roleData.stats.total}</span>
                <span className="stat-label">Total Cases</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{roleData.stats.solved}</span>
                <span className="stat-label">Solved</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{roleData.stats.ongoing}</span>
                <span className="stat-label">Ongoing</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {roleData.stats.total > 0 
                    ? Math.round((roleData.stats.solved / roleData.stats.total) * 100) 
                    : 0}%
                </span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>

          <div className="specializations">
            <h4>⚖️ Specializations</h4>
            <div className="specialization-list">
              <div className="specialization-item">
                <span>Criminal Law</span>
                <span className="stars">⭐⭐⭐⭐⭐</span>
              </div>
              <div className="specialization-item">
                <span>Family Law</span>
                <span className="stars">⭐⭐⭐⭐☆</span>
              </div>
              <div className="specialization-item">
                <span>Corporate Law</span>
                <span className="stars">⭐⭐⭐⭐☆</span>
              </div>
            </div>
          </div>

          <div className="contact-info">
            <h4>📞 Contact</h4>
            <div className="contact-item" style={{backgroundColor:'rgba(100, 116, 139, 0.1)'}}>
              <span className="contact-icon">📧</span>
              <span>{user?.email || 'email@example.com'}</span>
            </div>
            <div className="contact-item" style={{backgroundColor:'rgba(100, 116, 139, 0.1)'}}>
              <span className="contact-icon">📱</span>
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="contact-item" style={{backgroundColor:'rgba(100, 116, 139, 0.1)'}} >
              <span className="contact-icon">🏢</span>
              <span>Supreme Court Bar Member</span>
            </div>
          </div>

          <div className="profile-footer">
            <div className="qr-code">
              <div className="qr-placeholder">QR Code</div>
              <span>Scan to contact</span>
            </div>
            <div className="signature">
              <div className="signature-line"></div>
              <span>Digital Signature</span>
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="download-options">
  <button className="download-btn primary" onClick={downloadProfileAsPNG}>
    <span className="btn-icon">📥</span>
    Download as PNG
  </button>
  <button className="download-btn secondary" onClick={downloadProfileAsPDF}>
    <span className="btn-icon">📄</span>
    Download as PDF
  </button>
  <button className="download-btn tertiary" onClick={copyProfileShareableLink}>
    <span className="btn-icon">🔗</span>
    Copy Shareable Link
  </button>
</div>

        <div className="profile-card-note">
          <p>💡 <strong>Pro Tip:</strong> Share this card with potential clients to showcase your expertise and build trust!</p>
        </div>
      </div>
    </div>
  </div>
);
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
        amount: amount, // Razorpay expects amount in paise (₹999 * 100 = 99900)
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
   const verifyPayment = async (paymentData) => {
  try {
    const token = localStorage.getItem('token');
    console.log('🔍 Verifying payment...');
    
    const response = await fetch('http://localhost:5000/api/payment/verify-payment', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    const data = await response.json();
    console.log('💰 Payment verification response:', data);

    if (data.success) {
      // ✅ IMMEDIATELY update localStorage and state
      setHasPaid(true);
      localStorage.setItem('userHasPaid', 'true');
      console.log('✅ Payment verified - localStorage updated');
      
      // Also re-check from server for final confirmation
      await checkPaymentStatus();
      return data;
    } else {
      return data;
    }
  } catch (error) {
    console.error('💥 Error verifying payment:', error);
    return { success: false, error: 'Payment verification failed' };
  }
};
const initiatePayment = async (caseData) => {
  try {
    setPaymentLoading(true);
    
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    // Create Razorpay order
    const orderResponse = await createRazorpayOrder(999);
    
    if (!orderResponse.success) {
      console.error('❌ Order creation failed:', orderResponse.error);
      alert(`Failed to create payment order: ${orderResponse.error}. Please try again.`);
      return;
    }

    const razorpayKey = 'rzp_test_RTOZnKCegnEMZB'; // Your test key
    
    const options = {
      key: razorpayKey,
      amount: orderResponse.order.amount,
      currency: orderResponse.order.currency || 'INR',
      name: 'LegalMitra Case Management',
      description: 'One-Time Case Registration Fee',
      order_id: orderResponse.order.id,
      handler: async function (response) {
        console.log('🎯 Payment handler called:', response);
        
        const verificationResponse = await verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        });

        if (verificationResponse.success) {
          // Payment verified and status updated in MongoDB
          await submitCaseAfterPayment(caseData, verificationResponse.paymentId, response.razorpay_order_id);
        } else {
          alert('Payment verification failed. Please contact support.');
        }
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || ''
      },
      notes: {
        case_name: caseData.caseName,
        user_id: user?._id
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response) {
      console.error('❌ Payment failed:', response.error);
      alert(`Payment failed: ${response.error.description}`);
      setPaymentLoading(false);
    });

    rzp.open();
    
  } catch (error) {
    console.error('💥 Error in initiatePayment:', error);
    alert('Error initiating payment. Please try again.');
  } finally {
    setPaymentLoading(false);
  }
};
  const submitCaseAfterPayment = async (caseData, paymentId, razorpayOrderId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const caseSubmissionData = {
        caseData: {
          clientName: caseData.clientName,
          clientEmail: caseData.clientEmail,
          clientPhone: caseData.clientPhone,
          clientAddress: caseData.clientAddress,
          caseName: caseData.caseName,
          caseType: caseData.caseType,
          caseNumber: caseData.caseNumber,
          courtName: caseData.courtName,
          filingDate: caseData.filingDate,
          nextHearing: caseData.nextHearing,
          caseValue: caseData.caseValue,
          opponentName: caseData.opponentName,
          opponentLawyer: caseData.opponentLawyer,
          description: caseData.description,
          priority: caseData.priority,
          status: caseData.status
        },
        paymentId: paymentId,
        razorpayOrderId: razorpayOrderId
      };

      const response = await fetch('http://localhost:5000/api/cases/create-after-payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(caseSubmissionData)
      });

      const data = await response.json();

      if (response.ok) {
        setLawyerCases(prev => [data.case, ...prev]);
        setNewCase({
          clientName: '', clientEmail: '', clientPhone: '', clientAddress: '',
          caseName: '', caseType: '', caseNumber: '', courtName: '',
          filingDate: '', nextHearing: '', caseValue: '',
          opponentName: '', opponentLawyer: '', description: '',
          priority: 'medium', status: 'ongoing'
        });
        setShowForm(false);
        setShowPayment(false);
        setCaseDataBeforePayment(null);
        alert('✅ Case created successfully! Payment verified.');
      } else {
        alert('Failed to create case after payment: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error creating case after payment.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitCaseDirectly = async (caseData) => {
  try {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    
    console.log('📤 Submitting case directly...');
    const response = await fetch('http://localhost:5000/api/cases/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(caseData)
    });

    const data = await response.json();
    console.log('📄 Direct case submission response:', data);

    if (response.ok) {
      setLawyerCases(prev => [data.case, ...prev]);
      setNewCase({
        clientName: '', clientEmail: '', clientPhone: '', clientAddress: '',
        caseName: '', caseType: '', caseNumber: '', courtName: '',
        filingDate: '', nextHearing: '', caseValue: '',
        opponentName: '', opponentLawyer: '', description: '',
        priority: 'medium', status: 'ongoing'
      });
      setShowForm(false);
      alert('Case created successfully!');
    } else {
      // If payment required error, show payment screen
      if (response.status === 402) {
        console.log('💰 Payment required, showing payment screen');
        alert('Payment required. Please complete the one-time payment.');
        setCaseDataBeforePayment(caseData);
        setShowPayment(true);
        // ✅ Sync localStorage to reflect payment requirement
        setHasPaid(false);
        localStorage.setItem('userHasPaid', 'false');
      } else {
        alert('Failed to create case: ' + (data.error || 'Unknown error'));
      }
    }
  } catch (error) {
    console.error('💥 Error creating case:', error);
    alert('Error creating case. Please check if server is running.');
  } finally {
    setIsLoading(false);
  }
};


  const handleSubmitClientCase = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/cases/client/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newClientCase)
      });

      const data = await response.json();

      if (response.ok) {
        setClientCases(prev => [data.case, ...prev]);
        setNewClientCase({
          caseName: '', caseType: '', caseNumber: '', courtName: '',
          filingDate: '', nextHearing: '', caseDescription: '',
          lawyerName: '', lawyerEmail: '', lawyerPhone: '', status: 'ongoing'
        });
        setShowClientCaseForm(false);
        alert('Case added successfully!');
      } else {
        alert('Failed to add case: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding case:', error);
      alert('Error adding case. Please check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCase(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleClientCaseInputChange = (e) => {
    const { name, value } = e.target;
    setNewClientCase(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmitCase = async (e) => {
    e.preventDefault();
    
    if (user?.role === 'lawyer' && !hasPaid) {
      setCaseDataBeforePayment({ ...newCase });
      setShowPayment(true);
    } else {
      await submitCaseDirectly(newCase);
    }
  };

  const toggleCaseExpand = (caseId) => {
    setExpandedCase(expandedCase === caseId ? null : caseId);
  };

  const handleNoteChange = async (caseId, notes) => {
    setCaseNotes(prev => ({ ...prev, [caseId]: notes }));

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/cases/${caseId}/notes`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes })
      });
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const updateCaseStatus = async (caseId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cases/${caseId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (response.ok) {
        setLawyerCases(prev => prev.map(caseItem => 
          caseItem._id === caseId 
            ? { ...caseItem, status: newStatus }
            : caseItem
        ));
      }
    } catch (error) {
      console.error('Error updating case status:', error);
    }
  };

  const updateClientCaseStatus = async (caseId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/cases/${caseId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (response.ok) {
        setClientCases(prev => prev.map(caseItem => 
          caseItem._id === caseId 
            ? { ...caseItem, status: newStatus }
            : caseItem
        ));
      }
    } catch (error) {
      console.error('Error updating case status:', error);
    }
  };

  // Role-based data
  const getRoleData = () => {
    switch(user?.role) {
      case 'lawyer':
        const ongoing = lawyerCases.filter(c => c.status === 'ongoing').length;
        const solved = lawyerCases.filter(c => c.status === 'solved').length;
        const highPriority = lawyerCases.filter(c => c.priority === 'high').length;
        const totalValue = lawyerCases.reduce((sum, c) => {
          const value = parseInt(c.caseValue?.replace(/[^0-9]/g, '')) || 0;
          return sum + value;
        }, 0);
        
        return {
          cases: lawyerCases,
          stats: { ongoing, solved, highPriority, total: lawyerCases.length, totalValue },
          title: 'Lawyer Dashboard',
          showAddCase: true,
          welcomeMessage: `Welcome back, ${user?.name}!`,
          type: 'lawyer'
        };

      case 'client':
        const clientOngoing = clientCases.filter(c => c.status === 'ongoing').length;
        const clientSolved = clientCases.filter(c => c.status === 'solved').length;
        
        return {
          cases: clientCases,
          stats: { ongoing: clientOngoing, solved: clientSolved, total: clientCases.length },
          title: 'My Legal Cases',
          showAddCase: true,
          welcomeMessage: `Hello ${user?.name}, track your legal matters here.`,
          type: 'client'
        };

      default:
        return {
          cases: [],
          stats: { ongoing: 0, solved: 0, total: 0 },
          title: 'My Collection',
          showAddCase: false,
          welcomeMessage: 'Welcome to LegalMitra',
          type: 'default'
        };
    }
  };

  const roleData = getRoleData();

  // UI Components
  const renderPaymentStatus = () => {
    if (user?.role === 'lawyer') {
      if (checkingPayment) {
        return (
          <div className="payment-status checking">
            <span className="status-icon">⏳</span>
            <span className="status-text">Checking payment status...</span>
          </div>
        );
      }
      
      return (
        <div className={`payment-status ${hasPaid ? 'paid' : 'unpaid'}`}>
          <span className="status-icon">
            {hasPaid ? '✅' : '💰'}
          </span>
          <span className="status-text">
            {hasPaid ? 'Premium Member - Unlimited Cases' : 'One-time payment required to add cases'}
          </span>
        </div>
      );
    }
    return null;
  };

  const renderPaymentScreen = () => (
  <div className="payment-overlay">
    <div className="payment-modal-new">
      <div className="container">
        <div className="header">
          <h1>One-Time Registration Fee</h1>
          <p>Pay once and add unlimited cases forever! No recurring fees.</p>
        </div>
        
        <div className="card pricing-card">
          <h2>Unlimited Case Access</h2>
          <div className="price-tag">₹999</div>
          <div className="price-period">One-time payment • Lifetime access</div>
          
          <ul className="features">
            <li><i className="fas fa-check-circle"></i> Unlimited case creation</li>
            <li><i className="fas fa-check-circle"></i> Priority support</li>
            <li><i className="fas fa-check-circle"></i> Advanced analytics</li>
           
          </ul>
          
          
        </div>
        
        <div className="card form-card">
          <div className="payment-summary">
            <h3>Payment Summary</h3>
            <div className="payment-row">
              <span>One-time registration fee:</span>
              <span>₹999.00</span>
            </div>
            <div className="payment-row">
              <span>Tax:</span>
              <span>₹0.00</span>
            </div>
            <div className="payment-row">
              <span>Total Amount:</span>
              <span>₹999.00</span>
            </div>
          </div>
          
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                style={{ marginRight: '10px', marginTop: '3px' }}
                required
              />
              <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
            </label>
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={() => initiatePayment(caseDataBeforePayment)}
            disabled={paymentLoading}
          >
            {paymentLoading ? (
              <>
                <div className="loading-spinner-small"></div>
                Processing...
              </>
            ) : (
              'Pay Now - ₹999'
            )}
          </button>
          
          
        </div>
      </div>

      {/* Close button */}
      <button 
        className="close-btn-new"
        onClick={() => {
          setShowPayment(false);
          setCaseDataBeforePayment(null);
        }}
        disabled={paymentLoading}
      >
        ✕
      </button>
    </div>
  </div>
);

  // Render Solved Cases Section
  const renderSolvedCasesSection = () => {
    const solvedCases = roleData.cases.filter(caseItem => caseItem.status === 'solved');
    
    if (solvedCases.length === 0) return null;

    return (
      <div className="cases-section">

        <div className="section-header">
          <h2>
            {user?.role === 'lawyer' && 'Solved Cases'}
            {user?.role === 'client' && 'Solved Cases'}
          </h2>
          <button 
            className={`toggle-solved-btn ${showSolvedCases ? 'active' : ''}`}
            onClick={() => setShowSolvedCases(!showSolvedCases)}
          >
            {showSolvedCases ? '▲ Hide' : '▼ Show'} Solved Cases
          </button>
        </div>

        {showSolvedCases && (
          <div className="cases-grid">
            {solvedCases.map(caseItem => renderCaseCard(caseItem))}
          </div>
        )}
      </div>
    );
  };

  const renderWelcomeSection = () => {
    const nextHearing = roleData.cases.find(c => c.status === 'ongoing')?.nextHearing;
    
    return (
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>{roleData.welcomeMessage}
            <span className="welcome-emoji">
              {user?.role === 'lawyer' ? '👨‍⚖️' : '👤'}
            </span>
          </h1>
          <p className="welcome-subtitle">
            {user?.role === 'lawyer' && 'Here\'s your legal practice overview for today'}
            {user?.role === 'client' && 'Track your ongoing legal matters and case progress'}
          </p>
          <div className="welcome-stats">
            {user?.role === 'lawyer' && nextHearing && (
              <div className="welcome-stat">
                <span className="stat-icon">📅</span>
                <span>Next hearing: {new Date(nextHearing).toLocaleDateString()}</span>
              </div>
            )}
            <div className="welcome-stat">
              <span className="stat-icon">⚡</span>
              <span>
                {user?.role === 'lawyer' && `High priority cases: ${roleData.stats.highPriority}`}
                {user?.role === 'client' && `Active cases: ${roleData.stats.ongoing}`}
              </span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          {user?.role === 'lawyer' && (
            <>
              <button 
                className="primary-btn"
                onClick={() => setShowForm(true)}
              >
                <span className="btn-icon">➕</span>
                Add New Case
              </button>
              <button 
      className="secondary-btn"
      onClick={() => setShowProfileCard(true)} // ADD THIS
    >
      <span className="btn-icon">👨‍⚖️</span>
      Download Profile Card
    </button>
            </>
          )}
          {user?.role === 'client' && (
            <button 
              className="primary-btn"
              onClick={() => setShowClientCaseForm(true)}
            >
              <span className="btn-icon">➕</span>
              Add Your Case
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderStats = () => {
    if (user?.role === 'lawyer') {
      return (
        <div className="stats-grid">
          <div className="stat-card ongoing">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Ongoing Cases</h3>
              <div className="stat-number">{roleData.stats.ongoing}</div>
              <div className="stat-trend">Active matters</div>
            </div>
          </div>
          
          <div className="stat-card solved">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Solved Cases</h3>
              <div className="stat-number">{roleData.stats.solved}</div>
              <div className="stat-trend">Successfully closed</div>
            </div>
          </div>
          
          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Portfolio Value</h3>
              <div className="stat-number">₹{(roleData.stats.totalValue / 10000000).toFixed(1)}Cr</div>
              <div className="stat-trend">Total case value</div>
            </div>
          </div>
          
          <div className="stat-card priority">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h3>High Priority</h3>
              <div className="stat-number">{roleData.stats.highPriority}</div>
              <div className="stat-trend">Require attention</div>
            </div>
          </div>
        </div>
      );
    } else if (user?.role === 'client') {
      return (
        <div className="stats-grid">
          <div className="stat-card ongoing">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Active Cases</h3>
              <div className="stat-number">{roleData.stats.ongoing}</div>
              <div className="stat-trend">In progress</div>
            </div>
          </div>
          
          <div className="stat-card solved">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Closed Cases</h3>
              <div className="stat-number">{roleData.stats.solved}</div>
              <div className="stat-trend">Successfully resolved</div>
            </div>
          </div>
          
          <div className="stat-card revenue">
            <div className="stat-icon">👨‍⚖️</div>
            <div className="stat-content">
              <h3>Your Lawyer</h3>
              <div className="stat-number">1</div>
              <div className="stat-trend">Legal representative</div>
            </div>
          </div>
          
          <div className="stat-card priority">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>Next Hearing</h3>
              <div className="stat-number">Soon</div>
              <div className="stat-trend">Stay prepared</div>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderCaseCard = (caseItem) => {
    if (user?.role === 'lawyer') {
      return (
        <div key={caseItem._id} className={`case-card ${caseItem.priority} ${caseItem.status}`}>
          <div className="case-header" onClick={() => toggleCaseExpand(caseItem._id)}>
           <div className="case-header" onClick={() => toggleCaseExpand(caseItem._id)}>
  <div className="case-title-section">
    <h3>{caseItem.caseName}</h3>
    <div className="case-meta">
      <span className="case-number">{caseItem.caseNumber || 'N/A'}</span>
      <span className={`status-badge ${caseItem.status}`}>
        {caseItem.status === 'ongoing' ? '📋' : '✅'} {caseItem.status}
      </span>
      <span className={`priority-badge ${caseItem.priority}`}>
        {caseItem.priority === 'high' ? '🔴' : caseItem.priority === 'medium' ? '🟡' : '🟢'} {caseItem.priority}
      </span>
    </div>
  </div>
  <div className="case-header-actions">
    {/* Call Button - Only show for lawyers */}
    {user?.role === 'lawyer' && (
      <button 
        className="call-client-btn"
        onClick={(e) => {
          e.stopPropagation(); // Prevent expanding the case
          openCallOptions(caseItem);
        }}
        title="Contact Client"
      >
        <span className="call-icon">📞</span>
      </button>
    )}
    <button className="expand-btn">
      {expandedCase === caseItem._id ? '▲' : '▼'}
    </button>
  </div>
</div>
          </div>

          <div className="case-summary">
            <div className="summary-item">
              <span className="summary-icon">👤</span>
              <span>{caseItem.clientName}</span>
            </div>
            <div className="summary-item">
              <span className="summary-icon">⚖️</span>
              <span>{caseItem.caseType}</span>
            </div>
            <div className="summary-item">
              <span className="summary-icon">🏛️</span>
              <span>{caseItem.courtName || 'N/A'}</span>
            </div>
          </div>

          {expandedCase === caseItem._id && (
            <div className="case-details">
              <div className="details-grid">
                <div className="detail-section">
                  <h4>Client Information</h4>
                  <div className="detail-item">
                    <strong>Name:</strong> {caseItem.clientName}
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong> {caseItem.clientEmail}
                  </div>
                  <div className="detail-item">
                    <strong>Phone:</strong> {caseItem.clientPhone}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Case Information</h4>
                  <div className="detail-item">
                    <strong>Case Number:</strong> {caseItem.caseNumber || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Court:</strong> {caseItem.courtName || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Next Hearing:</strong> {caseItem.nextHearing ? new Date(caseItem.nextHearing).toLocaleDateString() : 'N/A'}
                  </div>
                </div>

                <div className="detail-section full-width" style={{color:'white'}}>
                  <h4>Case Description</h4>
                  <p>{caseItem.description}</p>
                </div>

                <div className="detail-section full-width">
                  <h4>Case Notes</h4>
                  <textarea
                    placeholder="Add your case notes here..."
                    value={caseNotes[caseItem._id] || caseItem.notes || ''}
                    onChange={(e) => handleNoteChange(caseItem._id, e.target.value)}
                    className="notes-textarea"
                    rows="4"
                  />
                </div>
              </div>

             <div className="case-actions">
  <div className="action-buttons-container">
    {/* Contact Client Button - Only for lawyers */}
    {user?.role === 'lawyer' && (
      <button 
        className="contact-client-action-btn"
        onClick={(e) => {
          e.stopPropagation();
          console.log('📞 Opening contact popup for:', caseItem.clientName);
          openContactPopup(caseItem);
        }}
        title="View Contact Details"
      >
        <span className="action-icon">👤</span>
        Contact Details
      </button>
    )}
    
    <button 
      className={`status-btn ${caseItem.status === 'ongoing' ? 'solved' : 'ongoing'}`}
      onClick={(e) => {
        e.stopPropagation();
        updateCaseStatus(caseItem._id, caseItem.status === 'ongoing' ? 'solved' : 'ongoing');
      }}
    >
      <span className="action-icon">
        {caseItem.status === 'ongoing' ? '✅' : '📋'}
      </span>
      {caseItem.status === 'ongoing' ? 'Mark as Solved' : 'Reopen Case'}
    </button>
  </div>
</div>
            </div>
          )}
        </div>
      );
    } else if (user?.role === 'client') {
      return (
        <div key={caseItem._id} className={`case-card ${caseItem.status}`}>
          <div className="case-header" onClick={() => toggleCaseExpand(caseItem._id)}>
  <div className="case-title-section">
    <h3>{caseItem.caseName}</h3>
    <div className="case-meta">
      <span className="case-number">{caseItem.caseNumber || 'N/A'}</span>
      <span className={`status-badge ${caseItem.status}`}>
        {caseItem.status === 'ongoing' ? '📋' : '✅'} {caseItem.status}
      </span>
      <span className={`priority-badge ${caseItem.priority}`}>
        {caseItem.priority === 'high' ? '🔴' : caseItem.priority === 'medium' ? '🟡' : '🟢'} {caseItem.priority}
      </span>
    </div>
  </div>
  <button className="expand-btn">
    {expandedCase === caseItem._id ? '▲' : '▼'}
  </button>
</div>

          <div className="case-summary">
            <div className="summary-item">
              <span className="summary-icon">👨‍⚖️</span>
              <span>Lawyer: {caseItem.lawyerName}</span>
            </div>
            <div className="summary-item">
              <span className="summary-icon">⚖️</span>
              <span>{caseItem.caseType}</span>
            </div>
            <div className="summary-item">
              <span className="summary-icon">📅</span>
              <span>Next: {caseItem.nextHearing ? new Date(caseItem.nextHearing).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>

          {expandedCase === caseItem._id && (
            <div className="case-details">
              <div className="details-grid">
                <div className="detail-section">
                  <h4>Your Lawyer</h4>
                  <div className="detail-item">
                    <strong>Name:</strong> {caseItem.lawyerName}
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong> {caseItem.lawyerEmail}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Case Information</h4>
                  <div className="detail-item">
                    <strong>Case Number:</strong> {caseItem.caseNumber || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Court:</strong> {caseItem.courtName || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Next Hearing:</strong> {caseItem.nextHearing ? new Date(caseItem.nextHearing).toLocaleDateString() : 'N/A'}
                  </div>
                </div>

                <div className="detail-section full-width">
                  <h4>Case Description</h4>
                  <p>{caseItem.caseDescription || caseItem.description}</p>
                </div>
              </div>

              <div className="case-actions">
                <button 
                  className={`status-btn ${caseItem.status === 'ongoing' ? 'solved' : 'ongoing'}`}
                  onClick={() => updateClientCaseStatus(caseItem._id, caseItem.status === 'ongoing' ? 'solved' : 'ongoing')}
                >
                  {caseItem.status === 'ongoing' ? '✅ Mark as Solved' : '📋 Reopen Case'}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
  };
// Contact Popup Function
const openContactPopup = (caseItem) => {
  setSelectedCaseForCall(caseItem);
  setShowCallModal(true);
};

// Enhanced Contact Popup Modal
const renderContactPopup = () => {
  if (!selectedCaseForCall) return null;

  return (
    <div className="contact-popup-overlay">
      <div className="contact-popup">
        <div className="contact-popup-header">
          <h3>Client Contact Details</h3>
          <button 
            className="close-btn"
            onClick={() => setShowCallModal(false)}
          >
            ✕
          </button>
        </div>

        <div className="contact-popup-content">
          {/* Client Information Card */}
          <div className="client-info-card">
            <div className="client-avatar-large">
              {selectedCaseForCall.clientName?.charAt(0) || 'C'}
            </div>
            <div className="client-info-main">
              <h4>{selectedCaseForCall.clientName}</h4>
              <p className="client-case-info">{selectedCaseForCall.caseName}</p>
              <div className="case-meta-info">
                <span className="case-type">{selectedCaseForCall.caseType}</span>
                <span className="case-status-badge">{selectedCaseForCall.status}</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="contact-details-section">
            <h5>Contact Information</h5>
            <div className="contact-details-grid">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div className="contact-info">
                  <label>Email</label>
                  <p>{selectedCaseForCall.clientEmail || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div className="contact-info">
                  <label>Phone</label>
                  <p>{selectedCaseForCall.clientPhone || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">🏠</span>
                <div className="contact-info">
                  <label>Address</label>
                  <p>{selectedCaseForCall.clientAddress || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h5>Quick Actions</h5>
            <div className="quick-actions-grid">
              <button 
                className="quick-action-btn call-btn"
                onClick={() => {
                  if (selectedCaseForCall.clientPhone) {
                    callClient(selectedCaseForCall);
                    setShowCallModal(false);
                  }
                }}
                disabled={!selectedCaseForCall.clientPhone}
              >
                <span className="action-icon-large">📞</span>
                <span>Call</span>
              </button>

              <button 
                className="quick-action-btn sms-btn"
                onClick={() => {
                  if (selectedCaseForCall.clientPhone) {
                    sendSMS(selectedCaseForCall);
                    setShowCallModal(false);
                  }
                }}
                disabled={!selectedCaseForCall.clientPhone}
              >
                <span className="action-icon-large">💬</span>
                <span>SMS</span>
              </button>

              <button 
                className="quick-action-btn email-btn"
                onClick={() => {
                  if (selectedCaseForCall.clientEmail) {
                    window.open(`mailto:${selectedCaseForCall.clientEmail}?subject=Regarding your case: ${selectedCaseForCall.caseName}`, '_self');
                    setShowCallModal(false);
                  }
                }}
                disabled={!selectedCaseForCall.clientEmail}
              >
                <span className="action-icon-large">📧</span>
                <span>Email</span>
              </button>

              <button 
                className="quick-action-btn copy-btn"
                onClick={() => {
                  const contactText = `Name: ${selectedCaseForCall.clientName}\nPhone: ${selectedCaseForCall.clientPhone || 'N/A'}\nEmail: ${selectedCaseForCall.clientEmail || 'N/A'}\nCase: ${selectedCaseForCall.caseName}`;
                  navigator.clipboard.writeText(contactText);
                  alert('Contact details copied to clipboard!');
                }}
              >
                <span className="action-icon-large">📋</span>
                <span>Copy</span>
              </button>
            </div>
          </div>

          {/* Communication History */}
          <div className="communication-history">
            <h5>Recent Communications</h5>
            {getCallLogs(selectedCaseForCall._id).length > 0 ? (
              <div className="communication-list">
                {getCallLogs(selectedCaseForCall._id)
                  .slice(-3)
                  .reverse()
                  .map((log, index) => (
                  <div key={index} className="communication-item">
                    <span className={`comm-icon ${log.type}`}>
                      {log.type === 'outgoing' ? '📞' : 
                       log.type === 'sms' ? '💬' : '📧'}
                    </span>
                    <div className="comm-details">
                      <span className="comm-type">{log.type}</span>
                      <span className="comm-time">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-communications">No recent communications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
  const renderLawyerForm = () => (
    <div className="case-form-overlay">
      <div className="case-form-modal">
        <div className="form-header">
          <h3>Add New Case</h3>
          <button 
            className="close-btn"
            onClick={() => setShowForm(false)}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmitCase} className="enhanced-form">
          <div className="form-section">
            <h4>Client Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Client Name *</label>
                <input
                  type="text"
                  name="clientName"
                  value={newCase.clientName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Client Email *</label>
                <input
                  type="email"
                  name="clientEmail"
                  value={newCase.clientEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="clientPhone"
                  value={newCase.clientPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Client Address *</label>
              <textarea
                name="clientAddress"
                value={newCase.clientAddress}
                onChange={handleInputChange}
                rows="2"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h4>Case Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Case Name *</label>
                <input
                  type="text"
                  name="caseName"
                  value={newCase.caseName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Case Type *</label>
                <select
                  name="caseType"
                  value={newCase.caseType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Civil">Civil</option>
                  <option value="Criminal">Criminal</option>
                  <option value="Family">Family</option>
                  <option value="Property">Property</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Case Number</label>
                <input
                  type="text"
                  name="caseNumber"
                  value={newCase.caseNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Court Name</label>
                <input
                  type="text"
                  name="courtName"
                  value={newCase.courtName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Next Hearing</label>
                <input
                  type="date"
                  name="nextHearing"
                  value={newCase.nextHearing}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Additional Information</h4>
            <div className="form-group full-width">
              <label>Case Description *</label>
              <textarea
                name="description"
                value={newCase.description}
                onChange={handleInputChange}
                rows="4"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {/* <span className="btn-icon">💼</span> */}
              {isLoading ? 'Creating...' : 'Create Case'}
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => setShowForm(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderClientCaseForm = () => (
    <div className="case-form-overlay">
      <div className="case-form-modal">
        <div className="form-header">
          <h3>Add Your Case</h3>
          <button 
            className="close-btn"
            onClick={() => setShowClientCaseForm(false)}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmitClientCase} className="enhanced-form">
          <div className="form-section">
            <h4>Case Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Case Name *</label>
                <input
                  type="text"
                  name="caseName"
                  value={newClientCase.caseName}
                  onChange={handleClientCaseInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Case Type *</label>
                <select
                  name="caseType"
                  value={newClientCase.caseType}
                  onChange={handleClientCaseInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Civil">Civil</option>
                  <option value="Criminal">Criminal</option>
                  <option value="Family">Family</option>
                  <option value="Property">Property</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Case Number</label>
                <input
                  type="text"
                  name="caseNumber"
                  value={newClientCase.caseNumber}
                  onChange={handleClientCaseInputChange}
                />
              </div>
              <div className="form-group">
                <label>Court Name</label>
                <input
                  type="text"
                  name="courtName"
                  value={newClientCase.courtName}
                  onChange={handleClientCaseInputChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Next Hearing</label>
                <input
                  type="date"
                  name="nextHearing"
                  value={newClientCase.nextHearing}
                  onChange={handleClientCaseInputChange}
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Case Description *</label>
              <textarea
                name="caseDescription"
                value={newClientCase.caseDescription}
                onChange={handleClientCaseInputChange}
                rows="4"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h4>Lawyer Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Lawyer Name *</label>
                <input
                  type="text"
                  name="lawyerName"
                  value={newClientCase.lawyerName}
                  onChange={handleClientCaseInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Lawyer Email *</label>
                <input
                  type="email"
                  name="lawyerEmail"
                  value={newClientCase.lawyerEmail}
                  onChange={handleClientCaseInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isLoading}>
              <span className="btn-icon">💼</span>
              {isLoading ? 'Adding...' : 'Add Case'}
            </button>
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => setShowClientCaseForm(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

 return (
  <div className="lawyer-dashboard">
    {renderWelcomeSection()}
    {renderPaymentStatus()}
    {renderStats()}

    {/* Add Case Form - Only for Lawyers */}
    {showForm && user?.role === 'lawyer' && renderLawyerForm()}

    {/* Add Client Case Form */}
    {showClientCaseForm && user?.role === 'client' && renderClientCaseForm()}

    {/* Payment Screen */}
    {showPayment && renderPaymentScreen()}

    {/* Profile Card Modal - ADD THIS */}
    {showProfileCard && renderProfileCardModal()}

    {showCallModal && renderCallModal()}
    {showCallModal && renderContactPopup()}



      {/* Cases Section */}
      <div className="cases-section">
        <div className="section-header">
          <h2>
            {user?.role === 'lawyer' && 'My Cases'}
            {user?.role === 'client' && 'My Legal Cases'}
          </h2>
        </div>

        {isLoading && roleData.cases.length === 0 ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading cases...</p>
          </div>
        ) : (
          <div className="cases-grid">
            {roleData.cases.filter(c => c.status === 'ongoing').length > 0 ? (
              roleData.cases.filter(c => c.status === 'ongoing').map(caseItem => renderCaseCard(caseItem))
            ) : (
              <div className="empty-state">
                {user?.role === 'lawyer' && 'No cases found. Click "Add Case" to get started.'}
                {user?.role === 'client' && 'No cases found. Click "Add Your Case" to get started.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* SOLVED CASES SECTION */}
      {renderSolvedCasesSection()}
    </div>
  );
};

export default MyCollection;