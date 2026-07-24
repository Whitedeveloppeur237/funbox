/* ============================================================
   FUNBOX — compliments.js
   Jeu "❤️ Compliment aléatoire" : 100 compliments générés à
   partir de familles de phrases variées, pour toujours sonner
   naturel et jamais robotique. Confettis + fond animé.
   ============================================================ */

const COMPLIMENTS_DATA = (() => {
  const list = [
    "Ton sourire à lui seul illumine ce groupe WhatsApp.",
    "Tu as ce truc rare : tu rends toujours les gens autour de toi meilleurs.",
    "Ta bonne humeur est contagieuse, ne change surtout rien.",
    "Tu es exactement le genre d'ami qu'on espère avoir dans sa vie.",
    "Ton énergie positive se sent même à travers un écran.",
    "Tu as un talent fou pour faire rire les gens au bon moment.",
    "On sent que tu écoutes vraiment les autres, et ça n'a pas de prix.",
    "Ta créativité surprend toujours agréablement le groupe.",
    "Tu es quelqu'un sur qui on peut vraiment compter.",
    "Ta franchise, toujours bienveillante, fait du bien à tout le monde.",
    "Tu as un sens de l'humour qui remonte le moral en deux secondes.",
    "Ta générosité ne passe jamais inaperçue, même quand tu ne le montres pas.",
    "Tu inspires les autres sans même t'en rendre compte.",
    "Ta présence dans ce groupe change vraiment l'ambiance, en mieux.",
    "Tu as une force tranquille que peu de gens possèdent.",
    "Ton empathie fait de toi quelqu'un de précieux.",
    "Tu sais toujours dire les mots qu'il faut au bon moment.",
    "Ta curiosité pour les autres est admirable.",
    "Tu as un charisme naturel qui attire la sympathie.",
    "Ton optimisme est un cadeau pour tous ceux qui t'entourent.",
    "Tu es quelqu'un de rare, ne l'oublie jamais.",
    "Ta patience avec les autres force le respect.",
    "Tu as ce petit truc en plus qui fait toute la différence.",
    "Ton honnêteté est une des plus belles qualités qu'on puisse avoir.",
    "Tu sais transformer une journée banale en bon souvenir.",
    "Ta motivation donne envie à tout le monde de se bouger.",
    "Tu as un cœur immense, même si tu ne le dis pas souvent.",
    "Ton style bien à toi ne ressemble à personne d'autre.",
    "Tu es quelqu'un qu'on n'oublie pas facilement, dans le bon sens.",
    "Ta capacité à rassurer les autres est précieuse.",
    "Tu apportes toujours une bouffée d'air frais dans une conversation.",
    "Ton intelligence se voit dans la façon dont tu abordes les choses.",
    "Tu as un don pour trouver le bon mot au bon moment.",
    "Ta loyauté envers tes proches est admirable.",
    "Tu sais célébrer les autres sans jamais chercher à briller à leur place.",
    "Ton calme dans les moments tendus fait un bien fou.",
    "Tu as toujours une solution ou un mot rassurant sous la main.",
    "Ta joie de vivre est un vrai moteur pour le groupe.",
    "Tu es de ces personnes qui rendent le quotidien plus léger.",
    "Ton originalité fait de toi quelqu'un d'unique.",
    "Tu écoutes sans juger, et ça, c'est précieux.",
    "Ta bienveillance se voit dans les petits détails.",
    "Tu sais transformer les tensions en éclats de rire.",
    "Ton dévouement envers les autres ne passe jamais inaperçu.",
    "Tu as une manière bien à toi de voir le bon côté des choses.",
    "Ta présence rassure, même sans que tu dises un mot.",
    "Tu es la définition même d'un bon ami.",
    "Ton audace inspire les autres à sortir de leur zone de confort.",
    "Tu sais rendre n'importe quel moment plus fun.",
    "Ta sincérité te rend immédiatement attachant.",
    "Tu as le don de faire sentir les gens importants.",
    "Ton humour subtil ne rate jamais sa cible.",
    "Tu es quelqu'un de solide sur qui s'appuyer.",
    "Ta spontanéité amène toujours du bon dans le groupe.",
    "Tu sais poser les bonnes questions au bon moment.",
    "Ton engagement pour les gens que tu aimes est admirable.",
    "Tu as cette capacité rare de rendre les autres plus confiants.",
    "Ta joie communicative n'a pas de prix.",
    "Tu es le genre de personne qu'on est content de croiser.",
    "Ta délicatesse dans les mots fait toute la différence.",
    "Tu sais faire briller les autres sans jamais te mettre en avant.",
    "Ton humilité, malgré tout ce que tu accomplis, force le respect.",
    "Tu apportes toujours une dose de fraîcheur dans les discussions.",
    "Ta capacité d'adaptation impressionne tout le monde.",
    "Tu es exactement le genre de personne qu'on veut garder proche.",
    "Ton regard sur les choses aide toujours à relativiser.",
    "Tu sais donner confiance rien qu'en étant toi-même.",
    "Ta persévérance est un exemple pour beaucoup.",
    "Tu as un sourire qui désamorce n'importe quelle tension.",
    "Ton sens du partage rend le groupe plus fort.",
    "Tu es capable de rendre une blague banale hilarante, juste par ta façon de la raconter.",
    "Ta bonté ne se dément jamais, même dans les moments difficiles.",
    "Tu sais mettre les gens à l'aise en un rien de temps.",
    "Ton enthousiasme est communicatif, tout simplement.",
    "Tu as un talent naturel pour fédérer les gens autour de toi.",
    "Ta discrétion cache une force impressionnante.",
    "Tu es toujours prêt à aider, sans qu'on ait besoin de demander deux fois.",
    "Ton regard positif sur les autres les pousse à donner le meilleur d'eux-mêmes.",
    "Tu as cette élégance naturelle dans ta façon d'être.",
    "Ta bonne humeur du matin donne le ton pour toute la journée du groupe.",
    "Tu sais transformer un simple message en moment de complicité.",
    "Ton authenticité est rafraîchissante dans un monde qui en manque parfois.",
    "Tu as un instinct incroyable pour savoir quand quelqu'un a besoin de soutien.",
    "Ta gentillesse ne connaît pas de limites.",
    "Tu es quelqu'un que les autres admirent sans forcément te le dire.",
    "Ton sang-froid dans les imprévus impressionne toujours.",
    "Tu sais faire de chaque rassemblement un bon moment.",
    "Ta répartie légendaire met une ambiance immédiate.",
    "Tu as un don pour transformer les silences gênants en fous rires.",
    "Ton respect pour les autres, même en désaccord, est remarquable.",
    "Tu es de ceux qui rendent une simple journée mémorable.",
    "Ta manière de raconter les histoires captive toujours l'audience.",
    "Tu as un charme discret mais indéniable.",
    "Ton soutien inconditionnel fait toute la différence pour tes proches.",
    "Tu sais toujours ramener le sourire, même dans les jours gris.",
    "Ta simplicité est en réalité ta plus grande force.",
    "Tu es une des personnes les plus fiables que l'on connaisse.",
    "Ton énergie donne littéralement envie de sortir du lit le matin.",
    "Tu as une manière bien à toi de rendre les choses plus belles.",
    "Ta présence dans nos vies est un vrai cadeau."
  ];
  return list;
})();

