import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useRef, useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";

const fromFrame = 10000;
const toFrame = 11379;
const frameCount = toFrame - fromFrame;

const images: string[] = [];
for (let i = fromFrame; i <= toFrame; i++) {
  images.push(`/sequence/${i.toString().padStart(8, "0")}.webp`);
}

function App() {
  const [frame, setFrame] = useState(fromFrame);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvaImages, setCanvaImages] = useState<HTMLImageElement[]>([]);

  const cacheImages = async () => {
    const promises = await images.map((src) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          resolve(img);
        };
        img.onerror = () => {
          reject();
        };
      });
    });

    const imgs = await Promise.all(promises);
    setCanvaImages(imgs);

    setLoading(false);
  };

  useEffect(() => {
    cacheImages();
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
          setFrame(f);
        },
      },
    });
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const img = canvaImages?.[frame];
    if (!img) return;
    // const hRatio = canvasRef.current.width / img.width;
    // const vRatio = canvasRef.current.height / img.height;
    // const ratio = Math.min(hRatio, vRatio);
    const context = canvasRef.current.getContext("2d");
    if (!context) return;
    console.log("drawing", img.width, img.height);

    let scale = Math.min(
      canvasRef.current.width / img.width,
      canvasRef.current.height / img.height
    );
    console.log("scale", scale);
    let width = img.width * scale;
    let height = img.height * scale;
    let x = canvasRef.current.width / 2 - width / 2;
    let y = canvasRef.current.height / 2 - height / 2;

    context.drawImage(img, x, y, width, height);
    // context.imageSmoothingEnabled = false;

    // context.drawImage(
    //   img,
    //   0,
    //   0,
    //   img.width * window.devicePixelRatio,
    //   img.height * window.devicePixelRatio
    // 0,
    // 0,
    // img.width * ratio,
    // img.height * ratio
    // );

    // imgRef.current.src = `/sequence/${frame.toString().padStart(8, "0")}.webp`;
  }, [frame, canvaImages]);

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
        {loading ? (
          <p>Loading</p>
        ) : (
          <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-screen h-screen object-cover"
          />
        )}
      </div>
    </ReactLenis>
  );
}

export default App;
