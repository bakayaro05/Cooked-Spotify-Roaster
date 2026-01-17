import { useLayoutEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";


const NarrativeSlide = forwardRef(({ sentence, introDone }, ref) => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    if (!introDone) return;

    const split = new SplitType(textRef.current, { types: "words" });

    gsap.from(split.words, {
      y: 30,
      opacity: 0,
      stagger: 0.20,
      duration: 0.8,
      ease: "power3.out",
    });

    return () => split.revert();
  }, [introDone]);

  useImperativeHandle(ref, () => ({
    exit: (onComplete) => {
      gsap.to(sectionRef.current, {
        opacity: 0,
        y: -40,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete,
      });
    },
  }));

  return (
    <section className="slide narrative" ref={sectionRef}>
      <h1 ref={textRef}>{sentence}</h1>
    </section>
  );
});

export default NarrativeSlide;
