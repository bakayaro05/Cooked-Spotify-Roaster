import StatSlide from "./component/slide/StatSlide";
import { useState,useEffect } from "react";
import { useRef } from "react";
import Background from "./component/background/background" 
import bg1 from "./assets/bg1.mp4";
import bg2 from "./assets/bg2.mp4";
import bg3 from "./assets/bg3.mp4";
import bg4 from "./assets/bg4.mp4";
import bg5 from "./assets/bg5.mp4";


const backgrounds = [bg1, bg2,bg3,bg4,bg5];




function App() {
  

 const slideRef = useRef();
 
 const [data,setData]=useState(null);
 const [index,setIndex]=useState(0);


//calling /wrapped endpoint.
 useEffect(() => {
  fetch("http://localhost:3000/wrapped", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      playlistId: "5GFpByk3bLI0Ah392uW3Gj?si=kFVRzHxtQ4uAkktRzw-ODw&pi=a-12VYjnLuSByb", // test playlist
    }),
  })
    .then(res => res.json())
    .then(json => setData(json))
    .catch(err => console.error(err));
}, []);


 // AUTO ADVANCE
  useEffect(() => {
  if (!slideRef.current || !data) return;



  const timer = setTimeout(() => {
    slideRef.current.exit(() => {
      setIndex(i => (i < slides.length - 1 ? i + 1 : i));
    });
  }, 7500);

  return () => clearTimeout(timer);
}, [index, data]);



// Guard goes AFTER hooks
  if (!data) {
    return <div>Loading your Wrapped...</div>;
  }
 

//The slides data.
  const slides = [
  {
    title: "Average Popularity",
    value: `${data.popularity}%`,
    subtitle: "How mainstream your taste is",
  },
  {
    title: "Total Tracks",
    value: data.trackCount,
    subtitle: "Songs in this playlist",
  },
  {
    title: "Listening Time",
    value: `${data.totalMinutes} mins`,
    subtitle: "Time spent vibing",
  },
  {
    title: "Top Artist",
    value: data.topArtist,
    subtitle: "Your most played artist",
  },
  {
    title: "Top Genre",
    value: data.topGenre,
    subtitle: "Your dominant genre",
  },
];


//rendering one slide based on index.
const slide = slides[index];
 return (
 <>
  <Background src={backgrounds[index]} />

 <StatSlide
    ref={slideRef}
    key={index}
    title={slide.title}
    value={slide.value}
    subtitle={slide.subtitle}
  />
 </>
 );
}

export default App;
