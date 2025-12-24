import { startWrapped } from "./wrapped.js";

const roastBtn = document.getElementById("roast-btn");
const playlistInput = document.getElementById("playlist-input");
const roastOutput = document.getElementById("roast-output");
const vibeOutput = document.getElementById("vibe-output");

function typeWriter(element, text, speed = 18,onComplete) {
    element.innerHTML = "";
    element.classList.add("typewriter");
    let i = 0;

    const interval = setInterval(() => {
        element.innerHTML += text.charAt(i);
        i++;

        if (i > text.length) {
            clearInterval(interval);
            element.classList.remove("typewriter");
            if (onComplete) onComplete();
        }
    }, speed);
}

function getPlaylistId(url) {
    const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
}

// ⭐ Generate Vibe Score



roastBtn.addEventListener("click", async () => {
    roastOutput.textContent = "Fetching playlist… 🔄";

    const url = playlistInput.value.trim();
    const playlistId = getPlaylistId(url);

    if (!playlistId) {
        roastOutput.textContent = "❌ Invalid playlist link.";
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/playlist?id=${playlistId}`);
        const data = await res.json();

        if (!data.tracks || data.tracks.length === 0) {
            roastOutput.textContent = "❌ Playlist has no public songs or is private.";
            return;
        }

        // UI update
        document.getElementById("playlist-cover").src = data.image;
        document.getElementById("playlist-title").textContent = data.name;
        document.getElementById("bg-blur").style.backgroundImage =
            `url(${data.image})`;

        // ⭐ Show playlist section
        const playlistInfo = document.getElementById("playlist-info");
        playlistInfo.classList.remove("hidden");
        playlistInfo.classList.add("show");


        roastOutput.textContent = "Cooking roast… 🔥🔥🔥";

        const roastRes = await fetch("http://localhost:3000/roast", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tracks: data.tracks })
        });
        const vibeRes = await fetch("http://localhost:3000/vibe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tracks : data.tracks })
});

const vibeData = await vibeRes.json();
document.getElementById("vibe-score").innerText = vibeData.score;
document.getElementById("vibe-explanation").innerText = vibeData.explanation;


        const roastData = await roastRes.json();

        // ⭐ Typewriter Roast
        const roastBox = document.getElementById("roast-box");
        roastBox.classList.remove("hidden");

        //Typewriter for continue wrapped section.
       typeWriter(roastOutput, roastData.roast, 18, () => {
  document.getElementById("continue-btn").style.display = "block";
});
        

       
        const wrappedRes = await fetch('http://localhost:3000/wrapped',{
           method : "POST",
           headers : {"Content-Type" : "application/json"},
           body : JSON.stringify({playlistId})

        })
        const wrappedStats = await wrappedRes.json();

   //When the user clicks continue we startWrapped.
    document.getElementById("continue-btn").addEventListener("click", () => {
  startWrapped(wrappedStats);});


    } catch (err) {
        roastOutput.textContent = "❌ Could not load playlist tra   cks";
        console.error(err);
    }

});

