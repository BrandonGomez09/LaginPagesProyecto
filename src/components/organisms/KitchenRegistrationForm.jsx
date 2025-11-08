// src/components/organisms/KitchenRegistrationForm.jsx

import React, { useState } from "react";
import "../../styles/components.css";
import Button from "../atoms/Button";
import { states, municipalities } from "../../data/locations";

// 1. Definimos la URL de nuestra API
const API_URL = 'http://localhost/api/kitchens'; // (La URL de Nginx)

function KitchenRegistrationForm({ onBack }) {
  const [selectedState, setSelectedState] = useState("");
  
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  // 2. Esta es la nueva función de envío
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // 3. Obtenemos todos los datos del formulario
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // 4. Creamos el "payload" (los datos) que enviaremos a la API
    // Solo incluimos los campos que nuestro microservicio acepta
    const payload = {
      // --- Datos Reales del Formulario (Sección 2) ---
      name: data.kitchen_name,
      description: data.description,
      contact_phone: data.contact_phone,
      contact_email: data.contact_email,

      // --- Datos Fijos (como pediste) ---
      // Estos simulan que otro microservicio nos dio los IDs
      owner_id: 1, 
      location_id: 1,
    };

    try {
      // 5. Hacemos la llamada 'fetch' a nuestro backend
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // ¡Éxito!
        alert("¡Solicitud de registro enviada con éxito!");
        console.log("Datos enviados:", payload);
        onBack(); // Regresamos a la página de inicio
      } else {
        // Error del servidor
        alert("Hubo un error al enviar la solicitud. Intenta más tarde.");
      }
    } catch (error) {
      // Error de red
      console.error("Error de red:", error);
      alert("No se pudo conectar al servidor. Revisa tu conexión.");
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-header">
        <h2>Registra tu Cocina Comunitaria</h2>
        <p>Completa los siguientes datos para dar de alta tu espacio en nuestra comunidad.</p>
      </div>
      
      {/* 6. Conectamos la función handleSubmit al formulario */}
      <form className="registration-form" onSubmit={handleSubmit}>
        
        {/* SECCIÓN 1: DATOS DEL USUARIO (Ignorados por ahora) */}
        <fieldset className="form-section">
          <legend>1. Datos del Responsable</legend>
          <input name="names" type="text" placeholder="Nombres" required />
          <input name="first_last_name" type="text" placeholder="Primer Apellido" required />
          <input name="second_last_name" type="text" placeholder="Segundo Apellido" />
          <input name="email" type="email" placeholder="Correo Electrónico" required />
          <input name="password" type="password" placeholder="Contraseña" required />
          <input name="phone_number" type="tel" placeholder="Número de Teléfono" required />
        </fieldset>

        {/* SECCIÓN 2: DATOS DE LA COCINA (Estos sí se envían) */}
        <fieldset className="form-section">
          <legend>2. Datos de la Cocina</legend>
          <input name="kitchen_name" type="text" placeholder="Nombre de la cocina" required />
          <textarea name="description" placeholder="Pequeña descripción de la cocina" rows="3" required></textarea>
          <input name="contact_phone" type="tel" placeholder="Teléfono de contacto de la cocina" required />
          <input name="contact_email" type="email" placeholder="Email de contacto de la cocina" required />
        </fieldset>

        {/* SECCIÓN 3: DATOS DE LA UBICACIÓN (Ignorados por ahora) */}
        <fieldset className="form-section">
          <legend>3. Ubicación</legend>
          <input name="street_address" type="text" placeholder="Dirección (Calle y Número)" required />
          <input name="neighborhood" type="text" placeholder="Barrio o Colonia" required />
          <select name="state_id" value={selectedState} onChange={handleStateChange} required>
            <option value="" disabled>Selecciona un estado</option>
            {states.map(state => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
          <select name="municipality_id" disabled={!selectedState} required>
            <option value="" disabled>Selecciona un municipio</option>
            {selectedState && municipalities[selectedState]?.map(mun => (
              <option key={mun.id} value={mun.id}>{mun.name}</option>
            ))}
          </select>
          <input name="postal_code" type="text" placeholder="Código Postal" required />
        </fieldset>
        
        <div className="form-actions">
           <Button text="Volver" type="secondary" onClick={onBack} />
           {/* 7. El botón de Registrar ahora es de tipo 'submit' */}
           <button type="submit" className="btn primary">
             Registrar mi Cocina
           </button>
        </div>
      </form>
    </div>
  );
}

export default KitchenRegistrationForm;