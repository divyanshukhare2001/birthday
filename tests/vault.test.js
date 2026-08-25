const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadVault() {
  const values = new Map();
  const localStorage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); }
  };
  const context = { window: {}, localStorage, Set, Date, JSON };
  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, "..", "vault-data.js"), "utf8"),
    context
  );
  return context.window.BirthdayVault;
}

test("cards unlock exactly at their local device-time thresholds", () => {
  const vault = loadVault();
  const opened = new Set();
  const cases = [
    [new Date(2026, 7, 24, 23, 59, 59), 0],
    [new Date(2026, 7, 25, 0, 0, 0), 1],
    [new Date(2026, 7, 25, 9, 29, 59), 1],
    [new Date(2026, 7, 25, 9, 30, 0), 2],
    [new Date(2026, 7, 25, 14, 0, 0), 3],
    [new Date(2026, 7, 25, 18, 30, 0), 4],
    [new Date(2026, 7, 25, 22, 30, 0), 5],
    [new Date(2026, 7, 26, 0, 0, 0), 5]
  ];

  for (const [now, expectedReady] of cases) {
    const ready = vault.items.filter((item) => vault.stateFor(item, now, opened) === "ready");
    assert.equal(ready.length, expectedReady);
  }
});

test("opened cards persist and render as opened after their unlock time", () => {
  const vault = loadVault();
  const item = vault.items[0];
  vault.markOpened(item.id);
  assert.ok(vault.readOpened().has(item.id));
  assert.equal(vault.stateFor(item, new Date(2026, 7, 25, 0, 0, 0), vault.readOpened()), "opened");
});

test("stored opened state cannot bypass the date guard", () => {
  const vault = loadVault();
  const item = vault.items[0];
  vault.markOpened(item.id);
  assert.equal(vault.stateFor(item, new Date(2026, 7, 24, 23, 59, 59), vault.readOpened()), "locked");
});

test("a valid surprise page remains visible when opened by its direct URL", () => {
  const vault = loadVault();
  let redirectedTo = null;
  const document = {
    body: { dataset: { surpriseId: "one-last-thing" } },
    title: "",
    querySelector() { return null; }
  };
  const context = {
    window: {
      BirthdayVault: vault,
      location: { replace(url) { redirectedTo = url; } }
    },
    document
  };

  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, "..", "surprise.js"), "utf8"),
    context
  );

  assert.equal(redirectedTo, null);
  assert.ok(vault.readOpened().has("one-last-thing"));
});
