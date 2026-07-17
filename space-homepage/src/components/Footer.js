import React from 'react';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-left">
        <span 
          onDoubleClick={() => window.location.href = '/admin'} 
          style={{ cursor: 'default', userSelect: 'none' }}
          title="System Core"
        >
          © {year} ARISTRO
        </span>
      </div>
      <div className="footer-center">
        <span>BUILT WITH <span className="footer-heart" aria-label="love">♥</span> AND LOTS OF COFFEE</span>
      </div>
      <div className="footer-right">
        <span>LAST UPDATED: JULY {year}</span>
      </div>
    </footer>
  );
}
