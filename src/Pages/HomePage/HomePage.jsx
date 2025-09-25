// src/Pages/HomePage/HomePage.jsx
import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: "Welcome to LegalMitra",
      subtitle: "Your Trusted Legal Partner",
      description: "Comprehensive legal solutions including bail prediction, lawyer matching, and legal documentation management for all your needs.",
      cta: "Get Started",
      link: "#welcome",
      background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)"
    },
    {
      id: 2,
      title: "IPC & CrPC Sections Database",
      subtitle: "Complete Legal Sections Information",
      description: "Access detailed explanations of Indian Penal Code and Criminal Procedure Code sections with case references and legal interpretations.",
      cta: "Explore Sections",
      link: "/sections/info.html",
      background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)"
    },
    {
      id: 3,
      title: "AI-Powered Bail Prediction", 
      subtitle: "Smart Bail Amount Estimation",
      description: "Get accurate bail amount predictions using our AI algorithms based on case type, severity, and legal precedents.",
      cta: "Predict Now",
      link: "/sections/predict.html",
      background: "linear-gradient(135deg, #059669 0%, #047857 100%)"
    },
    {
      id: 4,
      title: "Find Verified Lawyers",
      subtitle: "Connect with Legal Experts",
      description: "Browse our network of verified lawyers specializing in various legal domains with ratings, experience, and client reviews.",
      cta: "Find Lawyers",
      link: "/sections/lawyers.html",
      background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Increased to 5 seconds for better reading

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="homepage">
      {/* Carousel Section */}
      <section className="carousel-section" aria-label="Website main features">
        <div className="carousel-container">
          <div 
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                aria-hidden={index !== currentSlide}
              >
                <a href={slide.link} className="slide-link">
                  <div 
                    className="slide-background"
                    style={{ background: slide.background }}
                  >
                    <div className="slide-overlay">
                      <div className="slide-content">
                        <h2 className="slide-title">{slide.title}</h2>
                        <p className="slide-subtitle">{slide.subtitle}</p>
                        <p className="slide-description">{slide.description}</p>
                        <button className="slide-cta">{slide.cta}</button>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button 
            className="carousel-arrow carousel-arrow-prev"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button 
            className="carousel-arrow carousel-arrow-next"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            ›
          </button>

          {/* Dots Indicator */}
          <div className="carousel-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Space for future content below banner */}
      <div className="content-below">
        {/* Additional content will go here later */}
      </div>
    </div>
  );
};

export default HomePage;