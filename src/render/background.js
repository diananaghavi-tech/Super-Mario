export function drawSky(ctx, canvas) {
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#6fb2ff');
  grad.addColorStop(1, '#bfe4ff');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawSun(ctx) {
  ctx.save();
  ctx.translate(90, 80);
  ctx.fillStyle = 'rgba(255, 244, 200, 0.9)';
  ctx.shadowColor = 'rgba(255, 230, 150, 0.9)';
  ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.arc(0, 0, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255, 244, 200, 0.6)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 / 8) * i;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 38, Math.sin(a) * 38);
    ctx.lineTo(Math.cos(a) * 48, Math.sin(a) * 48);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawBirds(ctx, camX, WORLD_WIDTH, t) {
  ctx.strokeStyle = 'rgba(60, 70, 90, 0.5)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    const bx = (i * 300 - camX * 0.6 + t / 40) % (WORLD_WIDTH + 300) - 50;
    const by = 100 + (i % 2) * 40 + Math.sin(t / 400 + i) * 6;
    ctx.beginPath();
    ctx.moveTo(bx - 8, by);
    ctx.quadraticCurveTo(bx - 4, by - 6, bx, by);
    ctx.quadraticCurveTo(bx + 4, by - 6, bx + 8, by);
    ctx.stroke();
  }
}

export function drawMountains(ctx, camX, WORLD_WIDTH, GROUND_Y) {
  ctx.fillStyle = 'rgba(90, 110, 160, 0.45)';
  for (let i = 0; i < 5; i++) {
    const mx = (i * 420 - camX * 0.15) % (WORLD_WIDTH + 420) - 100;
    ctx.beginPath();
    ctx.moveTo(mx, GROUND_Y + 10);
    ctx.lineTo(mx + 110, GROUND_Y - 130);
    ctx.lineTo(mx + 220, GROUND_Y + 10);
    ctx.closePath();
    ctx.fill();
  }
}

export function drawBackgroundPipes(ctx, camX, canvas, GROUND_Y) {
  const pipeXs = [420, 1150, 1980];
  for (const px of pipeXs) {
    const drawX = px - camX * 0.55;
    if (drawX < -80 || drawX > canvas.width + 80) continue;
    const pw = 46, ph = 90, py = GROUND_Y - ph + 20;
    ctx.fillStyle = '#2e9e46';
    ctx.fillRect(drawX, py + 14, pw, ph - 14);
    ctx.fillStyle = '#238038';
    ctx.fillRect(drawX, py + 14, 8, ph - 14);
    ctx.fillStyle = '#3fbf5c';
    ctx.fillRect(drawX + pw - 10, py + 14, 6, ph - 14);
    ctx.fillStyle = '#2e9e46';
    ctx.fillRect(drawX - 6, py, pw + 12, 18);
    ctx.fillStyle = '#238038';
    ctx.fillRect(drawX - 6, py, 8, 18);
    ctx.fillStyle = '#3fbf5c';
    ctx.fillRect(drawX + pw - 4, py, 6, 18);
  }
}

export function drawCastle(ctx, camX, canvas, goal, GROUND_Y) {
  const baseX = goal.x + 90 - camX;
  if (baseX < -200 || baseX > canvas.width + 200) return;
  const w = 170, h = 130, y = GROUND_Y - h + 20;
  ctx.fillStyle = '#c9a876';
  ctx.fillRect(baseX, y, w, h);
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  for (let bx = 0; bx < w; bx += 20) ctx.fillRect(baseX + bx, y, 1, h);
  // crenellations
  ctx.fillStyle = '#c9a876';
  for (let cx = 0; cx < w; cx += 24) {
    ctx.fillRect(baseX + cx, y - 14, 16, 14);
  }
  // door
  ctx.fillStyle = '#4a2f1a';
  ctx.beginPath();
  ctx.moveTo(baseX + w/2 - 16, y + h);
  ctx.lineTo(baseX + w/2 - 16, y + h - 40);
  ctx.quadraticCurveTo(baseX + w/2, y + h - 60, baseX + w/2 + 16, y + h - 40);
  ctx.lineTo(baseX + w/2 + 16, y + h);
  ctx.closePath();
  ctx.fill();
  // small side tower
  ctx.fillStyle = '#b89968';
  ctx.fillRect(baseX - 30, y + 30, 30, h - 30);
  for (let cx = 0; cx < 30; cx += 15) ctx.fillRect(baseX - 30 + cx, y + 16, 12, 14);
  // window
  ctx.fillStyle = '#4a2f1a';
  ctx.fillRect(baseX + w/2 - 8, y + 24, 16, 16);
}

function drawCloud(ctx, x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.arc(x + 20, y - 8, 20, 0, Math.PI * 2);
  ctx.arc(x + 42, y, 18, 0, Math.PI * 2);
  ctx.fill();
}

export function drawBackgroundHills(ctx, camX, WORLD_WIDTH, GROUND_Y) {
  ctx.fillStyle = '#4fa84a';
  for (let i = 0; i < 6; i++) {
    const hx = (i * 500 - camX * 0.3) % (WORLD_WIDTH + 500);
    ctx.beginPath();
    ctx.arc(hx, GROUND_Y + 40, 80, Math.PI, 0);
    ctx.fill();
  }
  ctx.fillStyle = '#3d8f3a';
  for (let i = 0; i < 6; i++) {
    const hx = (i * 500 - camX * 0.3) % (WORLD_WIDTH + 500) + 60;
    ctx.beginPath();
    ctx.arc(hx, GROUND_Y + 55, 55, Math.PI, 0);
    ctx.fill();
  }
  // clouds
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 8; i++) {
    const cx = (i * 350 - camX * 0.5) % (WORLD_WIDTH + 350);
    const cy = 60 + (i % 3) * 30;
    drawCloud(ctx, cx, cy);
  }
}
