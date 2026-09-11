function drawBush(ctx, drawX, y) {
  ctx.fillStyle = '#3d8f3a';
  ctx.beginPath();
  ctx.arc(drawX, y, 10, Math.PI, 0);
  ctx.arc(drawX + 12, y - 4, 13, Math.PI, 0);
  ctx.arc(drawX + 26, y, 10, Math.PI, 0);
  ctx.fill();
}

export function drawPlatforms(ctx, camX, canvas, platforms, GROUND_Y) {
  for (const p of platforms) {
    const drawX = p.x - camX;
    if (drawX + p.w < 0 || drawX > canvas.width) continue;
    const isGround = p.y === GROUND_Y;

    if (isGround) {
      // dirt block style with brick seams
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(drawX, p.y, p.w, p.h);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1;
      for (let bx = 0; bx < p.w; bx += 24) {
        ctx.beginPath();
        ctx.moveTo(drawX + bx, p.y + 10);
        ctx.lineTo(drawX + bx, p.y + p.h);
        ctx.stroke();
      }
      ctx.fillStyle = '#5aa64c';
      ctx.fillRect(drawX, p.y, p.w, 10);
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(drawX, p.y, p.w, 3);

      // grass tufts + occasional flowers along the top edge
      for (let gx = 6; gx < p.w - 6; gx += 18) {
        const wx = p.x + gx;
        ctx.fillStyle = '#3d8f3a';
        ctx.beginPath();
        ctx.moveTo(drawX + gx - 3, p.y);
        ctx.lineTo(drawX + gx, p.y - 6);
        ctx.lineTo(drawX + gx + 3, p.y);
        ctx.fill();
        if (Math.floor(wx / 18) % 5 === 0) {
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(drawX + gx, p.y - 9, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffd700';
          ctx.beginPath();
          ctx.arc(drawX + gx, p.y - 9, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // foreground bushes every so often
      if (p.w > 90) drawBush(ctx, drawX + p.w / 2 - 13, p.y);
    } else {
      // floating wooden plank platform
      ctx.fillStyle = '#a9773c';
      ctx.fillRect(drawX, p.y, p.w, p.h);
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      for (let gy = 4; gy < p.h; gy += 6) {
        ctx.beginPath();
        ctx.moveTo(drawX + 3, p.y + gy);
        ctx.lineTo(drawX + p.w - 3, p.y + gy);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(drawX, p.y, p.w, 3);
      // metal end brackets
      ctx.fillStyle = '#5b5b5b';
      ctx.fillRect(drawX + 2, p.y, 6, p.h);
      ctx.fillRect(drawX + p.w - 8, p.y, 6, p.h);
      ctx.fillStyle = '#8c8c8c';
      ctx.beginPath();
      ctx.arc(drawX + 5, p.y + p.h / 2, 2, 0, Math.PI * 2);
      ctx.arc(drawX + p.w - 5, p.y + p.h / 2, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function drawStar(ctx, camX, canvas, x, y, taken, t) {
  if (taken) return;
  const drawX = x - camX;
  if (drawX < -30 || drawX > canvas.width + 30) return;
  const bob = Math.sin(t / 300 + x) * 4;
  const scale = 1 + Math.sin(t / 200 + x) * 0.12;
  ctx.save();
  ctx.translate(drawX, y + bob);
  ctx.scale(scale, scale);
  ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#ffd700';
  ctx.strokeStyle = '#c98e00';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
    const outerX = Math.cos(angle) * 12;
    const outerY = Math.sin(angle) * 12;
    const innerAngle = angle + Math.PI / 5;
    const innerX = Math.cos(innerAngle) * 5;
    const innerY = Math.sin(innerAngle) * 5;
    if (i === 0) ctx.moveTo(outerX, outerY);
    else ctx.lineTo(outerX, outerY);
    ctx.lineTo(innerX, innerY);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function drawMushroom(ctx, camX, canvas, x, y, taken) {
  if (taken) return;
  const drawX = x - camX;
  if (drawX < -30 || drawX > canvas.width + 30) return;
  ctx.save();
  ctx.translate(drawX, y);
  // stem
  ctx.fillStyle = '#f3e0c0';
  ctx.fillRect(-6, 2, 12, 10);
  // cap
  ctx.fillStyle = '#e0333f';
  ctx.beginPath();
  ctx.arc(0, 0, 12, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-6, -5, 2.6, 0, Math.PI * 2);
  ctx.arc(6, -5, 2.6, 0, Math.PI * 2);
  ctx.arc(0, -9, 2.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawGoalFlag(ctx, camX, goal) {
  const drawX = goal.x - camX;
  ctx.fillStyle = '#cccccc';
  ctx.fillRect(drawX, goal.y - goal.h + 20, 4, goal.h);
  ctx.beginPath();
  ctx.arc(drawX + 2, goal.y - goal.h + 18, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#ffe066';
  ctx.fill();
  ctx.fillStyle = '#ff3b3b';
  const wave = Math.sin(Date.now() / 250) * 4;
  ctx.beginPath();
  ctx.moveTo(drawX + 4, goal.y - goal.h + 25);
  ctx.quadraticCurveTo(drawX + 20 + wave, goal.y - goal.h + 31, drawX + 34, goal.y - goal.h + 38);
  ctx.quadraticCurveTo(drawX + 20 + wave, goal.y - goal.h + 45, drawX + 4, goal.y - goal.h + 51);
  ctx.closePath();
  ctx.fill();
}

export function drawHUDVignette(ctx, canvas) {
  const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.height/2.2, canvas.width/2, canvas.height/2, canvas.height);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.25)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
