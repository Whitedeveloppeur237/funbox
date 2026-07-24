/* ============================================================
   FUNBOX — riddles.js
   Jeu "🤔 Devinette" : 50 devinettes avec réponse masquée
   révélable au clic.
   ============================================================ */

const RIDDLES_DATA = [
  { q: "Je n'ai pas de bouche mais je parle, pas d'oreilles mais j'entends. Qui suis-je ?", a: "Un écho" },
  { q: "Plus j'ai de gardiens, moins je suis en sécurité. Qui suis-je ?", a: "Un secret" },
  { q: "On me casse avant de m'utiliser. Qui suis-je ?", a: "Un œuf" },
  { q: "Je grandis quand je mange, mais je meurs quand je bois. Qui suis-je ?", a: "Le feu" },
  { q: "Je n'ai ni yeux ni jambes, mais je cours toujours. Qui suis-je ?", a: "L'eau (une rivière)" },
  { q: "J'ai des clés mais pas de serrure, de l'espace mais pas de pièces. Qui suis-je ?", a: "Un clavier" },
  { q: "Plus on m'enlève, plus je grandis. Qui suis-je ?", a: "Un trou" },
  { q: "Je vole sans ailes, je pleure sans yeux. Qui suis-je ?", a: "Un nuage" },
  { q: "Je suis toujours devant toi mais tu ne peux jamais me voir. Qui suis-je ?", a: "L'avenir" },
  { q: "J'ai une tête, une queue, mais pas de corps. Qui suis-je ?", a: "Une pièce de monnaie" },
  { q: "Plus je suis chaud, plus je suis frais. Qui suis-je ?", a: "Le pain" },
  { q: "Je n'ai pas de vie, mais je peux mourir. Qui suis-je ?", a: "Une pile / batterie" },
  { q: "Quel est l'animal qui dort avec ses chaussures ?", a: "Le cheval (les fers)" },
  { q: "Je monte quand la pluie tombe. Qui suis-je ?", a: "Un parapluie" },
  { q: "Je n'ai pas de mains mais je peux te ralentir ou t'accélérer. Qui suis-je ?", a: "Le temps" },
  { q: "Combien de mois ont 28 jours ?", a: "Tous, chaque mois compte au moins 28 jours" },
  { q: "Qu'est-ce qui a des dents mais ne mord jamais ?", a: "Un peigne" },
  { q: "Qu'est-ce qui a un anneau mais pas de doigt ?", a: "Un téléphone qui sonne" },
  { q: "Je suis léger comme une plume mais même le plus fort ne peut me tenir longtemps. Qui suis-je ?", a: "Le souffle / la respiration" },
  { q: "Qu'est-ce qui reste toujours dans un coin, même en faisant le tour du monde ?", a: "Un timbre-poste" },
  { q: "Plus je suis grand, moins je pèse. Qui suis-je ?", a: "Un trou" },
  { q: "Je suis rempli de trous mais je retiens l'eau. Qui suis-je ?", a: "Une éponge" },
  { q: "Qu'est-ce qu'on peut attraper sans jamais courir après ?", a: "Un rhume" },
  { q: "Je marche sans jambes, je cours sans pieds. Qui suis-je ?", a: "L'eau" },
  { q: "Quel est le comble pour un boulanger ? Je suis fait mais pas cuit. Qui suis-je ?", a: "Un lit" },
  { q: "Je n'ai pas de bouche mais je mange, pas de vent mais je souffle. Qui suis-je ?", a: "La rivière (qui mange la roche)" },
  { q: "Qu'est-ce qui a quatre doigts et un pouce mais n'est pas une main ?", a: "Un gant" },
  { q: "Plus tu en prends, plus tu en laisses derrière toi. Qui suis-je ?", a: "Des pas" },
  { q: "Je suis toujours en face de toi mais tu ne peux jamais m'atteindre. Qui suis-je ?", a: "L'horizon" },
  { q: "Qu'est-ce qui appartient à toi mais que les autres utilisent plus que toi ?", a: "Ton prénom" },
  { q: "Je n'existe que lorsqu'on me donne un nom. Qui suis-je ?", a: "Le silence" },
  { q: "Deux mères et deux filles vont au restaurant, mais il n'y a que trois personnes. Comment ?", a: "Une grand-mère, sa fille et sa petite-fille" },
  { q: "Qu'est-ce qui monte et descend sans jamais bouger ?", a: "La température (ou un escalier)" },
  { q: "Je suis une porte mais je ne s'ouvre ni ne se ferme. Qui suis-je ?", a: "Un menu (porte de restaurant au sens figuré) / une porte-fenêtre peinte" },
  { q: "Qu'est-ce qui a une ville mais pas de maisons, des forêts mais pas d'arbres, des rivières mais pas d'eau ?", a: "Une carte" },
  { q: "Je suis plein le matin et vide le soir. Qui suis-je ?", a: "Un lit (ou une salle de classe)" },
  { q: "Qu'est-ce qui se brise sans qu'on le touche ?", a: "Une promesse" },
  { q: "Je n'ai qu'un œil mais je vois pas. Qui suis-je ?", a: "Une aiguille à coudre" },
  { q: "Qu'est-ce qui va d'une ville à l'autre sans jamais bouger ?", a: "Une route" },
  { q: "Plus tu me nourris, plus je deviens grand, mais si tu me donnes de l'eau, je meurs. Qui suis-je ?", a: "Le feu" },
  { q: "Je suis noire quand je suis propre et blanche quand je suis sale. Qui suis-je ?", a: "Un tableau (de craie)" },
  { q: "Qu'est-ce qu'on ne peut jamais manger au petit-déjeuner ?", a: "Le déjeuner et le dîner" },
  { q: "Je n'ai pas de porte mais on peut me cambrioler. Qui suis-je ?", a: "Une banque en ligne / un ordinateur" },
  { q: "Qu'est-ce qui a beaucoup de clés mais n'ouvre aucune porte ?", a: "Un piano" },
  { q: "Je suis toujours devant toi mais je change chaque seconde. Qui suis-je ?", a: "Le futur" },
  { q: "Qu'est-ce qui traverse les villes et les champs sans jamais se déplacer ?", a: "Une route" },
  { q: "Je peux être craqué, fait, ou raconté, mais jamais volé sans faire de bruit. Qui suis-je ?", a: "Une blague" },
  { q: "Qu'est-ce qui a des ailes mais ne vole pas ?", a: "Un moulin à vent" },
  { q: "Je suis un roi sans couronne et sans royaume, présent dans chaque jeu de cartes. Qui suis-je ?", a: "Le roi de cœur / trèfle / pique / carreau" },
  { q: "Qu'est-ce qui commence par un « e » et ne contient qu'une seule lettre ?", a: "Une enveloppe" }
];

