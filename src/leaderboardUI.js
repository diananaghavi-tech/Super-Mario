import { submitScore, fetchTopScores } from './leaderboard.js';

const scoreForm = document.getElementById('scoreForm');
const playerNameInput = document.getElementById('playerNameInput');
const scoreStatus = document.getElementById('scoreStatus');
const leaderboardList = document.getElementById('leaderboardList');

let pendingScore = 0;
let submitHandlerAttached = false;

function renderList(rows) {
  leaderboardList.innerHTML = '';
  for (const row of rows) {
    const li = document.createElement('li');
    li.textContent = `${row.player_name} — ${row.score}`;
    leaderboardList.appendChild(li);
  }
}

export async function refreshLeaderboard() {
  try {
    const rows = await fetchTopScores(10);
    renderList(rows);
  } catch (err) {
    leaderboardList.innerHTML = '';
    scoreStatus.textContent = 'Could not load the leaderboard.';
  }
}

// Called when a run ends (win or death) with the score for that run.
export function showScoreEntry(score) {
  pendingScore = score;
  scoreStatus.textContent = '';
  playerNameInput.value = '';
  playerNameInput.disabled = false;
  scoreForm.querySelector('button').disabled = false;

  refreshLeaderboard();

  if (!submitHandlerAttached) {
    submitHandlerAttached = true;
    scoreForm.addEventListener('submit', async e => {
      e.preventDefault();
      const name = playerNameInput.value.trim();
      if (!name) return;

      playerNameInput.disabled = true;
      scoreForm.querySelector('button').disabled = true;
      scoreStatus.textContent = 'Saving...';
      try {
        await submitScore(name, pendingScore);
        scoreStatus.textContent = 'Saved!';
        await refreshLeaderboard();
      } catch (err) {
        scoreStatus.textContent = 'Could not save your score.';
        playerNameInput.disabled = false;
        scoreForm.querySelector('button').disabled = false;
      }
    });
  }
}
