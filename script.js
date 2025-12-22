/* =========================
   INTRO VIDEO AUTO END
========================= */
const intro = document.getElementById("intro");
const app = document.getElementById("app");
const video = document.getElementById("introVideo");

if (video) {
  video.onended = () => {
    intro.style.display = "none";
    app.style.display = "block";
  };
}

/* =========================
   REAL-TIME DATE & TIME
========================= */
function updateDateTime() {
  const now = new Date();
  const el = document.getElementById("datetime");
  if (el) {
    el.innerText =
      "📅 " + now.toLocaleDateString("en-GB") +
      " | ⏰ " + now.toLocaleTimeString();
  }
}
setInterval(updateDateTime, 1000);
updateDateTime();

/* =========================
   ACTIVATION SETTINGS
========================= */
const ACTIVATION_CODE = "SASIYA"; // 🔑 CHANGE THIS
const VALID_HOURS = 168 ;               // ⏱ VALID TIME

/* =========================
   MAIN GENERATE BUTTON
   (WITH ACTIVATION)
========================= */
const genBtn = document.getElementById("genBtn");
if (genBtn) {
  genBtn.onclick = () => {
    if (isActivationValid()) {
      loadMainSignals();
      startTimer();
    } else {
      document.getElementById("activationModal").style.display = "flex";
    }
  };
}

/* =========================
   CHECK ACTIVATION
========================= */
function checkActivation() {
  const input = document.getElementById("activationInput").value;
  const msg = document.getElementById("activationMsg");

  if (input !== ACTIVATION_CODE) {
    msg.style.color = "red";
    msg.innerText = "❌ Invalid Activation Code";
    return;
  }

  const expiry = Date.now() + VALID_HOURS * 60 * 60 * 1000;
  localStorage.setItem("activationExpiry", expiry);

  msg.style.color = "lime";
  msg.innerText = "✅ Activated Successfully";

  setTimeout(() => {
    document.getElementById("activationModal").style.display = "none";
    loadMainSignals();
    startTimer();
  }, 800);
}

function isActivationValid() {
  const expiry = localStorage.getItem("activationExpiry");
  if (!expiry) return false;
  return Date.now() < expiry;
}

/* =========================
   LOAD MAIN SIGNALS
========================= */
function loadMainSignals() {
  fetch("main-signals.json")
    .then(r => r.json())
    .then(data => {
      document.getElementById("signalArea").style.display = "block";
      document.getElementById("activationTimer").style.display = "block";

      data.boxes.forEach((box, i) => {
        let html = "";
        box.forEach(s => {
          html += `<p>⏰ ${s.time} | 🎯 ${s.odd}</p>`;
        });
        document.getElementById("box" + (i + 1)).innerHTML = html;
      });
    });
}

/* =========================
   ACTIVATION TIMER
========================= */
let timerInterval;

function startTimer() {
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const expiry = localStorage.getItem("activationExpiry");
    if (!expiry) return;

    const diff = expiry - Date.now();

    if (diff <= 0) {
      clearInterval(timerInterval);
      logout();
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    document.getElementById("timeLeft").innerText =
      `${d}d : ${h}h : ${m}m : ${s}s`;
  }, 1000);
}

function logout() {
  localStorage.removeItem("activationExpiry");
  document.getElementById("signalArea").style.display = "none";
  document.getElementById("activationTimer").style.display = "none";
  alert("⛔ Activation Expired");
}

/* =========================
   AUTO LOAD IF STILL ACTIVE
========================= */
window.onload = () => {
  if (isActivationValid()) {
    loadMainSignals();
    startTimer();
  }
};

/* =========================
   2X SIGNALS BUTTON
   (ACTIVATION REQUIRED TOO)
========================= */
const gen2x = document.getElementById("gen2x");
if (gen2x) {
  gen2x.onclick = () => {
    if (isActivationValid()) {
      fetch("twox-signals.json")
        .then(r => r.json())
        .then(data => {
          let html = `<div class="highlight-box">⚠️ Notice: Always bet 3 rounds using Martingale. Auto cash out 2x.</div>`;
          data.signals.forEach(s => {
            html += `<p>⏰ ${s.time} — 🎯 ${s.odd}</p>`;
          });
          document.getElementById("twoxArea").innerHTML = html;
          document.getElementById("twoxArea").style.display = "block";
        });
    } else {
      document.getElementById("activationModal").style.display = "flex";
    }
  };
}
