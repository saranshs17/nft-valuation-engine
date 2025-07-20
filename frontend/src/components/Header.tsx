import React from 'react';
import './Header.css';

export function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <h1>NFT Valuation Engine</h1>
          </div>
          <div className="tagline">
            <span className="badge">JuliaOS Powered</span>
            <span className="separator">•</span>
            <span className="text">AI-Driven NFT Analysis</span>
          </div>
        </div>
      </div>
    </header>
  );
}