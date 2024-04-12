import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef } from "react";
import videoUrl from "/video.webm";

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    // if (!videoRef) return;
    gsap.registerPlugin(ScrollTrigger);
    // ScrollTrigger.normalizeScroll(true);

    gsap.timeline({
      defaults: { duration: 1 },
      scrollTrigger: {
        trigger: "#gsap-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 4,
        onUpdate: (e) => {
          // setProgress(e.progress);
          if (!videoRef.current?.duration) return;
          videoRef.current.currentTime = videoRef.current.duration * e.progress;
          console.log("setting time to", videoRef.current.currentTime);
        },
      },
    });
  }, []);

  return (
    <div
      id="gsap-container"
      className="flex flex-col items-center w-screen h-[10000px]"
    >
      <video
        className="w-screen h-screen object-cover fixed top-0 left-0"
        muted
        playsInline
        ref={videoRef}
      >
        <source src={videoUrl} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default App;
