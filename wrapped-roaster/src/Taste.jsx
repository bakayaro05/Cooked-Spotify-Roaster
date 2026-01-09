import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function Taste() {
  const textRef = useRef(null);

  useEffect(() => {

    const ctx = gsap.context(()=>{
         gsap.from(textRef.current, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
    },textRef)
    
     return () => ctx.revert();
   
  }, []);

  return (
    <section className="intro">
      <h1 ref={textRef}>Your vibe is… suspiciously good</h1>
    </section>
  );
}

export default Taste;
