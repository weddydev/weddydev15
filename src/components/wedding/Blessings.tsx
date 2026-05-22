import { useState } from "react";
import { StarField } from "./Particles";

export function Blessings() {
  const [lanterns] = useState(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      d: Math.random() * 8,
      dur: 10 + Math.random() * 8,
    })),
  );

  return (
    <section className="relative min-h-screen overflow-hidden" style={{ background: "linear-gradient(180deg, oklch(0.06 0.03 290) 0%, oklch(0.1 0.04 270) 60%, oklch(0.16 0.06 30) 100%)" }}>
      <StarField count={140} />

      {/* Lanterns rising */}
      <div className="pointer-events-none absolute inset-0">
        {lanterns.map((l) => (
          <div
            key={l.id}
            className="absolute bottom-0"
            style={{
              left: `${l.x}%`,
              animation: `lantern-rise ${l.dur}s ease-out ${l.d}s infinite`,
            }}
          >
            <div
              className="h-8 w-6 rounded-md animate-flicker"
              style={{
                background: "radial-gradient(ellipse at 50% 60%, oklch(0.95 0.2 80), oklch(0.6 0.22 45))",
                boxShadow: "0 0 30px oklch(0.78 0.22 55 / 0.85)",
              }}
            />
            <div className="mx-auto h-3 w-2 rounded-b-full bg-gold/50" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="font-display text-[10px] uppercase tracking-[0.7em] text-gold/70">Blessings rise to the sky</p>
        <h2 className="mt-6 font-display text-4xl text-gradient-gold md:text-7xl">Two souls.</h2>
        <h2 className="mt-2 font-display text-4xl text-gradient-gold md:text-7xl">One destiny.</h2>
        <h3 className="mt-8 font-serif-d text-3xl italic text-cream/90 md:text-5xl">Preethi &amp; Abhishek</h3>

        <div className="mt-14 flex items-center gap-3 text-gold/70">
          <span className="h-px w-16 bg-gold/40" />
          <span>✦</span>
          <span className="h-px w-16 bg-gold/40" />
        </div>
        <p className="mt-8 max-w-md font-serif-d italic text-cream/60">
          Thank you for being part of our story. May your blessings light the path ahead.
        </p>
      </div>
    </section>
  );
}