let lastRiddleIndex = -1;

function fbInitRiddles() {
  FB.recordGamePlayed();
  const container = document.getElementById('game-riddles');
  container.innerHTML = `
    <div class="game-panel riddle-panel">
      ${FB_BACK_BTN}
      <h2 class="game-title"><i class="fa-solid fa-circle-question"></i> Devinette</h2>
      <div class="riddle-card">
        <p id="riddle-question">Chargement...</p>
        <div class="riddle-answer-wrap">
          <p id="riddle-answer" class="riddle-answer hidden-answer">???</p>
        </div>
        <div class="riddle-actions">
          <button class="btn btn-secondary ripple-target" id="reveal-btn"><i class="fa-solid fa-eye"></i> Voir la réponse</button>
          <button class="btn btn-primary ripple-target" id="next-riddle-btn">Suivante <i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  `;
  FB.initRipples(container);
  document.getElementById('reveal-btn').addEventListener('click', revealAnswer);
  document.getElementById('next-riddle-btn').addEventListener('click', showRandomRiddle);
  container.querySelector('[data-back]').addEventListener('click', () => window.fbGoHome());
  showRandomRiddle();
}

function showRandomRiddle() {
  FB.sound.click();
  let idx;
  do {
    idx = Math.floor(Math.random() * RIDDLES_DATA.length);
  } while (idx === lastRiddleIndex && RIDDLES_DATA.length > 1);
  lastRiddleIndex = idx;
  const riddle = RIDDLES_DATA[idx];
  document.getElementById('riddle-question').textContent = riddle.q;
  const answerEl = document.getElementById('riddle-answer');
  answerEl.textContent = '???';
  answerEl.classList.add('hidden-answer');
  answerEl.dataset.answer = riddle.a;
}

function revealAnswer() {
  FB.sound.click();
  const answerEl = document.getElementById('riddle-answer');
  if (answerEl.classList.contains('hidden-answer')) {
    answerEl.textContent = answerEl.dataset.answer;
    answerEl.classList.remove('hidden-answer');
  }
}
