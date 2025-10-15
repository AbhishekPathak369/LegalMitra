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
import FindLawyer from './Pages/HomePage/FIndLawyer/FindLawyer';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderCurrentPage = () => {
    switch (currentPage) {
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
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
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
      </div>
    </AuthProvider>
  );
}

export default App;