let particles = [];

export function spawnBurst(x, y, color) {
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 / 10) * i;
    particles.push({
      x, y,
      vx: Math.cos(angle) * (1.5 + Math.random() * 1.5),
      vy: Math.sin(angle) * (1.5 + Math.random() * 1.5),
      life: 1,
      color,
    });
  }
}

export function updateParticles() {
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1;
    p.life -= 0.03;
  }
  particles = particles.filter(p => p.life > 0);
}

export function drawParticles(ctx) {
  for (const p of particles) {
    ctx.fillStyle = `rgba(${p.color}, ${Math.max(p.life, 0)})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function clearParticles() {
  particles = [];
}
