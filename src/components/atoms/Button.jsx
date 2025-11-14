// src/components/atoms/Button.jsx
import React from "react";
import "../../styles/components.css";

// Añadimos 'disabled' y 'htmlType' a las propiedades que recibe el componente
function Button({ text, type = "primary", onClick, disabled, htmlType }) {
  return (
    <button 
      // Si no le pasamos htmlType, por defecto será "button" para evitar envíos accidentales
      type={htmlType || "button"} 
      className={`btn ${type}`} 
      onClick={onClick}
      disabled={disabled} // Ahora el botón sí se desactivará visualmente
    >
      {text}
    </button>
  );
}

export default Button;