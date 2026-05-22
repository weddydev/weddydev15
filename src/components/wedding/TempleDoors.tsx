import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import doorImg from "@/assets/door.jpg";
import { dispatchBell, dispatchScene } from "./AudioController";
import { getReducedMotion } from "./ReducedMotion";

/**
 * Royal twin temple doors with momentum + snap.
 * - Drag horizontally (mouse or touch) to part the panels.
 * - Release: velocity + position decide a snap to OPEN or CLOSED with eased animation.
 * - The seam light bloom, fog, and petals only erupt at the moment the doors finish parting.
 */
export function TempleDoors({ onOpen }: { onOpen: () => void }) {
  const [progress, setProgress] = useState(0);
  const [opened, setOpened] = useState(false);
  const [revealed, setRevealed] = useState(false); // gates the bloom + particles

  const dragging = useRef(false);
  const startX = useRef(0);
  const startProg = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);
  const velocity = useRef(0); // px/ms
  const reach = useRef(420);
  const lastBellAt = useRef(0);

  // Animation refs (rAF for both live drag commits and snap)
  const rafScheduled = useRef(false);
  const pendingProg = useRef(0);
  const snapRaf = useRef<number | null>(null);

  const commit = () => {
    rafScheduled.current = false;
    setProgress(pendingProg.current);
  };
  const queueProgress = (v: number) => {
    pendingProg.current = Math.min(1, Math.max(0, v));
    if (!rafScheduled.current) {
      rafScheduled.current = true;
      requestAnimationFrame(commit);
    }
  };

  const cancelSnap = () => {
    if (snapRaf.current != null) {
      cancelAnimationFrame(snapRaf.current);
      snapRaf.current = null;
    }
  };

  // easeOutCubic
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  const animateTo = (target: 0 | 1, fromVel: number) => {
    cancelSnap();
    const reduced = getReducedMotion();
    const start = pendingProg.current;
    const dist = target - start;
    if (Math.abs(dist) < 0.001) {
      pendingProg.current = target;
      setProgress(target);
      if (target === 1) finishOpen();
      return;
    }
    // Duration scales with distance and inverse velocity. Reduced motion = snappy/no-anim.
    const speed = Math.max(0.4, Math.abs(fromVel) * 1000); // px/s-ish
    const base = reduced ? 220 : 720;
    const duration = reduced
      ? 180
      : Math.min(900, Math.max(260, (Math.abs(dist) * base * 1000) / speed));
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const v = start + dist * ease(t);
      pendingProg.current = v;
      setProgress(v);
      if (t < 1) {
        snapRaf.current = requestAnimationFrame(step);
      } else {
        snapRaf.current = null;
        if (target === 1) finishOpen();
      }
    };
    snapRaf.current = requestAnimationFrame(step);
  };

  const finishOpen = () => {
    if (opened) return;
    setOpened(true);
    setRevealed(true);
    // Cinematic gong burst at the moment the doors fully part
    dispatchBell(330, 6);
    setTimeout(() => dispatchBell(262, 7), 220);
    setTimeout(() => dispatchBell(196, 8), 480);
    dispatchScene("hero");
    setTimeout(onOpen, 1300);
  };

  useEffect(() => {
    reach.current = Math.max(180, window.innerWidth * (window.innerWidth < 640 ? 0.32 : 0.42));
    const onResize = () => {
      reach.current = Math.max(180, window.innerWidth * (window.innerWidth < 640 ? 0.32 : 0.42));
    };
    window.addEventListener("resize", onResize);

    const move = (clientX: number) => {
      if (!dragging.current) return;
      const dx = clientX - startX.current;
      const next = Math.min(1, Math.max(0, startProg.current + dx / reach.current));
      // velocity tracking (px / ms)
      const now = performance.now();
      const dt = Math.max(1, now - lastT.current);
      velocity.current = (clientX - lastX.current) / dt;
      lastX.current = clientX;
      lastT.current = now;
      // staggered drag bells
      if (next > 0.05 && now - lastBellAt.current > 700 && Math.abs(next - pendingProg.current) > 0.07) {
        lastBellAt.current = now;
        dispatchBell(620 + Math.random() * 80, 3);
      }
      queueProgress(next);
    };
    const release = () => {
      if (!dragging.current) return;
      dragging.current = false;
      // Decide snap target: position bias OR a strong outward fling
      const v = velocity.current; // positive = opening (left panel pulled left? our handler maps dx→open)
      const strongFling = Math.abs(v) > 0.6; // px/ms
      let target: 0 | 1;
      if (strongFling) target = v > 0 ? 1 : 0;
      else target = pendingProg.current > 0.45 ? 1 : 0;
      animateTo(target, v);
    };

    const onMouse = (e: MouseEvent) => move(e.clientX);
    const onTouch = (e: TouchEvent) => {
      if (dragging.current) e.preventDefault();
      if (e.touches[0]) move(e.touches[0].clientX);
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: false });
    window.addEventListener("mouseup", release);
    window.addEventListener("touchend", release);
    window.addEventListener("touchcancel", release);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseup", release);
      window.removeEventListener("touchend", release);
      window.removeEventListener("touchcancel", release);
      cancelSnap();
    };
  }, [opened]);

  const begin = (clientX: number) => {
    cancelSnap();
    dragging.current = true;
    startX.current = clientX;
    startProg.current = pendingProg.current;
    lastX.current = clientX;
    lastT.current = performance.now();
    velocity.current = 0;
  };

  const slide = progress * 100;
  const seamWidth = Math.max(2, progress * 18); // subtle seam light during drag
  const showBloom = revealed; // gated: only after fully parted

  return (
    <AnimatePresence>
      {!opened || progress < 1 ? (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.25 }}
          transition={{ duration: 1.1, ease: [0.7, 0, 0.3, 1] }}
        >
          {/* Hall background */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 55%, oklch(0.42 0.14 50 / 0.7), oklch(0.18 0.06 30 / 0.5) 45%, oklch(0.06 0.02 30) 78%)",
            }}
          />

          {/* Subtle seam glint while dragging — narrow, restrained */}
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2"
            style={{
              width: `${seamWidth}vw`,
              background:
                "linear-gradient(90deg, transparent, oklch(0.92 0.18 80 / 0.55), transparent)",
              filter: `blur(${10 - progress * 6}px)`,
              opacity: 0.3 + progress * 0.4,
              mixBlendMode: "screen",
            }}
          />

          {/* GATED: golden bloom that explodes only when doors fully part */}
          {showBloom && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1.4 }}
              transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, oklch(0.97 0.2 85 / 0.95), oklch(0.78 0.2 60 / 0.55) 22%, oklch(0.5 0.18 45 / 0.25) 45%, transparent 70%)",
                mixBlendMode: "screen",
                filter: "blur(8px)",
              }}
            />
          )}

          {/* GATED: drifting fog erupts only after the part */}
          {showBloom && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 1.4 }}
              style={{
                background:
                  "radial-gradient(ellipse at 50% 75%, oklch(0.85 0.05 60 / 0.45), transparent 55%), radial-gradient(ellipse at 30% 60%, oklch(0.7 0.08 50 / 0.28), transparent 60%), radial-gradient(ellipse at 70% 65%, oklch(0.7 0.08 50 / 0.28), transparent 60%)",
                filter: "blur(22px)",
                animation: "drift 22s ease-in-out infinite alternate",
                mixBlendMode: "screen",
              }}
            />
          )}

          {/* LEFT panel */}
          <DoorPanel side="left" slide={slide} onBegin={begin} />
          {/* RIGHT panel */}
          <DoorPanel side="right" slide={slide} onBegin={begin} />

          {/* Center seam glow line — fades as panels leave */}
          <div
            className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2"
            style={{
              width: 2,
              background:
                "linear-gradient(180deg, transparent, oklch(0.95 0.2 80 / 0.9), transparent)",
              opacity: 1 - progress,
              boxShadow: "0 0 24px oklch(0.85 0.2 75 / 0.9)",
            }}
          />

          {/* GATED: petals only when doors fully part */}
          {showBloom && !getReducedMotion() && (
            <div className="pointer-events-none absolute inset-0">
              {Array.from({ length: 18 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute h-2.5 w-4 rounded-full"
                  style={{
                    background:
                      i % 2 === 0
                        ? "radial-gradient(ellipse, oklch(0.7 0.22 30), transparent 70%)"
                        : "radial-gradient(ellipse, oklch(0.85 0.18 80), transparent 70%)",
                    left: `${10 + ((i * 47) % 80)}%`,
                    top: `-10%`,
                    ["--sx" as string]: "0px",
                    ["--dx" as string]: `${(i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 15)}px`,
                    animation: `petal-fall ${5 + (i % 6)}s linear ${i * 0.15}s infinite`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}

          {/* Hint */}
          <motion.div
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center sm:bottom-12"
            animate={{ opacity: progress > 0.05 ? 0 : [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          >
            <p className="font-display text-[10px] uppercase tracking-[0.4em] text-gold/80 sm:text-xs sm:tracking-[0.5em]">
              Pull the doors apart
            </p>
            <div className="mt-3 flex items-center justify-center gap-3 text-gold">
              <span className="text-xl">⟵</span>
              <span className="h-px w-12 bg-gold/60 sm:w-16" />
              <span className="text-xl">⟶</span>
            </div>
          </motion.div>

          {/* Title revealed as doors open */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-6"
            style={{ opacity: Math.max(0, progress - 0.25) * 1.6 }}
          >
            <div className="text-center">
              <p className="font-display text-[10px] uppercase tracking-[0.5em] text-gold/80 sm:text-xs sm:tracking-[0.6em]">
                The wedding of
              </p>
              <h1 className="mt-3 font-display text-4xl text-gradient-gold sm:mt-4 sm:text-6xl md:text-7xl">
                Preethi &amp; Abhishek
              </h1>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DoorPanel({
  side,
  slide,
  onBegin,
}: {
  side: "left" | "right";
  slide: number;
  onBegin: (clientX: number) => void;
}) {
  const isLeft = side === "left";
  return (
    <div
      className={`absolute inset-y-0 ${isLeft ? "left-0" : "right-0"} w-1/2 select-none cursor-grab active:cursor-grabbing`}
      style={{
        touchAction: "none",
        transform: `translate3d(${isLeft ? "-" : ""}${slide}%,0,0)`,
        willChange: "transform",
      }}
      onMouseDown={(e) => onBegin(e.clientX)}
      onTouchStart={(e) => onBegin(e.touches[0].clientX)}
    >
      {/* Door image — sharp on all sizes via cover; mirrored on the right so the ornate seam faces center */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${doorImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: isLeft ? "none" : "scaleX(-1)",
          imageRendering: "auto",
        }}
      />

      {/* Inner shadow toward the seam for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, oklch(0 0 0 / 0.55) 0%, transparent 18%, transparent 75%, oklch(0 0 0 / 0.85) 100%)",
        }}
      />

      {/* Ornate gold trim along the seam edge */}
      <div
        className="pointer-events-none absolute inset-y-0 w-3"
        style={{
          [isLeft ? "right" : "left"]: 0 as never,
          background:
            "linear-gradient(180deg, oklch(0.85 0.18 80), oklch(0.55 0.15 55) 50%, oklch(0.85 0.18 80))",
          boxShadow: "0 0 24px oklch(0.78 0.2 70 / 0.7)",
        } as React.CSSProperties}
      />
    </div>
  );
}
