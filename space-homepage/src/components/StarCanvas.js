import { useEffect } from 'react';

export default function StarCanvas() {
  useEffect(() => {
    const canvas = document.getElementById('star-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = window.innerWidth;
    let H = document.documentElement.scrollHeight;

    const resize = () => {
      W = window.innerWidth;
      H = document.documentElement.scrollHeight;
      canvas.width = W;
      canvas.height = H;
    };
    resize();

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.004 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }));

    let animId;
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        const alpha = 0.3 + 0.5 * Math.abs(Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });
      t += 0.5;
      animId = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return null;
}
