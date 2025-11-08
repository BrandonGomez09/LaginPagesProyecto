import React from "react";
import "../../styles/components.css";
import Button from "../atoms/Button";
// 1. Importa los iconos del formulario
import { FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";

function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container contact-content">
        <h2>Contáctanos</h2>
        <p>
          ¿Tienes dudas o deseas colaborar con nosotros? Déjanos un mensaje y te
          responderemos lo antes posible.
        </p>
        <form
          className="contact-form"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Gracias por tu mensaje  (simulación)");
          }}
        >
          {/* 2. Añade contenedores e iconos para cada campo */}
          <div className="input-with-icon">
            <FaUser className="input-icon" />
            <input type="text" placeholder="Nombre completo" required />
          </div>
          <div className="input-with-icon">
            <FaEnvelope className="input-icon" />
            <input type="email" placeholder="Correo electrónico" required />
          </div>
          <div className="input-with-icon">
            <FaCommentDots className="input-icon textarea-icon" />
            <textarea placeholder="Tu mensaje" rows="4" required></textarea>
          </div>
          <Button text="Enviar mensaje" />
        </form>
      </div>
    </section>
  );
}

export default Contact;