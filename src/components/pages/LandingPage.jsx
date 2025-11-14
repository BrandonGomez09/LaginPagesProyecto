import React from "react";
import Header from "../organisms/Header";
import Hero from "../organisms/Hero";
import About from "../organisms/About";
import HowItWorks from "../organisms/HowItWorks";
import Roles from "../organisms/Roles";
import Benefits from "../organisms/Benefits";
import CTASection from "../organisms/CTASection";
import Contact from "../organisms/Contact";
import Footer from "../organisms/Footer";

// 1. LIMPIEZA: Se eliminan todas las props de navegación
function LandingPage() { 
  return (
    <>
      {/* Header y Footer ya no se renderizan aquí, 
        se renderizan automáticamente desde 'MainLayout' 
      */}
      <Hero />
      <About />
      <HowItWorks />
      <Roles />
      <Benefits />
      {/* 2. CTASection ya no necesita props */}
      <CTASection /> 
      <Contact />
      {/* 3. Footer ya no se renderiza aquí */}
    </>
  );
}

export default LandingPage;