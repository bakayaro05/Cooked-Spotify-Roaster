# 🎧 Spotify Playlist Roaster — Wrapped Edition (v2)

This is **v2** of the Spotify Playlist Roaster project.

While the `master` branch focuses on generating a playlist roast and vibe score, **v2 evolves the project into a Spotify Wrapped–style experience**, combining data analytics, AI-driven insights, and animated frontend storytelling.

## 🚀 Progression from v1 → v2

| v1 (master) | v2 (this branch) |
|-------------|------------------|
| Single-step output | Multi-stage Wrapped-style flow |
| Basic playlist analysis | Dedicated analytics layer |
| Text-only results | Animated & visual storytelling |
| Minimal frontend logic | State-driven UI sequencing |

## ✨ New Additions in v2

- 🎁 **`/wrapped` mode** for playlist storytelling
- 📊 **JavaScript analytics module** to process playlist data
- 🎬 Animated transitions between insights
- 📈 Visual representation of vibe score
- 🧭 Structured flow: roast → analysis → summary

## 📊 Analytics Layer (v2 Highlight)

In v2, playlist data fetched from the Spotify API is passed through a **custom JavaScript analytics layer** that derives:

- Overall playlist vibe
- Popularity distribution
- Mood & energy patterns
- Notable trends and outliers

> ⚠️ The analytical logic and heuristics were **AI-assisted** (prompt-derived),  
> but the **integration, data handling, sequencing, and frontend consumption** of these analytics were fully implemented and validated as part of this project.

This approach mirrors real-world development, where engineers:
- Use AI/tools to design logic
- Integrate, adapt, and ship reliable systems

## 🔥 Core Features (Inherited from v1)

- Public Spotify playlist input
- AI-generated playlist roast
- Vibe score & narrative insights
- Spotify Web API integration
- Node.js backend

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Analytics:** Custom JavaScript data processing
- **Animations:** CSS animations + JS-controlled sequencing
- **Backend:** Node.js
- **Spotify Web API**
- **LLM API** for roast and narrative generation

## 🧠 Why v2 Exists

v2 focuses on:
- Separating **data processing from presentation**
- Learning **frontend state & flow management**
- Turning raw API data into **structured insights**
- Building a product-like experience without frameworks

Rather than expanding scope, v2 improves **clarity, polish, and storytelling**.

## 🔄 User Flow

1. User submits a public Spotify playlist
2. Spotify API fetches playlist metadata
3. JS analytics layer processes raw data
4. AI generates narrative insights
5. Wrapped-style UI presents results step-by-step

## 🔮 Future Scope

This project is intentionally built in **vanilla JavaScript** to solidify fundamentals.  
A planned future iteration would evolve this into a **React-based experience** with a more advanced animation system.

Potential future upgrades include:

- ⚛️ Migrating the UI to **React** for better state management and component-driven flows
- 🎬 Integrating **GSAP** for timeline-based animations and smoother transitions
- 🏆 Designing an **Awwwards-style storytelling flow**, focusing on:
  - Scroll-driven or timeline-driven reveals
  - Cinematic transitions between insights
  - Highly polished micro-interactions

## ⚠️ Notes

- Playlist must be **public**
- Built for **learning and experimentation**
- Not affiliated with Spotify
- Inspired by ideas shared by *Manware*, independently implemented

---

