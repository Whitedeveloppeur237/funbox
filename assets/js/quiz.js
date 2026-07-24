/* ============================================================
   FUNBOX — quiz.js
   Jeu "🧠 Quiz" : 20 questions à choix multiples, barre de
   progression, score, correction immédiate, animations.
   ============================================================ */

const QUIZ_DATA = [
  { q: "Quelle est la capitale du Cameroun ?", options: ["Douala", "Yaoundé", "Bafoussam", "Garoua"], correct: 1 },
  { q: "Combien de continents compte-t-on sur Terre ?", options: ["5", "6", "7", "8"], correct: 2 },
  { q: "Quel est le plus grand océan du monde ?", options: ["Atlantique", "Indien", "Arctique", "Pacifique"], correct: 3 },
  { q: "Quelle planète est surnommée la « planète rouge » ?", options: ["Vénus", "Mars", "Jupiter", "Saturne"], correct: 1 },
  { q: "Combien de joueurs compte une équipe de football sur le terrain ?", options: ["9", "10", "11", "12"], correct: 2 },
  { q: "Quel est l'élément chimique dont le symbole est « O » ?", options: ["Or", "Oxygène", "Osmium", "Ozone"], correct: 1 },
  { q: "Quelle langue est la plus parlée au monde (locuteurs natifs) ?", options: ["Anglais", "Espagnol", "Mandarin", "Français"], correct: 2 },
  { q: "En quelle année le Cameroun a-t-il obtenu son indépendance ?", options: ["1958", "1960", "1962", "1965"], correct: 1 },
  { q: "Quel est le plus long fleuve du monde ?", options: ["Amazone", "Nil", "Congo", "Mississippi"], correct: 1 },
  { q: "Combien de temps met la lumière du Soleil pour atteindre la Terre ?", options: ["8 secondes", "8 minutes", "8 heures", "8 jours"], correct: 1 },
  { q: "Quel réseau social utilise un petit oiseau bleu comme logo historique ?", options: ["Instagram", "Facebook", "Twitter (X)", "Snapchat"], correct: 2 },
  { q: "Quelle est la monnaie utilisée au Cameroun ?", options: ["Naira", "Franc CFA", "Cedi", "Dollar"], correct: 1 },
  { q: "Combien de côtés a un hexagone ?", options: ["5", "6", "7", "8"], correct: 1 },
  { q: "Quel animal est le roi de la savane ?", options: ["Le tigre", "Le lion", "L'éléphant", "Le léopard"], correct: 1 },
  { q: "Quel est le plus grand désert chaud du monde ?", options: ["Kalahari", "Gobi", "Sahara", "Atacama"], correct: 2 },
  { q: "Combien de couleurs compte un arc-en-ciel ?", options: ["5", "6", "7", "8"], correct: 2 },
  { q: "Quel pays a inventé le football moderne ?", options: ["Brésil", "France", "Angleterre", "Espagne"], correct: 2 },
  { q: "Quelle est la plus haute montagne du monde ?", options: ["Kilimandjaro", "Mont Blanc", "Everest", "K2"], correct: 2 },
  { q: "Quel organe pompe le sang dans le corps humain ?", options: ["Le foie", "Le cœur", "Les poumons", "Les reins"], correct: 1 },
  { q: "Combien de temps dure une année sur Terre ?", options: ["300 jours", "365 jours", "400 jours", "500 jours"], correct: 1 }
];

let quizState = {
  order: [],
  current: 0,
  score: 0,
  answered: false
};

function fbInitQuiz() {
  FB.recordGamePlayed();
  quizState = {
    order: FB.shuffle(QUIZ_DATA.map((_, i) => i)),
    current: 0,
    score: 0,
    answered: false
  };
  renderQuizFrame();
  renderQuestion();
}

function renderQuizFrame() {
  const container = document.getElementById('game-quiz');
  container.innerHTML = `
    <div class="game-panel quiz-panel">
      ${FB_BACK_BTN}
      <h2 class="game-title"><i class="fa-solid fa-brain"></i> Quiz du groupe</h2>
      <div class="quiz-progress-wrap">
        <div class="quiz-progress-bar"><div id="quiz-progress-fill" class="quiz-progress-fill"></div></div>
        <span id="quiz-progress-label" class="quiz-progress-label">Question 1 / 20</span>
      </div>
      <div class="quiz-score">Score : <span id="quiz-score">0</span> / 20</div>
      <div id="quiz-question-card" class="quiz-question-card">
        <p id="quiz-question-text" class="quiz-question-text"></p>
        <div id="quiz-options" class="quiz-options"></div>
      </div>
      <div id="quiz-result" class="quiz-result hidden"></div>
    </div>
  `;
  container.querySelector('[data-back]').addEventListener('click', () => window.fbGoHome());
  FB.initRipples(container);
}

