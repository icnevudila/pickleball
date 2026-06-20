function pad(number) {
  return String(number).padStart(2, "0");
}

function updateClock() {
  const now = new Date();
  document.querySelectorAll("[data-clock]").forEach((el) => {
    el.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  });
}

function updateCountdowns() {
  document.querySelectorAll("[data-countdown]").forEach((el) => {
    let seconds = Number(el.dataset.seconds || "0");
    if (seconds > 0) seconds -= 1;
    el.dataset.seconds = String(seconds);

    if (seconds <= 0) {
      el.textContent = "TIME UP";
      const card = el.closest(".court, .tv-court");
      if (card) card.classList.add("warning");
      return;
    }

    const minutes = Math.floor(seconds / 60);
    const remain = seconds % 60;
    el.textContent = `${pad(minutes)}:${pad(remain)}`;

    if (seconds <= 120) {
      const card = el.closest(".court, .tv-court");
      if (card) card.classList.add("warning");
    }
  });
}

function rotateLiveText() {
  const labels = ["LIVE", "SYNCED", "REALTIME"];
  document.querySelectorAll("[data-live-label]").forEach((el) => {
    const next = labels[Math.floor(Math.random() * labels.length)];
    el.textContent = next;
  });
}

setInterval(updateClock, 1000);
setInterval(updateCountdowns, 1000);
setInterval(rotateLiveText, 3500);
updateClock();
updateCountdowns();
