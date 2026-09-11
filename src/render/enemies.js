export function drawEnemies(ctx, camX, canvas, enemies) {
  for (const en of enemies) {
    if (!en.alive) continue;
    const drawX = en.x - camX;
    if (drawX + en.w < 0 || drawX > canvas.width) continue;
    ctx.save();
    ctx.translate(drawX + en.w / 2, en.y + en.h / 2);
    // body
    ctx.fillStyle = '#8b5a2b';
    ctx.beginPath();
    ctx.arc(0, 0, en.w / 2, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#c9986a';
    ctx.fillRect(-en.w / 2, 0, en.w, en.h / 2 - 2);
    // feet
    ctx.fillStyle = '#3b2313';
    ctx.fillRect(-en.w / 2, en.h / 2 - 4, 8, 4);
    ctx.fillRect(en.w / 2 - 8, en.h / 2 - 4, 8, 4);
    // eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-4, -2, 3, 0, Math.PI * 2);
    ctx.arc(4, -2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(-4, -1, 1.4, 0, Math.PI * 2);
    ctx.arc(4, -1, 1.4, 0, Math.PI * 2);
    ctx.fill();
    // angry brows
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-7, -6); ctx.lineTo(-1, -4);
    ctx.moveTo(7, -6); ctx.lineTo(1, -4);
    ctx.stroke();
    ctx.restore();
  }
}
