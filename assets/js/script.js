/* ============================================================
   FUNBOX — script.js
   Point d'entrée principal : splash screen, navigation entre
   les écrans (SPA maison sans framework), thème clair/sombre,
   panneau de statistiques et succès, réglages du son.
   ============================================================ */

const GAME_CARDS = [
  { id: 'quiz', icon: 'fa-solid fa-brain', code: '01', title: 'Quiz', desc: '20 questions pour tester le groupe', init: () => fbInitQuiz() },
  { id: 'jokes', icon: 'fa-solid fa-face-laugh-squint', code: '02', title: 'Blagues', desc: '50 blagues à dégainer sans prévenir', init: () => fbInitJokes() },
  { id: 'gift', icon: 'fa-solid fa-gift', code: '03', title: 'Cadeau mystère', desc: 'Ouvre et découvre la surprise', init: () => fbInitGift() },
  { id: 'wheel', icon: 'fa-solid fa-circle-notch', code: '04', title: 'Roue de la chance', desc: 'Un gage tiré au sort t\'attend', init: () => fbInitWheel() },
  { id: 'reaction', icon: 'fa-solid fa-bolt', code: '05', title: 'Temps de réaction', desc: 'Sois le plus rapide du groupe', init: () => fbInitReaction() },
  { id: 'bomb', icon: 'fa-solid fa-bomb', code: '06', title: 'Trouve la bombe', desc: 'Une grille, une bombe, du courage', init: () => fbInitBomb() },
  { id: 'hangman', icon: 'fa-solid fa-puzzle-piece', code: '07', title: 'Pendu', desc: '30 mots à deviner lettre par lettre', init: () => fbInitHangman() },
  { id: 'riddles', icon: 'fa-solid fa-circle-question', code: '08', title: 'Devinette', desc: '50 énigmes, réponse cachée', init: () => fbInitRiddles() },
  { id: 'compliments', icon: 'fa-solid fa-heart', code: '09', title: 'Compliment', desc: 'Une dose de gentillesse aléatoire', init: () => fbInitCompliments() }
];

/* ------------------------------------------------------------
   Navigation entre écrans
------------------------------------------------------------ */
function fbGoHome() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-home').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderStatsBar();
}
window.fbGoHome = fbGoHome;

const FB_BACK_BTN = '<button class="btn btn-ghost back-btn ripple-target" data-back><i class="fa-solid fa-chevron-left"></i> Retour</button>';

function fbOpenGame(gameId) {
  const card = GAME_CARDS.find(g => g.id === gameId);
  if (!card) return;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + gameId).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'auto' });
  card.init();
}

/* ------------------------------------------------------------
   Construction de la page d'accueil
------------------------------------------------------------ */
function renderHomeCards() {
  const grid = document.getElementById('cards-grid');
  grid.innerHTML = GAME_CARDS.map((g, i) => `
    <button class="card ripple-target" style="--delay:${i * 60}ms" data-game="${g.id}">
      <span class="card-code">MODE ${g.code}</span>
      <span class="card-icon"><i class="${g.icon}"></i></span>
      <span class="card-title">${g.title}</span>
      <span class="card-desc">${g.desc}</span>
      <span class="card-arrow"><i class="fa-solid fa-arrow-right"></i></span>
    </button>
  `).join('');

  grid.querySelectorAll('.card').forEach(cardEl => {
    cardEl.addEventListener('click', () => {
      FB.sound.click();
      fbOpenGame(cardEl.dataset.game);
    });
  });
  FB.initRipples(grid);
}

function renderGameScreens() {
  const root = document.getElementById('game-screens');
  root.innerHTML = GAME_CARDS.map(g => `
    <section id="screen-${g.id}" class="screen">
      <div id="game-${g.id}" class="game-container"></div>
    </section>
  `).join('');
}

