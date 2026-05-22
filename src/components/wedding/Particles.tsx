import { useEffect, useState } from "react";

export function PetalField({ count = 18 }: { count?: number }) {
  const [petals] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      sx: `${Math.random() * 100}vw`,
      dx: `${(Math.random() - 0.5) * 200}px`,
      delay: Math.random() * 8,
      duration: 9 + Math.random() * 10,
      size: 10 + Math.random() * 14,
      hue: Math.random() > 0.5 ? "oklch(0.7 0.2 30)" : "oklch(0.82 0.16 80)",
    })),
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 block rounded-full"
          style={{
            width: p.size,
            height: p.size * 0.55,
            background: `radial-gradient(ellipse at 30% 30%, ${p.hue}, transparent 70%)`,
            // @ts-expect-error css var
            "--sx": p.sx,
            "--dx": p.dx,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
            filter: "blur(0.3px)",
          }}
        />
      ))}
    </div>
  );
}

export function StarField({ count = 80 }: { count?: number }) {
  const [stars] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: 0.5 + Math.random() * 1.8,
      d: Math.random() * 4,
      dur: 2 + Math.random() * 3,
    })),
  );
  return (
    <div className="pointer-events-none absolute inset-0">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-cream animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            animationDelay: `${s.d}s`,
            animationDuration: `${s.dur}s`,
            background: "var(--cream)",
            boxShadow: "0 0 6px var(--gold-soft)",
          }}
        />
      ))}
    </div>
  );
}

export function Embers() {
  const [embers] = useState(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: 40 + Math.random() * 20,
      dx: `${(Math.random() - 0.5) * 80}px`,
      delay: Math.random() * 3,
      dur: 2 + Math.random() * 2.5,
      size: 3 + Math.random() * 4,
    })),
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {embers.map((e) => (
        <span
          key={e.id}
          className="absolute bottom-1/3 rounded-full"
          style={{
            left: `${e.x}%`,
            width: e.size,
            height: e.size,
            background: "radial-gradient(circle, oklch(0.85 0.2 70), oklch(0.6 0.22 35) 60%, transparent)",
            // @ts-expect-error css var
            "--dx": e.dx,
            animation: `ember-rise ${e.dur}s ease-out ${e.delay}s infinite`,
            filter: "blur(0.5px)",
          }}
        />
      ))}
    </div>
  );
}

export function CursorTrail() {
  useEffect(() => {
    const root = document.createElement("div");
    root.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:60;mix-blend-mode:screen;";
    document.body.appendChild(root);
    let last = 0;
    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - last < 35) return;
      last = now;
      const dot = document.createElement("span");
      const size = 6 + Math.random() * 10;
      dot.style.cssText = `position:absolute;left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;border-radius:50%;background:radial-gradient(circle, oklch(0.9 0.18 80 / 0.8), transparent 70%);transform:translate(-50%,-50%);transition:opacity 900ms ease, transform 900ms ease;`;
      root.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.opacity = "0";
        dot.style.transform = `translate(-50%,-50%) translateY(-30px) scale(0.3)`;
      });
      setTimeout(() => dot.remove(), 950);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      root.remove();
    };
  }, []);
  return null;
}
