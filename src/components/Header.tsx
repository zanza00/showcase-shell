import React, { useState, useEffect, useMemo } from 'react';
import { resolveManifests, findSlideByPath } from '@showcase/shared-libs';
import { introManifest } from '@showcase/intro';
import { contentManifest } from '@showcase/content';
import './Header.css';

const Header: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Build the complete slide list from all manifests
  const slides = useMemo(() => {
    return resolveManifests([introManifest, contentManifest]);
  }, []);

  useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', updatePath);
    window.addEventListener('single-spa:routing-event', updatePath);

    return () => {
      window.removeEventListener('popstate', updatePath);
      window.removeEventListener('single-spa:routing-event', updatePath);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
    setCurrentPath(path);
    setDropdownOpen(false);
  };

  const currentSlideIndex = findSlideByPath(slides, currentPath);
  const currentSlide = slides[currentSlideIndex];
  const prevSlide = currentSlideIndex > 0 ? slides[currentSlideIndex - 1] : null;
  const nextSlide = currentSlideIndex < slides.length - 1 ? slides[currentSlideIndex + 1] : null;

  return (
    <header className="showcase-header">
      {/* Row 1: Main title */}
      <div className="header-row header-title-row">
        <h1 className="header-title">Single-SPA Showcase</h1>
      </div>

      {/* Row 2: Navigation */}
      <div className="header-row header-nav-row">
        <div className="header-nav-section">
          {prevSlide ? (
            <button
              className="nav-adjacent prev"
              onClick={() => handleNavigate(prevSlide.fullPath)}
              title={prevSlide.title}
            >
              <span className="nav-arrow">←</span>
              <span className="nav-adjacent-title">{prevSlide.title}</span>
            </button>
          ) : (
            <div className="nav-adjacent-placeholder" />
          )}
        </div>

        <div className="header-current">
          <span className="current-slide-title">
            {currentSlide?.title ?? 'Welcome'}
          </span>
        </div>

        <div className="header-nav-section">
          {nextSlide ? (
            <button
              className="nav-adjacent next"
              onClick={() => handleNavigate(nextSlide.fullPath)}
              title={nextSlide.title}
            >
              <span className="nav-adjacent-title">{nextSlide.title}</span>
              <span className="nav-arrow">→</span>
            </button>
          ) : (
            <div className="nav-adjacent-placeholder" />
          )}

          <div className="dropdown-container">
            <button
              className="dropdown-trigger"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Open slide menu"
            >
              ☰
            </button>
            
            {dropdownOpen && (
              <div className="dropdown-menu">
                {slides.map((slide, index) => (
                  <button
                    key={slide.fullPath}
                    onClick={() => handleNavigate(slide.fullPath)}
                    className={`dropdown-item ${index === currentSlideIndex ? 'active' : ''}`}
                  >
                    <span className="dropdown-item-number">{index + 1}.</span>
                    {slide.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
