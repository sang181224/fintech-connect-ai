import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import EscrowWorkflow from "@/components/landing/EscrowWorkflow";
import BenefitsSection from "@/components/landing/BenefitsSection";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <BenefitsSection />
        <EscrowWorkflow />
        <HowItWorks />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
