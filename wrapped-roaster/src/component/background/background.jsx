import "./background.css";

function Background({ src }) {
  return (
    <div className="bg-wrapper">
      <video
        className="bg-video"
        src={src}
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
