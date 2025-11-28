// src/feature/landing/pages/LandingPage.tsx

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { LandingNavbar } from "../components/LandingNavbar";
import { HeroSection } from "../components/HeroSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { StatsSection } from "../components/StatsSection";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { PricingSection } from "../components/PricingSection";
import { FAQSection } from "../components/FAQSection";
import { CallToActionSection } from "../components/CallToActionSection";
import { FooterSection } from "../components/FooterSection";

export default function LandingPage() {
  // Inicializar AOS para animaciones on scroll
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false, // Se anima cada vez que haces scroll
      easing: "ease-out-cubic",
      mirror: true, // Se anima al hacer scroll hacia arriba también
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <LandingNavbar />

      {/* Contenido principal */}
      <main>
        {/* Hero con introducción */}
        <div className="max-w-6xl mx-auto px-4">
          <HeroSection />
        </div>

        {/* Características principales */}
        <div className="max-w-6xl mx-auto px-4 pb-10">
          <FeaturesSection />
        </div>

        {/* Estadísticas */}
        <StatsSection />

        {/* Cómo funciona */}
        <HowItWorksSection />

        {/* Testimonios */}
        <TestimonialsSection />

        {/* Planes y precios */}
        <PricingSection />

        {/* Preguntas frecuentes */}
        <FAQSection />

        {/* Call to Action final */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <CallToActionSection />
        </div>
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
