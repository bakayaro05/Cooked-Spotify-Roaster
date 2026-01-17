import StatSlide from "./component/slide/StatSlide";
import NarrativeSlide from "./component/slide/NarrativeSlide";
import { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";
import Background from "./component/background/background";
import "./App.css"
import gsap from 'gsap'

import bg0 from "./assets/bg0.mp4";
import bg1 from "./assets/bg1.mp4";
import bg2 from "./assets/bg2.mp4";
import bg3 from "./assets/bg3.mp4";
import bg4 from "./assets/bg4.mp4";
import bg5 from "./assets/bg5.mp4";



const backgrounds = [bg1, bg2, bg3, bg4, bg5];

function getPlaylistId(url) {
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

function LoadingScreen({loadingRef}){

   return (
      <div className="loading-screen" ref={loadingRef}>
        <video autoPlay muted loop playsInline>
          <source src={bg0} />
        </video>
        <div className="loading-text">
          Wrapping your music taste into space…
        </div>
      </div>
    );

}

function Slides({slidesContainerRef,
  slideRef,
  index,
  slides,
  introDone}){
 const slide = slides[index];
  if (!slide) return null;
return(
  <>
   {introDone && (<Background src={backgrounds[index % backgrounds.length]} />)}
   
  <div ref={slidesContainerRef} className="slides-container">
    {slide.type === "stat" ? (
      <StatSlide ref={slideRef} introDone={introDone} key={index} {...slide} />
    ) : (
      <NarrativeSlide
        ref={slideRef}
        introDone={introDone}
        key={index}
        sentence={slide.sentence}

      />
    )}
  </div>
  </>
);

  }

function App() {
  const slideRef = useRef(null);
  const [showSlides, setShowSlides] = useState(false);
  const loadingRef = useRef(null);
  const slidesContainerRef = useRef(null);
  const [introDone, setIntroDone] = useState(false);
  const [data, setData] = useState(null);
  const [index, setIndex] = useState(0);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [phase, setPhase] = useState("input");

  /* ---------------- SLIDES (DERIVED SAFELY) ---------------- */

  const slides = useMemo(() => {
    if (!data) return [];

    const roastSlides = (data.roasts || []).map(sentence => ({
      type: "narrative",
      sentence,
    }));

    return [
      {
        type: "stat",
        title: "Average Popularity",
        value: `${data.popularity}%`,
        subtitle: "How mainstream your taste is",
        direction: "up",
      },
      {
        type: "stat",
        title: "Total Tracks",
        value: data.trackCount,
        subtitle: "Songs in this playlist",
        direction: "scale",
      },
      {
        type: "narrative",
        sentence: `You spent ${data.totalMinutes} minutes vibing.`,
      },
      ...roastSlides,
      {
        type: "stat",
        title: "Top Artist",
        value: data.topArtist,
        subtitle: "Your most played artist",
        direction: "left",
      },
      {
        type: "stat",
        title: "Top Genre",
        value: data.topGenre,
        subtitle: "Your dominant genre",
        direction: "right",
      },
    ];
  }, [data]);

  /* ---------------- AUTO ADVANCE ---------------- */

  useEffect(() => {
    //  HARD GUARD — prevents  crash
    if (
      phase !== "slides" ||
      !introDone ||
      !slideRef.current ||
      slides.length === 0
    ) {
      return;
    }

    const timer = setTimeout(() => {
      slideRef.current.exit(() => {
        setIndex(i => (i < slides.length - 1 ? i + 1 : i));
      });
    }, 7500);

    return () => clearTimeout(timer);
  }, [index, slides.length, phase, introDone]);

/* ---------------- FOR SMOOTH TRANSITION BETWEEN LOADING AND SLIDES SCREEN ---------------- */
  useLayoutEffect(() => {
  if (phase !== "slides") return;
  

  setIntroDone(false);



  const tl = gsap.timeline({
  onComplete: () => {
    setIntroDone(true); // UNLOCK slide progression.. did this to fix a minute error that causes animation to break in the first slide and then continue again.
    setShowSlides(true); //mount    
  }
});


  // hide slides initially
  gsap.set(slidesContainerRef.current, {
    opacity: 0,
    scale: 0.98
  });

  tl.to(loadingRef.current, {
    opacity: 0,
    scale: 1.05,
    duration: 5,
    ease: "power2.inOut"
  })
    .set(loadingRef.current, { display: "none" })
    .to(slidesContainerRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: "power2.out"
    });

}, [phase]);



  /* ---------------- START WRAPPED ---------------- */

  const startWrapped = async () => {
    if (!playlistUrl) return;

    setPhase("loading");

    try {
      const id = getPlaylistId(playlistUrl);
      const res = await fetch("http://localhost:3000/wrapped", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistId: id }),
      });

      const json = await res.json();
      setData(json);

      setTimeout(() => setPhase("slides"), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- PHASE SCREENS ---------------- */


if (phase === "input") {
  return (
    <div className="input-screen">

      {/* Background video */}
      <video
        className="bg-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={bg1} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="overlay"></div>

      <div className="input-wrapper">

        <div className="input-card">
          <h1>Your Spotify Wrapped</h1>
          <p className="tagline">
            Turn your playlist into a cinematic roast.
          </p>

          <input
            placeholder="Paste Spotify playlist link"
            value={playlistUrl}
            onChange={e => setPlaylistUrl(e.target.value)}
          />

          <button onClick={startWrapped}>
            ENTER THE WRAP
          </button>
        </div>

        <div className="footer-note">
          Built by an indie dev · Not affiliated with Spotify
        </div>

      </div>
    </div>
  );
}


   
  /* ---------------- RENDER SLIDE ---------------- */

  return (
  <>
    
      <LoadingScreen loadingRef={loadingRef} />
    

    
      {showSlides && <Slides  slidesContainerRef={slidesContainerRef}
      slideRef={slideRef}
      index={index}
      slides={slides}
      introDone={introDone} />}
    
  </>
);


 
     


  
}

export default App;
