(function () {
  "use strict";

  const preloader = document.getElementById("gm-preloader");
  const collage = document.querySelector(".gm-collage");
  const flipCard = document.querySelector(".gm-flip-card");
  const frontImage = document.querySelector(".gm-photo-mat img");
  const underImage = document.querySelector(".gm-under-polaroid img");
  const underProgress = document.querySelector(".gm-under-progress");
  const backNumber = document.querySelector(".gm-back-number");
  const backMessage = document.querySelector(".gm-back-message");
  const backDoodle = document.querySelector(".gm-back-doodle");
  const cardProgress = document.querySelector(".gm-card-progress");
  const currentMessage = document.querySelector(".gm-current-message");
  const currentNumber = document.querySelector(".gm-current-number");
  const currentCopy = document.querySelector(".gm-current-copy");
  const currentDoodle = document.querySelector(".gm-current-doodle");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cover = {
    image: "../assets/birthday-sunset-hero.png",
    alt: "A girl holding warm fairy lights at sunset",
    position: "69% center"
  };
  const memories = [
    {
      image: "../assets/morning-carnations-photo.png",
      alt: "Pink carnations glowing in soft morning light",
      position: "center",
      message: "Your smile makes even the quietest morning feel like sunshine.",
      doodle: "☀"
    },
    {
      image: "../assets/memory-coffee.png",
      alt: "Coffee, a croissant, and pink flowers beside a sunny window",
      position: "center",
      message: "The way you care makes everything around you feel softer.",
      doodle: "❀"
    },
    {
      image: "../assets/memory-letter-rose.png",
      alt: "A ribbon-tied letter beside a dried pink rose",
      position: "center",
      message: "Your sleepy morning voice is my favorite way for a day to begin.",
      doodle: "☕"
    },
    {
      image: "../assets/memory-moon-window.png",
      alt: "A crescent moon and city lights through a cozy window",
      position: "center",
      message: "You turn the most ordinary little moments into memories I keep.",
      doodle: "♡"
    },
    {
      image: "../assets/memory-vinyl.png",
      alt: "Headphones, a vinyl record, and warm fairy lights",
      position: "center",
      message: "Your laughter always finds me, even on the difficult days.",
      doodle: "☾"
    },
    {
      image: "../assets/memory-two-mugs.png",
      alt: "Two ceramic mugs together on a cozy blanket",
      position: "center",
      message: "Every song feels better when it reminds me of you.",
      doodle: "♫"
    },
    {
      image: "../assets/memory-pink-sky.png",
      alt: "A crescent moon in a pink and peach evening sky",
      position: "center",
      message: "You make comfort feel less like a place and more like a person.",
      doodle: "♡"
    },
    {
      image: "../assets/memory-camera-prints.png",
      alt: "A vintage camera with instant photographs and pink flowers",
      position: "center",
      message: "Your dreams deserve every beautiful sky they can reach.",
      doodle: "☁"
    },
    {
      image: "../assets/memory-birthday-cake.png",
      alt: "A pink birthday cake glowing with candlelight",
      position: "center",
      message: "I love the way you notice and remember the smallest things.",
      doodle: "✦"
    },
    {
      image: "../assets/remember-sunset-memory.png",
      alt: "Two people sitting together beside the sea at sunset",
      position: "center",
      message: "Simply being you gives me ten thousand reasons to smile.",
      doodle: "♥"
    }
  ];
  let finished = false;
  let currentMemory = 0;
  let isChanging = false;
  const flippedMemories = [];

  function writeMessage(element, message) {
    element.replaceChildren(document.createTextNode(`${message} `));
    const heart = document.createElement("b");
    heart.textContent = "♡";
    element.append(heart);
  }

  function showCompletedMemory(memoryIndex) {
    const memory = memories[memoryIndex];
    currentNumber.textContent = String(memoryIndex + 1).padStart(2, "0");
    writeMessage(currentCopy, memory.message);
    currentDoodle.textContent = memory.doodle;
    currentMessage.setAttribute("aria-hidden", "false");
    currentMessage.setAttribute("aria-label", `Flip message ${memoryIndex + 1} back to the photo stack`);
    collage.classList.add("has-message");
  }

  function syncDeckVisibility() {
    const cardsOnLeft = memories.length - flippedMemories.length;
    collage.classList.toggle("is-deck-empty", cardsOnLeft === 0);
  }

  function showTopMessage() {
    if (flippedMemories.length === 0) {
      currentMessage.setAttribute("aria-hidden", "true");
      collage.classList.remove("has-message");
      return;
    }

    showCompletedMemory(flippedMemories[flippedMemories.length - 1]);
  }

  function renderMemories() {
    const memory = memories[currentMemory];
    const frontPhoto = currentMemory === 0 ? cover : memories[currentMemory - 1];
    const nextPhoto = memories[currentMemory];

    frontImage.src = frontPhoto.image;
    frontImage.alt = frontPhoto.alt;
    frontImage.style.objectPosition = frontPhoto.position;
    underImage.src = nextPhoto.image;
    underImage.style.objectPosition = nextPhoto.position;
    underProgress.textContent = `${currentMemory + 1} / ${memories.length}`;
    backNumber.textContent = String(currentMemory + 1).padStart(2, "0");
    writeMessage(backMessage, memory.message);
    backDoodle.textContent = memory.doodle;
    cardProgress.textContent = currentMemory === 0 ? "" : `${currentMemory} / ${memories.length}`;
    flipCard.classList.toggle("is-cover", currentMemory === 0);
    flipCard.setAttribute(
      "aria-label",
      currentMemory === 0
        ? `Flip the cover photograph to read message 1 of ${memories.length}`
        : `Flip photograph ${currentMemory} of ${memories.length} to read message ${currentMemory + 1}`
    );

    if (memories[currentMemory + 1]) {
      const preload = new Image();
      preload.src = memories[currentMemory + 1].image;
    }
  }

  function finishPreloader() {
    if (finished) return;
    finished = true;
    document.body.classList.remove("is-preloading");
    preloader.classList.add("is-finished");
    window.setTimeout(() => { preloader.hidden = true; }, 550);
  }

  if (reducedMotion) {
    window.setTimeout(finishPreloader, 300);
  } else {
    window.requestAnimationFrame(() => preloader.classList.add("is-running"));
    window.setTimeout(finishPreloader, 7200);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") finishPreloader();
  });

  renderMemories();
  syncDeckVisibility();

  flipCard.addEventListener("click", () => {
    if (isChanging || flippedMemories.length === memories.length) return;
    isChanging = true;
    const completedMemory = currentMemory;
    collage.classList.add("is-animating");
    flipCard.classList.add("is-flipped");
    flipCard.setAttribute("aria-disabled", "true");

    window.setTimeout(() => {
      flippedMemories.push(completedMemory);
      showTopMessage();
      currentMemory = flippedMemories.length;
      flipCard.classList.add("is-resetting");
      flipCard.classList.remove("is-flipped");
      collage.classList.remove("is-animating");
      syncDeckVisibility();
      if (currentMemory < memories.length) renderMemories();
      void flipCard.offsetWidth;
      window.requestAnimationFrame(() => {
        flipCard.classList.remove("is-resetting");
        flipCard.removeAttribute("aria-disabled");
        isChanging = false;
      });
    }, reducedMotion ? 0 : 1180);
  });

  currentMessage.addEventListener("click", () => {
    if (isChanging || flippedMemories.length === 0) return;
    isChanging = true;
    const returningMemory = flippedMemories[flippedMemories.length - 1];

    currentMemory = returningMemory;
    renderMemories();
    collage.classList.remove("is-deck-empty");
    collage.classList.add("is-animating", "is-reversing");
    flipCard.classList.add("is-resetting", "is-flipped");
    flipCard.setAttribute("aria-disabled", "true");
    void flipCard.offsetWidth;

    window.requestAnimationFrame(() => {
      flipCard.classList.remove("is-resetting");
      flipCard.classList.remove("is-flipped");

      window.setTimeout(() => {
        flippedMemories.pop();
        showTopMessage();
        syncDeckVisibility();
        collage.classList.remove("is-animating", "is-reversing");
        flipCard.removeAttribute("aria-disabled");
        isChanging = false;
        if (flippedMemories.length === 0) flipCard.focus({ preventScroll: true });
      }, reducedMotion ? 0 : 1180);
    });
  });
})();
