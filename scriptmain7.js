/* ══════════════════════════════════════════
   Carlos · 50 Años — Script principal
   ══════════════════════════════════════════ */

emailjs.init("O9TA18-zps7iaEptM");
const SERVICE_ID  = "service_6m7prwn";
const TEMPLATE_ID = "template_41pvc6t";


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
   RSVP FORM — EmailJS
   ════════════════════════════════════════ */
document.getElementById('rsvp-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const btn     = document.getElementById('button-send');
    const btnText = document.getElementById('btn-text');

    const alergias = this.allergies.value.trim() || 'Ninguna';
    const correo   = this.reply_to.value.trim();

    btn.disabled        = true;
    btnText.textContent = 'Enviando…';

    emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        couple_name: this.couple_name.value,
        from_name:   this.from_name.value,
        last_name:   this.last_name.value,
        age:         this.age.value,
        attendance:  this.attendance.value,
        reply_to:    correo,
        allergies:   alergias + '\nCorreo: ' + correo,
    })
        .then(() => {
            btnText.textContent  = '✓  ¡Confirmado!';
            btn.style.background = '#5c6b3a';
            this.reset();

            setTimeout(() => {
                btn.disabled        = false;
                btnText.textContent = 'Confirmar Asistencia';
                btn.style.background = '';
            }, 5000);
        })
        .catch((err) => {
            console.error('EmailJS error:', JSON.stringify(err));
            btn.disabled        = false;
            btnText.textContent = 'Error — intenta de nuevo';
            btn.style.background = '#8b2020';

            setTimeout(() => {
                btnText.textContent  = 'Confirmar Asistencia';
                btn.style.background = '';
            }, 3500);
        });
});
