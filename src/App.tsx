import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";

const fromFrame = 10000;
const toFrame = 11379;
const frameCount = toFrame - fromFrame;

function App() {
  const [frame, setFrame] = useState(fromFrame);

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
          let f = Math.floor(frameCount * e.progress);
          setFrame(f + fromFrame);
        },
      },
    });
  }, []);

  return (
    <ReactLenis
      root
      options={{
        syncTouch: true,
        smoothWheel: true,
      }}
    >
      <div
        id="gsap-container"
        className="flex flex-col items-center w-screen h-[10000px]"
      >
        <img
          src={`/sequence/${frame.toString().padStart(8, "0")}.webp`}
          className="fixed top-0 left-0 w-screen h-screen object-cover"
        />
      </div>
    </ReactLenis>
  );
}

export default App;
