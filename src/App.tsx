import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useEffect, useMemo, useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";

const fromFrame = 0;
const toFrame = 1379;

const images: string[] = [];
// public/sequence/00000000_1_11zon.webp
// public/sequence/00000001_2_11zon.webp
for (let i = fromFrame; i <= toFrame; i++) {
  images.push(
    `/sequence/${i.toString().padStart(8, "0")}_${(
      i + 1
    ).toString()}_11zon.webp`
  );
}
console.log("images", images);

function App() {
  // const [frame, setFrame] = useState(fromFrame);
  // const [loading, setLoading] = useState(true);
  // const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvaImages, setCanvaImages] = useState<HTMLImageElement[]>([]);

  const cacheImages = async () => {
    const promises = await images.map((src) => {
      return new Promise<HTMLImageElement | undefined>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          resolve(img);
        };
        img.onerror = () => {
          resolve(undefined);
        };
      });
    });

    try {
      const imgs = await Promise.all(promises);
      setCanvaImages(imgs.filter((img) => !!img));

      // setLoading(false);
    } catch (err) {
      console.log("err", err);
    }
  };

  const frameCount = useMemo(() => {
    return canvaImages.length;
  }, [canvaImages]);

  useEffect(() => {
    cacheImages();
  }, []);

  // useEffect(() => {
  //   if (!frameCount) return;
  //   // if (!videoRef) return;
  //   gsap.registerPlugin(ScrollTrigger);
  //   // ScrollTrigger.normalizeScroll(true);

  //   gsap.timeline({
  //     defaults: { duration: 1 },
  //     scrollTrigger: {
  //       trigger: "#gsap-container",
  //       start: "top top",
  //       end: "bottom bottom",
  //       scrub: 4,
  //       onUpdate: (e) => {
  //         // setProgress(e.progress);
  //         let f = Math.floor(frameCount * e.progress);
  //         setFrame(f);
  //       },
  //     },
  //   });
  // }, [frameCount]);

  // useEffect(() => {
  //   if (!canvasRef.current) return;
  //   const img = canvaImages?.[frame];
  //   if (!img) return;
  //   const context = canvasRef.current.getContext("2d");
  //   if (!context) return;
  //   context.imageSmoothingEnabled = false;
  //   console.log("drawing", img.width, img.height);
  //   let scale = Math.min(
  //     canvasRef.current.width / img.width,
  //     canvasRef.current.height / img.height
  //   );
  //   console.log("scale", scale);
  //   let width = img.width * scale;
  //   let height = img.height * scale;
  //   console.log("timed", width, height);
  //   // img.width = width;
  //   // img.height = height;
  //   let x = canvasRef.current.width / 2 - width / 2;
  //   let y = canvasRef.current.height / 2 - height / 2;

  //   context.drawImage(
  //     img,
  //     0,
  //     0,
  //     img.width,
  //     img.height,
  //     0,
  //     0,
  //     canvasRef.current.width,
  //     canvasRef.current.height
  //   );

  //   // context.drawImage(
  //   //   img,
  //   //   0,
  //   //   0,
  //   //   img.width * window.devicePixelRatio,
  //   //   img.height * window.devicePixelRatio
  //   // 0,
  //   // 0,
  //   // img.width * ratio,
  //   // img.height * ratio
  //   // );

  //   // imgRef.current.src = `/sequence/${frame.toString().padStart(8, "0")}.webp`;
  // }, [frame, canvaImages]);

  useEffect(() => {
    if (!frameCount || !canvaImages.length) return;
    const canvas = document.getElementById(
      "hero-lightpass"
    ) as HTMLCanvasElement;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = 1920;
    canvas.height = 1080;

    const airpods = {
      frame: 0,
    };

    gsap.registerPlugin(ScrollTrigger);

    gsap.to(airpods, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        scrub: 0.5,
      },
      onUpdate: () => {
        render();
      }, // use animation onUpdate instead of scrollTrigger's onUpdate
    });

    canvaImages[0].onload = render;

    function render() {
      if (!context) return;
      console.log("drawing", airpods.frame);
      context.clearRect(0, 0, canvas.width, canvas.height);
      // context.drawImage(canvaImages[airpods.frame], 0, 0);
      const img = canvaImages[airpods.frame];
      context.drawImage(
        img, // image
        0, // source x
        0
        // (image.height - img.width / canvasAspect) / 2, // source y
        // img.width, // source width
        // img.width / canvasAspect, // source height
        // 0, // destination x
        // 0, // destination y
        // canvas.width, // destination width
        // canvas.height // destination height
      );
    }
  }, [canvaImages, frameCount]);

  return <canvas id="hero-lightpass" />;

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
        <div className="fixed top-0 left-0">
          <canvas id="hero-lightpass" />
        </div>
        {/* {loading ? (
          <p>Loading</p>
        ) : (
          <div className="fixed top-0 left-0">
            <canvas id="hero-lightpass" />
          </div>
        )} */}
      </div>
    </ReactLenis>
  );
}

export default App;
