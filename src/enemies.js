import { GROUND_Y, ENEMY_SPEED } from './config.js';

// Goombas that patrol a fixed range and must be jumped on or avoided.
export function makeEnemies() {
  return [
    { x: 300, y: GROUND_Y - 24, w: 24, h: 24, minX: 260, maxX: 460, vx: ENEMY_SPEED, alive: true },
    { x: 950, y: GROUND_Y - 24, w: 24, h: 24, minX: 910, maxX: 1260, vx: ENEMY_SPEED, alive: true },
    { x: 1420, y: GROUND_Y - 24, w: 24, h: 24, minX: 1390, maxX: 1650, vx: -ENEMY_SPEED, alive: true },
    { x: 1900, y: GROUND_Y - 24, w: 24, h: 24, minX: 1780, maxX: 2350, vx: ENEMY_SPEED, alive: true },
  ];
}
