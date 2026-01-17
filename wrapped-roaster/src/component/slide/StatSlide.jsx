import { useLayoutEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import "./slide.css";

const StatSlide = forwardRef(({ title, value, subtitle,direction, introDone }, ref) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const valueRef = useRef(null);
  const subRef = useRef(null);
  const splitRef = useRef(null);

  const tl = useRef(null);

  console.log("StatSlide rendered", { title, value, subtitle });
  // ENTER animation (Spotify-style)
  useLayoutEffect(() => {
  if (!introDone) return;

  const ctx = gsap.context(() => {
    tl.current = gsap.timeline();
        
    //for fade in first.. 
     tl.current.to(sectionRef.current, {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    });


   splitRef.current = new SplitType(valueRef.current, { types: "chars" });
    tl.current
      .from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      })
      .from(
        splitRef.current.chars,
        {
          y: 50,
          opacity: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.2"
      );

    if (subRef.current) {
      tl.current.from(
        subRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }
  }, sectionRef);

  return () => {
  splitRef.current?.revert();
  splitRef.current = null;
    ctx.revert();
    tl.current?.kill();
    tl.current = null;
  };
}, [introDone]);



  // EXIT animation exposed to parent
 useImperativeHandle(ref, () => ({
  exit: (onComplete) => {
    let vars = { opacity: 0, duration: 0.5, ease: "power2.inOut" };

    if (direction === "up") vars.y = -60;
    if (direction === "left") vars.x = -80;
    if (direction === "right") vars.x = 80;
    if (direction === "scale") vars.scale = 0.9;
    if (direction === "fade") vars.opacity = 0;

    gsap.to(sectionRef.current, {
      ...vars,
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
