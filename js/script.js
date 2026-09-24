// 1. CONFIGURACIÓN DE LA FECHA (EDITABLE)
const EVENT_DATE_STRING = "2026-10-24T20:00:00"; 

// LÓGICA DE LA CUENTA REGRESIVA Y BLOQUEO DE WHATSAPP
function updateCountdown() {
    const targetDate = new Date(EVENT_DATE_STRING).getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    const countdownBoxes = document.getElementById("countdown-boxes");
    const partyStartedMsg = document.getElementById("party-started-msg");
    const btnWhatsapp = document.querySelector(".btn-90s-whatsapp");

    if (difference <= 0) {
        // Ocultar contador y mostrar mensaje
        if (countdownBoxes) countdownBoxes.classList.add("d-none");
        if (partyStartedMsg) partyStartedMsg.classList.remove("d-none");

        // DESHABILITAR BOTÓN DE WHATSAPP AL TERMINAR
        if (btnWhatsapp) {
            btnWhatsapp.classList.add("disabled");
            btnWhatsapp.removeAttribute("href");
            btnWhatsapp.style.pointerEvents = "none";
            btnWhatsapp.innerHTML = '<i class="fa-solid fa-lock me-2"></i>CONFIRMACIÓN CERRADA';
        }
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? '0' + days : days;
    document.getElementById("hours").innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? '0' + seconds : seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// 2. MODAL Y ACTIVACIÓN DEL EFECTO ZOOM-IN EN LA PRESENTACIÓN
const btnContinue = document.getElementById('btn-continue');
const welcomeModal = document.getElementById('welcome-modal');
const heroSection = document.getElementById('hero');
const wheelLeft = document.getElementById('wheel-left');
const wheelRight = document.getElementById('wheel-right');
const localAudio = document.getElementById('local-mp3-audio');

btnContinue.addEventListener('click', () => {
    // Ocultar modal
    welcomeModal.style.display = 'none';
    // Quitar bloqueo de scroll
    document.body.classList.remove('modal-open-custom');
    
    // Disparar animación Zoom In
    heroSection.classList.add('start-zoom');

    // Reproducir audio
    playCassette();
});

// 3. CONTROL DEL REPRODUCTOR DE MÚSICA / CASSETERA
function playCassette() {
    wheelLeft.classList.add('spinning');
    wheelRight.classList.add('spinning');

    if (localAudio) {
        localAudio.play().catch(err => {
            console.log("Audio local no encontrado o bloqueado, activando sintetizador de respaldo.");
            playSynthesizedAudio();
        });
    }
}

function stopCassette() {
    wheelLeft.classList.remove('spinning');
    wheelRight.classList.remove('spinning');
    if (localAudio) localAudio.pause();
    if (audioCtx) audioCtx.suspend();
}

document.getElementById('btn-play-audio').addEventListener('click', playCassette);
document.getElementById('btn-pause-audio').addEventListener('click', stopCassette);

// REPRODUCTOR SINTETIZADO RETRO (Web Audio API) DE RESPALDO
let audioCtx = null;
function playSynthesizedAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
    } else {
        audioCtx.resume();
    }
}
