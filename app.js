(function () {
  "use strict";

  const vault = window.BirthdayVault;
  const cardsRoot = document.getElementById("vault-cards");
  const dateLabel = document.getElementById("vault-date");
  let updateTimer;

  if (dateLabel) {
    const { year, monthIndex, day } = vault.TARGET_DATE;
    dateLabel.dateTime = vault.DATE_KEY;
    dateLabel.innerHTML = `${String(day).padStart(2, "0")}. ${String(monthIndex + 1).padStart(2, "0")}. ${year}&nbsp;&nbsp;♡`;
  }

  function titleMarkup(title, emoji) {
    const lines = title.split("|");
    return lines.map((line, index) => `<span>${line}${index === lines.length - 1 ? ` <em>${emoji}</em>` : ""}</span>`).join("");
  }

  function envelopeMarkup() {
    return '<span class="envelope" aria-hidden="true"><i></i></span>';
  }

  function heartMarkup() {
    return '<span class="sketch-heart" aria-hidden="true">♡</span>';
  }

  function lockMarkup(open) {
    return `<span class="mini-lock${open ? " is-open" : ""}" aria-hidden="true"><i></i></span>`;
  }

  function cardMarkup(item, state) {
    const isLocked = state === "locked";
    const art = isLocked ? envelopeMarkup() : heartMarkup();
    let status;

    if (state === "locked") {
      status = `<span class="locked-copy">Unlocks at<br /><b>${item.time}</b></span>${lockMarkup(false)}`;
    } else if (state === "ready") {
      status = `<span class="card-cta">CLICK ME TO OPEN</span>${lockMarkup(true)}`;
    } else {
      status = '<span class="card-cta opened-label">OPENED</span>';
    }

    return `
      <button class="vault-card state-${state}" type="button" data-card-id="${item.id}" ${isLocked ? "disabled" : ""} aria-label="${item.title.replace("|", " ")}, ${state}">
        <time>${item.time}</time>
        <h3>${titleMarkup(item.title, item.emoji)}</h3>
        <span class="card-art">${art}</span>
        <span class="card-status">${status}</span>
      </button>`;
  }

  function render() {
    window.clearTimeout(updateTimer);
    const now = new Date();
    const opened = vault.readOpened();
    cardsRoot.innerHTML = vault.items.map((item) => cardMarkup(item, vault.stateFor(item, now, opened))).join("");

    cardsRoot.querySelectorAll(".vault-card:not(:disabled)").forEach((card) => {
      card.addEventListener("click", () => {
        const item = vault.items.find((entry) => entry.id === card.dataset.cardId);
        if (!item || new Date() < vault.unlockAt(item)) return;
        vault.markOpened(item.id);
        window.location.href = item.href;
      });
    });

    const next = vault.items.map(vault.unlockAt).find((time) => time > now);
    if (next) {
      const delay = Math.max(250, Math.min(next.getTime() - now.getTime() + 75, 86_400_000));
      updateTimer = window.setTimeout(render, delay);
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) render();
  });
  window.addEventListener("focus", render);
  window.addEventListener("pageshow", render);
  render();
})();
