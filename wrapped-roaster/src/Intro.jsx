import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function Intro({onNext}) {
  const titleRef = useRef(null);
  const sectionRef=useRef(null);

  useEffect(() => {

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    },sectionRef);


    return () => ctx.revert(); 
  }, []);

   const handleNext = () => {
    gsap.to(sectionRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: onNext,
    });
  };


  return (
    <section className="intro" ref={sectionRef} onClick={handleNext}>
      <h1 ref={titleRef}>Your music taste in 2024</h1>
    </section>
  );
}


export default Intro;