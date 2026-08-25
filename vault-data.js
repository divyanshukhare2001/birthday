(function () {
  "use strict";

  const TARGET_DATE = { year: 2026, monthIndex: 7, day: 26 };
  const DATE_KEY = `${TARGET_DATE.year}-${String(TARGET_DATE.monthIndex + 1).padStart(2, "0")}-${String(TARGET_DATE.day).padStart(2, "0")}`;
  const STORAGE_KEY = `birthday-vault:opened:${DATE_KEY}`;

  const items = [
    { id: "it-begins", time: "12:00 AM", hour: 0, minute: 0, title: "It Begins", emoji: "♥", href: "surprises/it-begins.html" },
    { id: "good-morning", time: "09:30 AM", hour: 9, minute: 30, title: "Good Morning,|Birthday Girl", emoji: "☀️", href: "surprises/good-morning.html" },
    { id: "remember-this", time: "02:00 PM", hour: 14, minute: 0, title: "I Remember|This", emoji: "📷", href: "surprises/i-remember-this.html" },
    { id: "playlist", time: "05:30 PM", hour: 17, minute: 30, title: "If Us Were a|Playlist", emoji: "🎧", href: "surprises/playlist.html" },
    { id: "one-last-thing", time: "10:00 PM", hour: 22, minute: 0, title: "One Last|Thing", emoji: "🌙", href: "surprises/one-last-thing.html" }
  ];

  function unlockAt(item) {
    return new Date(TARGET_DATE.year, TARGET_DATE.monthIndex, TARGET_DATE.day, item.hour, item.minute, 0, 0);
  }

  function readOpened() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return new Set(Array.isArray(value) ? value : []);
    } catch (_error) {
      return new Set();
    }
  }

  function markOpened(id) {
    const opened = readOpened();
    opened.add(id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...opened]));
    } catch (_error) {
      // The visit still works if storage is disabled; only persistence is lost.
    }
  }

  function stateFor(item, now, opened) {
    if (now < unlockAt(item)) return "locked";
    return opened.has(item.id) ? "opened" : "ready";
  }

  window.BirthdayVault = {
    DATE_KEY,
    TARGET_DATE,
    STORAGE_KEY,
    items,
    unlockAt,
    readOpened,
    markOpened,
    stateFor
  };
})();
