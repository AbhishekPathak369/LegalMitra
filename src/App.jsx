import React, { useState } from 'react';
import './App.css';
import NewHeader from './Components/Header/NewHeader';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';
import HomePage from './Pages/HomePage/HomePage';
import BailPredic from './Pages/HomePage/BailPredic/bailpredic';
import Sections from './Pages/HomePage/Sections/sections';
import Registration from './Components/Registration/registration';
import Login from './Components/Login/Login';
import MyCollection from './Pages/HomePage/MyCollection/MyCollection';
import FAQ from './Pages/HomePage/FAQ/FAQ';
import AboutUs from './Pages/HomePage/AboutUs/AboutUs';
import FindLawyer from './Pages/HomePage/FindLawyer/FindLawyer';
import { AuthProvider } from './context/AuthContext';
import ProfilePage from './Pages/HomePage/ProfilePage/ProfilePage';
import AdminLogin from './Components/Admin/AdminLogin';
import AdminDashboard from './Pages/HomePage/AdminDashboard/AdminDashboard';
import Chatbot from './Components/Chatbot/Chatbot'; // Import chatbot

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showChatbot, setShowChatbot] = useState(false); // Chatbot state

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'admin-login':
        return <AdminLogin setCurrentPage={setCurrentPage} />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'law-sections':
        return <Sections />;
      case 'predict-bail':
        return <BailPredic />;
      case 'find-lawyer':
        return <FindLawyer />;
      case 'registration':
        return <Registration setCurrentPage={setCurrentPage} />;
      case 'login':
        return <Login setCurrentPage={setCurrentPage} />;
      case 'faq':
        return <FAQ />;
      case 'about':
        return <AboutUs />;
      case 'my-collection':
        return <MyCollection />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <AuthProvider>
      <div className="App">
        <NewHeader setCurrentPage={setCurrentPage} />
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="main-content">
          {renderCurrentPage()}
        </main>
        <Footer />

        {/* Global Chatbot Widget - Shows on EVERY page */}
        <div className="global-chatbot-widget">
          {/* Chatbot Toggle Button */}
          <button 
            className={`chatbot-toggle-btn ${showChatbot ? 'active' : ''}`}
            onClick={toggleChatbot}
            aria-label="Toggle chatbot"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path 
                d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" 
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Chatbot Container */}
          {showChatbot && (
            <div className="global-chatbot-container">
              <Chatbot />
            </div>
          )}
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;