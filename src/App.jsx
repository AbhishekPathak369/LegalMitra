// src/App.jsx
import React, { useState } from 'react';
import './App.css';

// Import components
import Header from './Components/Header/Header';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer';

// Import pages
import HomePage from './Pages/HomePage/HomePage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Simple function to render the current page
  const renderCurrentPage = () => {
    if (currentPage === 'home') {
      return <HomePage />;
    }
    // For now, just show homepage for all pages
    return <HomePage />;
  };

  return (
    <div className="App">
      <Header />
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;