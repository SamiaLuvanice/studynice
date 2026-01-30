import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TrustSection } from '@/components/landing/TrustSection';
import { FinalCtaSection } from '@/components/landing/FinalCtaSection';
import { Footer } from '@/components/landing/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TrustSection />
        <FinalCtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
