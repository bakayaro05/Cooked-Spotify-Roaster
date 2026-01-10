import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./background.css";

function Background({ src }) {
  const videoRef = useRef(null);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    //if (src === currentSrc) return;

    const video = videoRef.current;

    gsap.to(video, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setCurrentSrc(src);
        video.load();
        gsap.fromTo(
          video,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 }
        );
      },
    });
  }, [src]);

  return (
    <div className="bg-wrapper">
      <video
        ref={videoRef}
        className="bg-video"
        src={currentSrc}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="bg-overlay" />
    </div>
  );
}

export default Background;
