import { Navbar } from "@/components/layout/Navbar";
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
          className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${HERO_BACKGROUND}')` }}
        />
        <Navbar />
        <Hero />
      </div>
      <main>
        <Features />
        <HowItWorks />
        <Pricing />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
