import { GRAVITY, FRICTION, WALK_SPEED, RUN_SPEED, JUMP_FORCE, DOUBLE_JUMP_FORCE, WORLD_WIDTH, GROUND_Y } from './config.js';
import { platforms, pits, stars, mushrooms, goal, resetCollectibles } from './level.js';
import { makeEnemies } from './enemies.js';
import { rectsOverlap } from './physics.js';
import { createPlayer, resetPlayerPosition, growPlayer, shrinkPlayer } from './player.js';
import { spawnBurst, updateParticles, drawParticles, clearParticles } from './particles.js';
import { keys, initInput, initCanvasClick } from './input.js';
import { setStarTotal, setStarCount, setLives, hideTitleOverlay, showMessage, hideMessage } from './hud.js';
import { showScoreEntry } from './leaderboardUI.js';
import { drawSky, drawSun, drawBirds, drawMountains, drawBackgroundHills, drawBackgroundPipes, drawCastle } from './render/background.js';
import { drawPlatforms, drawStar, drawMushroom, drawGoalFlag, drawHUDVignette } from './render/world.js';
import { drawEnemies } from './render/enemies.js';
import { drawPlayer } from './render/player.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let camX = 0;
let gameState = 'title'; // title, playing, won, dead
let jumpKeyWasDown = false;
let enemies = makeEnemies();
let player = createPlayer();

setStarTotal(stars.length);

function startGame() {
  gameState = 'playing';
  hideTitleOverlay();
  jumpKeyWasDown = true; // don't let the key that starts the game also count as a jump
}

function update() {
  if (gameState !== 'playing') { updateParticles(); return; }

  const running = keys['shift'];
  const maxSpeed = running ? RUN_SPEED : WALK_SPEED;

  // Horizontal input
  let moving = false;
  if (keys['arrowleft'] || keys['a']) {
    player.vx -= running ? 1.6 : 1;
    player.facing = -1;
    moving = true;
  }
  if (keys['arrowright'] || keys['d']) {
    player.vx += running ? 1.6 : 1;
    player.facing = 1;
    moving = true;
  }
  player.vx *= FRICTION;
  if (Math.abs(player.vx) > maxSpeed) player.vx = maxSpeed * Math.sign(player.vx);

  if (moving && player.onGround) player.walkPhase += running ? 0.55 : 0.35;

  // Jump / double jump (edge-triggered so holding the key doesn't chain-jump)
  const jumpPressed = keys['arrowup'] || keys['w'] || keys[' '];
  if (jumpPressed && !jumpKeyWasDown) {
    if (player.onGround) {
      player.vy = JUMP_FORCE;
      player.onGround = false;
      player.jumpsUsed = 1;
    } else if (player.jumpsUsed < 2) {
      player.vy = DOUBLE_JUMP_FORCE;
      player.jumpsUsed = 2;
      spawnBurst(player.x - camX + player.w / 2, player.y + player.h / 2, '255, 255, 255');
    }
  }
  jumpKeyWasDown = jumpPressed;

  // Gravity
  player.vy += GRAVITY;
  if (player.vy > 15) player.vy = 15;

  // Move horizontally then resolve collisions
  player.x += player.vx;
  player.onGround = false;

  for (const p of platforms) {
    if (rectsOverlap(player, p)) {
      // Resolve based on overlap direction (simple approach)
      const overlapLeft = (player.x + player.w) - p.x;
      const overlapRight = (p.x + p.w) - player.x;
      if (player.vx > 0 && overlapLeft < 20) {
        player.x = p.x - player.w;
      } else if (player.vx < 0 && overlapRight < 20) {
        player.x = p.x + p.w;
      }
    }
  }

  // Move vertically then resolve collisions
  player.y += player.vy;
  for (const p of platforms) {
    if (rectsOverlap(player, p)) {
      if (player.vy > 0) {
        // landing on top
        player.y = p.y - player.h;
        player.vy = 0;
        player.onGround = true;
        player.jumpsUsed = 0;
      } else if (player.vy < 0) {
        // hit head
        player.y = p.y + p.h;
        player.vy = 0;
      }
    }
  }

  // Fell into a pit or off the world -> lose a life
  const inPit = pits.some(pit => player.x + player.w/2 > pit.x1 && player.x + player.w/2 < pit.x2);
  if (player.y > 500 || (inPit && player.y > GROUND_Y)) {
    loseLife();
  }

  // World bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.w > WORLD_WIDTH) player.x = WORLD_WIDTH - player.w;

  // Star collection
  for (const s of stars) {
    if (!s.taken) {
      const starBox = { x: s.x - 12, y: s.y - 12, w: 24, h: 24 };
      if (rectsOverlap(player, starBox)) {
        s.taken = true;
        player.starsCollected++;
        setStarCount(player.starsCollected);
        spawnBurst(s.x - camX, s.y, '255, 215, 0');
      }
    }
  }

  // Mushroom collection - grows the player and grants a hit of protection
  for (const m of mushrooms) {
    if (!m.taken) {
      const mBox = { x: m.x - 12, y: m.y - 12, w: 24, h: 24 };
      if (rectsOverlap(player, mBox)) {
        m.taken = true;
        growPlayer(player);
        spawnBurst(m.x - camX, m.y, '220, 60, 60');
      }
    }
  }

  if (player.invuln > 0) player.invuln--;

  // Enemies: patrol, get stomped from above, or damage the player on contact
  for (const en of enemies) {
    if (!en.alive) continue;
    en.x += en.vx;
    if (en.x < en.minX) { en.x = en.minX; en.vx = Math.abs(en.vx); }
    if (en.x + en.w > en.maxX) { en.x = en.maxX - en.w; en.vx = -Math.abs(en.vx); }

    if (rectsOverlap(player, en)) {
      const stomping = player.vy > 0 && (player.y + player.h - en.y) < 14;
      if (stomping) {
        en.alive = false;
        player.vy = JUMP_FORCE * 0.55;
        spawnBurst(en.x - camX + en.w / 2, en.y, '150, 100, 60');
      } else if (player.invuln <= 0) {
        const knockDir = (player.x + player.w / 2 < en.x + en.w / 2) ? -1 : 1;
        if (player.big) {
          shrinkPlayer(player);
          player.invuln = 90;
          player.vx = knockDir * 6;
          player.vy = -6;
        } else {
          loseLife();
          player.invuln = 90;
          player.vx = knockDir * 6;
          player.vy = -6;
        }
      }
    }
  }

  // Goal check
  if (rectsOverlap(player, goal)) {
    winGame();
  }

  // Camera follows player, clamped to world
  camX = player.x - 300;
  if (camX < 0) camX = 0;
  if (camX > WORLD_WIDTH - canvas.width) camX = WORLD_WIDTH - canvas.width;

  updateParticles();
}

