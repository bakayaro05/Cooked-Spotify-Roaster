Cooked — Spotify Wrapped Roaster (V3)

Cooked is an evolving experiment in building cinematic, AI-assisted frontend systems.
This repository contains Version 3 of the project — the final and most complete iteration.

What began as a simple Spotify playlist roaster gradually transformed into a full prompt-driven, animation-heavy, narrative experience, inspired by Spotify Wrapped.

This README documents not just the final product, but the entire journey of prompting, iteration, architectural rewrites, and lessons learned across Cooked V1 → V2 → V3.

 Project Evolution
 
 ----------Cooked V1 — “Can I roast a playlist?”

Goal: Generate a fun roast for a Spotify playlist
Stack: Basic Node.js backend + LLM
Output: Plain text roast

Learnings:
Prompt structure matters more than raw creativity
AI output quality depends heavily on context framing.
And the current UI was kinda boring ;) 

Limitation:

Static output, no UX, no narrative flow

----------Cooked V2 — “What if this felt like Spotify Wrapped?”
Goal: Turn the roast into a visual experience

Added:
Basic React frontend
Slide-based stat rendering
Initial GSAP animations

Prompting evolved to:
Generate sections instead of paragraphs
Separate stats from commentary

Problems discovered:

React architecture was fragile
Slides broke when data was missing
Animations fought React’s render cycle

Outcome:

Visually promising, but structurally unstable
Had no proper frontend, this was only to implement the slides flow logic

🔹 Cooked V3 — “Finish it. Properly.”

This repository.

V3 was not about adding features — it was about understanding everything that broke in V2 and fixing it correctly, even if that meant rewriting large parts of the app.

What Cooked V3 Does
Fetches Spotify playlist analytics from a custom /wrapped backend
Passes analytics into an LLM to generate roasts + narrative sentences
Renders stats and narration as cinematic animated slides
Uses GSAP timelines for controlled, sequential animations
Plays background videos per slide (SPA-safe)
Plays background music via a custom audio engine
Guides the user through a full experience:
Intro → Input → Loading → Narrative Slides → Ending

The Prompting Journey (Core of Cooked)

Cooked is fundamentally a prompt-engineering project disguised as a frontend app.

Early Prompting (V1)

One-shot prompts

Output: Long, unstructured text

Issues:

Repetition
Tone inconsistency
No narrative pacing

Mid Prompting (V2)
Structured prompts
Sections like:
Overall vibe
Top artist roast
Genre commentary

Improvement:
Better control

Still missing:
Emotional flow
Timing awareness

Advanced Prompting (V3)
Prompts evolved to:
Include playlist analytics
Generate short narrative sentences
Avoid filler and repetition

Match a cinematic pacing, not just humor

Instead of:
“Here’s a roast”

The model now produces:
Transitional narration
Context-aware commentary
Slides that feel intentional, not dumped

 Architecture Changes in V3

V3 exists because V2’s architecture was insufficient.

Major rewrites included:

1. Slide System Refactor
Slides treated as derived state
Computed declaratively using useMemo
No conditional hooks
Stable refs → stable animations

2. Rendering Model Change
From phase-based rendering
To always-mounted components
Prevented animation resets and timing bugs

3. Animation Lifecycle Fixes
Moved critical animations to useLayoutEffect
GSAP timelines scoped per slide
Predictable enter/exit behavior

4. Background System Redesign
Background videos decoupled from slides
Fixed overlap and layering issues
SPA routing issues resolved by asset strategy

 Audio: The Unexpected Boss Fight
Adding music turned out to be one of the hardest parts.

Problems faced:

Spotify preview_url becoming unreliable / deprecated
Browser autoplay restrictions
Audio failing silently due to SPA routing
Audio needing to persist across slide changes

Solution:

Built a custom audio engine class
Explicit user interaction via intro screen
Non-Spotify background music
Centralized control of play / pause / lifecycle


OVERALL ARCHITECTURE/FLOW/OVERVIEW :

**NOTE 
V1 & V2 endpoints exist but unused
V3 exclusively uses /wrapped
Non-config files outside /wrapped-roaster belong to legacy versions
Current HLD reflects V3 only**

1. System Overview Diagram :
<pre>
┌────────────────────────────┐
│        Web Browser         │
│  (React SPA + GSAP + Audio)│
└─────────────┬──────────────┘
              │ HTTP (JSON)
              ▼
┌────────────────────────────┐
│      Node.js Server        │
│        (Express)           │
└─────────────┬──────────────┘
        ┌─────┴─────┐
        ▼           ▼
┌─────────────┐  ┌─────────────┐
│ Spotify API │  │  Groq LLM   │
│ (Playlist)  │  │ (Roasting) │
└─────────────┘  └─────────────┘
</pre>

