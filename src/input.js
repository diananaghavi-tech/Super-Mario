export const keys = {};

// Global key handling. State transitions (start/restart) are delegated to
// callbacks so this module doesn't need to know about game.js internals.
export function initInput({ getState, onStart, onRestart }) {
  window.addEventListener('keydown', e => {
    // Don't hijack keystrokes typed into the score-entry name field.
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

    keys[e.key.toLowerCase()] = true;
    if (e.key === ' ') e.preventDefault();

    if (getState() === 'title' && e.key.toLowerCase() !== 'r') {
      onStart();
    }
    if (e.key.toLowerCase() === 'r') onRestart();
  });
  window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
}

export function initCanvasClick(canvas, { getState, onStart }) {
  canvas.addEventListener('click', () => {
    if (getState() === 'title') onStart();
  });
}
