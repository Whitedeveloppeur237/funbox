/* ============================================================
   FUNBOX — wheel.js
   Jeu "🎡 Roue de la chance" : roue en canvas avec vraie
   animation de rotation physique (décélération progressive).
   ============================================================ */

const WHEEL_SEGMENTS = [
  { label: "Raconte une blague", color: "#6B8F71" },
  { label: "Chante un couplet", color: "#4F6F52" },
  { label: "Fais 10 pompes", color: "#C1594B" },
  { label: "Envoie un selfie", color: "#8A9B6E" },
  { label: "Complimente qqn", color: "#6B8F71" },
  { label: "Raconte un souvenir", color: "#4F6F52" },
  { label: "Danse 20 secondes", color: "#C1594B" },
  { label: "Choisis quelqu'un", color: "#8A9B6E" }
];

let wheelRotation = 0;
let wheelSpinning = false;

function fbInitWheel() {
  FB.recordGamePlayed();
  const container = document.getElementById('game-wheel');
  container.innerHTML = `
    <div class="game-panel wheel-panel">
      ${FB_BACK_BTN}
      <h2 class="game-title"><i class="fa-solid fa-circle-notch"></i> Roue de la chance</h2>
      <div class="wheel-wrap">
        <div class="wheel-pointer"><i class="fa-solid fa-caret-down"></i></div>
        <canvas id="wheel-canvas" width="340" height="340"></canvas>
      </div>
      <button class="btn btn-primary ripple-target" id="spin-btn"><i class="fa-solid fa-bullseye"></i> Tourner la roue</button>
      <div id="wheel-result" class="wheel-result hidden"></div>
    </div>
  `;
  container.querySelector('[data-back]').addEventListener('click', () => window.fbGoHome());
  FB.initRipples(container);

  wheelRotation = 0;
  drawWheel();
  document.getElementById('spin-btn').addEventListener('click', spinWheel);
}

function drawWheel() {
  const canvas = document.getElementById('wheel-canvas');
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = canvas.width / 2 - 6;
  const segAngle = (Math.PI * 2) / WHEEL_SEGMENTS.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(wheelRotation);

  WHEEL_SEGMENTS.forEach((seg, i) => {
    const start = i * segAngle;
    const end = start + segAngle;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = seg.color + (i % 2 === 0 ? 'CC' : '99');
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Texte du segment
    ctx.save();
    ctx.rotate(start + segAngle / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = '600 12px Poppins, sans-serif';
    ctx.fillText(seg.label, radius - 14, 4);
    ctx.restore();
  });

  ctx.restore();

  // Centre
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();
  ctx.strokeStyle = '#00E5FF';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function spinWheel() {
  if (wheelSpinning) return;
  wheelSpinning = true;
  document.getElementById('wheel-result').classList.add('hidden');
  const spinBtn = document.getElementById('spin-btn');
  spinBtn.disabled = true;

  const segAngle = (Math.PI * 2) / WHEEL_SEGMENTS.length;
  const extraTurns = 5 + Math.random() * 2; // 5 à 7 tours
  const randomOffset = Math.random() * Math.PI * 2;
  const targetRotation = wheelRotation + extraTurns * Math.PI * 2 + randomOffset;

  const duration = 4200;
  const startTime = performance.now();
  const startRotation = wheelRotation;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  let lastTickSegment = -1;

  function animate(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(t);
    wheelRotation = startRotation + (targetRotation - startRotation) * eased;
    drawWheel();

    const currentSegment = Math.floor(((wheelRotation % (Math.PI * 2)) / segAngle));
    if (currentSegment !== lastTickSegment) {
      lastTickSegment = currentSegment;
      FB.sound.wheel();
    }

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      finishSpin(targetRotation, segAngle);
    }
  }
  requestAnimationFrame(animate);
}

function finishSpin(finalRotation, segAngle) {
  wheelSpinning = false;
  document.getElementById('spin-btn').disabled = false;

  // Le pointeur est en haut (angle -PI/2 par rapport au centre, soit 270°)
  const normalized = ((Math.PI * 1.5) - (finalRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const index = Math.floor(normalized / segAngle) % WHEEL_SEGMENTS.length;
  const seg = WHEEL_SEGMENTS[index];

  const resultEl = document.getElementById('wheel-result');
  resultEl.classList.remove('hidden');
  resultEl.innerHTML = `<span class="wheel-result-icon"><i class="fa-solid fa-champagne-glasses"></i></span> <strong>${seg.label}</strong>`;
  resultEl.classList.remove('pop-in');
  void resultEl.offsetWidth;
  resultEl.classList.add('pop-in');

  FB.sound.win();
  FB.confettiBurst(0.5, 0.35, 60);
  FB.recordWin();
}