function renderQuestion() {
  quizState.answered = false;
  const qIndex = quizState.order[quizState.current];
  const q = QUIZ_DATA[qIndex];

  document.getElementById('quiz-question-text').textContent = q.q;
  document.getElementById('quiz-score').textContent = quizState.score;
  document.getElementById('quiz-progress-label').textContent = `Question ${quizState.current + 1} / ${QUIZ_DATA.length}`;
  document.getElementById('quiz-progress-fill').style.width = `${(quizState.current / QUIZ_DATA.length) * 100}%`;

  const optionsWrap = document.getElementById('quiz-options');
  optionsWrap.innerHTML = '';
  const shuffledOptionIndices = FB.shuffle(q.options.map((_, i) => i));

  shuffledOptionIndices.forEach(optIndex => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option ripple-target';
    btn.textContent = q.options[optIndex];
    btn.addEventListener('click', () => handleAnswer(optIndex, q.correct, btn));
    optionsWrap.appendChild(btn);
    FB.initRipples(optionsWrap);
  });

  const card = document.getElementById('quiz-question-card');
  card.classList.remove('slide-in');
  void card.offsetWidth;
  card.classList.add('slide-in');
}

function handleAnswer(chosenIndex, correctIndex, btnEl) {
  if (quizState.answered) return;
  quizState.answered = true;

  const allBtns = document.querySelectorAll('.quiz-option');
  allBtns.forEach(b => b.disabled = true);

  if (chosenIndex === correctIndex) {
    quizState.score++;
    btnEl.classList.add('correct');
    FB.sound.win();
  } else {
    btnEl.classList.add('wrong');
    allBtns.forEach(b => {
      if (b.textContent === QUIZ_DATA[quizState.order[quizState.current]].options[correctIndex]) {
        b.classList.add('correct');
      }
    });
    FB.sound.lose();
  }

  document.getElementById('quiz-score').textContent = quizState.score;

  setTimeout(() => {
    quizState.current++;
    if (quizState.current < QUIZ_DATA.length) {
      renderQuestion();
    } else {
      finishQuiz();
    }
  }, 1100);
}

function finishQuiz() {
  document.getElementById('quiz-progress-fill').style.width = '100%';
  document.getElementById('quiz-progress-label').textContent = `Terminé !`;
  document.getElementById('quiz-question-card').classList.add('hidden');

  const state = FB.getState();
  if (quizState.score > state.stats.quizBest) {
    FB.updateStats({ quizBest: quizState.score });
  }
  if (quizState.score >= QUIZ_DATA.length * 0.6) {
    FB.recordWin();
  } else {
    FB.recordLoss();
  }
  FB.checkAchievements();

  const resultEl = document.getElementById('quiz-result');
  resultEl.classList.remove('hidden');
  const pct = Math.round((quizState.score / QUIZ_DATA.length) * 100);
  let mention = '<i class="fa-solid fa-face-meh"></i> Peut mieux faire';
  if (pct >= 90) mention = '<i class="fa-solid fa-crown"></i> Génie du groupe !';
  else if (pct >= 70) mention = '<i class="fa-solid fa-fire"></i> Très fort !';
  else if (pct >= 50) mention = '<i class="fa-solid fa-thumbs-up"></i> Pas mal du tout !';

  resultEl.innerHTML = `
    <div class="quiz-final-score">${quizState.score} / ${QUIZ_DATA.length}</div>
    <p class="quiz-mention">${mention}</p>
    <button class="btn btn-primary ripple-target" id="quiz-replay-btn"><i class="fa-solid fa-rotate-right"></i> Recommencer</button>
  `;
  FB.initRipples(resultEl);
  document.getElementById('quiz-replay-btn').addEventListener('click', fbInitQuiz);

  if (pct >= 90) FB.confettiBurst(0.5, 0.3, 130);
}
