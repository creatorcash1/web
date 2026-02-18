//  Landing Page 
// Assembles all sections: Navbar  Hero  Courses  Demo  Live Offer 
// Testimonials  FAQ  Footer
// 

import Navbar              from "@/components/Navbar";
import Footer              from "@/components/Footer";
import HeroSection         from "@/sections/HeroSection";
import CoursesSection      from "@/sections/CoursesSection";
import DemoSection         from "@/sections/DemoSection";
import LiveOfferSection    from "@/sections/LiveOfferSection";
import TestimonialsSection from "@/sections/TestimonialsSection";
import FAQSection          from "@/sections/FAQSection";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <CoursesSection />
        <DemoSection />
        <LiveOfferSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
