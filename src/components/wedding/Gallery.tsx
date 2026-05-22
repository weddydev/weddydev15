import { useEffect, useRef, useState } from "react";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import couple from "@/assets/couple.jpg";

const photos = [
  { src: couple, caption: "Two hearts, one promise" },
  { src: g1, caption: "Forever and always" },
  { src: g2, caption: "Henna, gold and grace" },
  { src: g3, caption: "By the sacred fire" },
  { src: couple, caption: "Underneath the moon" },
  { src: g1, caption: "Beginnings written in gold" },
];

export function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const [mx, setMx] = useState(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      setMx(((e.clientX - r.left) / r.width - 0.5) * 2);
    };
    const el = ref.current;
    el?.addEventListener("mousemove", onMove);
    return () => el?.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-night py-32">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="font-display text-xs uppercase tracking-[0.5em] text-gold/70">The Memory Palace</p>
        <h2 className="mt-4 font-display text-4xl text-gradient-gold md:text-6xl">Walk Through Our Hallway</h2>
        <p className="mx-auto mt-6 max-w-xl font-serif-d text-lg italic text-cream/70">
          Hanging frames suspended in golden light. Move within. Wander.
        </p>
      </div>

      <div
        ref={ref}
        className="relative mx-auto mt-20 h-[520px] w-full max-w-6xl"
        style={{ perspective: "1400px" }}
      >
        {/* Hallway floor */}
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background: "linear-gradient(180deg, transparent, oklch(0.18 0.06 35) 60%, oklch(0.12 0.04 30))",
            transform: "rotateX(60deg) translateY(40px)",
            transformOrigin: "bottom",
            opacity: 0.7,
          }}
        />
        {/* Side wall lights */}
        {[10, 30, 50, 70, 90].map((l, i) => (
          <div
            key={i}
            className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full animate-flicker"
            style={{
              left: `${l}%`,
              background: "radial-gradient(circle, oklch(0.95 0.18 80), transparent 70%)",
              boxShadow: "0 0 30px oklch(0.78 0.2 60)",
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        <div
          className="relative h-full"
          style={{ transform: `rotateY(${mx * 6}deg)`, transformStyle: "preserve-3d", transition: "transform 0.4s ease" }}
        >
          {photos.map((p, i) => {
            const total = photos.length;
            const pos = (i - (total - 1) / 2) / ((total - 1) / 2); // -1..1
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 group"
                style={{
                  transform: `translate(-50%, -50%) translateX(${pos * 36}vw) translateZ(${-Math.abs(pos) * 200}px) rotateY(${-pos * 25}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="ornate-border overflow-hidden rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  style={{
                    width: 220,
                    height: 300,
                    background: "var(--maroon)",
                    boxShadow: "0 30px 60px -10px oklch(0 0 0 / 0.7), 0 0 40px oklch(0.6 0.2 50 / 0.3)",
                  }}
                >
                  <img src={p.src} alt={p.caption} loading="lazy" className="h-full w-full object-cover" />
                  <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 60%, oklch(0.1 0.04 30 / 0.85))" }} />
                  <div className="absolute inset-x-0 bottom-3 px-3 text-center font-serif-d text-sm italic text-cream/90">{p.caption}</div>
                </div>
                {/* Hanging string */}
                <div className="absolute left-1/2 -top-20 h-20 w-px -translate-x-1/2 bg-gold/40" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
