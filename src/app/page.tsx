import { Navbar } from "@/components/layout/Navbar";
import { MainSection } from "@/components/layout/MainSection";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/sections/Footer";
import { HERO_BACKGROUND } from "@/lib/constants";

export default function LandingPage() {
  return (
    <>
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none sticky top-0 -z-10 h-screen w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${HERO_BACKGROUND}')` }}
        />
        <div className="relative z-10 -mt-[100vh]">
          <Navbar />
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
