// INTRO VIDEO AUTO END
const intro = document.getElementById("intro");
const app = document.getElementById("app");
const video = document.getElementById("introVideo");

if (video) {
  video.onended = () => {
    intro.style.display = "none";
    app.style.display = "block";
  };
}

// REAL-TIME DATE & TIME
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

// MAIN SIGNALS GENERATE
const genBtn = document.getElementById("genBtn");
if (genBtn) {
  genBtn.onclick = () => {
    fetch("main-signals.json")
      .then(r => r.json())
      .then(data => {
        document.getElementById("signalArea").style.display = "block";
        data.boxes.forEach((box, i) => {
          let html = "";
          box.forEach(s => {
            html += `<p>⏰ ${s.time} | 🎯 ${s.odd}</p>`;
          });
          document.getElementById("box" + (i + 1)).innerHTML = html;
        });
      });
  };
}

// 2X SIGNALS GENERATE
const gen2x = document.getElementById("gen2x");
if (gen2x) {
  gen2x.onclick = () => {
    fetch("twox-signals.json")
      .then(r => r.json())
      .then(data => {
        let html = "";
        data.signals.forEach(s => {
          html += `<p>⏰ ${s.time} — 🎯 ${s.odd}</p>`;
        });
        document.getElementById("twoxArea").innerHTML = html;
        document.getElementById("twoxArea").style.display = "block";
      });
  };
}