import { useEffect, useState } from "react";
import { Sparkles, Snowflake } from "lucide-react";

const KEY = "wedding:reduced-motion";

export function getReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(KEY);
  if (stored === "1") return true;
  if (stored === "0") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function ReducedMotionToggle() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const v = getReducedMotion();
    setReduced(v);
    document.documentElement.dataset.reducedMotion = v ? "true" : "false";
  }, []);
  const toggle = () => {
    const v = !reduced;
    setReduced(v);
    localStorage.setItem(KEY, v ? "1" : "0");
    document.documentElement.dataset.reducedMotion = v ? "true" : "false";
    window.dispatchEvent(new CustomEvent("wedding:reduced-motion", { detail: v }));
  };
  return (
    <button
      onClick={toggle}
      aria-label={reduced ? "Enable full motion" : "Reduce motion"}
      aria-pressed={reduced}
      className="glass fixed left-4 top-[68px] z-[120] flex h-11 items-center gap-2 rounded-full px-4 font-display text-[10px] uppercase tracking-[0.3em] text-gold transition hover:scale-105 md:left-6 md:top-[76px]"
      style={{ boxShadow: "0 0 24px oklch(0.7 0.18 70 / 0.25)" }}
    >
      {reduced ? <Snowflake className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      <span className="hidden sm:inline">{reduced ? "Calm" : "Cinematic"}</span>
    </button>
  );
}
