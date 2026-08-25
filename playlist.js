(function () {
  "use strict";

  const preloader = document.getElementById("pl-preloader");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let finished = false;

  function finishPreloader() {
    if (finished) return;
    finished = true;
    document.body.classList.remove("is-preloading");
    preloader.classList.add("is-finished");
    window.setTimeout(() => { preloader.hidden = true; }, 500);
  }

  if (reducedMotion) {
    window.setTimeout(finishPreloader, 250);
  } else {
    window.requestAnimationFrame(() => preloader.classList.add("is-running"));
    window.setTimeout(finishPreloader, 6400);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") finishPreloader();
  });
})();
