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
  
  // NEW: State for showing solved cases
  const [showSolvedCases, setShowSolvedCases] = useState(false);
  
  // NEW: State for client to add their case
  const [showClientCaseForm, setShowClientCaseForm] = useState(false);
  
  const [lawyerCases, setLawyerCases] = useState([]);
  const [clientCases, setClientCases] = useState([]);
  const [studentCases, setStudentCases] = useState([]);

  // NEW: State for client case form
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

  // Fetch cases from MongoDB
  useEffect(() => {
    if (user?.role === 'lawyer') {
      fetchLawyerCases();
    } else if (user?.role === 'client') {
      fetchClientCases();
    }
  }, [user]);

  const fetchLawyerCases = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/cases/my-cases', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setLawyerCases(data.cases || []);
      } else {
        console.error('Failed to fetch cases:', data.error);
        setLawyerCases([]);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
      setLawyerCases([]);
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Fetch client cases
  const fetchClientCases = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/cases/my-cases', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setClientCases(data.cases || []);
      } else {
        console.error('Failed to fetch cases:', data.error);
        setClientCases([]);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
      setClientCases([]);
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Function to handle client case input changes
  const handleClientCaseInputChange = (e) => {
    const { name, value } = e.target;
    setNewClientCase(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // NEW: Function to submit client case - FIXED VERSION
  const handleSubmitClientCase = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      console.log("Submitting client case:", newClientCase);
      
      const response = await fetch('http://localhost:5000/api/cases/client/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newClientCase)
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (response.ok) {
        // Add the new case to the state
        setClientCases(prev => [data.case, ...prev]);
        
        // Reset form
        setNewClientCase({
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

  // NEW: Function to update client case status
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
        // Update local state
        setClientCases(prev => prev.map(caseItem => 
          caseItem._id === caseId 
            ? { ...caseItem, status: newStatus }
            : caseItem
        ));
      } else {
        console.error('Failed to update status:', data.error);
      }
    } catch (error) {
      console.error('Error updating case status:', error);
    }
  };

  // Role-based data and stats
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
          setCases: setLawyerCases,
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
          setCases: setClientCases,
          stats: { ongoing: clientOngoing, solved: clientSolved, total: clientCases.length },
          title: 'My Legal Cases',
          showAddCase: true,
          welcomeMessage: `Hello ${user?.name}, track your legal matters here.`,
          type: 'client'
        };

      case 'student':
        const saved = studentCases.filter(c => c.status === 'saved').length;
        const studying = studentCases.filter(c => c.status === 'studying').length;
        const completed = 5;
        
        return {
          cases: studentCases,
          setCases: setStudentCases,
          stats: { saved, studying, completed, total: studentCases.length },
          title: 'Study Dashboard',
          showAddCase: false,
          welcomeMessage: `Welcome ${user?.name}, continue your legal studies.`,
          type: 'student'
        };

      default:
        return {
          cases: [],
          setCases: () => {},
          stats: { ongoing: 0, solved: 0, total: 0 },
          title: 'My Collection',
          showAddCase: false,
          welcomeMessage: 'Welcome to LegalMitra',
          type: 'default'
        };
    }
  };

  const roleData = getRoleData();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCase(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmitCase = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/cases/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCase)
      });

      const data = await response.json();

      if (response.ok) {
        // Add the new case to the state
        setLawyerCases(prev => [data.case, ...prev]);
        
        // Reset form
        setNewCase({
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
        setShowForm(false);
        
        alert('Case created successfully!');
      } else {
        alert('Failed to create case: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating case:', error);
      alert('Error creating case. Please check if server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCaseExpand = (caseId) => {
    setExpandedCase(expandedCase === caseId ? null : caseId);
  };

  const handleNoteChange = async (caseId, notes) => {
    // Update local state immediately
    setCaseNotes(prev => ({ ...prev, [caseId]: notes }));

    // Save to MongoDB
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
        // Update local state
        setLawyerCases(prev => prev.map(caseItem => 
          caseItem._id === caseId 
            ? { ...caseItem, status: newStatus }
            : caseItem
        ));
      } else {
        console.error('Failed to update status:', data.error);
      }
    } catch (error) {
      console.error('Error updating case status:', error);
    }
  };

  // Render Welcome Section
  const renderWelcomeSection = () => {
    const nextHearing = roleData.cases.find(c => c.status === 'ongoing')?.nextHearing;
    
    return (
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>{roleData.welcomeMessage}
            <span className="welcome-emoji">
              {user?.role === 'lawyer' ? '👨‍⚖️' : user?.role === 'client' ? '👤' : '🎓'}
            </span>
          </h1>
          <p className="welcome-subtitle">
            {user?.role === 'lawyer' && 'Here\'s your legal practice overview for today'}
            {user?.role === 'client' && 'Track your ongoing legal matters and case progress'}
            {user?.role === 'student' && 'Enhance your legal knowledge with case studies'}
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
                {user?.role === 'student' && `Cases studying: ${roleData.stats.studying}`}
              </span>
            </div>
          </div>
        </div>
        <div className="header-actions">
          {user?.role === 'lawyer' && (
            <>
              <button className="primary-btn">
                <span className="btn-icon">📊</span>
                Generate Report
              </button>
              <button className="secondary-btn">
                <span className="btn-icon">👥</span>
                Client Portal
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
          {user?.role === 'student' && (
            <button className="primary-btn">
              <span className="btn-icon">📚</span>
              Study Materials
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render Stats
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
    } else if (user?.role === 'student') {
      return (
        <div className="stats-grid">
          <div className="stat-card ongoing">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>Saved Cases</h3>
              <div className="stat-number">{roleData.stats.saved}</div>
              <div className="stat-trend">For study</div>
            </div>
          </div>
          
          <div className="stat-card solved">
            <div className="stat-icon">📖</div>
            <div className="stat-content">
              <h3>Studying</h3>
              <div className="stat-number">{roleData.stats.studying}</div>
              <div className="stat-trend">Currently learning</div>
            </div>
          </div>
          
          <div className="stat-card revenue">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Completed</h3>
              <div className="stat-number">{roleData.stats.completed}</div>
              <div className="stat-trend">Case studies</div>
            </div>
          </div>
          
          <div className="stat-card priority">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>Progress</h3>
              <div className="stat-number">75%</div>
              <div className="stat-trend">Learning journey</div>
            </div>
          </div>
        </div>
      );
    }
  };

  // Render Quick Actions
  const renderQuickActions = () => {
    if (user?.role === 'lawyer') {
      return (
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button 
              className="action-btn"
              onClick={() => setShowForm(!showForm)}
            >
              <span className="action-icon">➕</span>
              Add New Case
            </button>
            <button className="action-btn">
              <span className="action-icon">📞</span>
              Schedule Call
            </button>
            <button className="action-btn">
              <span className="action-icon">📄</span>
              Upload Documents
            </button>
            <button className="action-btn">
              <span className="action-icon">🎯</span>
              Set Reminder
            </button>
          </div>
        </div>
      );
    } else if (user?.role === 'client') {
      return (
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button 
              className="action-btn"
              onClick={() => setShowClientCaseForm(true)}
            >
              <span className="action-icon">➕</span>
              Add Your Case
            </button>
            <button className="action-btn">
              <span className="action-icon">📊</span>
              Case Progress
            </button>
            <button className="action-btn">
              <span className="action-icon">📅</span>
              Hearing Dates
            </button>
            <button className="action-btn">
              <span className="action-icon">💼</span>
              My Documents
            </button>
          </div>
        </div>
      );
    } else if (user?.role === 'student') {
      return (
        <div className="quick-actions">
          <h3>Study Tools</h3>
          <div className="action-buttons">
            <button className="action-btn">
              <span className="action-icon">🔍</span>
              Find Cases
            </button>
            <button className="action-btn">
              <span className="action-icon">📝</span>
              Take Notes
            </button>
            <button className="action-btn">
              <span className="action-icon">📚</span>
              Study Materials
            </button>
            <button className="action-btn">
              <span className="action-icon">🎯</span>
              Quiz Yourself
            </button>
          </div>
        </div>
      );
    }
  };

  // NEW: Render Client Case Form
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
                  <option value="Commercial">Commercial</option>
                  <option value="Family">Family</option>
                  <option value="Property">Property</option>
                  <option value="Corporate">Corporate</option>
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
                <label>Filing Date</label>
                <input
                  type="date"
                  name="filingDate"
                  value={newClientCase.filingDate}
                  onChange={handleClientCaseInputChange}
                />
              </div>
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
            <div className="form-group">
              <label>Lawyer Phone</label>
              <input
                type="tel"
                name="lawyerPhone"
                value={newClientCase.lawyerPhone}
                onChange={handleClientCaseInputChange}
              />
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

  // Render Case Card
  const renderCaseCard = (caseItem) => {
    if (user?.role === 'lawyer') {
      return (
        <div key={caseItem._id} className={`case-card ${caseItem.priority} ${caseItem.status}`}>
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
            <div className="summary-item">
              <span className="summary-icon">💰</span>
              <span>{caseItem.caseValue || 'N/A'}</span>
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
                  <div className="detail-item">
                    <strong>Address:</strong> {caseItem.clientAddress}
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
                    <strong>Filing Date:</strong> {caseItem.filingDate ? new Date(caseItem.filingDate).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Next Hearing:</strong> {caseItem.nextHearing ? new Date(caseItem.nextHearing).toLocaleDateString() : 'N/A'}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Opponent Information</h4>
                  <div className="detail-item">
                    <strong>Opponent:</strong> {caseItem.opponentName || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Opponent Lawyer:</strong> {caseItem.opponentLawyer || 'N/A'}
                  </div>
                </div>

                <div className="detail-section full-width">
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
                <button 
                  className={`status-btn ${caseItem.status === 'ongoing' ? 'solved' : 'ongoing'}`}
                  onClick={() => updateCaseStatus(caseItem._id, caseItem.status === 'ongoing' ? 'solved' : 'ongoing')}
                >
                  {caseItem.status === 'ongoing' ? '✅ Mark as Solved' : '📋 Reopen Case'}
                </button>
                <button className="action-btn-small">
                  📞 Call Client
                </button>
                <button className="action-btn-small">
                  ✏️ Edit Details
                </button>
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
                  <div className="detail-item">
                    <strong>Phone:</strong> {caseItem.lawyerPhone}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Case Information</h4>
                  <div className="detail-item">
                    <strong>Case Number:</strong> {caseItem.caseNumber || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Type:</strong> {caseItem.caseType}
                  </div>
                  <div className="detail-item">
                    <strong>Status:</strong> {caseItem.status}
                  </div>
                  <div className="detail-item">
                    <strong>Court:</strong> {caseItem.courtName || 'N/A'}
                  </div>
                  <div className="detail-item">
                    <strong>Filing Date:</strong> {caseItem.filingDate ? new Date(caseItem.filingDate).toLocaleDateString() : 'N/A'}
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
    } else if (user?.role === 'student') {
      return (
        <div key={caseItem.id} className="case-card study">
          <div className="case-header" onClick={() => toggleCaseExpand(caseItem.id)}>
            <div className="case-title-section">
              <h3>{caseItem.caseName}</h3>
              <div className="case-meta">
                <span className="case-number">{caseItem.court} ({caseItem.year})</span>
                <span className={`importance-badge ${caseItem.importance}`}>
                  {caseItem.importance} Importance
                </span>
              </div>
            </div>
            <button className="expand-btn">
              {expandedCase === caseItem.id ? '▲' : '▼'}
            </button>
          </div>

          <div className="case-summary">
            <div className="summary-item">
              <span className="summary-icon">⚖️</span>
              <span>{caseItem.caseType}</span>
            </div>
            <div className="summary-item">
              <span className="summary-icon">🏛️</span>
              <span>{caseItem.court}</span>
            </div>
            <div className="summary-item">
              <span className="summary-icon">📅</span>
              <span>{caseItem.year}</span>
            </div>
          </div>

          {expandedCase === caseItem.id && (
            <div className="case-details">
              <div className="details-grid">
                <div className="detail-section full-width">
                  <h4>Key Learning Points</h4>
                  <ul className="study-points">
                    {caseItem.studyPoints.map((point, index) => (
                      <li key={index}>📌 {point}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section full-width">
                  <h4>Study Notes</h4>
                  <textarea
                    placeholder="Add your study notes and observations here..."
                    value={caseNotes[caseItem.id] || ''}
                    onChange={(e) => handleNoteChange(caseItem.id, e.target.value)}
                    className="notes-textarea"
                    rows="4"
                  />
                </div>
              </div>

              <div className="case-actions">
                <button className="action-btn-small">
                  📚 Related Cases
                </button>
                <button className="action-btn-small">
                  🎯 Take Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  // NEW: Render Solved Cases Section
  const renderSolvedCasesSection = () => {
    const solvedCases = roleData.cases.filter(caseItem => caseItem.status === 'solved');
    
    if (solvedCases.length === 0) return null;

    return (
      <div className="cases-section">
        <div className="section-header">
          <h2>
            {user?.role === 'lawyer' && 'Solved Cases'}
            {user?.role === 'client' && 'Solved Cases'}
            {user?.role === 'student' && 'Completed Studies'}
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

  // Render Lawyer Form
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
              <div className="form-group">
                <label>Case Value (₹)</label>
                <input
                  type="text"
                  name="caseValue"
                  value={newCase.caseValue}
                  onChange={handleInputChange}
                  placeholder="e.g., ₹50,00,000"
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
                  <option value="Commercial">Commercial</option>
                  <option value="Family">Family</option>
                  <option value="Property">Property</option>
                  <option value="Corporate">Corporate</option>
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
                <label>Filing Date</label>
                <input
                  type="date"
                  name="filingDate"
                  value={newCase.filingDate}
                  onChange={handleInputChange}
                />
              </div>
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
            <h4>Opponent Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Opponent Name</label>
                <input
                  type="text"
                  name="opponentName"
                  value={newCase.opponentName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Opponent Lawyer</label>
                <input
                  type="text"
                  name="opponentLawyer"
                  value={newCase.opponentLawyer}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Additional Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select
                  name="priority"
                  value={newCase.priority}
                  onChange={handleInputChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={newCase.status}
                  onChange={handleInputChange}
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="solved">Solved</option>
                </select>
              </div>
            </div>
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
              <span className="btn-icon">💼</span>
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

  return (
    <div className="lawyer-dashboard">
      {renderWelcomeSection()}
      {renderStats()}
      {renderQuickActions()}

      {/* Add Case Form - Only for Lawyers */}
      {showForm && user?.role === 'lawyer' && renderLawyerForm()}

      {/* Add Client Case Form */}
      {showClientCaseForm && user?.role === 'client' && renderClientCaseForm()}

      {/* Cases Section */}
      <div className="cases-section">
        <div className="section-header">
          <h2>
            {user?.role === 'lawyer' && 'My Cases'}
            {user?.role === 'client' && 'My Legal Cases'}
            {user?.role === 'student' && 'Case Studies'}
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
                {user?.role === 'student' && 'No case studies saved yet.'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Solved Cases Section */}
      {renderSolvedCasesSection()}
    </div>
  );
};

export default MyCollection;