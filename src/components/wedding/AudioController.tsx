import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Cinematic ambient audio synthesized with the WebAudio API.
 * - A continuous wind bed (filtered pink noise)
 * - A slow temple-bell pad
 * - On-demand bell strikes via window event "wedding:bell"
 * - Scene volume hints via window event "wedding:scene" with detail = name
 */
export function AudioController() {
  const [muted, setMuted] = useState(true); // start muted; user must opt in
  const [armed, setArmed] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const windRef = useRef<GainNode | null>(null);
  const padRef = useRef<GainNode | null>(null);

  // Build the audio graph lazily on first unmute
  const ensureGraph = async () => {
    if (ctxRef.current) return;
    const Ctx =
      (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    const ctx = new Ctx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterRef.current = master;

    // --- Wind: pink-ish noise through low-pass with slow LFO ---
    const buf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < data.length; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + w * 0.04;
      b1 = 0.96 * b1 + w * 0.07;
      b2 = 0.85 * b2 + w * 0.12;
      data[i] = (b0 + b1 + b2) * 0.25;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 600;
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 350;
    lfo.connect(lfoGain).connect(lp.frequency);
    const wind = ctx.createGain();
    wind.gain.value = 0.55;
    noise.connect(lp).connect(wind).connect(master);
    noise.start();
    lfo.start();
    windRef.current = wind;

    // --- Drone pad: stacked sines tuned to a calm raga-ish chord ---
    const padGain = ctx.createGain();
    padGain.gain.value = 0.18;
    padGain.connect(master);
    [110, 165, 220, 330].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.12 / (i + 1);
      o.connect(g).connect(padGain);
      o.start();
      // slow drift
      const dlfo = ctx.createOscillator();
      const dgain = ctx.createGain();
      dlfo.frequency.value = 0.03 + i * 0.02;
      dgain.gain.value = 0.6;
      dlfo.connect(dgain).connect(o.frequency);
      dlfo.start();
    });
    padRef.current = padGain;
  };

  // Strike a temple bell (FM-ish synthesis with long decay)
  const strikeBell = (freq = 520, dur = 4) => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    const partials = [1, 2.0, 2.76, 5.4, 8.93];
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.55, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    g.connect(master);
    partials.forEach((p, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = freq * p;
      const og = ctx.createGain();
      og.gain.value = 0.45 / (i + 1);
      o.connect(og).connect(g);
      o.start(now);
      o.stop(now + dur + 0.1);
    });
  };

  const fadeMaster = (target: number, time = 1.5) => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(target, now + time);
  };

  const toggle = async () => {
    await ensureGraph();
    const ctx = ctxRef.current!;
    if (ctx.state === "suspended") await ctx.resume();
    if (muted) {
      setMuted(false);
      setArmed(true);
      fadeMaster(0.5, 2.2);
      // welcome bell
      setTimeout(() => strikeBell(440, 5), 400);
    } else {
      setMuted(true);
      fadeMaster(0, 0.8);
    }
  };

  // Listen to scene events
  useEffect(() => {
    const onBell = (e: Event) => {
      const detail = (e as CustomEvent).detail as { freq?: number; dur?: number } | undefined;
      strikeBell(detail?.freq ?? 520, detail?.dur ?? 4);
    };
    const onScene = (e: Event) => {
      const name = (e as CustomEvent).detail as string;
      const wind = windRef.current;
      const pad = padRef.current;
      const ctx = ctxRef.current;
      if (!wind || !pad || !ctx) return;
      const now = ctx.currentTime;
      const set = (node: GainNode, v: number) => {
        node.gain.cancelScheduledValues(now);
        node.gain.setValueAtTime(node.gain.value, now);
        node.gain.linearRampToValueAtTime(v, now + 1.4);
      };
      switch (name) {
        case "hero": set(wind, 0.5); set(pad, 0.22); break;
        case "story": set(wind, 0.35); set(pad, 0.28); break;
        case "mandap": set(wind, 0.4); set(pad, 0.32); strikeBell(392, 5); break;
        case "rsvp": set(wind, 0.3); set(pad, 0.3); break;
        case "gallery": set(wind, 0.25); set(pad, 0.3); break;
        case "blessings":
          set(wind, 0.45); set(pad, 0.38);
          [0, 900, 1800].forEach((d, i) => setTimeout(() => strikeBell(440 - i * 30, 6), d));
          break;
      }
    };
    window.addEventListener("wedding:bell", onBell);
    window.addEventListener("wedding:scene", onScene);
    return () => {
      window.removeEventListener("wedding:bell", onBell);
      window.removeEventListener("wedding:scene", onScene);
    };
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "Unmute ambient audio" : "Mute ambient audio"}
      className="glass fixed left-4 top-4 z-[120] flex h-11 items-center gap-2 rounded-full px-4 font-display text-[10px] uppercase tracking-[0.3em] text-gold transition hover:scale-105 md:left-6 md:top-6"
      style={{ boxShadow: "0 0 24px oklch(0.7 0.18 70 / 0.25)" }}
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      <span className="hidden sm:inline">{muted ? (armed ? "Muted" : "Sound on") : "Playing"}</span>
    </button>
  );
}

// Helpers exported for other components
export const dispatchBell = (freq?: number, dur?: number) =>
  window.dispatchEvent(new CustomEvent("wedding:bell", { detail: { freq, dur } }));
export const dispatchScene = (name: string) =>
  window.dispatchEvent(new CustomEvent("wedding:scene", { detail: name }));
