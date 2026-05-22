import { useEffect, useRef, useState } from "react";
import { dispatchScene } from "./AudioController";

const SCENES = [
  { name: "hero",      tint: "oklch(0.12 0.04 30 / 0)" },
  { name: "story",     tint: "oklch(0.1 0.06 280 / 0.35)" },
  { name: "mandap",    tint: "oklch(0.18 0.1 30 / 0.3)" },
  { name: "venue",     tint: "oklch(0.16 0.08 30 / 0.3)" },
  { name: "rsvp",      tint: "oklch(0.22 0.16 35 / 0.35)" },
  { name: "gallery",   tint: "oklch(0.1 0.04 30 / 0.25)" },
  { name: "blessings", tint: "oklch(0.08 0.05 280 / 0.45)" },
];

type Spark = { id: number; x: number; y: number; dx: number; dy: number };

export function DestinyThread() {
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const lastSparkAt = useRef(0);
  const lastScrollY = useRef(0);
  const sceneRef = useRef(0);

  // Determine current scene from progress
  const sceneIndex = Math.min(SCENES.length - 1, Math.floor(progress * SCENES.length * 0.999));
  const tint = SCENES[sceneIndex].tint;

  useEffect(() => {
    if (sceneRef.current !== sceneIndex) {
      sceneRef.current = sceneIndex;
      dispatchScene(SCENES[sceneIndex].name);
    }
  }, [sceneIndex]);

  const emitSparks = (count = 6) => {
    setSparks((prev) => {
      const next = [...prev];
      for (let i = 0; i < count; i++) {
        next.push({
          id: Math.random() + performance.now(),
          x: 0,
          y: 0,
          dx: (Math.random() - 0.5) * 80,
          dy: (Math.random() - 0.5) * 80 - 10,
        });
      }
      return next.slice(-40);
    });
  };

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        setProgress(p);
        // velocity-driven sparks
        const dy = Math.abs(window.scrollY - lastScrollY.current);
        lastScrollY.current = window.scrollY;
        const now = performance.now();
        if (dy > 12 && now - lastSparkAt.current > 90) {
          lastSparkAt.current = now;
          emitSparks(Math.min(8, Math.ceil(dy / 20)));
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Decay sparks
  useEffect(() => {
    if (sparks.length === 0) return;
    const t = setTimeout(() => setSparks((s) => s.slice(2)), 700);
    return () => clearTimeout(t);
  }, [sparks]);

  useEffect(() => {
    if (!dragging) return;
    const move = (clientY: number) => {
      const t = Math.min(1, Math.max(0, (clientY - 80) / (window.innerHeight - 160)));
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: t * max });
      emitSparks(3);
    };
    const onMouse = (e: MouseEvent) => move(e.clientY);
    const onTouch = (e: TouchEvent) => {
      e.preventDefault();
      move(e.touches[0].clientY);
    };
    const stop = () => setDragging(false);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: false });
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchend", stop);
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchend", stop);
    };
  }, [dragging]);

  return (
    <>
      {/* Dynamic background tint that crossfades by scene */}
      <div
        className="pointer-events-none fixed inset-0 z-[5] transition-[background] duration-700"
        style={{ background: tint, mixBlendMode: "multiply" }}
      />

      <div className="pointer-events-none fixed right-3 top-0 z-50 h-screen w-12 md:right-8">
        {/* Thread line */}
        <div
          className="absolute left-1/2 top-20 h-[calc(100vh-160px)] w-[3px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.55 0.2 25), oklch(0.7 0.24 30), oklch(0.45 0.18 25))",
            boxShadow: "0 0 14px oklch(0.65 0.22 30 / 0.7)",
          }}
        />

        {/* Knot */}
        <div
          className="pointer-events-auto absolute left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
          style={{ top: `calc(80px + (100vh - 160px) * ${progress})`, touchAction: "none" }}
          onMouseDown={() => setDragging(true)}
          onTouchStart={() => setDragging(true)}
        >
          <div
            className="relative flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, oklch(0.85 0.2 60), oklch(0.45 0.22 28))",
              boxShadow:
                "0 0 18px oklch(0.7 0.24 35), 0 0 40px oklch(0.55 0.2 25 / 0.6)",
              animation: "thread-pulse 2.4s ease-in-out infinite",
            }}
          >
            <span className="text-[10px]">✦</span>

            {/* Sparks */}
            {sparks.map((s) => (
              <span
                key={s.id}
                className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.95 0.2 80), transparent 70%)",
                  boxShadow: "0 0 8px oklch(0.85 0.22 70)",
                  transform: `translate(-50%,-50%) translate(${s.dx}px, ${s.dy}px) scale(0.4)`,
                  opacity: 0,
                  animation: "thread-spark 700ms ease-out forwards",
                }}
              />
            ))}
          </div>
        </div>

        <div className="absolute -left-28 top-1/2 hidden -translate-y-1/2 -rotate-90 font-display text-[10px] uppercase tracking-[0.4em] text-gold/60 lg:block">
          Pull the destiny thread
        </div>
      </div>
    </>
  );
}
