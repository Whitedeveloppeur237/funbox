/* ============================================================
   FUNBOX — jokes.js
   Jeu "😂 Blagues" : 50 blagues tirées au hasard sans répétition
   immédiate, avec animation de carte retournée.
   ============================================================ */

const JOKES_DATA = [
  "Pourquoi les plongeurs plongent-ils toujours en arrière et jamais en avant ? Parce que sinon ils tombent dans le bateau.",
  "Qu'est-ce qu'un crocodile qui surveille la pharmacie ? Un pharmacocodile.",
  "Comment appelle-t-on un chat tout seul ? Un chat-solitaire.",
  "Pourquoi les poissons détestent l'ordinateur ? Ils ont peur du net.",
  "Qu'est-ce qui est jaune et qui attend ? Jonathan.",
  "Deux pêcheurs se rencontrent, l'un dit : « Il paraît que tu as pêché 100 kg de sardines ! » L'autre répond : « Oui, avec une seule ! Elle était énorme ! »",
  "Pourquoi les girafes ont un long cou ? Parce que leurs pieds sentent mauvais.",
  "C'est un chien qui va à la Poste et qui demande un timbre. L'employé lui demande : « Pour où ? » Le chien répond : « Pour ma niche voyons ! »",
  "Que dit un mur à un autre mur ? On se voit au coin.",
  "Pourquoi les cyclopes ont arrêté d'enseigner ? Parce qu'ils n'avaient qu'un seul élève.",
  "Quel est le sport le plus silencieux ? Le judo, parce qu'on n'entend pas le judogi.",
  "C'est l'histoire d'une girafe qui rentre dans un bar... en fait non, elle ne rentre pas, elle est trop grande.",
  "Pourquoi les développeurs confondent Halloween et Noël ? Parce que OCT 31 == DEC 25.",
  "Qu'est-ce qu'un magicien qui a perdu sa magie ? Un cien.",
  "Comment fait-on rire un poisson rouge ? On lui raconte des histoires de bocal.",
  "Deux antennes se marient. La cérémonie était nulle mais la réception excellente.",
  "Pourquoi le squelette n'a pas d'amis ? Il n'a pas de corps pour les inviter.",
  "Quel est le comble pour un électricien ? De ne pas être au courant.",
  "Que fait une fraise sur un cheval ? Tagada tagada tagada.",
  "Pourquoi les abeilles ont du miel dans les cheveux ? Parce qu'elles ont un ruche-tail.",
  "Comment appelle-t-on un serpent qui travaille pour l'État ? Un serpent-fonctionnaire.",
  "Quel est le comble pour un jardinier ? De perdre la boule.",
  "Un escargot se fait racketter par deux tortues. Il va voir la police et dit : « Je ne sais pas ce qui m'arrive, tout est allé si vite. »",
  "Pourquoi les hiboux ne peuvent-ils pas parler ? Sinon ils ne seraient pas discrets.",
  "Qu'est-ce qu'un poulet dans une boîte ? Un cube de bouillon en préparation.",
  "Que dit un informaticien quand il s'ennuie ? J'ai un bug dans ma vie sociale.",
  "Pourquoi les moutons vont-ils toujours au même endroit ? Parce qu'ils suivent le troupeau, forcément.",
  "Comment un citron devient-il célèbre ? En pressant les autres.",
  "Quel est le comble pour un menuisier ? De na pas être clouté au sol.",
  "Pourquoi le café porte plainte ? Parce qu'on le moud tous les matins.",
  "Que dit une imprimante à une autre imprimante ? Ce papier est à toi ou c'est en-tête ?",
  "Pourquoi la banane ne va jamais seule à la fête ? Parce qu'elle a peur de se faire éplucher.",
  "Comment reconnaît-on un extraterrestre poli ? Il vient en Ufo-lisant.",
  "Deux tomates traversent la route, l'une se fait écraser. L'autre dit : « Allez, ketchup ! »",
  "Pourquoi le zéro n'aime pas rencontrer le huit ? Parce qu'il faut se serrer la ceinture.",
  "Quel est le comble pour un marin ? Avoir le mal de terre.",
  "Comment appelle-t-on un chien magicien ? Un labra-cadabra.",
  "Pourquoi les fantômes sont de mauvais menteurs ? On voit clair à travers eux.",
  "Qu'est-ce qu'un serpent chargé d'électricité ? Un boa-constricteur.",
  "Que répond une pile à qui lui demande comment elle va ? Ça va, je suis chargée.",
  "Pourquoi les nuages ne vont jamais à l'école ? Parce qu'ils font l'école buissonnière... enfin, l'école pluvieuse.",
  "Comment appelle-t-on un chat qui vient d'avaler un dictionnaire ? Un chat qui a les mots dans la gorge.",
  "Pourquoi les mathématiciens confondent Halloween et l'infini ? Parce qu'il n'y a pas de fin logique.",
  "Quel est le comble pour un boulanger ? De ne pas gagner de croûte.",
  "Pourquoi la mer est-elle salée ? Parce que les poissons ne pleurent jamais en silence.",
  "Que dit une aiguille à une autre aiguille ? On se pique un peu plus tard ?",
  "Comment un robot dit-il bonjour ? Il fait un bit de causette.",
  "Pourquoi les araignées adorent internet ? Parce qu'elles peuvent tisser leur propre toile.",
  "Quel est le comble pour un dentiste ? De ne rien avoir à se mettre sous la dent.",
  "Pourquoi les canards regardent-ils toujours vers le bas ? Ils cherchent leurs coin-coins.",
  "Comment appelle-t-on une vache qui ne donne pas de lait ? Un malentendu."
];

let lastJokeIndex = -1;

function fbInitJokes() {
  FB.recordGamePlayed();
  const container = document.getElementById('game-jokes');
  container.innerHTML = `
    <div class="game-panel joke-panel">
      ${FB_BACK_BTN}
      <h2 class="game-title"><i class="fa-solid fa-face-laugh-squint"></i> Blagues du groupe</h2>
      <div class="joke-card" id="joke-card">
        <p id="joke-text">Clique sur le bouton pour révéler une blague !</p>
      </div>
      <button class="btn btn-primary ripple-target" id="new-joke-btn"><i class="fa-solid fa-dice"></i> Nouvelle blague</button>
    </div>
  `;
  FB.initRipples(container);
  document.getElementById('new-joke-btn').addEventListener('click', showRandomJoke);
  container.querySelector('[data-back]').addEventListener('click', () => window.fbGoHome());
  showRandomJoke();
}

function showRandomJoke() {
  FB.sound.click();
  const card = document.getElementById('joke-card');
  const text = document.getElementById('joke-text');
  card.classList.remove('flip-in');
  void card.offsetWidth; // reflow pour relancer l'animation
  let idx;
  do {
    idx = Math.floor(Math.random() * JOKES_DATA.length);
  } while (idx === lastJokeIndex && JOKES_DATA.length > 1);
  lastJokeIndex = idx;
  text.textContent = JOKES_DATA[idx];
  card.classList.add('flip-in');
}
