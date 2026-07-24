/* ============================================================
   FUNBOX — bomb.js
   Jeu "💣 Trouve la bombe" : grille 5x5, une seule bombe cachée,
   animation d'explosion si on tombe dessus.
   ============================================================ */

const BOMB_GRID_SIZE = 5;

let bombState = {
  bombIndex: -1,
  revealed: new Set(),
  finished: false
};

function fbInitBomb() {
  FB.recordGamePlayed();
  const total = BOMB_GRID_SIZE * BOMB_GRID_SIZE;
  bombState = {
    bombIndex: Math.floor(Math.random() * total),
    revealed: new Set(),
    finished: false
  };
  renderBomb();
}

function renderBomb() {
  const container = document.getElementById('game-bomb');
  container.innerHTML = `
    <div class="game-panel bomb-panel">
      ${FB_BACK_BTN}
      <h2 class="game-title"><i class="fa-solid fa-bomb"></i> Trouve la bombe</h2>
      <p class="bomb-instructions">Clique sur les cases : une seule cache la bombe. Ouvre-en le plus possible sans exploser !</p>
      <div id="bomb-grid" class="bomb-grid"></div>
      <p id="bomb-status" class="bomb-status"></p>
      <div id="bomb-actions" class="hidden">
        <button class="btn btn-primary ripple-target" id="bomb-replay"><i class="fa-solid fa-rotate-right"></i> Rejouer</button>
      </div>
    </div>
  `;
  container.querySelector('[data-back]').addEventListener('click', () => window.fbGoHome());
  FB.initRipples(container);

  const grid = document.getElementById('bomb-grid');
  const total = BOMB_GRID_SIZE * BOMB_GRID_SIZE;
  for (let i = 0; i < total; i++) {
    const cell = document.createElement('button');
    cell.className = 'bomb-cell ripple-target';
    cell.dataset.index = i;
    cell.addEventListener('click', () => revealCell(i, cell));
    grid.appendChild(cell);
  }
  FB.initRipples(grid);
}

function revealCell(index, cell) {
  if (bombState.finished || bombState.revealed.has(index)) return;
  bombState.revealed.add(index);
  cell.disabled = true;

  if (index === bombState.bombIndex) {
    cell.innerHTML = '<i class="fa-solid fa-burst"></i>';
    cell.classList.add('bomb-hit');
    triggerExplosion();
  } else {
    cell.innerHTML = '<i class="fa-solid fa-star"></i>';
    cell.classList.add('bomb-safe');
    FB.sound.click();
    checkBombWin();
  }
}

function triggerExplosion() {
  bombState.finished = true;
  FB.sound.explosion();
  document.getElementById('bomb-grid').classList.add('shake');
  const status = document.getElementById('bomb-status');
  status.innerHTML = '<i class="fa-solid fa-burst"></i> Boom ! Tu as trouvé la bombe...';
  status.classList.add('status-lose');
  revealAllBombCells();
  document.getElementById('bomb-actions').classList.remove('hidden');
  document.getElementById('bomb-replay').addEventListener('click', fbInitBomb);
  FB.recordLoss();
}

function checkBombWin() {
  const total = BOMB_GRID_SIZE * BOMB_GRID_SIZE;
  if (bombState.revealed.size === total - 1) {
    bombState.finished = true;
    const status = document.getElementById('bomb-status');
    status.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Incroyable, tu as désamorcé toute la grille !';
    status.classList.add('status-win');
    document.getElementById('bomb-actions').classList.remove('hidden');
    document.getElementById('bomb-replay').addEventListener('click', fbInitBomb);
    FB.sound.win();
    FB.confettiBurst(0.5, 0.4, 90);
    FB.recordWin();
  }
}

function revealAllBombCells() {
  const cells = document.querySelectorAll('.bomb-cell');
  cells.forEach((cell, i) => {
    cell.disabled = true;
    if (i === bombState.bombIndex) {
      cell.innerHTML = '<i class="fa-solid fa-bomb"></i>';
      cell.classList.add('bomb-hit');
    } else if (!bombState.revealed.has(i)) {
      cell.innerHTML = '';
      cell.classList.add('bomb-dim');
    }
  });
}
