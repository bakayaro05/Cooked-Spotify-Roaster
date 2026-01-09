import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import fetch from "node-fetch";
import path from 'path';
import { fileURLToPath } from 'url';
import { getHiddenGem, getPlaylistStats, getPlaylistVibe, getTopArtist, getTopGenre } from "./analytics.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
 
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY});



app.get("/",(req,res)=>{

   res.sendFile(path.join(__dirname,'index.html'))

})

// ---------------------------
// 1. Get a public Spotify token
// ---------------------------
// ---------------------------
// Get Spotify token using Client Credentials
// ---------------------------
async function getSpotifyToken() {
    const clientId = process.env.clientId;
    const clientSecret = process.env.clientSecret;

    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Authorization": `Basic ${authString}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
    });

    if (!res.ok) throw new Error("Failed to get Spotify access token");

    const data = await res.json();
    return data.access_token;
}


// ---------------------------
// 2. Get playlist tracks
// ---------------------------
// ---------------------------
// 2. Get playlist tracks + metadata
// ---------------------------
app.get("/playlist", async (req, res) => {
    try {
        const playlistId = req.query.id;

        console.log("📌 Incoming request to /playlist");
        console.log("➡ Playlist ID:", playlistId);

        const token = await getSpotifyToken();

        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) return res.status(400).json({ error: "Cannot fetch playlist" });

        const data = await response.json();

        const tracks = data.tracks.items.map(t => t.track?.name).filter(Boolean);

        const playlistInfo = {
            name: data.name,
            image: data.images?.[0]?.url || null,
            tracks
        };

        res.json(playlistInfo);

    } catch (err) {
        console.error("🔥 SERVER ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


// ---------------------------
// 3. Roast with Groq
// ---------------------------
app.post("/roast", async (req, res) => {
    try {
        const tracks = req.body.tracks;

        const prompt = `
Roast this Spotify playlist of a user sarcastically. Keep it very very short
Songs:
${tracks.map((t, i) => `${i+1}. ${t}`).join("\n")}
        `;

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: "You are a funny sarcastic roaster. Where you roast a persons spotify playlist." },
                { role: "user", content: prompt }
            ]
        });

        res.json({ roast: completion.choices[0].message.content });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post("/vibe", async (req, res) => {
    try {
        const tracks = req.body.tracks;

        const prompt = `
You are an AI music analyst. Analyze the *overall vibe* of this Spotify playlist.
Give:
- A Vibe Score (0 to 100)
- A short one-line explanation (fun, emotional, chaotic, etc.)

Be concise.
Tracks:
${tracks.map((t, i) => `${i+1}. ${t}`).join("\n")}
        `;

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: "You analyze playlists and output a vibe score with a short description." },
                { role: "user", content: prompt }
            ]
        });

        const responseText = completion.choices[0].message.content;

        // Extract numeric score if possible
        let scoreMatch = responseText.match(/(\d{1,3})/);
        let score = scoreMatch ? Math.min(Math.max(parseInt(scoreMatch[1]), 0), 100) : 50;

        res.json({
            score: score,
            explanation: responseText
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/wrapped", async (req, res) => {
  try {
    const {playlistId} = req.body;
    const token = await getSpotifyToken();

     const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    
     const data = await response.json();

     if (!data?.tracks?.items) {
  return res.status(400).json({ error: "Invalid or empty playlist" });
}

       const tracks = data.tracks.items
      .map(i => i.track)
      .filter(Boolean);

    const artistGenreMap = await getArtistsGenre(tracks, token);
    const wrapped = buildWrappedStats(tracks, artistGenreMap);

    res.json(wrapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


function buildWrappedStats(tracks, artistGenres) {

  const basicData = getPlaylistStats(tracks);
  const topGenre = getTopGenre(tracks, artistGenres);
  

  return {
    popularity: basicData.avgPopularity,
    trackCount: basicData.trackCount,
    totalMinutes: basicData.totalMinutes,
    topArtist: getTopArtist(tracks),
    topGenre: topGenre,
    vibe: getPlaylistVibe(tracks, topGenre),
    hiddenGem: getHiddenGem(tracks)
  };
}



 async function getArtistsGenre(tracks, token) {
  // Collect unique artist IDs
  const artistMap = {};

  tracks.forEach(track => {
    track.artists.forEach(artist => {
      artistMap[artist.id] = artist.href;
    });
  });

  const artistHrefs = Object.values(artistMap);

  const artistRes = await Promise.all(
    artistHrefs.map(href =>
      fetch(href, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    )
  );

  const artists = await Promise.all(artistRes.map(r => r.json()));

  const artistGenreMap = {};
  artists.forEach(artist => {
    artistGenreMap[artist.id] = artist.genres || [];
  });

  return artistGenreMap;
}


// Run server
app.listen(3000, () => console.log("Server running on port 3000"));
