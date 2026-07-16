import React, { useEffect, useRef } from 'react';

import Starfield from './Starfield';
import { createNebulaParticles, drawNebula } from './NebulaEffect';
import { drawBlackHole } from './BlackHole';
import { motion } from 'framer-motion';

// ...existing code...

const SpaceHome = () => {
  const containerRef = useRef(null);
  const nebulaRef = useRef(null);
  const blackHoleRef = useRef(null);

  useEffect(() => {
    // Nebula Effect
    const nebulaCanvas = nebulaRef.current;
    if (nebulaCanvas) {
      nebulaCanvas.width = window.innerWidth;
      nebulaCanvas.height = window.innerHeight;
      const ctx = nebulaCanvas.getContext('2d');
      const particles = createNebulaParticles(nebulaCanvas);
      let animationId;
      const mouse = { x: 0, y: 0 };
      const animate = (time) => {
        ctx.clearRect(0, 0, nebulaCanvas.width, nebulaCanvas.height);
        drawNebula(ctx, particles, time, mouse, nebulaCanvas);
        animationId = requestAnimationFrame(animate);
      };
      animate(0);
      return () => cancelAnimationFrame(animationId);
    }
  }, []);

  useEffect(() => {
    // Black Hole Effect
    const blackHoleCanvas = blackHoleRef.current;
    if (blackHoleCanvas) {
      blackHoleCanvas.width = window.innerWidth;
      blackHoleCanvas.height = window.innerHeight;
      const ctx = blackHoleCanvas.getContext('2d');
      let animationId;
      const animate = (time) => {
        ctx.clearRect(0, 0, blackHoleCanvas.width, blackHoleCanvas.height);
        drawBlackHole(ctx, blackHoleCanvas.width / 2, blackHoleCanvas.height / 2, time * 0.001, blackHoleCanvas);
        animationId = requestAnimationFrame(animate);
      };
      animate(0);
      return () => cancelAnimationFrame(animationId);
    }
  }, []);

  return (
    <div className="space-home" ref={containerRef} style={{position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden'}}>
      <Starfield />
      <canvas ref={nebulaRef} className="nebula-canvas" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1}} />
      <canvas ref={blackHoleRef} className="blackhole-canvas" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2}} />
  <div className="content-overlay">
        <motion.h1 
          className="main-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          Welcome to the Cosmos
        </motion.h1>
        <motion.p 
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
        >
          Journey through the infinite expanse of space
        </motion.p>
        <motion.div 
          className="cta-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1.5 }}
        >
          <button className="explore-btn">Explore the Universe</button>
        </motion.div>
      </div>
    </div>
  );
};

export default SpaceHome;
