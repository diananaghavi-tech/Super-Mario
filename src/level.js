import { GROUND_Y } from './config.js';

// Platforms: x, y, width, height
export const platforms = [
  { x: 0,    y: GROUND_Y, w: 500,  h: 50 },
  { x: 560,  y: GROUND_Y, w: 260,  h: 50 },
  { x: 900,  y: GROUND_Y, w: 400,  h: 50 },
  { x: 1380, y: GROUND_Y, w: 300,  h: 50 },
  { x: 1760, y: GROUND_Y, w: 640,  h: 50 },
  // floating platforms
  { x: 250,  y: 300, w: 100, h: 20 },
  { x: 620,  y: 260, w: 100, h: 20 },
  { x: 780,  y: 320, w: 90,  h: 20 },
  { x: 1000, y: 280, w: 110, h: 20 },
  { x: 1200, y: 220, w: 100, h: 20 },
  { x: 1450, y: 300, w: 100, h: 20 },
  { x: 1600, y: 240, w: 100, h: 20 },
  { x: 1900, y: 300, w: 120, h: 20 },
  { x: 2100, y: 250, w: 100, h: 20 },
];

// Gaps (pits) - defined as x ranges where there's no ground so falling = death
export const pits = [
  { x1: 500, x2: 560 },
  { x1: 820, x2: 900 },
  { x1: 1300, x2: 1380 },
  { x1: 1680, x2: 1760 },
];

// Stars to collect
export const stars = [
  { x: 280, y: 260, taken: false },
  { x: 650, y: 220, taken: false },
  { x: 810, y: 280, taken: false },
  { x: 1030, y: 240, taken: false },
  { x: 1230, y: 180, taken: false },
  { x: 1480, y: 260, taken: false },
  { x: 1630, y: 200, taken: false },
  { x: 1930, y: 260, taken: false },
  { x: 2130, y: 210, taken: false },
  { x: 2300, y: 350, taken: false },
];

// Mushrooms: grow the player and grant one hit of protection against enemies
export const mushrooms = [
  { x: 190, y: GROUND_Y - 20, taken: false },
  { x: 950, y: GROUND_Y - 20, taken: false },
  { x: 1420, y: 270, taken: false },
  { x: 2000, y: GROUND_Y - 20, taken: false },
];

// Simple flagpole goal at the end
export const goal = { x: 2350, y: 250, w: 20, h: 150 };

export function resetCollectibles() {
  stars.forEach(s => { s.taken = false; });
  mushrooms.forEach(m => { m.taken = false; });
}
