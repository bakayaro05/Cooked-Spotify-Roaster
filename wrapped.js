// wrapped.js

const wrappedRoot = document.getElementById("wrapped-root");

// 1️⃣ Entry point
export function startWrapped(wrappedData) {
  wrappedRoot.classList.remove("hidden");

  const slides = generateSlides(wrappedData);
  playSlides(slides);
}

// 2️⃣ Analytics → slide data
function generateSlides(data) {
  return [
    {
      bg: "bg-purple",
      small: "Your playlist lives in",
      big: data.topGenre?.toUpperCase() || "UNKNOWN"
    },
    {
      bg: "bg-orange",
      small: "You couldn't stop listening to",
      big: data.topArtist
    },
    {
      bg: "bg-blue",
      small: "Total tracks in this playlist",
      big: `${data.trackCount} songs`
    },
    {
      bg: "bg-green",
      small: "Total listening time",
      big: `${Math.round(data.totalMinutes)} minutes`
    },
    {
      bg: "bg-pink",
      small: "Average popularity",
      big: `${Math.round(data.popularity)}% mainstream`
    },
    {
      bg: "bg-dark",
      small: "Overall vibe",
      big: typeof data.vibe === "object"
        ? data.vibe.label
        : data.vibe
    },
    {
      bg: "bg-gold",
      small: "Your hidden gem 💎",
      big: data.hiddenGem
        ? `${data.hiddenGem.name} — ${data.hiddenGem.artist}`
        : "No gem found"
    }
  ];
}


// 3️⃣ Render ONE slide
function renderSlide(slide) {
  wrappedRoot.innerHTML = `
    <div class="slide ${slide.bg}">
      <p class="small">${slide.small}</p>
      <h1 class="big">${slide.big}</h1>
    </div>
  `;

  requestAnimationFrame(() => {
    wrappedRoot.querySelector(".slide").classList.add("active");
  });
}

// 4️⃣ Timeline controller
function playSlides(slides) {
  let index = 0;

  renderSlide(slides[index]);

  const interval = setInterval(() => {
    index++;
    if (index >= slides.length) {
      clearInterval(interval);
      return;
    }
    renderSlide(slides[index]);
  }, 4000);
}
