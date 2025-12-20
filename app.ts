/************************************
 * STEP 1 — CONFIG VALUES
 ************************************/

const clientId = "YOUR_SPOTIFY_CLIENT_ID";  // <-- PUT YOUR SPOTIFY CLIENT ID
const redirectURI = "http://localhost:5500/"; // MUST match Spotify dashboard
const openaiKey = "YOUR_OPENAI_API_KEY";     // <-- PUT YOUR OPENAI KEY

/************************************
 * STEP 2 — SPOTIFY LOGIN FLOW
 ************************************/

// Redirect user to Spotify login page
document.getElementById("login-btn").addEventListener("click", () => {
    const authEndpoint = "https://accounts.spotify.com/authorize";

    const scopes = [
        "playlist-read-private",
        "playlist-read-collaborative",
        "user-read-private"
    ];

    const authURL = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectURI}&scope=${scopes.join(
        "%20"
    )}&response_type=token&show_dialog=true`;

    window.location = authURL;
});

// Extract access token from URL fragment
function getAccessTokenFromURL() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get("access_token");
}

let accessToken = getAccessTokenFromURL();

// If token exists → fetch playlists
if (accessToken) {
    document.getElementById("login-btn").style.display = "none";
    loadPlaylists();
}

/************************************
 * STEP 3 — FETCH USER PLAYLISTS
 ************************************/

async function loadPlaylists() {
    const response = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
        headers: { Authorization: "Bearer " + accessToken }
    });

    const data = await response.json();
    console.log("Playlists:", data);

    const playlistSection = document.getElementById("playlist-section");
    playlistSection.style.display = "block";

    const playlistContainer = document.getElementById("playlists");
    playlistContainer.innerHTML = "";

    data.items.forEach((playlist) => {
        const div = document.createElement("div");
        div.textContent = playlist.name;
        div.className = "playlist-item";
        div.addEventListener("click", () => loadPlaylistTracks(playlist.id, playlist.name));
        playlistContainer.appendChild(div);
    });
}

/************************************
 * STEP 4 — FETCH TRACKS OF A PLAYLIST
 ************************************/

async function loadPlaylistTracks(playlistId, playlistName) {
    const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
            headers: { Authorization: "Bearer " + accessToken }
        }
    );

    const data = await response.json();
    console.log("Tracks:", data);

    // Extract track names + artists
    const tracks = data.items
        .map((item) => {
            if (!item.track) return null;
            return `${item.track.name} by ${item.track.artists
                .map((artist) => artist.name)
                .join(", ")}`;
        })
        .filter(Boolean);

    roastPlaylist(playlistName, tracks);
}

/************************************
 * STEP 5 — ROAST PLAYLIST WITH OPENAI
 ************************************/

async function roastPlaylist(playlistName, trackList) {
    const roastSection = document.getElementById("roast-section");
    roastSection.style.display = "block";

    const roastOutput = document.getElementById("roast-output");
    roastOutput.textContent = "Cooking roast… 🔥🔥🔥";

    const prompt = `
You are "Cooked", a rude but funny AI that roasts Spotify playlists.
Roast this playlist HARD but keep it SAFE and CLEAN.

Playlist Name: ${playlistName}

Tracks:
${trackList.join("\n")}

Give a hilarious brutal roast in 4–6 sentences.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini", // you can upgrade if you want
            messages: [{ role: "user", content: prompt }],
            temperature: 0.9
        })
    });

    const data = await response.json();
    console.log("Roast:", data);

    roastOutput.textContent = data.choices[0].message.content;
}

/************************************
 * STEP 6 — ROAST AGAIN BUTTON
 ************************************/

document.getElementById("roast-again-btn").addEventListener("click", () => {
    document.getElementById("roast-section").style.display = "none";
});
