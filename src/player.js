import { PLAYER_SMALL, PLAYER_BIG } from './config.js';

export function createPlayer() {
  return {
    x: 40, y: 300, w: PLAYER_SMALL.w, h: PLAYER_SMALL.h,
    vx: 0, vy: 0,
    onGround: false,
    facing: 1,
    starsCollected: 0,
    lives: 3,
    walkPhase: 0,
    jumpsUsed: 0,
    big: false,
    invuln: 0,
  };
}

export function resetPlayerPosition(p) {
  p.x = 40; p.y = 300; p.vx = 0; p.vy = 0;
}

export function growPlayer(p) {
  if (p.big) return;
  p.big = true;
  const oldH = p.h;
  p.w = PLAYER_BIG.w;
  p.h = PLAYER_BIG.h;
  p.y -= (p.h - oldH);
}

export function shrinkPlayer(p) {
  if (!p.big) return;
  p.big = false;
  const oldH = p.h;
  p.w = PLAYER_SMALL.w;
  p.h = PLAYER_SMALL.h;
  p.y += (oldH - p.h);
}
