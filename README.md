
Spotify Playlist Roaster (Cooked)

A fun web app that takes a public Spotify playlist link, analyzes it, roasts your music taste, and assigns a Vibe Score — because your playlist deserves honest feedback.

This repository represents the evolution of the Cooked project across multiple versions, each exploring deeper levels of AI integration, frontend architecture, and user experience.

Credits & Inspiration

The original idea was inspired by a YouTube video by Manware:
Channel: https://www.youtube.com/@IAmManware
Video: “19 ACTUALLY UNIQUE Projects That Get You A Job”
https://www.youtube.com/watch?v=muJf6SwEaa0

This project is my independent implementation and extension of that idea.

**Project Versions Overview
 Version 1 — Core Playlist Roaster (MVP)**

**Branch: main / v1**

The initial working version focused on proving the core idea.

**Highlights:**

*Accepts a public Spotify playlist link
*Fetches playlist metadata via Spotify Web API

Uses an LLM to generate:
*A humorous roast
*A vibe description
*A numerical vibe score
*Typewriter-style animated text output
*Simple, clean UI

Tech Stack:
*Frontend: HTML, CSS, Vanilla JavaScript
*Backend: Node.js
*Spotify Web API
*LLM API
This version validated the concept and end-to-end flow.

**Version 2 — Wrapped-Style Visual Experience**

**Branch: v2**
V2 explored presentation and animation, inspired by Spotify Wrapped.

**What Changed:**

*Migration to React
*Slide-based UI for stats and roasts
*Initial GSAP animations
*Structured AI output instead of long text blocks

**Key Learnings:**

*React hook order and render lifecycle
*Early architectural limitations
*Challenges mixing animations with React state
*V2 was visually promising but structurally unstable — it set the stage for a full rewrite.

**Version 3 — Cinematic Narrative Experience**

**Branch: v3**

V3 is the final and most complete iteration of Cooked. This include complete migration to react.

**Major Additions:**

*Fully refactored React architecture
*Declarative slide system using derived state
*GSAP timelines with controlled sequencing
*Narrative slides between statistics
*Looping background videos (SPA-safe)
*Background music via a custom audio engine

**Complete user flow:**

Intro → Input → Loading → Slides → Ending

**Focus:**

*Stability over hacks
*Architectural correctness
*Narrative pacing
*End-to-end completion
*Features (Across Versions)
*Paste any public Spotify playlist link
*AI-powered playlist roasts
*Vibe Score derived from playlist characteristics
*Animated text and transitions
*Progressive UX improvements across versions

**How It Works (High Level)**
*User pastes a public Spotify playlist URL
*Backend fetches playlist metadata using Spotify API
*AI analyzes playlist characteristics
*Roast, vibe description, and score are generated
*Results are rendered according to the version’s UI style

**Notes**

*Playlist must be public
*Built for learning and experimentation
*Not affiliated with Spotify
*Roasts are intentionally sarcastic 

**Branch Guide**

main / v1 → Core MVP
v2 → Wrapped-style slides & animations
v3 → Cinematic narrative experience (final)

