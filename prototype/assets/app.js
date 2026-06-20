function pad(n) {
  return String(n).padStart(2, "0");
}

function updateClocks() {
  const now = new Date();
  document.querySelectorAll("[data-clock]").forEach((el) => {
    el.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  });
}

function updateTimers() {
  document.querySelectorAll("[data-countdown]").forEach((el) => {
    let seconds = Number(el.dataset.seconds || "0");
    if (seconds > 0) seconds -= 1;
    el.dataset.seconds = String(seconds);
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    el.textContent = `${pad(min)}:${pad(sec)}`;
    const card = el.closest(".tv-court, .court-card");
    if (card && seconds <= 120 && seconds > 0) {
      card.classList.add("warning");
    }
    if (card && seconds === 0) {
      el.textContent = "TIME UP";
      card.classList.add("warning");
    }
  });
}

function fakeLivePulse() {
  const pills = document.querySelectorAll("[data-live-text]");
  pills.forEach((pill) => {
    pill.textContent = Math.random() > 0.5 ? "LIVE" : "SYNCED";
  });
}

setInterval(updateClocks, 1000);
setInterval(updateTimers, 1000);
setInterval(fakeLivePulse, 4000);
updateClocks();
updateTimers();
