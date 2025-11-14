import React from "react";
import "../../styles/components.css";
import Button from "../atoms/Button";
// 1. Importa Link
import { Link } from "react-router-dom";

// 2. Ya no necesita la prop 'onNavigateToRegistration'
function CTASection() { 
  return (
    <section className="section cta">
      <div className="container cta-content">
        <h2>Únete a Bienestar Integral</h2>
        <p>
          Sé parte del cambio positivo. Dona, colabora o crea una cocina
          comunitaria para mejorar vidas.
        </p>
        <div className="cta-buttons">
          <a href="#contact">
            <Button text="Unirme como voluntario" />
          </a>
          
          {/* 3. Envuelve el Botón en un Link a "/registro" */}
          <Link to="/registro">
            <Button 
              text="Registrar mi cocina" 
            />
          </Link>
       </div>
      </div>
    </section>
  );
}

export default CTASection;