import React, { useState, useEffect } from 'react';
import './Hero.css';

const BOOT_LINES = [
  '> INITIALIZING SYSTEM...',
  '> LOADING MODULES...',
  '> CONNECTING TO ORBIT...',
  '> WELCOME, EXPLORER.',
];

function BootSequence({ onComplete }) {
  const [visible, setVisible] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const next = () => {
      if (i < BOOT_LINES.length) {
        setVisible(prev => [...prev, BOOT_LINES[i]]);
        i++;
        setTimeout(next, 280);
      } else {
        setTimeout(() => setDone(true), 200);
        setTimeout(onComplete, 600);
      }
    };
    const id = setTimeout(next, 300);
    return () => clearTimeout(id);
  }, [onComplete]);

  return (
    <div className={`boot-seq ${done ? 'boot-done' : ''}`} aria-live="polite">
      {visible.map((line, idx) => (
        <div
          key={idx}
          className={`boot-line ${idx === BOOT_LINES.length - 1 ? 'boot-line-final' : ''}`}
          style={{ animationDelay: `${idx * 0.05}s` }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const [showContent, setShowContent] = useState(false);

  const handleBootComplete = () => {
    setTimeout(() => setShowContent(true), 200);
  };

  return (
    <section id="home" className="hero" aria-label="Hero section">
      {/* Boot sequence col */}
      <div className="hero-boot-col">
        <BootSequence onComplete={handleBootComplete} />
        <div className="hero-online-badge" style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.6s 0.5s' }}>
          <span className="hero-online-dot" aria-hidden="true" />
          SYSTEM ONLINE →
        </div>
      </div>

      {/* Center: Identity block */}
      <div className={`hero-identity ${showContent ? 'hero-identity--visible' : ''}`}>
        <div className="hero-sub-label">&#47;&#47; DEBAJIT DUTTA</div>
        <h1 className="hero-name" aria-label="ARISTRO">
          ARISTRO<span className="hero-dot" aria-hidden="true">.</span>
        </h1>
        <p className="hero-tagline">
          Computer Science Student<br />
          Building. Learning. Documenting.
        </p>
        <a href="#projects" className="btn-cta hero-cta" id="hero-cta-btn" aria-label="Access projects terminal">
          <span>&gt; Access Terminal</span>
          <span className="cta-cursor" aria-hidden="true">█</span>
        </a>
      </div>

      {/* Right panel: Telemetry */}
      <div className={`hero-telemetry ${showContent ? 'hero-telemetry--visible' : ''}`} aria-label="Telemetry panel">
        <div className="telem-header">TELEMETRY</div>
        <div className="telem-grid">
          <TelemRow label="TIME" value={<LiveClock />} />
          <TelemRow label="LOCATION" value={<span className="telem-neon">EARTH</span>} />
          <TelemRow label="MODE" value={<span className="telem-neon">FOCUS</span>} />
          <TelemRow label="POWER" value={<PowerBar />} />
        </div>
        <div className="telem-divider" aria-hidden="true" />
        <div className="telem-live">
          <div className="telem-label">LIVE FEED</div>
          <WaveformBar />
          <div className="telem-now-playing">
            <span className="telem-dim">Now Playing</span>
            <span>Phonk Atmospheric // 08:45</span>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-scroll-hint" aria-hidden="true">
        <span>↓</span> SCROLL TO EXPLORE
      </div>
    </section>
  );
}

function TelemRow({ label, value }) {
  return (
    <div className="telem-row">
      <span className="telem-label">{label}</span>
      <span className="telem-value">{value}</span>
    </div>
  );
}

function LiveClock() {
  const [t, setT] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setT(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="telem-neon" aria-live="polite" aria-atomic="true">{t}</span>;
}

function PowerBar() {
  return (
    <div className="power-bar-wrap" aria-label="Power 100%">
      <div className="power-bar-track">
        <div className="power-bar-fill" />
      </div>
      <span className="telem-neon">100%</span>
    </div>
  );
}

function WaveformBar() {
  const bars = Array.from({ length: 28 }, (_, i) => ({
    h: 20 + Math.sin(i * 0.7) * 14 + Math.random() * 10,
    delay: i * 0.06
  }));
  return (
    <div className="waveform" aria-hidden="true">
      {bars.map((b, i) => (
        <div
          key={i}
          className="waveform-bar"
          style={{
            height: `${b.h}%`,
            animationDelay: `${b.delay}s`
          }}
        />
      ))}
    </div>
  );
}
