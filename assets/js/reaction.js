/* ============================================================
   FUNBOX — reaction.js
   Jeu "⚡ Temps de réaction" : écran rouge -> vert après un
   délai aléatoire, mesure du temps de clic, classification.
   ============================================================ */

let reactionState = {
  phase: 'idle', // idle | waiting | ready | tooSoon | result
  startTime: 0,
  timeoutId: null
};

function fbInitReaction() {
  FB.recordGamePlayed();
  const container = document.getElementById('game-reaction');
  container.innerHTML = `
    <div class="game-panel reaction-panel">
      ${FB_BACK_BTN}
      <h2 class="game-title"><i class="fa-solid fa-bolt"></i> Temps de réaction</h2>
      <div id="reaction-zone" class="reaction-zone reaction-idle">
        <p id="reaction-label">Clique pour commencer</p>
      </div>
      <p class="reaction-best" id="reaction-best"></p>
    </div>
  `;
  container.querySelector('[data-back]').addEventListener('click', () => {
    clearTimeout(reactionState.timeoutId);
    window.fbGoHome();
  });
  FB.initRipples(container);

  updateBestLabel();
  const zone = document.getElementById('reaction-zone');
  zone.addEventListener('click', handleZoneClick);
  reactionState.phase = 'idle';
}

function updateBestLabel() {
  const best = FB.getState().stats.reactionBest;
  const el = document.getElementById('reaction-best');
  el.textContent = best ? `Ton meilleur temps : ${best} ms` : `Aucun record pour l'instant`;
}

function handleZoneClick() {
  const zone = document.getElementById('reaction-zone');
  const label = document.getElementById('reaction-label');

  if (reactionState.phase === 'idle' || reactionState.phase === 'result' || reactionState.phase === 'tooSoon') {
    // Démarrer une nouvelle manche
    reactionState.phase = 'waiting';
    zone.className = 'reaction-zone reaction-waiting';
    label.textContent = 'Attends le vert...';
    const delay = 1200 + Math.random() * 2500;
    reactionState.timeoutId = setTimeout(() => {
      reactionState.phase = 'ready';
      reactionState.startTime = performance.now();
      zone.className = 'reaction-zone reaction-ready';
      label.textContent = 'CLIQUE MAINTENANT !';
    }, delay);
    return;
  }

  if (reactionState.phase === 'waiting') {
    // Cliqué trop tôt
    clearTimeout(reactionState.timeoutId);
    reactionState.phase = 'tooSoon';
    zone.className = 'reaction-zone reaction-toosoon';
    label.textContent = 'Trop tôt ! Reclique pour réessayer.';
    FB.sound.lose();
    return;
  }

  if (reactionState.phase === 'ready') {
    const elapsed = Math.round(performance.now() - reactionState.startTime);
    reactionState.phase = 'result';
    zone.className = 'reaction-zone reaction-result';

    let mention = '<i class="fa-solid fa-turtle"></i> Lent';
    if (elapsed < 220) mention = '<i class="fa-solid fa-bolt"></i> Excellent';
    else if (elapsed < 320) mention = '<i class="fa-solid fa-fire"></i> Bon';
    else if (elapsed < 450) mention = '<i class="fa-solid fa-thumbs-up"></i> Moyen';

    label.innerHTML = `${elapsed} ms<br><span class="reaction-mention">${mention}</span><br><small>Reclique pour rejouer</small>`;

    const state = FB.getState();
    if (!state.stats.reactionBest || elapsed < state.stats.reactionBest) {
      FB.updateStats({ reactionBest: elapsed });
      FB.showToast('<i class="fa-solid fa-trophy"></i> Nouveau record de réaction !', 3200, true);
    }
    updateBestLabel();

    if (elapsed < 320) {
      FB.recordWin();
      FB.sound.win();
    } else {
      FB.recordLoss();
    }
  }
}
