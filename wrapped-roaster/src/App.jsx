import StatSlide from "./component/slide/StatSlide";
import NarrativeSlide from "./component/slide/NarrativeSlide";
import { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";
import Background from "./component/background/background";
import "./App.css"
import gsap from 'gsap'
import { audioEngine } from "../public/audio/AudioEngine.jsx";
import { setAudioPhase } from "../public/audio/useAudio.js";

import bg0 from "./assets/bg0.mp4";
import bg1 from "./assets/bg1.mp4";
import bg2 from "./assets/bg2.mp4";
import bg3 from "./assets/bg3.mp4";
import bg4 from "./assets/bg4.mp4";
import bg5 from "./assets/bg5.mp4";
import bg6 from "./assets/bg6.mp4";



const backgrounds = [ bg2, bg3, bg4, bg5, bg6];
const MIN_LOADING_TIME = 10000; //for mandatory 3.5s cinematic hold

function getPlaylistId(url) {
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}




function Slides({slidesContainerRef,
  slideRef,
  index,
  slides,
  introDone}){

  if (!slides || slides.length === 0 || !slides[index]) {
    return null;
  }

 const slide = slides[index];
  
return(
  <>
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

/*------------FOR END CREDIT------------*/
function EndCredits({ onRestart }) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    const tl = gsap.timeline();

    gsap.set(
      [titleRef.current, subtitleRef.current, buttonRef.current, footerRef.current],
      { opacity: 0, y: 12 }
    );

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    })
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      }, "-=0.4")
      .to(buttonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      }, "+=0.2")
      .to(footerRef.current, {
        opacity: 0.6,
        y: 0,
        duration: 0.6,
        ease: "sine.out",
      }, "-=0.3");

  }, []);

  return (
    <div ref={containerRef} className="end-credits">
      <p ref={titleRef}>That’s your taste.</p>
      <p ref={subtitleRef}>No skips. No lies.</p>

      <button ref={buttonRef} onClick={onRestart}>
        Try another playlist
      </button>

      <p ref={footerRef} className="footer">
        Built by an indie dev · Not Spotify
      </p>
    </div>
  );
}



function App() {

  const slideRef = useRef(null);
  const inputWrapperRef = useRef(null);
  const inputCardRef = useRef(null);
  const loadingTextRef = useRef(null);
  const [showLoadingText, setShowLoadingText] = useState(false);
  const introRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const introTl = useRef(null);

  const slidesContainerRef = useRef(null);
  const [ShowSlides,setShowSlides]=useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [data, setData] = useState(null);
  const [index, setIndex] = useState(0);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [phase, setPhase] = useState("intro");
  const [dataReady, setDataReady] = useState(false);
  const [minLoadingDone, setMinLoadingDone] = useState(false);
  const [bgPhase, setBgPhase] = useState("intro");



  /*----------- FOR DERIVING BACKGROUND ---------- */
 const currentBackground = useMemo(() => {
  if (bgPhase === "intro" || bgPhase === "input") return bg0;
  if (bgPhase === "loading") return bg1;
  if (bgPhase === "slides")
    return backgrounds[index % backgrounds.length];
}, [bgPhase, index]);




  /* ---------------- SLIDES (DERIVED SAFELY) ---------------- */

  const slides = useMemo(() => {
    if (!data) return [];

    const roastSlides = (data.roastspersonality || []).map(sentence => ({
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




  /*-----------------FOR PLAYING AUDIO------------*/
 useEffect(() => {
  const unlock = () => {
    audioEngine.unlock(); 
    setAudioPhase(null);     // reset
    setAudioPhase("HOME");   // replay
  };


  document.addEventListener("click", unlock, { once: true });
  
  return () =>{ document.removeEventListener("click", unlock);
  } 
},[]);



  useEffect(() => {
   if (phase === "input") {
    setAudioPhase("HOME");
    return;
  }

  if (phase === "loading") {
    setAudioPhase("LOADING");
    return;
  }

  if (phase === "slides") {
    setAudioPhase("SLIDES");
  }

  
  if (phase === "end") {
    setAudioPhase("END");
  }

}, [phase]);


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
        setIndex(i =>{
      
        if (i < slides.length - 1) return i + 1;
        setPhase("end");
        setBgPhase("end");
        return i;
          
      });
      });
    }, 7500);

    return () => clearTimeout(timer);
  }, [index, slides.length, phase, introDone]);


  /*For transitioning only when both are true i.e dat is ready as well as the minimum loading time has passed*/
  useEffect(() => {
  if (phase === "loading" && dataReady && minLoadingDone) {
     setBgPhase("slides"); 
    setPhase("slides");
  } 
}, [phase, dataReady, minLoadingDone]);


/* ---------------- FOR SMOOTH TRANSITION BETWEEN LOADING AND SLIDES SCREEN ---------------- */
  useLayoutEffect(() => {
  if (phase !== "slides") return;
  

  setIntroDone(false);



  const tl = gsap.timeline({
  onComplete: () => {
    //setIntroDone(true); // UNLOCK slide progression.. did this to fix a minute error that causes animation to break in the first slide and then continue again.
    setShowSlides(true); //mount    
  }
});


  // hide slides initially
  gsap.set(slidesContainerRef.current, {
    opacity: 0,
    scale: 0.98
  });

 
    tl.to(slidesContainerRef.current, {
      opacity: 1,
      scale: 1,
      duration: 1,
      delay:0.6,
      ease: "power2.out",
      onComplete:setIntroDone(true)
    });

}, [phase]);

