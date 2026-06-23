import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { MainSection } from "@/components/layout/MainSection";
import { StickyHeroBackground } from "@/components/layout/StickyHeroBackground";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutMission } from "@/components/sections/about/AboutMission";
import { AboutPartners } from "@/components/sections/about/AboutPartners";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "About StrikeRobot — The intelligence layer for physical AI",
  description:
    "StrikeRobot builds the intelligence and infrastructure layer for the next generation of physical AI — giving robots the spatial understanding to act in the real world.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      {/* One page-level sticky hero background (same as agentic): it stays pinned
          at the top behind everything. Sections with their own bg cover it
          (e.g. AboutMission's gradient); transparent sections like AboutPartners
          reveal it as you scroll. */}
      <div className="relative">
        <StickyHeroBackground />
        <div className="relative z-10 -mt-[100dvh]">
          <AboutHero />
          <MainSection transparent>
            <AboutMission />
            <AboutPartners />
            <CTA variant="about" />
            <Footer />
          </MainSection>
        </div>
      </div>
    </>
  );
}
