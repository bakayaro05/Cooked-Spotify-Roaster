import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";
import "./slide.css";

const StatSlide = forwardRef(({ title, value, subtitle,direction }, ref) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const valueRef = useRef(null);
  const subRef = useRef(null);

  const tl = useRef(null);

  console.log("StatSlide rendered", { title, value, subtitle });
  // ENTER animation (Spotify-style)
  useEffect(() => {

  const valueSplit = new SplitType(valueRef.current, { types: "chars" });
  const tl = gsap.timeline();  
  const ctx = gsap.context(()=>{

 
  tl.from(titleRef.current, {
    y: 40,
    opacity: 0,
    duration: 1.6,
    ease: "power3.out",
  })
  .from(
      valueSplit.chars,
      {
        y: 50,
        opacity: 0,
        stagger: 0.25,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.3");

  if (subRef.current) {
    tl.from(
      subRef.current,
      {
        y: 20,
        opacity: 0,
        duration: 2,
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
