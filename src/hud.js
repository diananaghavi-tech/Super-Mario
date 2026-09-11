const starCountEl = document.getElementById('starCount');
const starTotalEl = document.getElementById('starTotal');
const livesEl = document.getElementById('lives');
const titleOverlay = document.getElementById('titleOverlay');
const msgOverlay = document.getElementById('msgOverlay');
const msgTitle = document.getElementById('msgTitle');
const msgBody = document.getElementById('msgBody');

export function setStarTotal(n) { starTotalEl.textContent = n; }
export function setStarCount(n) { starCountEl.textContent = n; }
export function setLives(n) { livesEl.textContent = n; }

export function hideTitleOverlay() { titleOverlay.classList.remove('visible'); }

export function showMessage(title, body) {
  msgTitle.textContent = title;
  msgBody.textContent = body;
  msgOverlay.classList.add('visible');
}
export function hideMessage() { msgOverlay.classList.remove('visible'); }
