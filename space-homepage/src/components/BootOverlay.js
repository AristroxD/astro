import React, { useState, useEffect, useRef } from 'react';
import './BootOverlay.css';

const BOOT_LINES = [
  '> INITIALIZING SYSTEM...',
  '> LOADING MODULES...',
  '> CONNECTING TO ORBIT...',
  '> WELCOME, EXPLORER.',
];

export default function BootOverlay({ onComplete }) {
  const [rendered, setRendered] = useState([]);
  const [done, setDone] = useState(false);
  useEffect(() => {
    setRendered([]);
    let cancelled = false;
    const timers = [];

    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        if (!cancelled) setRendered(prev => [...prev, line]);
      }, 400 + i * 400);
      timers.push(t);
    });

    const finishT = setTimeout(() => {
      if (!cancelled) {
        setDone(true);
        setTimeout(onComplete, 800); // wait for fade transition
      }
    }, 400 + BOOT_LINES.length * 400 + 400);
    timers.push(finishT);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <div className={`boot-overlay ${done ? 'boot-overlay--fade' : ''}`} aria-hidden={done}>
      <div className="boot-overlay-content">
        {rendered.map((line, idx) => (
          <div key={idx} className="boot-line-overlay">{line}</div>
        ))}
        {!done && <div className="boot-line-overlay"><span className="cta-cursor">█</span></div>}
      </div>
    </div>
  );
}
