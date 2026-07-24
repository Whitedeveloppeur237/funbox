/* ============================================================
   FUNBOX — gift.js
   Jeu "🎁 Cadeau mystère" : ouvre un cadeau animé et révèle au
   hasard une citation, une blague, un défi ou une récompense.
   ============================================================ */

const GIFT_CONTENT = {
  quote: [
    "« La vie, c'est comme un vélo, il faut avancer pour ne pas perdre l'équilibre. »",
    "« Le succès, c'est se déplacer d'échec en échec sans perdre son enthousiasme. »",
    "« Le seul moment où tu échoues vraiment, c'est quand tu abandonnes. »",
    "« Ce n'est pas parce que les choses sont difficiles qu'on n'ose pas, c'est parce qu'on n'ose pas qu'elles sont difficiles. »",
    "« Le meilleur moment pour planter un arbre, c'était il y a 20 ans. Le deuxième meilleur, c'est maintenant. »"
  ],
  joke: [
    "Pourquoi le lion ne mange jamais le clown ? Parce qu'il a mauvais goût.",
    "Qu'est-ce qu'un chat qui a mangé un canari ? Un chat-tonnant.",
    "Deux boutons discutent : « Bouton, on sort ce soir ? » « Non, je préfère rester tranquille. »",
    "Pourquoi les mathématiciens n'aiment pas la forêt ? Trop de racines carrées."
  ],
  challenge: [
    "Défi : envoie un mème dans le groupe dans les 5 prochaines minutes.",
    "Défi : raconte ton pire souvenir de cours en un seul message.",
    "Défi : change ta photo de profil par un emoji pendant 1 heure.",
    "Défi : écris un compliment à la dernière personne qui a parlé dans le groupe."
  ],
  reward: [
    "🏅 Tu remportes le titre honorifique de « Roi/Reine du FunBox » pour la journée !",
    "🎖️ Récompense débloquée : « Chanceux du jour ». Porte-la fièrement !",
    "🥇 Tu gagnes le droit de choisir le prochain jeu du groupe !",
    "🎗️ Médaille virtuelle « Meilleur esprit d'équipe » attribuée !"
  ]
};

const GIFT_TYPES = [
  { key: 'quote', label: 'Citation inspirante', icon: 'fa-solid fa-quote-left' },
  { key: 'joke', label: 'Petite blague', icon: 'fa-solid fa-face-laugh-squint' },
  { key: 'challenge', label: 'Défi surprise', icon: 'fa-solid fa-bullseye' },
  { key: 'reward', label: 'Récompense virtuelle', icon: 'fa-solid fa-trophy' }
];

function fbInitGift() {
  FB.recordGamePlayed();
  const container = document.getElementById('game-gift');
  container.innerHTML = `
    <div class="game-panel gift-panel">
      ${FB_BACK_BTN}
      <h2 class="game-title"><i class="fa-solid fa-gift"></i> Cadeau mystère</h2>
      <div class="gift-box-wrap">
        <div id="gift-box" class="gift-box ripple-target">
          <span class="gift-box-icon"><i class="fa-solid fa-gift"></i></span>
        </div>
      </div>
      <p class="gift-instructions">Clique sur le cadeau pour l'ouvrir !</p>
      <div id="gift-reveal" class="gift-reveal hidden"></div>
    </div>
  `;
  container.querySelector('[data-back]').addEventListener('click', () => window.fbGoHome());
  FB.initRipples(container);

  document.getElementById('gift-box').addEventListener('click', openGift);
}

function openGift() {
  const box = document.getElementById('gift-box');
  if (box.classList.contains('opened')) return;
  box.classList.add('opened');
  FB.sound.click();

  setTimeout(() => {
    const type = FB.pickRandom(GIFT_TYPES);
    const content = FB.pickRandom(GIFT_CONTENT[type.key]);

    const revealEl = document.getElementById('gift-reveal');
    revealEl.classList.remove('hidden', 'pop-in');
    void revealEl.offsetWidth;
    revealEl.innerHTML = `
      <div class="gift-reveal-card">
        <span class="gift-reveal-icon"><i class="${type.icon}"></i></span>
        <h3>${type.label}</h3>
        <p>${content}</p>
        <button class="btn btn-secondary ripple-target" id="gift-again"><i class="fa-solid fa-gift"></i> Un autre cadeau</button>
      </div>
    `;
    revealEl.classList.add('pop-in');
    FB.initRipples(revealEl);

    FB.sound.win();
    FB.confettiBurst(0.5, 0.35, 70);
    FB.recordWin();

    document.getElementById('gift-again').addEventListener('click', () => {
      box.classList.remove('opened');
      revealEl.classList.add('hidden');
    });
  }, 550);
}
