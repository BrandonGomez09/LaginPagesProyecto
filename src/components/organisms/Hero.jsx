import React from "react";
import "../../styles/components.css";
import Button from "../atoms/Button";
import heroMainImage from "../../assets/images/hero-main-image.png";
// 1. Importa Link
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <h1>Optimiza tu cocina comunitaria y maximiza tu impacto</h1>
          <p>
            Bienestar Integral es la plataforma todo-en-uno que conecta voluntarios, gestiona recursos y transparenta finanzas para fortalecer tu comunidad.
          </p>
          <div className="hero-buttons">
            <a href="#contact">
              <Button text="Unirme como voluntario" />
            </a>
            
            {/* 2. Cambia esto para que sea un Link a "/registro" */}
            <Link to="/registro">
              <Button text="Soy dueño de cocina" type="secondary" />
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroMainImage} alt="Voluntarios colaborando en una cocina comunitaria" />
        </div>
      </div>
    </section>
  );
}

export default Hero;