2. Backend HLD Diagram (server.js + analytics.js)
<pre>
┌───────────────────────────────┐
│          server.js            │
│      (Express Server)         │
├───────────────────────────────┤
│  /wrapped  (V3 ONLY ENDPOINT) │
│                               │
│  1. Get Spotify Token         │
│  2. Fetch Playlist            │
│  3. Extract Tracks            │
│  4. Fetch Artist Genres       │
│  5. Call analytics.js         │
│  6. Call Groq LLM             │
│  7. Build Wrapped JSON        │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│         analytics.js          │
│     (Pure Analysis Layer)     │
├───────────────────────────────┤
│ getPlaylistStats()            │
│ getTopArtist()                │
│ getTopGenre()                 │
│ getHiddenGem()                │
│ getPlaylistVibe()             │
└───────────────────────────────┘
</pre>
3. Wrapped Endpoint Internal Flow
<pre>
   Client Request
    │
    ▼
/wrapped (POST)
    │
    ├──► getSpotifyToken()
    │
    ├──► Fetch Playlist Metadata (via spotify API)
    │
    ├──► Extract Track Objects
    │
    ├──► Fetch Artist Genres ( via getArtistsGenre() )
    │
    ├──► analytics.js   (via buildWrappedStats() )
    │      ├─ Popularity         {via  getPlaylistStats() }
    │      ├─ Duration           {via  getPlaylistStats() }
    │      ├─ Top Artist         {via getTopArtist() }
    │      ├─ Top Genre          {via getRoast() }
    │      └─ Hidden Gem         {via getHiddenGem() }  
    │      └─ Groq LLM (Roast + Personality) {ALL THROUGH getPlaylistStats() }
    │      
    ├
    │
    ▼
Final Wrapped JSON
</pre>

4. Frontend HLD Diagram
<pre>
┌─────────────────────────────────────┐
│            React App (SPA)           │
│           src/app.jsx                │
├─────────────────────────────────────┤
│ Phase Controller (State Machine)    │
│ intro → input → loading → slides → end
├─────────────────────────────────────┤
│ Background Video Engine             │
│ (bg0.mp4 → bg6.mp4)                 │
├─────────────────────────────────────┤
│ Slide Engine                        │
│ ├── StatSlide Component             │
│ └── NarrativeSlide Component        │
├─────────────────────────────────────┤
│ GSAP Animation Layer                │
├─────────────────────────────────────┤
│ Audio System                        │
│ ├── useAudio.js                     │
│ └── AudioEngine Class               │
└─────────────────────────────────────┘
</pre>
<pre>
Entire frontend logic lives in /wrapped-roaster
No routing, no Redux
UI controlled by phases
Slides are derived, not fetched individually
</pre>

 5. React Phase-Based Architecture

┌─────────┐
│  Intro  │
└────┬────┘
     ▼
┌─────────┐
│  Input  │
└────┬────┘
     ▼
┌─────────┐
│ Loading │  (Minimum cinematic delay)
└────┬────┘
     ▼
┌─────────┐
│ Slides  │  (Auto-advance)
└────┬────┘
     ▼
┌─────────┐
│   End   │
└─────────┘

6. Slide Rendering Architecture
<pre>
   Wrapped JSON
    │
    ▼
slides[] (Derived)
    │
    ├── StatSlide
    │     ├─ Popularity
    │     ├─ Top Artist
    │     └─ Top Genre
    │
    └── NarrativeSlide
          ├─ Roast Line 1
          ├─ Roast Line 2
          └─ Personality Lines
</pre>

7. Audio System HLD
<pre>
 React Phase Change
       │
       ▼
setAudioPhase()
       │
       ▼
useAudio.js
       │
       ▼
AudioEngine (Singleton)
       │
       ▼
HTMLAudioElement

</pre>

8. Asset Architecture
<pre>
 /wrapped-roaster
│
├── public/audio/
│     └── bgm mp3 files
│
├── src/assets/
│     ├── bg0.mp4 → bg6.mp4
│
├── src/components/
│     ├── Slide Component
│     └── Narrative Component


Audio kept in public/ to bypass SPA routing
Videos bundled for fast local playback
Components separated by responsibility

</pre>



AI Usage (Honest Take)

AI was used heavily in this project:
For code generation

Debuggin
Architectural suggestions
Prompt iteration

However:

No solution was accepted blindly
Every major fix required understanding why it worked
Many AI-generated parts were rewritten or simplified

By the end:

I understood the system better than the code itself
The real learning came from debugging AI-assisted mistakes

What This Project Taught Me
React renders before effects — effects don’t prevent bad renders
Hooks must execute in the same order, always
Animation bugs are often state bugs
SPA routing can silently break assets and audio
Complex UI demands architectural clarity, not hacks
Finishing a project matters more than polishing forever

Timeline

Start: 26 December 2025 — 22:25:12
End: 27 January 2026 — 05:52:55

Planned for weeks. Took a month. Worth it.


