(function () {
  "use strict";

  const video = document.getElementById("last-message-video");
  const playButton = document.getElementById("last-play-button");

  function syncButton() {
    const isPlaying = !video.paused && !video.ended;
    playButton.innerHTML = isPlaying
      ? "<span>❚❚</span> Pause My Message <i>♡</i>"
      : "<span>▶</span> Play My Message <i>♡</i>";
  }

  playButton.addEventListener("click", async () => {
    if (video.paused || video.ended) {
      try {
        await video.play();
      } catch (_error) {
        video.controls = true;
      }
    } else {
      video.pause();
    }
    syncButton();
  });

  video.addEventListener("play", syncButton);
  video.addEventListener("pause", syncButton);
  video.addEventListener("ended", syncButton);
})();
