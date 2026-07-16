export const drawBlackHole = (ctx, centerX, centerY, time, canvas) => {
  const eventHorizonRadius = 45;
  const accretionDiskRadius = 200;

  ctx.save();

  // Gravitational lensing effect on background
  const lensRadius = accretionDiskRadius * 2;
  for (let r = eventHorizonRadius; r < lensRadius; r += 10) {
    ctx.globalAlpha = 0.1 - (r / lensRadius) * 0.1;
    ctx.strokeStyle = `hsl(200, 50%, 70%)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Accretion disk with realistic physics
  ctx.globalAlpha = 1;
  for (let layer = 0; layer < 12; layer++) {
    const radius = eventHorizonRadius * 1.2 + (accretionDiskRadius - eventHorizonRadius * 1.2) * (layer / 12);
    const rotation = time * (3 - layer * 0.15); // Faster inner rotation
    const temperature = 1 - (layer / 12); // Hotter inner regions
    
    ctx.globalAlpha = 0.4 - layer * 0.025;
    
    for (let angle = 0; angle < Math.PI * 2; angle += 0.15) {
      const x = centerX + Math.cos(angle + rotation) * radius;
      const y = centerY + Math.sin(angle + rotation) * radius * 0.25; // Flatten disk
      
      // Temperature-based color
      let hue, sat, light;
      if (temperature > 0.7) {
        hue = 50 + temperature * 20; // Hot white-yellow
        sat = 80;
        light = 85;
      } else if (temperature > 0.4) {
        hue = 30; // Orange
        sat = 90;
        light = 65;
      } else {
        hue = 10; // Red
        sat = 80;
        light = 45;
      }
      
      const intensity = Math.sin(angle * 3 + rotation * 2) * 0.3 + 0.7;
      const noise = Math.sin(angle * 7 + rotation * 3 + time * 2) * 0.2 + 0.8;
      
      ctx.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${intensity * noise * 0.8})`;
      ctx.beginPath();
      ctx.arc(x, y, 2 + temperature * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Jets from black hole poles
  ctx.globalAlpha = 0.3;
  const jetGradient = ctx.createLinearGradient(
    centerX, centerY - accretionDiskRadius * 2,
    centerX, centerY - eventHorizonRadius
  );
  jetGradient.addColorStop(0, 'rgba(100, 150, 255, 0)');
  jetGradient.addColorStop(0.5, 'rgba(100, 150, 255, 0.3)');
  jetGradient.addColorStop(1, 'rgba(200, 220, 255, 0.6)');
  
  ctx.fillStyle = jetGradient;
  ctx.fillRect(centerX - 8, centerY - accretionDiskRadius * 2, 16, accretionDiskRadius * 2 - eventHorizonRadius);

  // Event horizon (pure black)
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(centerX, centerY, eventHorizonRadius, 0, Math.PI * 2);
  ctx.fill();

  // Photon sphere glow
  ctx.globalAlpha = 0.2;
  const photonGlow = ctx.createRadialGradient(
    centerX, centerY, eventHorizonRadius,
    centerX, centerY, eventHorizonRadius * 1.8
  );
  photonGlow.addColorStop(0, 'rgba(150, 200, 255, 0.4)');
  photonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = photonGlow;
  ctx.beginPath();
  ctx.arc(centerX, centerY, eventHorizonRadius * 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};