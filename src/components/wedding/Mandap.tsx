import { useEffect, useRef, useState } from "react";
import mandap from "@/assets/mandap.jpg";

const events = [
  { name: "Mehndi", date: "12 Feb 2026", time: "5 PM", icon: "🌿" },
  { name: "Sangeet", date: "13 Feb 2026", time: "7 PM", icon: "🎶" },
  { name: "Haldi", date: "14 Feb 2026", time: "10 AM", icon: "🌼" },
  { name: "Wedding", date: "14 Feb 2026", time: "6 PM", icon: "🔥" },
  { name: "Reception", date: "15 Feb 2026", time: "8 PM", icon: "✨" },
];

export function Mandap() {
  const ref = useRef<HTMLElement>(null);
  const [t, setT] = useState(0); // 0..1 progress

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh;
      const passed = vh - r.top;
      setT(Math.min(1, Math.max(0, passed / total)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pillarH = (i: number) => Math.max(0, Math.min(1, (t - 0.1 - i * 0.05) * 4));
  const flowersOpacity = Math.max(0, Math.min(1, (t - 0.4) * 3));
  const lanternsOpacity = Math.max(0, Math.min(1, (t - 0.55) * 3));
  const fireOpacity = Math.max(0, Math.min(1, (t - 0.7) * 4));

  return (
    <section ref={ref} className="relative min-h-[180vh] overflow-hidden bg-night">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-end overflow-hidden">
        {/* Mandap photo backdrop revealed */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${mandap})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.18 + t * 0.5,
            filter: `blur(${(1 - t) * 6}px)`,
            transform: `scale(${1.05 + t * 0.05})`,
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.08 0.04 30 / 0.85), oklch(0.1 0.05 30 / 0.5) 50%, oklch(0.08 0.04 30 / 0.95))" }} />

        {/* Header */}
        <div className="absolute inset-x-0 top-16 z-10 px-6 text-center">
          <p className="font-display text-xs uppercase tracking-[0.5em] text-gold/70">The Ceremonies</p>
          <h2 className="mt-3 font-display text-4xl text-gradient-gold md:text-6xl">A Mandap Rises</h2>
        </div>

        {/* The Mandap construction */}
        <div className="relative h-[70vh] w-full max-w-5xl">
          {/* Ground */}
          <div
            className="absolute inset-x-0 bottom-0 h-2 rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, oklch(0.5 0.15 60 / 0.6), transparent)", boxShadow: "0 0 40px oklch(0.6 0.18 50 / 0.5)" }}
          />
          {/* Pillars */}
          {[15, 38, 62, 85].map((left, i) => (
            <div
              key={i}
              className="absolute bottom-0"
              style={{
                left: `${left}%`,
                width: 22,
                height: `${pillarH(i) * 65}%`,
                transform: "translateX(-50%)",
                background: "linear-gradient(180deg, oklch(0.7 0.15 70), oklch(0.45 0.13 50) 60%, oklch(0.3 0.1 40))",
                borderRadius: "6px 6px 2px 2px",
                boxShadow: "0 0 20px oklch(0.6 0.18 60 / 0.5)",
                transition: "height 0.5s ease",
              }}
            >
              <div className="absolute -top-2 left-1/2 h-4 w-8 -translate-x-1/2 rounded-md" style={{ background: "var(--gradient-gold)" }} />
            </div>
          ))}

          {/* Top arch */}
          <div
            className="absolute left-1/2 top-[18%] h-3 w-[78%] -translate-x-1/2 rounded-full"
            style={{
              background: "var(--gradient-gold)",
              opacity: pillarH(3),
              boxShadow: "0 0 30px oklch(0.78 0.2 70 / 0.6)",
              transition: "opacity 0.5s ease",
            }}
          />

          {/* Flowers garlands */}
          <div
            className="absolute left-1/2 top-[20%] -translate-x-1/2 transition-opacity duration-700"
            style={{ opacity: flowersOpacity }}
          >
            <svg width="640" height="80" viewBox="0 0 640 80" className="max-w-full">
              <path d="M 20 10 Q 160 80 320 30 T 620 10" stroke="oklch(0.65 0.18 50)" strokeWidth="3" fill="none" />
            </svg>
            <div className="-mt-10 flex justify-between px-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="h-3 w-3 rounded-full" style={{ background: "radial-gradient(circle, oklch(0.78 0.2 65), oklch(0.5 0.18 35))", boxShadow: "0 0 8px oklch(0.7 0.2 55)" }} />
              ))}
            </div>
          </div>

          {/* Hanging lanterns */}
          {[25, 50, 75].map((l, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${l}%`,
                top: "26%",
                opacity: lanternsOpacity,
                transition: "opacity 0.7s ease",
                animation: `float-slow ${4 + i}s ease-in-out ${i * 0.4}s infinite`,
              }}
            >
              <div className="mx-auto h-10 w-px bg-gold/40" />
              <div
                className="h-6 w-6 rounded-md animate-flicker"
                style={{
                  background: "radial-gradient(circle, oklch(0.95 0.18 80), oklch(0.55 0.2 40))",
                  boxShadow: "0 0 24px oklch(0.78 0.2 60 / 0.9)",
                }}
              />
            </div>
          ))}

          {/* Sacred fire in center */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2" style={{ opacity: fireOpacity, transition: "opacity 0.7s ease" }}>
            <div
              className="h-16 w-12 rounded-full animate-flicker"
              style={{
                background: "radial-gradient(ellipse at 50% 70%, oklch(0.95 0.2 85), oklch(0.7 0.22 50) 50%, oklch(0.45 0.2 30 / 0.5) 80%, transparent)",
                boxShadow: "0 0 60px oklch(0.7 0.22 50 / 0.8)",
                filter: "blur(1px)",
              }}
            />
            <div className="mx-auto -mt-2 h-3 w-16 rounded-full" style={{ background: "linear-gradient(180deg, oklch(0.4 0.1 40), oklch(0.2 0.05 30))" }} />
          </div>
        </div>

        {/* Event cards */}
        <div className="absolute inset-x-0 bottom-6 z-10 px-4">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-2 md:grid-cols-5 md:gap-4">
            {events.map((e, i) => (
              <div
                key={e.name}
                className="glass rounded-2xl p-3 text-center md:p-4"
                style={{
                  opacity: Math.max(0, Math.min(1, (t - 0.3 - i * 0.04) * 4)),
                  transform: `translateY(${Math.max(0, 30 - t * 100)}px)`,
                  transition: "opacity 0.4s, transform 0.4s",
                }}
              >
                <div className="text-2xl">{e.icon}</div>
                <div className="mt-1 font-display text-sm uppercase tracking-[0.2em] text-gold">{e.name}</div>
                <div className="mt-1 font-serif-d text-xs italic text-cream/70">{e.date}</div>
                <div className="font-serif-d text-xs italic text-cream/60">{e.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
