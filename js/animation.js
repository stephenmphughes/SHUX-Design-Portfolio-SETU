// YOUTUBE LINK FOR TIMELINE: https://www.youtube.com/watch?v=t5AE66WgQD0
//ANIMATION https://www.youtube.com/watch?v=evmu1ABASaU

// Code will select timeline containers and the timeline class itself
const timeline = document.querySelector('.timeline');
const timelineContainers = document.querySelectorAll('.timeline-container');

// Function to trigger animations when elements enter the viewport
function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add the 'animate' class, this will trigger animation
      entry.target.classList.add('animate');
    }
  });
}

// observer - THIS TRIGGERS WHEN HALF THE PAGE IS IN VIEW (HALF OF THE SECTION HAS BEEN SCROLLED ONTO)
const observerOptions = {
  threshold: 0.20
};

// Create the IntersectionObserver instance for timeline containers
const observer = new IntersectionObserver(handleIntersection, observerOptions);

// Observe each timeline container
timelineContainers.forEach(container => {
  observer.observe(container);
});

// Observe the timeline to trigger animation on vertical line
const timelineObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      timeline.classList.add('animate');
    }
  });
}, observerOptions);

// Observe the timeline element itself
timelineObserver.observe(timeline);

// ===== Diagonal Slider init (scoped) =====
(function () {
  function initDiagonalSlider() {
    const slider = document.querySelector("#diagonal-slider");
    if (!slider || !window.anime) return; // guard

    const nextBtn = slider.querySelector(".nav .next");
    const prevBtn = slider.querySelector(".nav .prev");
    const items = slider.querySelectorAll(".item");
    let current = 0;
    let isPlaying = false;

    // Split headline letters for animation
    items.forEach((item) => {
      const textWrapper = item.querySelector(".wrap");
      if (!textWrapper) return;
      textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    });

    function anim(currentEl, nextEl, callback) {
      const currentImgs = currentEl.querySelectorAll(".img");
      const currentText = currentEl.querySelectorAll(".content .letter");
      const nextImgs = nextEl.querySelectorAll(".img");
      const nextText = nextEl.querySelectorAll(".content .letter");

      const t = 400;
      const offset = "-=" + t * 0.4;
      const imgOffset = t * 0.8;

      const tl = anime.timeline({
        easing: "easeInOutQuint",
        duration: t,
        complete: callback
      });

      tl.add({
        targets: currentText,
        translateY: [0, '-0.75em'],
        opacity: [1, 0],
        easing: "easeInQuint",
        duration: t,
        delay: (_, i) => 10 * (i + 1)
      })
      .add({ targets: currentImgs[0], translateY: -600, rotate: [0, '-15deg'], opacity: [1, 0], easing: "easeInCubic" }, offset)
      .add({ targets: currentImgs[1], translateY: -600, rotate: [0, '15deg'],  opacity: [1, 0], easing: "easeInCubic" }, "-=" + imgOffset)
      .add({ targets: currentImgs[2], translateY: -600, rotate: [0, '-15deg'], opacity: [1, 0], easing: "easeInCubic" }, "-=" + imgOffset)
      .add({ targets: currentImgs[3], translateY: -600, rotate: [0, '15deg'],  opacity: [1, 0], easing: "easeInCubic" }, "-=" + imgOffset)
      .add({ targets: currentEl, opacity: 0, duration: 10, easing: "easeInCubic" })
      .add({ targets: nextEl, opacity: 1, duration: 10 }, offset)
      .add({ targets: nextImgs[0], translateY: [600, 0], rotate: ['15deg', 0],  opacity: [0, 1], easing: "easeOutCubic" }, offset)
      .add({ targets: nextImgs[1], translateY: [600, 0], rotate: ['-15deg', 0], opacity: [0, 1], easing: "easeOutCubic" }, "-=" + imgOffset)
      .add({ targets: nextImgs[2], translateY: [600, 0], rotate: ['15deg', 0], opacity: [0, 1], easing: "easeOutCubic" }, "-=" + imgOffset)
      .add({ targets: nextImgs[3], translateY: [600, 0], rotate: ['-15deg', 0], opacity: [0, 1], easing: "easeOutCubic" }, "-=" + imgOffset)
      .add({
        targets: nextText,
        translateY: ['0.75em', 0],
        opacity: [0, 1],
        easing: "easeOutQuint",
        duration: t * 1.5,
        delay: (_, i) => 10 * (i + 1)
      }, offset);
    }

    function updateSlider(newIndex) {
      const currentItem = items[current];
      const newItem = items[newIndex];

      function done() {
        currentItem.classList.remove("is-active");
        newItem.classList.add("is-active");
        current = newIndex;
        isPlaying = false;
      }
      anim(currentItem, newItem, done);
    }

    function next() {
      if (isPlaying) return;
      isPlaying = true;
      const newIndex = current === items.length - 1 ? 0 : current + 1;
      updateSlider(newIndex);
    }
    function prev() {
      if (isPlaying) return;
      isPlaying = true;
      const newIndex = current === 0 ? items.length - 1 : current - 1;
      updateSlider(newIndex);
    }

    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDiagonalSlider);
  } else {
    initDiagonalSlider();
  }
})();
