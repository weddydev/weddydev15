import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarField } from "./Particles";

const memories = [
  { x: 12, y: 30, title: "First Glance", date: "Aug 2021", text: "A coffee shop in Bangalore. Two strangers, one shared umbrella in the monsoon rain." },
  { x: 28, y: 55, title: "First Trip", date: "Dec 2022", text: "A road trip to Hampi — sunsets behind ancient stones, songs on a broken speaker." },
  { x: 46, y: 35, title: "The Promise", date: "Mar 2023", text: "Under the cherry blossoms in Kashmir, Abhishek wrote a letter Preethi still keeps." },
  { x: 62, y: 60, title: "Family Tea", date: "Jul 2024", text: "Two families. Three pots of chai. One blessing that changed everything." },
  { x: 78, y: 38, title: "The Proposal", date: "Feb 2025", text: "On the rooftops of Udaipur, with a ring carried halfway around the world." },
  { x: 90, y: 62, title: "Forever", date: "Feb 2026", text: "A sacred fire. A thousand stars as witness. Two souls, one path." },
];

export function LoveStory() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section className="relative min-h-screen overflow-hidden py-32" style={{ background: "linear-gradient(180deg, oklch(0.18 0.07 30) 0%, oklch(0.1 0.04 280) 50%, oklch(0.08 0.04 290) 100%)" }}>
      <StarField count={120} />

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <p className="font-display text-xs uppercase tracking-[0.5em] text-gold/70">Our Constellation</p>
        <h2 className="mt-4 font-display text-4xl text-gradient-gold md:text-6xl">A Love Written in the Stars</h2>
        <p className="mx-auto mt-6 max-w-xl font-serif-d text-lg italic text-cream/70">
          Each star, a memory. Trace them and our story will unfold.
        </p>
      </div>

      {/* Constellation canvas */}
      <div className="relative mx-auto mt-20 h-[480px] w-full max-w-6xl px-6">
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          {memories.slice(0, -1).map((m, i) => {
            const n = memories[i + 1];
            return (
              <line
                key={i}
                x1={m.x}
                y1={m.y}
                x2={n.x}
                y2={n.y}
                stroke="oklch(0.85 0.16 80 / 0.4)"
                strokeWidth="0.15"
                strokeDasharray="0.6 0.4"
              />
            );
          })}
        </svg>
        {memories.map((m, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
          >
            <span
              className="block h-3 w-3 rounded-full transition-all duration-300 group-hover:scale-150"
              style={{
                background: "radial-gradient(circle, oklch(0.96 0.06 85), oklch(0.78 0.18 70) 70%)",
                boxShadow: "0 0 14px oklch(0.85 0.18 75), 0 0 30px oklch(0.7 0.2 55 / 0.7)",
              }}
            />
            <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap font-display text-[10px] uppercase tracking-[0.3em] text-gold/80 opacity-0 transition group-hover:opacity-100">
              {m.title}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center px-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" />
            <motion.div
              className="glass relative max-w-md rounded-3xl p-8 text-center"
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-display text-[10px] uppercase tracking-[0.5em] text-gold">{memories[active].date}</p>
              <h3 className="mt-3 font-display text-3xl text-gradient-gold">{memories[active].title}</h3>
              <p className="mt-5 font-serif-d text-lg italic leading-relaxed text-cream/80">{memories[active].text}</p>
              <div className="mt-6 flex justify-center gap-2 text-gold/60">✦ ✦ ✦</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