/*For loading text pulse effect*/
useEffect(() => {
  if (!showLoadingText || !loadingTextRef.current) return;

  gsap.fromTo(
    loadingTextRef.current,
    { opacity: 0, y: 6 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(loadingTextRef.current, {
          opacity: 0.4,
          duration: 1.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    }
  );
}, [showLoadingText]);


/*----FOR TRANSITIOING INPUT LAYER TEXTS-----*/
useLayoutEffect(() => {
  if (phase !== "intro") return;

  const lines = [
    line1Ref.current,
    line2Ref.current,
    line3Ref.current,
  ];

  // hard reset
  gsap.set(lines, {
    opacity: 0,
    y: 24,
    position: "absolute",
    left: "50%",
    top: "50%",
    xPercent: -50,
    yPercent: -50,
  });

  const tl = gsap.timeline();
  introTl.current = tl;

  // LINE 1
  tl.to(lines[0], {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
  })
  .to(lines[0], {
    opacity: 0,
    y: -16,
    duration: 0.7,
    ease: "power3.in",
  }, "+=0.8");

  // LINE 2
  tl.to(lines[1], {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
  })
  .to(lines[1], {
    opacity: 0,
    y: -16,
    duration: 0.7,
    ease: "power3.in",
  }, "+=0.8");

  // LINE 3 (Tap to begin)
  tl.to(lines[2], {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    onComplete: () => {
      // flicker / pulse
      gsap.to(lines[2], {
        opacity: 0.4,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: "sine.inOut",
      });
    },
  });

}, [phase]);




/*-----FOR TRANSITION BETWEEN INTRO TO INPUT----------*/
useLayoutEffect(() => {
  if (phase !== "intro-exit" || !introRef.current) return;

  introTl.current?.kill(); // stop pulse cleanly

  gsap.to(introRef.current, {
    opacity: 0,
    scale: 0.98,
    duration: 0.8,
    ease: "power2.inOut",
    onComplete: () => {
       setBgPhase("input");
       setPhase("input");
    }, 
  });
}, [phase]);


  /* ---------------- START WRAPPED ---------------- */

  const startWrapped = async () => {
    if (!playlistUrl) return;
    
    setBgPhase("loading");
    setPhase("loading");
    setMinLoadingDone(false);
    setTimeout(() => {
  setMinLoadingDone(true);
}, MIN_LOADING_TIME);


    // for Cinematic exit animation
  const tl = gsap.timeline({
    onComplete: () => {
      // slight cinematic delay since it comes too fast before input card slides away.
      setTimeout(() => {
        setShowLoadingText(true);
      }, 400);
    }
  });

  tl.to(inputCardRef.current, {
    x: -180,
    opacity: 0,
    rotateY: -8,
    duration: 1.1,
    ease: "power4.inOut",
  })
  .to(inputWrapperRef.current, {
    x: -60,
    opacity: 0,
    duration: 0.9,
    ease: "power3.inOut",
  }, "-=0.6");

   

    try {
      const id = getPlaylistId(playlistUrl);
      const res = await fetch("http://localhost:3000/wrapped", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistId: id }),
      });

      const json = await res.json();
      setData(json);
      setDataReady(true);
    } catch (err) {
      console.error(err);
    }
  };

/*------handlebegin for triggering the transisitioning between intro to input screen using useLayoutEffect---------*/
const handleBegin = () => {
  if (phase !== "intro") return;
  setPhase("intro-exit");
};




return (


  


  <div className="app-root">

     {/*Background ALWAYS mounted */}
    <Background src={currentBackground} />
    <div className="overlay" />


  
  

  {(phase === "intro" || phase === "intro-exit") && (
  <div ref={introRef} className="intro" onClick={handleBegin}>
    <p ref={line1Ref}>This is not a playlist.</p>
    <p ref={line2Ref}>This is a personality profile.</p>
    <p ref={line3Ref}>Tap to begin.</p>
  </div>
)}


    {/* INPUT LAYER */}
    
    <div className={`layer input-layer ${phase === "input" ? "show" : "hide"}`}>
      <div ref={inputWrapperRef} className="input-wrapper">
        <div ref={inputCardRef} className="input-card">
          <h1>Your Spotify Wrapped</h1>
          <p className="tagline">Turn your public playlist into a cinematic personality roast.</p>

          <input
            placeholder="Paste Spotify playlist link"
            value={playlistUrl}
            onChange={e => setPlaylistUrl(e.target.value)}
          />

          <button onClick={startWrapped}>ENTER THE WRAP</button>
        </div>

        <div className="footer-note">
          Built by an indie dev · Not affiliated with Spotify
        </div>
      </div>
    </div>

    {/* LOADING LAYER */}
    <div className={`layer loading-layer ${phase === "loading" ? "show" : "hide"}`}>
      {showLoadingText && (
        <p ref={loadingTextRef} className="loading-text">
          WRAPPING YOUR TASTE
        </p>
      )}
    </div>

    {/*SLIDES LAYER (PRE-MOUNTED) */}
    <div className={`layer slides-layer ${phase === "slides" ? "show" : "hide"}`}>
      <Slides
        slidesContainerRef={slidesContainerRef}
        slideRef={slideRef}
        index={index}
        slides={slides}
        introDone={introDone}
      />
    </div>

    {phase === "end" && (
  <div className="layer end-layer show">
    <EndCredits onRestart={() => window.location.reload()} />
  </div>
)}


  </div>
);


  
     


  
}

export default App;
