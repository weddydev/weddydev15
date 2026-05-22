import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import couple from "@/assets/couple.jpg";
import { PetalField } from "./Particles";

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18 });
  const sy = useSpring(my, { stiffness: 80, damping: 18 });
  const tx = useTransform(sx, (v) => v * 18);
  const ty = useTransform(sy, (v) => v * 18);
  const rx = useTransform(sy, (v) => -v * 4);
  const ry = useTransform(sx, (v) => v * 4);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
      my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-night"
    >
      {/* Cloud layers */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, oklch(0.55 0.12 50 / 0.6), transparent 50%), radial-gradient(ellipse at 80% 70%, oklch(0.4 0.14 28 / 0.6), transparent 55%)",
          animation: "drift 30s linear infinite alternate",
        }}
      />
      {/* Moon */}
      <motion.div
        className="absolute right-[12%] top-[14%] h-40 w-40 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, oklch(0.96 0.06 85), oklch(0.78 0.12 75) 60%, transparent 75%)",
          filter: "blur(2px)",
          boxShadow: "0 0 80px oklch(0.85 0.16 80 / 0.6)",
          x: useTransform(sx, (v) => v * -25),
          y: useTransform(sy, (v) => v * -25),
        }}
      />

      {/* Floating diyas */}
      {[
        { l: "8%", t: "60%", d: 0 },
        { l: "18%", t: "78%", d: 1.2 },
        { l: "82%", t: "55%", d: 0.6 },
        { l: "92%", t: "78%", d: 2 },
        { l: "30%", t: "85%", d: 1.6 },
        { l: "70%", t: "82%", d: 0.3 },
      ].map((d, i) => (
        <div
          key={i}
          className="pointer-events-none absolute"
          style={{ left: d.l, top: d.t, animation: `float-slow ${5 + i}s ease-in-out ${d.d}s infinite` }}
        >
          <div className="relative">
            <div
              className="h-3 w-10 rounded-b-full"
              style={{ background: "linear-gradient(180deg, oklch(0.45 0.1 40), oklch(0.25 0.06 35))" }}
            />
            <div
              className="absolute -top-3 left-1/2 h-5 w-3 -translate-x-1/2 rounded-full animate-flicker"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 60%, oklch(0.95 0.18 85), oklch(0.7 0.22 50) 55%, transparent 80%)",
                boxShadow: "0 0 30px oklch(0.78 0.2 60 / 0.9)",
              }}
            />
          </div>
        </div>
      ))}

      <PetalField count={20} />

      {/* Couple portrait */}
      <motion.div
        className="relative z-10 mx-auto"
        style={{ x: tx, y: ty, rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      >
        <div className="relative">
          <div
            className="absolute -inset-8 rounded-full opacity-70 blur-2xl"
            style={{ background: "var(--gradient-ember)" }}
          />
          <div className="relative ornate-border overflow-hidden rounded-[3rem]" style={{ width: "min(420px, 78vw)" }}>
            <img
              src={couple}
              alt="Preethi and Abhishek silhouette"
              className="h-auto w-full"
              style={{ aspectRatio: "4/5", objectFit: "cover" }}
            />
            <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 100%, transparent 50%, oklch(0.12 0.04 25 / 0.95))" }} />
          </div>
        </div>
      </motion.div>

      {/* Text */}
      <div className="absolute inset-x-0 bottom-16 z-20 px-6 text-center md:bottom-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="font-display text-[10px] uppercase tracking-[0.7em] text-gold/80 md:text-xs"
        >
          ✦  An eternal union  ✦
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1.2 }}
          className="mt-4 font-display text-5xl text-gradient-gold md:text-8xl"
        >
          Preethi <span className="font-serif-d italic text-cream/80">&amp;</span> Abhishek
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="mt-6 font-serif-d text-lg italic text-cream/70 md:text-xl"
        >
          14 · February · 2026   ·   Udaipur, India
        </motion.p>
      </div>

      {/* Top gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40" style={{ background: "linear-gradient(180deg, oklch(0.08 0.03 30), transparent)" }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(0deg, oklch(0.08 0.03 30), transparent)" }} />
    </section>
  );
}
