import React from "react";
import "../../styles/components.css";
// 1. Importa los iconos necesarios
import { FaSearchLocation, FaUserPlus, FaHandsHelping } from "react-icons/fa";

function HowItWorks() {
  // 2. Añade los iconos a la data de los pasos
  const steps = [
    {
      id: 1,
      icon: <FaSearchLocation className="how-card-icon" />,
      title: "1. Encuentra una cocina",
      desc: "Explora diferentes cocinas comunitarias cercanas y conoce sus necesidades.",
    },
    {
      id: 2,
      icon: <FaUserPlus className="how-card-icon" />,
      title: "2. Inscríbete como voluntario",
      desc: "Regístrate según tus habilidades y colabora en actividades que te apasionen.",
    },
    {
      id: 3,
      icon: <FaHandsHelping className="how-card-icon" />,
      title: "3. Apoya y comparte",
      desc: "Participa en eventos, realiza donaciones o ayuda en la organización.",
    },
  ];

  return (
    <section className="section how">
      <div className="container">
        <h2>¿Cómo funciona?</h2>
        <div className="how-steps">
          {steps.map((step) => (
            <div key={step.id} className="how-card">
              {/* 3. Renderiza el icono */}
              {step.icon}
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;