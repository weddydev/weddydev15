import { motion } from "framer-motion";

const venues = [
  {
    tag: "The Wedding",
    icon: "🔥",
    name: "City Palace, Udaipur",
    date: "14 February 2026  ·  6:00 PM",
    address: "City Palace Complex, Old City, Udaipur, Rajasthan 313001",
    note: "Sacred vows by the lake at sunset, beneath a thousand marigold garlands.",
    map: "https://maps.google.com/?q=City+Palace+Udaipur",
  },
  {
    tag: "The Reception",
    icon: "✨",
    name: "Taj Lake Palace",
    date: "15 February 2026  ·  8:00 PM",
    address: "Pichola, Udaipur, Rajasthan 313001",
    note: "An evening of feasting, music and fireworks above Lake Pichola.",
    map: "https://maps.google.com/?q=Taj+Lake+Palace+Udaipur",
  },
];

export function Venue() {
  return (
    <section
      className="relative min-h-screen overflow-hidden py-24 sm:py-32"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.1 0.04 25) 0%, oklch(0.16 0.07 30) 50%, oklch(0.1 0.04 25) 100%)",
      }}
    >
      {/* Decorative arches */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div
          className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-b-full"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, oklch(0.7 0.2 60 / 0.35), transparent 70%)",
            filter: "blur(30px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6">
        <div className="text-center">
          <p className="font-display text-[10px] uppercase tracking-[0.4em] text-gold/70 sm:text-xs sm:tracking-[0.5em]">
            The Sacred Grounds
          </p>
          <h2 className="mt-3 font-display text-3xl text-gradient-gold sm:mt-4 sm:text-5xl md:text-6xl">
            Where We Become One
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-serif-d text-base italic text-cream/70 sm:text-lg">
            Two evenings, two palaces, one love — set against the timeless waters of Udaipur.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:mt-16 sm:gap-8 md:grid-cols-2">
          {venues.map((v, i) => (
            <motion.article
              key={v.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8"
            >
              {/* Top arch ornament */}
              <div
                className="pointer-events-none absolute -top-12 left-1/2 h-24 w-48 -translate-x-1/2 rounded-b-full"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 100%, oklch(0.78 0.2 70 / 0.55), transparent 70%)",
                  filter: "blur(20px)",
                }}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-[10px] uppercase tracking-[0.45em] text-gold/80 sm:text-xs sm:tracking-[0.5em]">
                    {v.tag}
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-gradient-gold sm:text-3xl md:text-4xl">
                    {v.name}
                  </h3>
                </div>
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl sm:h-14 sm:w-14 sm:text-3xl"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 30%, oklch(0.95 0.16 85 / 0.25), oklch(0.4 0.13 35 / 0.4))",
                    boxShadow: "0 0 24px oklch(0.78 0.2 70 / 0.35)",
                    border: "1px solid oklch(0.85 0.18 80 / 0.4)",
                  }}
                >
                  {v.icon}
                </span>
              </div>

              <div className="my-5 flex items-center gap-3 sm:my-6">
                <span className="h-px flex-1 bg-gold/40" />
                <span className="font-serif-d text-sm italic text-gold/80 sm:text-base">{v.date}</span>
                <span className="h-px flex-1 bg-gold/40" />
              </div>

              <p className="font-serif-d text-base italic leading-relaxed text-cream/80 sm:text-lg">
                {v.note}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-cream/60 sm:text-base">
                {v.address}
              </p>

              <a
                href={v.map}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-[10px] uppercase tracking-[0.3em] text-ink transition hover:scale-105 sm:text-xs sm:tracking-[0.4em]"
                style={{
                  background: "var(--gradient-gold)",
                  boxShadow: "0 8px 24px oklch(0.5 0.18 50 / 0.4)",
                }}
              >
                <span>View on Map</span>
                <span aria-hidden>↗</span>
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
