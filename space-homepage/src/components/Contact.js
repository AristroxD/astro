import React, { useState, useEffect } from 'react';
import { getContactLinks } from '../lib/db';
import './Contact.css';

const DEFAULT_LINKS = [
  { label: 'EMAIL',     value: 'hello@aristro.dev',        href: 'mailto:hello@aristro.dev',    icon: '✉' },
  { label: 'GITHUB',    value: 'github.com/AristroxD',     href: 'https://github.com/AristroxD','icon': '⌥' },
  { label: 'LINKEDIN',  value: 'linkedin.com/in/aristro',  href: '#',                            icon: '◈' },
  { label: 'INSTAGRAM', value: '@aristro.exe',             href: '#',                            icon: '◉' },
];

export default function Contact() {
  const [links, setLinks] = useState(DEFAULT_LINKS);

  useEffect(() => {
    getContactLinks()
      .then(data => { if (data?.length) setLinks(data); })
      .catch(console.error);
  }, []);

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-heading">
      <h2 id="contact-heading" className="section-label">CONTACT</h2>

      <div className="contact-grid">
        <div className="contact-links-col" aria-label="Contact links">
          <div className="contact-sub">LET'S CONNECT</div>
          <ul className="contact-list">
            {links.map(({ label, value, href, icon }) => (
              <li key={label}>
                <a
                  href={href}
                  className="contact-item"
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={`${label}: ${value}`}
                >
                  <span className="contact-icon" aria-hidden="true">{icon}</span>
                  <div className="contact-item-text">
                    <span className="contact-item-label">{label}</span>
                    <span className="contact-item-value">{value}</span>
                  </div>
                  <span className="contact-arrow" aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
          <a href={links[0]?.href || 'mailto:hello@aristro.dev'} className="btn-cta contact-cta" id="contact-send-btn" aria-label="Send a message">
            <span>&gt; Send a message</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="contact-visual card" aria-hidden="true">
          <OrbitVisual />
        </div>
      </div>
    </section>
  );
}

function OrbitVisual() {
  return (
    <div className="orbit-wrap">
      <div className="orbit-planet" />
      <div className="orbit orbit-1"><div className="orbit-dot" /></div>
      <div className="orbit orbit-2"><div className="orbit-dot" /></div>
      <div className="orbit orbit-3"><div className="orbit-dot" /></div>
      <div className="orbit-label" style={{ top: '12%', right: '14%' }}>GITHUB</div>
      <div className="orbit-label" style={{ bottom: '20%', left: '10%' }}>EMAIL</div>
      <div className="orbit-label" style={{ bottom: '12%', right: '16%' }}>LINKEDIN</div>
    </div>
  );
}
