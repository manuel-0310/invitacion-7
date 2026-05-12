/* ══════════════════════════════════════════
   Carlos · 50 Años — Script principal
   ══════════════════════════════════════════ */

/* ── EmailJS Config ─────────────────────────
   Reemplaza con tus claves reales de EmailJS
   ─────────────────────────────────────────── */
emailjs.init("YOUR_PUBLIC_KEY");         // ← tu Public Key de EmailJS

const SERVICE_ID  = "YOUR_SERVICE_ID";  // ← tu Service ID
const TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // ← tu Template ID


/* ════════════════════════════════════════
   INTRO → MAIN CONTENT
   ════════════════════════════════════════ */
let alreadyLaunched = false;

function launchMain() {
    if (alreadyLaunched) return;
    alreadyLaunched = true;

    const overlay = document.getElementById('intro-overlay');
    const main    = document.getElementById('main-content');

    overlay.classList.add('fade-out');

    setTimeout(() => {
        overlay.style.display = 'none';
        main.classList.remove('hidden');
        initCountdown();
        initReveal();
    }, 900);
}

// Auto-launch after 6 s si el usuario no hace click
setTimeout(launchMain, 6000);


/* ════════════════════════════════════════
   COUNTDOWN TIMER
   ════════════════════════════════════════ */
function initCountdown() {
    const TARGET = new Date("Oct 10, 2026 18:00:00").getTime();

    const elDays  = document.getElementById('days');
    const elHours = document.getElementById('hours');
    const elMin   = document.getElementById('minutes');
    const elSec   = document.getElementById('seconds');
    const elTimer = document.getElementById('timer');

    const pad = n => (n < 10 ? '0' : '') + n;

    const tick = () => {
        const diff = TARGET - Date.now();

        if (diff <= 0) {
            clearInterval(interval);
            elTimer.innerHTML =
                '<span class="board-num" style="font-size:clamp(22px,6vw,32px);color:var(--gold)">¡ES HOY!</span>';
            return;
        }

        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000)  / 60000);
        const s = Math.floor((diff % 60000)    / 1000);

        elDays.textContent    = pad(d);
        elHours.textContent   = pad(h);
        elMin.textContent     = pad(m);
        elSec.textContent     = pad(s);
    };

    tick();
    const interval = setInterval(tick, 1000);
}


/* ════════════════════════════════════════
   SCROLL REVEAL
   ════════════════════════════════════════ */
function initReveal() {
    const items = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.10 });

    items.forEach(el => observer.observe(el));
}


/* ════════════════════════════════════════
   RSVP FORM — EmailJS
   ════════════════════════════════════════ */
document.getElementById('rsvp-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const btn     = document.getElementById('button-send');
    const btnText = document.getElementById('btn-text');

    btn.disabled       = true;
    btnText.textContent = 'Enviando…';

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, this)
        .then(() => {
            btnText.textContent  = '✓  ¡Confirmado!';
            btn.style.background = '#5C6B3A';   /* olive green */
            this.reset();

            // Reset button after 5 s
            setTimeout(() => {
                btn.disabled         = false;
                btnText.textContent  = 'Confirmar';
                btn.style.background = '';
            }, 5000);
        })
        .catch(() => {
            btn.disabled         = false;
            btnText.textContent  = 'Error — intenta de nuevo';
            btn.style.background = '#8B2020';

            setTimeout(() => {
                btnText.textContent  = 'Confirmar';
                btn.style.background = '';
            }, 3500);
        });
});
