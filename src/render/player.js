export function drawPlayer(ctx, camX, player) {
  const drawX = player.x - camX;
  const drawY = player.y;
  const squash = Math.max(-0.25, Math.min(0.25, player.vy / 30));
  ctx.save();
  ctx.translate(drawX + player.w / 2, drawY + player.h / 2);
  ctx.scale(player.facing * (1 - squash * 0.3), 1 + squash * 0.3);

  const legSwing = player.onGround ? Math.sin(player.walkPhase) * 6 : 0;
  const w = player.w, h = player.h;
  const scarfWave = Math.sin(Date.now() / 150) * 5 + player.vx * 1.5;

  // trailing scarf, behind the body
  ctx.fillStyle = '#e0a940';
  ctx.beginPath();
  ctx.moveTo(-w/2 + 2, -h/2 + 10);
  ctx.quadraticCurveTo(-w/2 - 10 - scarfWave, -h/2 + 4, -w/2 - 14 - scarfWave, h/2 - 8);
  ctx.quadraticCurveTo(-w/2 - 4, h/2 - 4, -w/2 + 2, h/2 - 14);
  ctx.closePath();
  ctx.fill();

  // boots
  ctx.fillStyle = '#4a3320';
  ctx.fillRect(-w/2 + 1, h/2 - 5 + Math.max(0, -legSwing * 0.3), 9, 6);
  ctx.fillRect(w/2 - 10, h/2 - 5 + Math.max(0, legSwing * 0.3), 9, 6);

  // legs (dark trousers)
  ctx.fillStyle = '#2e3b2a';
  ctx.fillRect(-w/2 + 2, h/2 - 13, 8, 11 + legSwing * 0.3);
  ctx.fillRect(w/2 - 10, h/2 - 13, 8, 11 - legSwing * 0.3);

  // hands
  ctx.fillStyle = '#ffe0c2';
  ctx.beginPath();
  ctx.arc(-w/2 - 1, 2 + legSwing * 0.4, 3.5, 0, Math.PI * 2);
  ctx.arc(w/2 + 1, 2 - legSwing * 0.4, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // long green coat
  ctx.fillStyle = '#2f7d4f';
  ctx.beginPath();
  ctx.moveTo(-w/2, -h/2 + 8);
  ctx.lineTo(-w/2 - 2, h/2 - 10);
  ctx.lineTo(w/2 + 2, h/2 - 10);
  ctx.lineTo(w/2, -h/2 + 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3f9463';
  ctx.fillRect(-w/2, -h/2 + 8, w, 6);

  // scarf knot at the neck (in front)
  ctx.fillStyle = '#e0a940';
  ctx.beginPath();
  ctx.arc(0, -h/2 + 10, 5, 0, Math.PI * 2);
  ctx.fill();

  // head
  ctx.fillStyle = '#ffe0c2';
  ctx.fillRect(-w/2 + 4, -h/2 - 6, w - 8, 14);

  // golden tousled hair
  ctx.fillStyle = '#f0c04a';
  ctx.beginPath();
  ctx.moveTo(-w/2 + 3, -h/2 - 5);
  ctx.lineTo(-w/2 + 1, -h/2 - 13);
  ctx.lineTo(-w/2 + 6, -h/2 - 8);
  ctx.lineTo(-w/2 + 8, -h/2 - 14);
  ctx.lineTo(-w/2 + 11, -h/2 - 7);
  ctx.lineTo(-w/2 + 14, -h/2 - 13);
  ctx.lineTo(w/2 - 5, -h/2 - 9);
  ctx.lineTo(w/2 - 3, -h/2 - 4);
  ctx.closePath();
  ctx.fill();

  // eye
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(w/2 - 10, -h/2 - 2, 3, 3);

  ctx.restore();
}
