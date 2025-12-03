import React, { useState, useEffect } from 'react';
import './ProgressBar.css';

const ProgressBar: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 7; // Intro, About, Architecture, Good, Bad, Ugly, Q&A

  // Route to slide number mapping
  const routeToSlide: Record<string, number> = {
    '/': 1,
    '/about': 2,
    '/architecture': 3,
    '/good': 4,
    '/bad': 5,
    '/ugly': 6,
    '/end': 7,
  };

  const slideToRoute: Record<number, string> = {
    1: '/',
    2: '/about',
    3: '/architecture',
    4: '/good',
    5: '/bad',
    6: '/ugly',
    7: '/end',
  };

  useEffect(() => {
    // Update current slide based on URL
    const updateSlide = () => {
      const path = window.location.pathname;
      const slide = routeToSlide[path];
      if (slide) {
        setCurrentSlide(slide);
      }
    };

    updateSlide();

    // Listen for route changes
    window.addEventListener('popstate', updateSlide);
    window.addEventListener('single-spa:routing-event', updateSlide);

    return () => {
      window.removeEventListener('popstate', updateSlide);
      window.removeEventListener('single-spa:routing-event', updateSlide);
    };
  }, []);

  const navigate = (slide: number) => {
    const path = slideToRoute[slide];
    if (path) {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
      setCurrentSlide(slide);
    }
  };

  const goToPrevious = () => {
    if (currentSlide > 1) {
      navigate(currentSlide - 1);
    }
  };

  const goToNext = () => {
    if (currentSlide < totalSlides) {
      navigate(currentSlide + 1);
    }
  };

  const progressPercentage = ((currentSlide - 1) / (totalSlides - 1)) * 100;

  return (
    <div className="progress-bar-container">
      <button
        className="nav-button"
        onClick={goToPrevious}
        disabled={currentSlide === 1}
        aria-label="Previous slide"
      >
        ←
      </button>

      <div className="progress-info">
        <span className="slide-counter">
          {currentSlide} / {totalSlides}
        </span>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <button
        className="nav-button"
        onClick={goToNext}
        disabled={currentSlide === totalSlides}
        aria-label="Next slide"
      >
        →
      </button>
    </div>
  );
};

export default ProgressBar;
