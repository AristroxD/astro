export const createNebulaParticles = (canvas) => {
  const nebulaParticles = [];
  for (let i = 0; i < 80; i++) {
    nebulaParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 150 + 50,
      opacity: Math.random() * 0.2 + 0.05,
      color: [220, 260, 300, 340][Math.floor(Math.random() * 4)],
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      phase: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01
    });
  }
  return nebulaParticles;
};

export const drawNebula = (ctx, nebulaParticles, time, mousePosition, canvas) => {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  
  for (let particle of nebulaParticles) {
    particle.x += particle.vx + mousePosition.x * 0.3;
    particle.y += particle.vy + mousePosition.y * 0.2;
    particle.phase += 0.005;

    // Wrap particles
    if (particle.x < -200) particle.x = canvas.width + 200;
    if (particle.x > canvas.width + 200) particle.x = -200;
    if (particle.y < -200) particle.y = canvas.height + 200;
    if (particle.y > canvas.height + 200) particle.y = -200;

    const sizeMultiplier = Math.sin(particle.phase) * 0.3 + 0.8;
    const opacityMultiplier = Math.sin(particle.phase * 0.7) * 0.4 + 0.7;

    const gradient = ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size * sizeMultiplier
    );
    
    const hue = particle.color + Math.sin(time + particle.phase) * 20;
    gradient.addColorStop(0, `hsla(${hue}, 70%, 50%, ${particle.opacity * opacityMultiplier})`);
    gradient.addColorStop(0.3, `hsla(${hue + 10}, 80%, 40%, ${particle.opacity * 0.6 * opacityMultiplier})`);
    gradient.addColorStop(0.7, `hsla(${hue + 20}, 60%, 30%, ${particle.opacity * 0.3 * opacityMultiplier})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate(time * particle.rotationSpeed);
    ctx.translate(-particle.x, -particle.y);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * sizeMultiplier, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
};