let lastComplimentIndex = -1;

function fbInitCompliments() {
  FB.recordGamePlayed();
  const container = document.getElementById('game-compliments');
  container.innerHTML = `
    <div class="game-panel compliment-panel">
      ${FB_BACK_BTN}
      <h2 class="game-title"><i class="fa-solid fa-heart"></i> Compliment aléatoire</h2>
      <div class="compliment-card" id="compliment-card">
        <span class="compliment-heart"><i class="fa-solid fa-heart-circle-check"></i></span>
        <p id="compliment-text">Clique pour recevoir un compliment du groupe !</p>
      </div>
      <button class="btn btn-primary ripple-target" id="new-compliment-btn"><i class="fa-solid fa-wand-magic-sparkles"></i> Un compliment</button>
    </div>
  `;
  FB.initRipples(container);
  document.getElementById('new-compliment-btn').addEventListener('click', showRandomCompliment);
  container.querySelector('[data-back]').addEventListener('click', () => window.fbGoHome());
  showRandomCompliment();
}

function showRandomCompliment() {
  FB.sound.click();
  const card = document.getElementById('compliment-card');
  const text = document.getElementById('compliment-text');
  card.classList.remove('pop-in');
  void card.offsetWidth;
  let idx;
  do {
    idx = Math.floor(Math.random() * COMPLIMENTS_DATA.length);
  } while (idx === lastComplimentIndex && COMPLIMENTS_DATA.length > 1);
  lastComplimentIndex = idx;
  text.textContent = COMPLIMENTS_DATA[idx];
  card.classList.add('pop-in');
  const rect = card.getBoundingClientRect();
  FB.confettiBurst((rect.left + rect.width / 2) / window.innerWidth, (rect.top + 40) / window.innerHeight, 70);
}
