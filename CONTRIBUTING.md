# Working in parallel on this game

The game used to be one ~1000-line HTML file, which meant any two people (or
agents) working at the same time were almost guaranteed to edit the same
lines and produce a merge conflict. It's now split by concern so independent
work lands in independent files:

```
index.html            markup only
styles.css            all CSS
src/config.js         tunable constants (speeds, gravity, sizes)
src/level.js          platforms, pits, stars, mushrooms, goal
src/enemies.js        enemy spawn/patrol data
src/player.js         player create/grow/shrink
src/physics.js        collision helpers
src/particles.js      particle burst effects
src/input.js          keyboard/click handling
src/hud.js            DOM/score/overlay updates
src/render/*.js       drawing: background, world, player, enemies
src/game.js           orchestrates update()/draw()/game state - the one file
                       that touches most of the others
src/main.js           entry point
```

## Guidelines for low-conflict parallel work

- **Scope each PR to one module or one `src/render/*` file** where possible
  (e.g. "retune enemy speed" touches only `src/enemies.js` and
  `src/config.js`; "redesign the HUD" touches only `src/hud.js`,
  `styles.css`, and `index.html`).
- **Treat `src/game.js` as a hot file.** It's the orchestrator, so it's the
  one place multiple features are likely to need a small edit (a new
  import, a new call in `update()` or `draw()`). Keep those edits minimal
  and additive (add a line, don't restructure existing lines) to reduce
  conflict surface.
- **Before pushing**, run the same checks CI runs:
  ```
  for f in $(find src -name '*.js'); do node --check "$f"; done
  node .github/scripts/check-imports.js
  node .github/scripts/check-html-refs.js
  ```
- **Keep modules pure where possible** (render functions take `ctx` and data
  in as arguments rather than reaching for globals) — that's what lets two
  people edit two render files at once without touching shared state.
