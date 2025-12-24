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

     // ✅ SIGNAL THAT WRAPPED IS DONE
      window.dispatchEvent(new Event("wrapped:done"));
      return;
    }
    renderSlide(slides[index]);
  }, 4000);

  

}


export function resetToHome() {
  // Hide wrapped
  document.getElementById("wrapped-root").classList.add("hidden");

  // Reset roast UI
  document.getElementById("roast-box").classList.add("hidden");
  document.getElementById("continue-btn").style.display = "none";
  document.getElementById("continue-btn").classList.remove("show");

  // Clear text
  document.getElementById("roast-output").textContent = "";
  document.getElementById("vibe-score").textContent = "";
  document.getElementById("vibe-explanation").textContent = "";

  // Reset playlist section
  document.getElementById("playlist-info").classList.add("hidden");

  // Reset input
  document.getElementById("playlist-input").value = "";

  // Optional: reset background
  document.getElementById("bg-blur").style.backgroundImage = "";

  // Scroll to top (important for mobile)
  window.scrollTo({ top: 0, behavior: "smooth" });
}
