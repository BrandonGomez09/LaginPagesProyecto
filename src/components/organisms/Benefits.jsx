import React from "react";
import "../../styles/components.css";
import FeatureCard from "../molecules/FeatureCard";
// 1. Importa los iconos
import { FaEye, FaUsers, FaBullseye, FaHandHoldingHeart } from "react-icons/fa";

function Benefits() {
  // 2. Añade los iconos a la data de los beneficios
  const features = [
    {
      icon: <FaEye className="feature-card-icon" />,
      title: "Transparencia",
      desc: "Los recursos y donaciones son gestionados de manera clara y verificable.",
    },
    {
      icon: <FaUsers className="feature-card-icon" />,
      title: "Comunidad",
      desc: "Crea lazos entre personas comprometidas con mejorar su entorno.",
    },
    {
      icon: <FaBullseye className="feature-card-icon" />,
      title: "Impacto Real",
      desc: "Cada acción cuenta: tus aportes llegan a quienes más lo necesitan.",
    },
    {
      icon: <FaHandHoldingHeart className="feature-card-icon" />,
      title: "Solidaridad",
      desc: "Una plataforma que convierte la empatía en acción colectiva.",
    },
  ];

  return (
    <section id="benefits" className="section benefits">
      <div className="container">
        <h2>Beneficios de usar Bienestar Integral</h2>
        <div className="benefits-grid">
          {features.map((f, i) => (
            // 3. Pasa el icono como prop
            <FeatureCard key={i} icon={f.icon} title={f.title} desc={f.desc} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Benefits;