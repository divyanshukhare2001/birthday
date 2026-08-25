(function () {
  "use strict";

  const vault = window.BirthdayVault;
  const pageId = document.body.dataset.surpriseId;
  const item = vault.items.find((entry) => entry.id === pageId);

  // The vault controls when links become clickable, but a valid surprise URL
  // can always be opened directly.
  if (!item) {
    window.location.replace("../index.html");
    return;
  }

  vault.markOpened(item.id);
  document.title = `${item.title.replace("|", " ")} · The Birthday Vault`;
  const heading = document.querySelector("[data-surprise-title]");
  if (heading && !heading.hasAttribute("data-preserve-title")) heading.textContent = item.title.replace("|", " ");
})();
