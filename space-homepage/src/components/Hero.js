import React, { useState, useEffect } from 'react';
import './Hero.css';

export default function Hero() {
  return (
    <section id="home" className="hero" aria-label="Hero section">
      {/* Boot sequence col */}
      <div className="hero-boot-col">
        <div className="boot-seq boot-done" aria-hidden="true">
          <div className="boot-line">&gt; INITIALIZING SYSTEM...</div>
          <div className="boot-line">&gt; LOADING MODULES...</div>
          <div className="boot-line">&gt; CONNECTING TO ORBIT...</div>
          <div className="boot-line boot-line-final">&gt; WELCOME, EXPLORER.</div>
        </div>
        <div className="hero-online-badge">
          <span className="hero-online-dot" aria-hidden="true" />
          SYSTEM ONLINE →
        </div>
      </div>

      {/* Center: Identity block */}
      <div className="hero-identity hero-identity--visible">
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
      <div className="hero-telemetry hero-telemetry--visible" aria-label="Telemetry panel">
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
