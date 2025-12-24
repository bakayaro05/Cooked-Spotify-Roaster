# 🎧 Spotify Playlist Roaster

A fun web app that takes a **public Spotify playlist link**, analyzes it, **roasts your music taste**, and assigns a **Vibe Score** — because your playlist deserves honest feedback.

### 📌 Credits & Inspiration
The core idea for this project was inspired by a YouTube video by **Manware**:
- Channel: https://www.youtube.com/@IAmManware  
- Video: *“19 ACTUALLY UNIQUE Projects That Get You A J*B”*  
  https://www.youtube.com/watch?v=muJf6SwEaa0

This project is my **independent implementation** of that idea, where I:
- Designed and implemented the **backend API flow**
- Integrated the **Spotify Web API**
- Connected AI-based analysis to produce roasts and vibe scores
- Built a working **MVP from scratch**

## 🔥 Features

- Paste any **public Spotify playlist link**
- AI-powered **playlist roast**
- **Vibe Score** derived from playlist characteristics using prompt-based AI analysis
- Clean, minimal UI
- Typewriter-style animated text output

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js
- **Spotify Web API**
- **LLM API** (for generating roasts & vibe analysis)

## 🚀 How It Works

1. User pastes a public Spotify playlist URL
2. Playlist metadata is fetched using the Spotify API
3. AI generates:
   - A humorous roast
   - A vibe description
   - A numerical vibe score
4. Results are rendered with animated, typewriter-style text

## ⚠️ Notes

- Playlist must be **public**
- Built for **learning and experimentation**
- Not affiliated with Spotify
- Roasts are intentionally sarcastic 😄
