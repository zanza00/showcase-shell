import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import {
  resolveManifests,
  findSlideByPath,
  type ResolvedSlide,
} from "@zanza00/shared-libs";
import { introManifest } from "@zanza00/intro";
import { contentManifest } from "@zanza00/content";
import "./ProgressBar.css";

const ProgressBar: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Build the complete slide list from all manifests
  const slides: ResolvedSlide[] = useMemo(() => {
    return resolveManifests([introManifest, contentManifest]);
  }, []);

  const totalSlides = slides.length;
  const currentSlideIndex = findSlideByPath(slides, currentPath);
  const currentSlide = currentSlideIndex + 1; // 1-based for display

  useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", updatePath);
    window.addEventListener("single-spa:routing-event", updatePath);

    return () => {
      window.removeEventListener("popstate", updatePath);
      window.removeEventListener("single-spa:routing-event", updatePath);
    };
  }, []);

  const navigate = (index: number) => {
    if (index >= 0 && index < slides.length) {
      const slide = slides[index];
      window.history.pushState({}, "", slide.fullPath);
      window.dispatchEvent(new PopStateEvent("popstate"));
      setCurrentPath(slide.fullPath);
    }
  };

  const goToPrevious = () => {
    if (currentSlideIndex > 0) {
      navigate(currentSlideIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      navigate(currentSlideIndex + 1);
    }
  };

  const progressPercentage =
    totalSlides > 1 ? (currentSlideIndex / (totalSlides - 1)) * 100 : 0;

  const portalTarget = document.getElementById("progress-bar-portal");

  const progressBarContent = (
    <div className="progress-bar-container">
      <button
        className="nav-button"
        onClick={goToPrevious}
        disabled={currentSlideIndex <= 0}
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
        disabled={currentSlideIndex >= totalSlides - 1}
        aria-label="Next slide"
      >
        →
      </button>
    </div>
  );

  // Use portal if target exists, otherwise render inline (fallback)
  if (portalTarget) {
    return ReactDOM.createPortal(progressBarContent, portalTarget);
  }

  return progressBarContent;
};

export default ProgressBar;
