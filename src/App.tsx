import { useState } from "react";
import { TempleDoors } from "@/components/wedding/TempleDoors";
import { Hero } from "@/components/wedding/Hero";
import { DestinyThread } from "@/components/wedding/DestinyThread";
import { LoveStory } from "@/components/wedding/LoveStory";
import { Mandap } from "@/components/wedding/Mandap";
import { Venue } from "@/components/wedding/Venue";
import { Rsvp } from "@/components/wedding/Rsvp";
import { Gallery } from "@/components/wedding/Gallery";
import { Blessings } from "@/components/wedding/Blessings";
import { CursorTrail } from "@/components/wedding/Particles";
import { AudioController } from "@/components/wedding/AudioController";
import { ReducedMotionToggle } from "@/components/wedding/ReducedMotion";

/**
 * Single-entry App component for the wedding experience.
 * All sections are composed here. Edit this file to tweak the page.
 */
export default function App() {
  const [entered, setEntered] = useState(false);
  return (
    <main className="relative bg-background text-foreground">
      <TempleDoors onOpen={() => setEntered(true)} />
      <ReducedMotionToggle />
      {entered && (
        <>
          <AudioController />
          <CursorTrail />
          <DestinyThread />
          <Hero />
          <LoveStory />
          <Mandap />
          <Venue />
          <Rsvp />
          <Gallery />
          <Blessings />
        </>
      )}
    </main>
  );
}