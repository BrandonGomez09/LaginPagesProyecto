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

function LandingPage({ onNavigateToRegistration, onOpenModal  }) { // Recibe la prop
  return (
    <>
      <Header />
      <Hero />
      <About />
      <HowItWorks />
      <Roles />
      <Benefits />
      <CTASection onNavigateToRegistration={onNavigateToRegistration} /> 
      <Contact />
      <Footer onOpenModal={onOpenModal} /> {/* Pasa la prop a Footer */}
    </>
  );
}

export default LandingPage;