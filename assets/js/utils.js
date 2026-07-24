/* ============================================================
   FUNBOX — utils.js
   Fonctions partagées par tous les modules : stockage local,
   sons, confettis, particules de fond, effet ripple, toasts,
   statistiques et succès (achievements).
   Tout est exposé sur l'objet global `FB` pour rester
   accessible depuis les fichiers de jeux (scripts classiques,
   pas de modules ES pour rester 100% "ouvrir index.html").
   ============================================================ */

const FB = (() => {

  /* ------------------------------------------------------------
     1. STORAGE — petite couche au-dessus de localStorage
  ------------------------------------------------------------ */
  const STORAGE_KEY = 'funbox_state_v1';

  const defaultState = {
    settings: { sound: true, theme: 'light', music: false },
    stats: {
      gamesPlayed: 0,
      wins: 0,
      streak: 0,
      bestStreak: 0,
      quizBest: 0,
      reactionBest: null
    },
    achievements: {}
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultState);
      const parsed = JSON.parse(raw);
      // fusion défensive au cas où de nouveaux champs apparaissent
      return {
        settings: { ...defaultState.settings, ...parsed.settings },
        stats: { ...defaultState.stats, ...parsed.stats },
        achievements: { ...defaultState.achievements, ...parsed.achievements }
      };
    } catch (e) {
      console.warn('FunBox: état corrompu, réinitialisation.', e);
      return structuredClone(defaultState);
    }
  }

  let state = loadState();

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function getState() { return state; }

  function updateStats(patch) {
    Object.assign(state.stats, patch);
    save();
  }

  function recordGamePlayed() {
    state.stats.gamesPlayed++;
    save();
  }

  function recordWin() {
    state.stats.wins++;
    state.stats.streak++;
    if (state.stats.streak > state.stats.bestStreak) {
      state.stats.bestStreak = state.stats.streak;
    }
    save();
    checkAchievements();
  }

  function recordLoss() {
    state.stats.streak = 0;
    save();
  }

  /* ------------------------------------------------------------
     2. ACHIEVEMENTS
  ------------------------------------------------------------ */
  const ACHIEVEMENT_DEFS = [
    { id: 'first_game', label: 'Premier pas', desc: 'Joue à ton premier mini-jeu', icon: 'fa-solid fa-flag-checkered',
      test: s => s.gamesPlayed >= 1 },
    { id: 'five_wins', label: 'Sur la lancée', desc: 'Gagne 5 parties', icon: 'fa-solid fa-fire',
      test: s => s.wins >= 5 },
    { id: 'streak_3', label: 'Série chaude', desc: '3 victoires d\'affilée', icon: 'fa-solid fa-bolt',
      test: s => s.bestStreak >= 3 },
    { id: 'quiz_master', label: 'Cerveau du groupe', desc: 'Score de 15+ au Quiz', icon: 'fa-solid fa-brain',
      test: s => s.quizBest >= 15 },
    { id: 'veteran', label: 'Habitué de FunBox', desc: 'Joue 20 parties', icon: 'fa-solid fa-crown',
      test: s => s.gamesPlayed >= 20 }
  ];

  function checkAchievements() {
    const newly = [];
    ACHIEVEMENT_DEFS.forEach(a => {
      if (!state.achievements[a.id] && a.test(state.stats)) {
        state.achievements[a.id] = true;
        newly.push(a);
      }
    });
    if (newly.length) {
      save();
      newly.forEach(a => showToast(`<i class="${a.icon}"></i> Succès débloqué : ${a.label}`, 3200, true));
    }
    return newly;
  }

  /* ------------------------------------------------------------
     3. SOUND — bips synthétisés via WebAudio (aucun fichier requis)
  ------------------------------------------------------------ */
  let audioCtx = null;
  function ctx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function beep({ freq = 440, duration = 0.15, type = 'sine', gain = 0.08, glideTo = null }) {
    if (!state.settings.sound) return;
    try {
      const c = ctx();
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime);
      if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, c.currentTime + duration);
      g.gain.setValueAtTime(gain, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
      osc.connect(g).connect(c.destination);
      osc.start();
      osc.stop(c.currentTime + duration);
    } catch (e) { /* silencieux si audio bloqué */ }
  }

  const sound = {
    click: () => beep({ freq: 320, duration: 0.06, type: 'triangle', gain: 0.05 }),
    win: () => { beep({ freq: 523, duration: 0.12 }); setTimeout(() => beep({ freq: 659, duration: 0.12 }), 100); setTimeout(() => beep({ freq: 784, duration: 0.2 }), 200); },
    lose: () => beep({ freq: 200, duration: 0.4, type: 'sawtooth', glideTo: 80 }),
    wheel: () => beep({ freq: 200, duration: 0.05, type: 'square', gain: 0.03 }),
    explosion: () => beep({ freq: 120, duration: 0.5, type: 'sawtooth', glideTo: 30, gain: 0.15 }),
    toggle: (sound) => { state.settings.sound = sound; save(); }
  };

  /* ------------------------------------------------------------
     4. TOASTS
  ------------------------------------------------------------ */
  function showToast(message, ms = 3200, isHtml = false) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'toast';
    if (isHtml) { el.innerHTML = message; } else { el.textContent = message; }
    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
      el.classList.remove('show');
      setTimeout(() => el.remove(), 400);
    }, ms);
  }

  /* ------------------------------------------------------------
     5. CONFETTI — canvas léger, sans dépendance
  ------------------------------------------------------------ */
  function confettiBurst(originX = 0.5, originY = 0.4, count = 90) {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const c = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('active');

    const colors = ['#6B8F71', '#4F6F52', '#C1594B', '#EFE7D6', '#2B2B2B'];
    const particles = Array.from({ length: count }, () => ({
      x: originX * canvas.width,
      y: originY * canvas.height,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -12 - 4,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 18,
      life: 1
    }));

    let frame = 0;
    function tick() {
      frame++;
      c.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.vy += 0.35; // gravité
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;
        p.life -= 0.012;
        if (p.life > 0) {
          alive = true;
          c.save();
          c.globalAlpha = Math.max(p.life, 0);
          c.translate(p.x, p.y);
          c.rotate((p.rotation * Math.PI) / 180);
          c.fillStyle = p.color;
          c.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          c.restore();
        }
      });
      if (alive && frame < 240) {
        requestAnimationFrame(tick);
      } else {
        c.clearRect(0, 0, canvas.width, canvas.height);
        canvas.classList.remove('active');
      }
    }
    tick();
  }

  /* ------------------------------------------------------------
     6. PARTICLES — fond animé discret
  ------------------------------------------------------------ */
  function initParticles() {
    const canvas = document.getElementById('bg-particles');
    if (!canvas) return;
    const c = canvas.getContext('2d');
    let w, h, particles;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COUNT = window.innerWidth < 700 ? 28 : 55;
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.1
    }));

    function loop() {
      c.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.fillStyle = `rgba(107, 143, 113, ${p.alpha})`;
        c.fill();
      });
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ------------------------------------------------------------
     7. RIPPLE EFFECT — appliqué automatiquement aux .btn / .card
  ------------------------------------------------------------ */
  function attachRipple(el) {
    el.addEventListener('click', function (e) {
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height) * 1.4;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  }

  function initRipples(scope = document) {
    scope.querySelectorAll('.ripple-target').forEach(el => {
      if (!el.dataset.rippleBound) {
        attachRipple(el);
        el.dataset.rippleBound = 'true';
      }
    });
  }

  /* ------------------------------------------------------------
     8. HELPERS DIVERS
  ------------------------------------------------------------ */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function formatMs(ms) {
    return `${ms} ms`;
  }

  return {
    state, getState, save, updateStats, recordGamePlayed, recordWin, recordLoss,
    checkAchievements, ACHIEVEMENT_DEFS,
    sound, showToast, confettiBurst, initParticles, initRipples,
    shuffle, pickRandom, formatMs
  };
})();