import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { gsap } from "gsap";
import "./slide.css";

const StatSlide = forwardRef(({ title, value, subtitle }, ref) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const valueRef = useRef(null);
  const subRef = useRef(null);

  const tl = useRef(null);

  console.log("StatSlide rendered", { title, value, subtitle });
  // ENTER animation (Spotify-style)
  useEffect(() => {
   const tl = gsap.timeline();  
  const ctx = gsap.context(()=>{

 
  tl.from(titleRef.current, {
    y: 40,
    opacity: 0,
    duration: 1.6,
    ease: "power3.out",
  })
  .from(
    valueRef.current,
    {
      y: 60,
      opacity: 0,
      duration: 2.0,
      ease: "power3.out",
    },
    "-=0.3"
  );

  if (subRef.current) {
    tl.from(
      subRef.current,
      {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      },
      "-=0.25"
    );
  }

  return () => tl.kill();

  },tl);
  return ()=>ctx.revert();
}, []);


  // EXIT animation exposed to parent
  useImperativeHandle(ref, () => ({
    exit: (onComplete) => {
      gsap.to(sectionRef.current, {
        opacity: 0,
        scale: 0.96,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete,
      });
    },
  }));

  return (
    <section className="slide" ref={sectionRef}>
      <h2 ref={titleRef} className="slide-title">{title}</h2>
      <h1 ref={valueRef} className="slide-value">{value}</h1>
      {subtitle && (
        <p ref={subRef} className="slide-sub">{subtitle}</p>
      )}
    </section>
  );
});

export default StatSlide;
