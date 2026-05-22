import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Embers } from "./Particles";

export function Rsvp() {
  const [name, setName] = useState("");
  const [petals, setPetals] = useState<{ id: number; x: number }[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const tossPetal = () => {
    const id = Date.now() + Math.random();
    setPetals((p) => [...p, { id, x: (Math.random() - 0.5) * 80 }]);
    setTimeout(() => setPetals((p) => p.filter((x) => x.id !== id)), 1800);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    for (let i = 0; i < 14; i++) setTimeout(tossPetal, i * 50);
    setTimeout(() => setSubmitted(true), 600);
  };

  return (
    <section className="relative min-h-screen overflow-hidden py-32" style={{ background: "linear-gradient(180deg, oklch(0.08 0.04 30) 0%, oklch(0.18 0.08 25) 100%)" }}>
      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <p className="font-display text-xs uppercase tracking-[0.5em] text-gold/70">Bless the Sacred Fire</p>
        <h2 className="mt-4 font-display text-4xl text-gradient-gold md:text-6xl">Will you join us?</h2>
        <p className="mx-auto mt-6 max-w-md font-serif-d text-lg italic text-cream/70">
          Write your name. Toss your petals into the agni. Become part of the blessing.
        </p>

        {/* Fire pit */}
        <div className="relative mx-auto mt-14 h-64 w-64">
          <Embers />
          <div
            className="absolute left-1/2 top-1/2 h-44 w-32 -translate-x-1/2 -translate-y-1/2 animate-flicker"
            style={{
              background:
                "radial-gradient(ellipse at 50% 70%, oklch(0.97 0.18 85), oklch(0.75 0.22 55) 35%, oklch(0.5 0.22 35 / 0.6) 65%, transparent 80%)",
              filter: "blur(2px)",
              borderRadius: "50% 50% 40% 40% / 60% 60% 40% 40%",
              boxShadow: "0 0 100px oklch(0.7 0.22 50 / 0.8)",
            }}
          />
          <div className="absolute bottom-6 left-1/2 h-6 w-44 -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(ellipse, oklch(0.4 0.1 40), oklch(0.18 0.05 30))" }} />

          <AnimatePresence>
            {petals.map((p) => (
              <motion.span
                key={p.id}
                initial={{ y: -120, x: p.x, opacity: 1, scale: 1, rotate: 0 }}
                animate={{ y: 40, opacity: 0, scale: 0.4, rotate: 360 }}
                transition={{ duration: 1.6, ease: "easeIn" }}
                className="absolute left-1/2 top-1/2 h-3 w-4 rounded-full"
                style={{ background: "radial-gradient(ellipse, oklch(0.7 0.22 30), oklch(0.5 0.2 25))" }}
              />
            ))}
          </AnimatePresence>
        </div>

        {!submitted ? (
          <form onSubmit={submit} className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-full border border-gold/30 bg-ink/60 px-6 py-3 text-center font-serif-d text-lg text-cream placeholder:text-cream/40 outline-none transition focus:border-gold focus:shadow-[0_0_30px_oklch(0.78_0.2_70/0.4)]"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={tossPetal}
                className="rounded-full border border-gold/40 px-5 py-2 font-display text-xs uppercase tracking-[0.3em] text-gold transition hover:bg-gold/10"
              >
                Toss a petal
              </button>
              <button
                type="submit"
                className="relative overflow-hidden rounded-full px-7 py-3 font-display text-xs uppercase tracking-[0.3em] text-ink transition hover:scale-105"
                style={{ background: "var(--gradient-gold)", boxShadow: "0 0 30px oklch(0.78 0.2 70 / 0.5)" }}
              >
                Bless &amp; RSVP ✦
              </button>
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10"
          >
            <p className="font-display text-2xl text-gradient-gold">Blessings received, {name}.</p>
            <p className="mt-3 font-serif-d italic text-cream/70">May your love be as eternal as ours. ✦</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
