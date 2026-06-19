import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { MainSection } from "@/components/layout/MainSection";
import { AgenticHero } from "@/components/sections/agentic/AgenticHero";
import { AgenticLayer } from "@/components/sections/agentic/AgenticLayer";
import { AgenticLoop } from "@/components/sections/agentic/AgenticLoop";
import { AgenticAwareness } from "@/components/sections/agentic/AgenticAwareness";
import { AgenticOEMs } from "@/components/sections/agentic/AgenticOEMs";
import { AgenticCTA } from "@/components/sections/agentic/AgenticCTA";
import { Footer } from "@/components/sections/Footer";
import { HERO_BACKGROUND } from "@/lib/constants";

export const metadata: Metadata = {
  title: "SR Agentic — Ephemeral intelligence for robots",
  description:
    "SR Agentic builds task-shaped spatial understanding on the fly — and adapts the instant the world changes. Task-Conditioned Scene Graph navigation for the real world.",
};

export default function AgenticPage() {
  return (
    <>
      <div className="relative">
        {/* Sticky hero background — spans the WHOLE agentic page (stays pinned
            behind every section as you scroll), so MainSection is transparent. */}
        <div
          aria-hidden
          className="pointer-events-none sticky top-0 -z-10 h-screen w-full"
        >
          <Image
            src={HERO_BACKGROUND}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="relative z-10 -mt-[100vh]">
          <Navbar />
          <AgenticHero />
          <MainSection transparent>
            <AgenticLayer />
            <AgenticLoop />
            <AgenticAwareness />
            <AgenticOEMs />
            <AgenticCTA />
            <Footer />
          </MainSection>
        </div>
      </div>
    </>
  );
}
