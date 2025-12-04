import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  // Navigation items for the presentation
  const navItems = [
    { path: '/', label: 'Intro' },
    { path: '/about', label: 'About' },
    { path: '/setup', label: 'Setup' },
    { path: '/spoilers', label: 'Spoilers' },
    { path: '/architecture', label: 'Architecture' },
    { path: '/good', label: 'The Good' },
    { path: '/bad', label: 'The Bad' },
    { path: '/ugly', label: 'The Ugly' },
    { path: '/end', label: 'Q&A' },
  ];

  const currentPath = window.location.pathname;

  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    // Dispatch popstate event to trigger Single-SPA reroute
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <header className="showcase-header">
      <div className="header-content">
        <h1 className="header-title">
          Single-SPA Showcase
        </h1>
        
        <nav className="header-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
