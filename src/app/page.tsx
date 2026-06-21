import { Navbar } from "@/components/layout/Navbar";
import { MainSection } from "@/components/layout/MainSection";
import { StickyHeroBackground } from "@/components/layout/StickyHeroBackground";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="relative">
        <StickyHeroBackground />
        <div className="relative z-10 -mt-[100dvh]">
          <Hero />
          <Features />
        </div>
      </div>
      <MainSection>
        <HowItWorks />
        <Pricing />
        <CTA />
        <Footer />
      </MainSection>
    </>
  );
}
