/* ══════════════════════════════════════════
   Carlos · 50 Años — Script principal
   ══════════════════════════════════════════ */

const SHEET_URL = "https://script.google.com/macros/s/AKfycbzuGHeAHfmnIfik20u7OyyG4qzM-H0Dgb0t65OWcjzG2oCn_17O76Tv-py7U05Lz_rVZA/exec";


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

    const pad = n => String(n).padStart(2, '0');

    const tick = () => {
        const diff = TARGET - Date.now();

        if (diff <= 0) {
            clearInterval(interval);
            elTimer.innerHTML =
                '<span class="board-num" style="font-size:clamp(18px,5vw,28px);color:var(--yellow)">¡ES HOY!</span>';
            return;
        }

        elDays.textContent  = pad(Math.floor(diff / 86400000));
        elHours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
        elMin.textContent   = pad(Math.floor((diff % 3600000)  / 60000));
        elSec.textContent   = pad(Math.floor((diff % 60000)    / 1000));
    };

    tick();
    const interval = setInterval(tick, 1000);
}


/* ════════════════════════════════════════
   SCROLL REVEAL
   ════════════════════════════════════════ */
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.10 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}


/* ════════════════════════════════════════
   RSVP FORM — Google Sheets
   ════════════════════════════════════════ */
document.getElementById('rsvp-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const btn     = document.getElementById('button-send');
    const btnText = document.getElementById('btn-text');

    btn.disabled        = true;
    btnText.textContent = 'Enviando…';

    const payload = JSON.stringify({
        couple_name: this.couple_name.value,
        from_name:   this.from_name.value,
        last_name:   this.last_name.value,
        reply_to:    this.reply_to.value.trim(),
        age:         this.age.value,
        attendance:  this.attendance.value,
        allergies:   this.allergies.value.trim() || 'Ninguna',
    });

    fetch(SHEET_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body:    payload,
    })
        .then(() => {
            btnText.textContent  = '✓  ¡Confirmado!';
            btn.style.background = '#5c6b3a';
            this.reset();

            setTimeout(() => {
                btn.disabled         = false;
                btnText.textContent  = 'Confirmar Asistencia';
                btn.style.background = '';
            }, 5000);
        })
        .catch((err) => {
            console.error('Sheets error:', err);
            btn.disabled         = false;
            btnText.textContent  = 'Error — intenta de nuevo';
            btn.style.background = '#8b2020';

            setTimeout(() => {
                btnText.textContent  = 'Confirmar Asistencia';
                btn.style.background = '';
            }, 3500);
        });
});
