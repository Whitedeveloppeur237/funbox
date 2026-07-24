/* ============================================================
   FUNBOX — hangman.js
   Jeu "🧩 Pendu" : 30 mots, clavier virtuel, dessin progressif
   du pendu en SVG animé, bouton rejouer.
   ============================================================ */

const HANGMAN_WORDS = [
  { word: "ORDINATEUR", category: "Technologie" },
  { word: "TELEPHONE", category: "Technologie" },
  { word: "INTERNET", category: "Technologie" },
  { word: "CLAVIER", category: "Technologie" },
  { word: "ECRAN", category: "Technologie" },
  { word: "ELEPHANT", category: "Animaux" },
  { word: "GIRAFE", category: "Animaux" },
  { word: "CROCODILE", category: "Animaux" },
  { word: "PANTHERE", category: "Animaux" },
  { word: "PERROQUET", category: "Animaux" },
  { word: "CAMEROUN", category: "Cameroun" },
  { word: "DOUALA", category: "Cameroun" },
  { word: "YAOUNDE", category: "Cameroun" },
  { word: "BAFOUSSAM", category: "Cameroun" },
  { word: "MAKOSSA", category: "Cameroun" },
  { word: "SOLEIL", category: "Nature" },
  { word: "ETOILE", category: "Nature" },
  { word: "MONTAGNE", category: "Nature" },
  { word: "RIVIERE", category: "Nature" },
  { word: "FORET", category: "Nature" },
  { word: "MUSIQUE", category: "Loisirs" },
  { word: "DANSE", category: "Loisirs" },
  { word: "VOYAGE", category: "Loisirs" },
  { word: "AVENTURE", category: "Loisirs" },
  { word: "BIBLIOTHEQUE", category: "Loisirs" },
  { word: "FOOTBALL", category: "Sport" },
  { word: "BASKETBALL", category: "Sport" },
  { word: "NATATION", category: "Sport" },
  { word: "VELO", category: "Sport" },
  { word: "COURSE", category: "Sport" }
];

const HANGMAN_MAX_ERRORS = 6;

let hangmanState = {
  word: '',
  category: '',
  guessed: new Set(),
  errors: 0,
  finished: false
};

function fbInitHangman() {
  FB.recordGamePlayed();
  const picked = FB.pickRandom(HANGMAN_WORDS);
  hangmanState = {
    word: picked.word,
    category: picked.category,
    guessed: new Set(),
    errors: 0,
    finished: false
  };
  renderHangman();
}

function renderHangman() {
  const container = document.getElementById('game-hangman');
  container.innerHTML = `
    <div class="game-panel hangman-panel">
      ${FB_BACK_BTN}
      <h2 class="game-title"><i class="fa-solid fa-puzzle-piece"></i> Pendu</h2>
      <div class="hangman-category">
        <i class="fa-solid fa-tag"></i> Catégorie : <span>${hangmanState.category}</span>
      </div>
      <div class="hangman-figure-wrap">
        ${hangmanSvg(hangmanState.errors)}
      </div>
      <p id="hangman-word" class="hangman-word"></p>
      <div id="hangman-keyboard" class="hangman-keyboard"></div>
      <p id="hangman-status" class="hangman-status"></p>
      <div id="hangman-actions" class="hangman-actions hidden">
        <button class="btn btn-primary ripple-target" id="hangman-replay"><i class="fa-solid fa-rotate-right"></i> Rejouer</button>
      </div>
    </div>
  `;
  container.querySelector('[data-back]').addEventListener('click', () => window.fbGoHome());
  FB.initRipples(container);

  renderWordDisplay();
  renderKeyboard();
}

function renderWordDisplay() {
  const el = document.getElementById('hangman-word');
  el.textContent = hangmanState.word
    .split('')
    .map(letter => (hangmanState.guessed.has(letter) ? letter : '_'))
    .join(' ');
}

function renderKeyboard() {
  const keyboard = document.getElementById('hangman-keyboard');
  keyboard.innerHTML = '';
  const alphabet = 'AZERTYUIOPQSDFGHJKLMWXCVBN'.split('');
  alphabet.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'hangman-key ripple-target';
    btn.textContent = letter;
    btn.disabled = hangmanState.finished || hangmanState.guessed.has(letter);
    btn.addEventListener('click', () => guessLetter(letter));
    keyboard.appendChild(btn);
  });
  FB.initRipples(keyboard);
}

function guessLetter(letter) {
  if (hangmanState.finished || hangmanState.guessed.has(letter)) return;
  hangmanState.guessed.add(letter);

  if (!hangmanState.word.includes(letter)) {
    hangmanState.errors++;
    FB.sound.lose();
  } else {
    FB.sound.click();
  }

  document.querySelector('.hangman-figure-wrap').innerHTML = hangmanSvg(hangmanState.errors);
  renderWordDisplay();
  renderKeyboard();
  checkHangmanEnd();
}

function checkHangmanEnd() {
  const wordComplete = hangmanState.word.split('').every(l => hangmanState.guessed.has(l));
  const statusEl = document.getElementById('hangman-status');
  const actionsEl = document.getElementById('hangman-actions');

  if (wordComplete) {
    hangmanState.finished = true;
    statusEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Bravo, mot trouvé !';
    statusEl.classList.add('status-win');
    actionsEl.classList.remove('hidden');
    FB.sound.win();
    FB.confettiBurst(0.5, 0.4, 80);
    FB.recordWin();
  } else if (hangmanState.errors >= HANGMAN_MAX_ERRORS) {
    hangmanState.finished = true;
    statusEl.innerHTML = `<i class="fa-solid fa-skull"></i> Perdu ! Le mot était : ${hangmanState.word}`;
    statusEl.classList.add('status-lose');
    actionsEl.classList.remove('hidden');
    renderKeyboard();
    FB.recordLoss();
  }

  if (hangmanState.finished) {
    document.getElementById('hangman-replay').addEventListener('click', fbInitHangman);
  }
}

/* Dessin progressif du pendu en SVG : la potence est toujours visible,
   puis un élément du corps apparaît à chaque erreur (6 étapes = 6 erreurs max). */
function hangmanSvg(errors) {
  const gallows = `
    <line x1="20" y1="180" x2="140" y2="180" class="hm-part" />
    <line x1="60" y1="180" x2="60" y2="20" class="hm-part" />
    <line x1="60" y1="20" x2="130" y2="20" class="hm-part" />
    <line x1="130" y1="20" x2="130" y2="45" class="hm-part" />
  `;
  const bodySteps = [
    `<circle cx="130" cy="60" r="15" class="hm-part hm-body" />`,                    // 1 tête
    `<line x1="130" y1="75" x2="130" y2="120" class="hm-part hm-body" />`,           // 2 tronc
    `<line x1="130" y1="90" x2="108" y2="105" class="hm-part hm-body" />`,           // 3 bras gauche
    `<line x1="130" y1="90" x2="152" y2="105" class="hm-part hm-body" />`,           // 4 bras droit
    `<line x1="130" y1="120" x2="112" y2="150" class="hm-part hm-body" />`,          // 5 jambe gauche
    `<line x1="130" y1="120" x2="148" y2="150" class="hm-part hm-body" />`           // 6 jambe droite
  ];
  const bodyParts = bodySteps.slice(0, errors).join('');
  return `<svg viewBox="0 0 180 200" class="hangman-svg">${gallows}${bodyParts}</svg>`;
}