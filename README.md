# 🎧 Spotify Playlist Roaster (Cooked)

A fun web app that takes a public Spotify playlist link, analyzes it, roasts your music taste, and assigns a **Vibe Score** — because your playlist deserves honest feedback.

This repository represents the **evolution of the Cooked project across multiple versions**, each exploring deeper levels of AI integration, frontend architecture, and user experience.

---

## 📌 Credits & Inspiration

The original idea was inspired by a YouTube video by **Manware**:

- **Channel:** https://www.youtube.com/@IAmManware  
- **Video:** *“19 ACTUALLY UNIQUE Projects That Get You A Job”*  
  https://www.youtube.com/watch?v=muJf6SwEaa0  

This project is my **independent implementation and extension** of that idea.
---
 ## 🧠 Development Journey (Dev Log)

On the first day, I started by understanding the basics of React — what components are, how hooks work, how props pass information between components, and how useEffect, useRef, and gsap.from() fit into the picture. Almost immediately, I ran into React Strict Mode, which already set the tone for how confusing and unforgiving things were going to get.

Once the basics were clear, I rendered my first slides, built a basic slide template, and figured out how to play slides sequentially. That later evolved into a common slide component. Somewhere during this, a small but important realization hit me: props in React are passed as a single object, not scattered values — a tiny detail, but one that mattered a lot later.

Next, I wired the frontend to the already-built /wrapped API endpoint, fetched playlist data, stored it as slides, and rendered them index by index. Except… nothing worked. For a long time. Turns out I had simply forgotten to run server.js. I was also confused about how to run React and the backend at the same time — until I realized it was literally just opening another terminal and running both. Rookie mistake, but lesson learned.

Once React finally rendered something, all values showed up as undefined. That pushed me back to the backend, where I discovered the playlist wasn’t being fetched at all. After prompt-debugging for a while, I realized the playlist ID itself was wrong. Fixing that finally completed the core React data flow.

At that point, only GSAP animations were left — or so I thought.

While implementing animations, I learned one of React’s most important rules the hard way: hooks must always be called in the exact same order on every render. Implementing GSAP timelines for text animations was straightforward, but things got complicated when I tried to add background videos to mimic Spotify Wrapped.

I built a background component that returned a looping <video> tag and mapped background videos to slides by index. Conceptually easy. Practically broken. After hours of debugging — including re-encoding videos and trying random fixes — I finally discovered the real issue: SPA routing. I didn’t even know that term before this phase. The workaround was copying videos into the assets folder to bypass routing issues.

That worked… but then the videos were invisible. Turns out GSAP overlays and a black background on the slide component were literally covering the videos. A pure CSS problem. Once fixed, background videos finally worked.

After taking a break to actually understand the codebase instead of blindly fixing things, I asked AI how the experience could be elevated further. That led to three ideas:

Text staggering (characters or words)

Direction-based slide transitions

Narrative sentence slides between stats

All three were implemented fairly smoothly.

The actual final phase (which wasn’t final at all) was migrating the entire roasting logic into React and converting it into a narrative-based flow. This took way longer than expected. I ran into backend issues where a response variable (res) didn’t even exist but was still being returned. This caused silent frontend failures — made worse by the fact that the server hadn’t been hard-restarted.

Even after fixing the backend, React still broke. The issue was how I handled slides and side effects. useEffect was running with null data, and my fixes caused hook order violations because hooks were conditionally executed. That’s when a major React concept finally clicked: effects run after render, so fixing state inside useEffect doesn’t prevent invalid renders.

I tried using a mutable slides variable that updated when data arrived. It avoided crashes but created worse problems — slides were recreated every render, refs didn’t attach properly, and auto-advance animations broke. The real fix was treating slides as derived state, computed declaratively using useMemo with stable dependencies. Once I did that, everything stabilized — refs worked, effects behaved, and animations finally advanced correctly.

At this point the full flow existed — but making it seamless was the hardest part. The transitions between the intro screen and slides alone took nearly three days spread across a week. To fix it, I had to deeply understand how GSAP works with React, how useEffect differs from useLayoutEffect, and how limited my initial architecture was.

This led to major architectural changes, especially in App.js: moving from a phase-based rendering system to an always-mounted architecture. Along the way, several UI changes were made to improve UX. This entire refactor — architecture + UI — consumed a huge chunk of time.

After that, I improved the LLM prompt itself by passing playlist analytics into it, which significantly improved roast quality.

Then came the final boss: background music.

Adding music turned out to be far harder than expected. I ended up building a separate AudioEngine class — something I never thought I’d do for this project. Initially, I tried using Spotify’s preview_url, but those were being deprecated. That forced me to switch to non-Spotify, lofi-style background music.

Then came browser autoplay restrictions — audio wouldn’t play unless the user clicked. Even after solving that, audio still didn’t play… because once again, SPA routing.

Once audio worked, another issue appeared: background overlaps. Backgrounds were always mounted, and slides also had their own background components, causing overlaps during renders. The fix was separating background logic entirely from slide components.

To add variety, I replaced abstract backgrounds with real video footage — which meant manually hunting and downloading external videos.

Two final issues remained:

Audio required a user click — unavoidable — so I added an intentional intro click sequence

There was no ending screen, so videos looped endlessly after slides finished

Fixing those gave the final flow:

Intro → Input → Loading → Slides → Ending

And that’s where I stopped.