function loseLife() {
  player.lives--;
  setLives(player.lives);
  if (player.lives <= 0) {
    gameState = 'dead';
    showMessage('GAME OVER', 'You ran out of lives. Stars collected: ' + player.starsCollected + '/' + stars.length);
    showScoreEntry(player.starsCollected);
  } else {
    resetPlayerPosition(player);
    shrinkPlayer(player);
    player.invuln = 90;
  }
}

function winGame() {
  gameState = 'won';
  showMessage('YOU WIN!', 'You reached the flag with ' + player.starsCollected + '/' + stars.length + ' stars.');
  showScoreEntry(player.starsCollected);
}

function restart() {
  player = createPlayer();
  resetCollectibles();
  enemies = makeEnemies();
  setStarCount(0);
  setLives(player.lives);
  clearParticles();
  jumpKeyWasDown = false;
  gameState = 'playing';
  hideTitleOverlay();
  hideMessage();
}

function draw() {
  const t = Date.now();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSky(ctx, canvas);
  drawSun(ctx);
  drawBirds(ctx, camX, WORLD_WIDTH, t);
  drawMountains(ctx, camX, WORLD_WIDTH, GROUND_Y);
  drawBackgroundHills(ctx, camX, WORLD_WIDTH, GROUND_Y);
  drawBackgroundPipes(ctx, camX, canvas, GROUND_Y);
  drawCastle(ctx, camX, canvas, goal, GROUND_Y);
  drawPlatforms(ctx, camX, canvas, platforms, GROUND_Y);
  stars.forEach(s => drawStar(ctx, camX, canvas, s.x, s.y, s.taken, t));
  mushrooms.forEach(m => drawMushroom(ctx, camX, canvas, m.x, m.y, m.taken));
  drawEnemies(ctx, camX, canvas, enemies);
  drawGoalFlag(ctx, camX, goal);
  if (player.invuln <= 0 || Math.floor(t / 80) % 2 === 0) drawPlayer(ctx, camX, player);
  drawParticles(ctx);
  drawHUDVignette(ctx, canvas);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

export function init() {
  initInput({
    getState: () => gameState,
    onStart: startGame,
    onRestart: restart,
  });
  initCanvasClick(canvas, {
    getState: () => gameState,
    onStart: startGame,
  });
  loop();
}