/* ------------------------------------------------------------
   Barre de stats rapide sur la home
------------------------------------------------------------ */
function renderStatsBar() {
  const s = FB.getState().stats;
  const bar = document.getElementById('stats-bar');
  if (!bar) return;
  bar.innerHTML = `
    <div class="stat-chip"><i class="fa-solid fa-dice stat-icon"></i><span class="stat-value">${s.gamesPlayed}</span><span class="stat-label">Parties</span></div>
    <div class="stat-chip"><i class="fa-solid fa-medal stat-icon"></i><span class="stat-value">${s.wins}</span><span class="stat-label">Victoires</span></div>
    <div class="stat-chip"><i class="fa-solid fa-fire stat-icon"></i><span class="stat-value">${s.bestStreak}</span><span class="stat-label">Meilleure série</span></div>
  `;
}

/* ------------------------------------------------------------
   Panneau Succès / Statistiques (modal)
------------------------------------------------------------ */
function openAchievementsModal() {
  FB.sound.click();
  const s = FB.getState();
  const modal = document.getElementById('modal-overlay');
  const body = document.getElementById('modal-body');

  const achievementsHtml = FB.ACHIEVEMENT_DEFS.map(a => {
    const unlocked = !!s.achievements[a.id];
    return `
      <div class="achievement-row ${unlocked ? 'unlocked' : 'locked'}">
        <span class="achievement-icon"><i class="${unlocked ? a.icon : 'fa-solid fa-lock'}"></i></span>
        <div>
          <p class="achievement-label">${a.label}</p>
          <p class="achievement-desc">${a.desc}</p>
        </div>
      </div>
    `;
  }).join('');

  body.innerHTML = `
    <h3 class="modal-title"><i class="fa-solid fa-trophy"></i> Succès &amp; statistiques</h3>
    <div class="stats-grid">
      <div class="stat-box"><span class="stat-box-value">${s.stats.gamesPlayed}</span><span>Parties jouées</span></div>
      <div class="stat-box"><span class="stat-box-value">${s.stats.wins}</span><span>Victoires</span></div>
      <div class="stat-box"><span class="stat-box-value">${s.stats.bestStreak}</span><span>Meilleure série</span></div>
      <div class="stat-box"><span class="stat-box-value">${s.stats.quizBest}</span><span>Meilleur score Quiz</span></div>
      <div class="stat-box"><span class="stat-box-value">${s.stats.reactionBest ? s.stats.reactionBest + ' ms' : '—'}</span><span>Meilleur réflexe</span></div>
    </div>
    <div class="achievements-list">${achievementsHtml}</div>
  `;
  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

/* ------------------------------------------------------------
   Réglages : thème + son
------------------------------------------------------------ */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  FB.getState().settings.theme = theme;
  FB.save();
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '🌙' : '☀️';
}

function applySoundIcon() {
  const btn = document.getElementById('sound-toggle');
  if (!btn) return;
  btn.textContent = FB.getState().settings.sound ? '🔊' : '🔇';
}

/* ------------------------------------------------------------
   Splash screen
------------------------------------------------------------ */
function playSplashThenReveal() {
  const splash = document.getElementById('splash-screen');
  const app = document.getElementById('app');
  setTimeout(() => {
    splash.classList.add('fade-out');
    app.classList.add('visible');
    setTimeout(() => splash.remove(), 700);
  }, 1500);
}

/* ------------------------------------------------------------
   Initialisation générale
------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  // Thème + son initiaux
  applyTheme(FB.getState().settings.theme);
  applySoundIcon();

  // Fond animé (particules)
  FB.initParticles();

  // Construction de la home et des écrans de jeux
  renderHomeCards();
  renderGameScreens();
  renderStatsBar();

  // Boutons globaux
  document.getElementById('theme-toggle').addEventListener('click', () => {
    FB.sound.click();
    const current = FB.getState().settings.theme;
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  document.getElementById('sound-toggle').addEventListener('click', () => {
    const newVal = !FB.getState().settings.sound;
    FB.sound.toggle(newVal);
    applySoundIcon();
    if (newVal) FB.sound.click();
  });

  document.getElementById('achievements-toggle').addEventListener('click', openAchievementsModal);
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
  });

  FB.initRipples(document);

  // Splash screen
  playSplashThenReveal();
});
