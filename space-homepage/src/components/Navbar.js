import React, { useState, useEffect } from 'react';
import './Navbar.css';

const NAV_ITEMS = [
  { label: 'Home',     href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'Journal',  href: '#journal' },
  { label: 'About',    href: '#about' },
  { label: 'Uses',     href: '#uses' },
  { label: 'Contact',  href: '#contact' },
];

export default function Navbar() {
  const [time, setTime] = useState('');
  const [active, setActive] = useState('home');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setTime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(n => n.href.slice(1));
      let current = sections[0];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) current = id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <a href="#home" className="nav-logo" aria-label="ARISTRO home">ARISTRO</a>

      <ul className="nav-links">
        {NAV_ITEMS.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              className={active === href.slice(1) ? 'nav-link active' : 'nav-link'}
              aria-current={active === href.slice(1) ? 'page' : undefined}
            >
              {label.toUpperCase()}
            </a>
          </li>
        ))}
      </ul>

      <div className="nav-status" aria-label="System status">
        <span className="nav-status-label">SYSTEM_STATUS</span>
        <span className="nav-status-value">
          ONLINE&nbsp;
          <span className="status-dot" aria-hidden="true" />
        </span>
        <span className="nav-clock" aria-live="polite" aria-atomic="true">{time}</span>
      </div>
    </nav>
  );
}