This project, which I thought would take a few weeks, ended up taking about a month. I learned a lot about React, Node.js, GSAP, architecture, and debugging. I used AI heavily — sometimes more than I liked — especially toward the end when boredom kicked in. Still, I made sure to understand why things worked, and I rewrote or modified a lot of AI-generated code myself.

Major architectural decisions were AI-suggested, but understanding and validating them was on me. Despite the heavy AI usage, the learning came from debugging, refactoring, and finishing.

With that, I’m closing the Spotify Wrapped (Cooked) project.

Project Duration:
26 December 2025, 22:25:12 → 27 January 2026, 05:52:55


---

## 🧭 Project Versions Overview

---

### 🔹 Version 1 — Core Playlist Roaster (MVP)

**Branch:** `main` / `v1`

The initial working version focused on proving the core idea.

#### Highlights
- Accepts a public Spotify playlist link
- Fetches playlist metadata via Spotify Web API
- Uses an LLM to generate:
  - A humorous roast
  - A vibe description
  - A numerical vibe score
- Typewriter-style animated text output
- Simple, clean UI

#### Tech Stack
- Frontend: HTML, CSS, Vanilla JavaScript  
- Backend: Node.js  
- Spotify Web API  
- LLM API  

This version validated the concept and end-to-end flow.

---

### 🔹 Version 2 — Wrapped-Style Visual Experience

**Branch:** `v2`

V2 explored presentation and animation, inspired by Spotify Wrapped.

#### What Changed
- Migration to React
- Slide-based UI for stats and roasts
- Initial GSAP animations
- Structured AI output instead of long text blocks

#### Key Learnings
- React hook order and render lifecycle
- Early architectural limitations
- Challenges mixing animations with React state

V2 was visually promising but structurally unstable — it set the stage for a full rewrite.

---

### 🔹 Version 3 — Cinematic Narrative Experience

**Branch:** `v3`

V3 is the **final and most complete iteration** of Cooked, including a full migration to React.

#### Major Additions
- Fully refactored React architecture
- Declarative slide system using derived state
- GSAP timelines with controlled sequencing
- Narrative slides between statistics
- Looping background videos (SPA-safe)
- Background music via a custom audio engine

---

#### Focus
- Stability over hacks
- Architectural correctness
- Narrative pacing
- End-to-end completion

---

## 🔥 Features (Across Versions)

- Paste any public Spotify playlist link
- AI-powered playlist roasts
- Vibe Score derived from playlist characteristics
- Animated text and transitions
- Progressive UX improvements across versions

---

## 🚀 How It Works (High Level)

1. User pastes a public Spotify playlist URL
2. Backend fetches playlist metadata using Spotify API
3. AI analyzes playlist characteristics
4. Roast, vibe description, and score are generated
5. Results are rendered according to the version’s UI style

---

## ⚠️ Notes

- Playlist must be public
- Built for learning and experimentation
- Not affiliated with Spotify
- Roasts are intentionally sarcastic 😄

---


## Project File Structure
This project consists of a Node.js backend (V3) and a React-based frontend (wrapped-roaster).
Earlier versions (V1, V2) exist in the repository but are not used in the current implementation.

## **Root Directory**
<pre>
  /
├── analytics.js
├── server.js
├── app.js
├── app.ts
├── wrapped.js
├── styles.css
├── cooked.rest
├── wrapped-roaster/
└── (config files)

</pre>

## **File Descriptions**

- analytics.js
Analyzes the Spotify tracks and artist data received from the Spotify API.
It processes the data returned by the /wrapped endpoint and structures it for consumption by the frontend Slide and Narrative components.

- server.js
Main backend server file.
While multiple endpoints exist from earlier versions (V1, V2), only the /wrapped endpoint is used in V3.
This endpoint fetches Spotify data, invokes analytics.js, and returns the final processed payload.

- app.js / app.ts / wrapped.js / styles.css
Legacy files from earlier versions (V1 and V2).
These files are not used in the current V3 implementation.

- cooked.rest
REST client file used for manually testing backend endpoints during development.

- wrapped-roaster/
Contains all frontend logic for V3, implemented using React.

## **wrapped-roaster (Frontend – V3)**
<pre>
  wrapped-roaster/
├── public/
│   └── audio/
├── src/
│   ├── assets/
│   └── component/
│       ├── Slide/
│       └── Narrative/
│   └── App.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md

</pre>

- public/audio

Stores all background music files (.mp3, .m4a) used across different phases of the application (home, loading, slides).
Placed inside public to bypass SPA routing and ensure direct, reliable audio access.

- src/assets

Contains background video files (bg0.mp4 to bg6.mp4).
These videos are used as dynamic visual backgrounds during slides and narrative sequences.

- src/component

Contains the two core UI components of the application:

- Slide Component
Handles slide-based presentation of Spotify analytics such as top artists, genres, and statistics.
Includes GSAP-based animation logic for cinematic transitions.

- Narrative Component
Handles text-only, paragraph-style storytelling.
Uses the same /wrapped endpoint data but focuses on narrative delivery instead of visual slides.

- src/App.jsx

Main React entry point for the frontend.
Calls the backend /wrapped endpoint.
Controls the entire user flow including:

Intro sequence
Slide rendering
Narrative rendering
End sequence
Acts as the central coordinator for all frontend components and application state.

---
## 📎 Branch Guide

- `main` / `v1` → Core MVP  
- `v2` → Wrapped-style slides & animations  
- `v3` → Cinematic narrative experience (final)  


#### Complete User Flow
Intro → Input → Loading → Slides → Ending
