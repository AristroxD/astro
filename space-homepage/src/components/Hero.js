import React, { useState, useEffect, useRef } from 'react';
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
        <div className="hero-identity-bg" style={{ background: "url('/assets/earth.png') no-repeat center center", backgroundSize: 'cover' }} aria-hidden="true" />
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
        <TelemetryLiveFeed />
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

function WaveformBar({ isPlaying }) {
  const bars = Array.from({ length: 28 }, (_, i) => ({
    h: 20 + Math.sin(i * 0.7) * 14 + Math.random() * 10,
    delay: i * 0.06
  }));
  return (
    <div className={`waveform ${!isPlaying ? 'waveform--paused' : ''}`} aria-hidden="true">
      {bars.map((b, i) => (
        <div
          key={i}
          className="waveform-bar"
          style={{
            height: isPlaying ? `${b.h}%` : '4px',
            animationDelay: `${b.delay}s`,
            animationPlayState: isPlaying ? 'running' : 'paused'
          }}
        />
      ))}
    </div>
  );
}

function TelemetryLiveFeed() {
  const [presence, setPresence] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Set default Discord ID (user can change this in their Vercel env or code)
  const DISCORD_USER_ID = process.env.REACT_APP_DISCORD_ID || "411910609386340362"; 

  useEffect(() => {
    if (!DISCORD_USER_ID) return;
    const fetchStatus = () => {
      fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`)
        .then(res => res.json())
        .then(json => {
          if (json.success) setPresence(json.data);
        })
        .catch(err => console.debug('Lanyard API offline or user not in Lanyard guild'));
    };
    fetchStatus();
    const id = setInterval(fetchStatus, 8000);
    return () => clearInterval(id);
  }, [DISCORD_USER_ID]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const isSpotify = presence?.listening_to_spotify;
  const spotify = presence?.spotify;
  
  const statusColor = {
    online: 'var(--neon)',
    idle: '#ffb300',
    dnd: '#ff4d6d',
    offline: '#555'
  }[presence?.discord_status || 'offline'];

  return (
    <div className="telem-live">
      <div className="telem-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>LIVE FEED</span>
        <span style={{ color: statusColor, fontSize: '0.55rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
          DC // {(presence?.discord_status || 'OFFLINE').toUpperCase()}
        </span>
      </div>

      <div onClick={toggleAudio} style={{ cursor: 'pointer' }} title="Click to play/pause background music">
        <WaveformBar isPlaying={isPlaying || isSpotify} />
      </div>

      <div className="telem-now-playing">
        {isSpotify ? (
          <>
            <span className="telem-dim">LISTENING ON SPOTIFY:</span>
            <span style={{ color: 'var(--neon)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase' }}>{spotify.song}</span>
            <span className="telem-dim">by {spotify.artist}</span>
          </>
        ) : isPlaying ? (
          <>
            <span className="telem-dim">AMBIENT AUDIO:</span>
            <span style={{ color: 'var(--neon)', fontWeight: 600, fontSize: '0.72rem' }}>PHONK ATMOSPHERIC</span>
            <span className="telem-dim">Click waveforms to pause</span>
          </>
        ) : (
          <>
            <span className="telem-dim">AUDIO SYSTEM:</span>
            <span>SYSTEM CALM // NO FEED</span>
            <span className="telem-dim" onClick={toggleAudio} style={{ textDecoration: 'underline', cursor: 'pointer' }}>
              Click to load ambient audio
            </span>
          </>
        )}
      </div>

      <audio 
        ref={audioRef} 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" 
        loop 
        preload="none"
      />
    </div>
  );
}
