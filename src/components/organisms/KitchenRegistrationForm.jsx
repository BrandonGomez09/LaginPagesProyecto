// src/components/organisms/KitchenRegistrationForm.jsx

import React, { useState, useEffect } from "react";
import "../../styles/components.css";
import Button from "../atoms/Button";

// 1. Definimos la URL base CORRECTA de tu API Gateway (con /v1)
const API_BASE_URL = 'https://states-municipies.bim2.xyz/api';

function KitchenRegistrationForm({ onBack }) {
  // Estados para manejar los datos del formulario y las listas dinámicas
  const [selectedState, setSelectedState] = useState("");
  const [statesList, setStatesList] = useState([]);            // Lista dinámica de estados
  const [municipalitiesList, setMunicipalitiesList] = useState([]); // Lista dinámica de municipios
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);

  // 2. useEffect: Se ejecuta una vez al cargar el componente para traer los estados
  useEffect(() => {
    const fetchStates = async () => {
      setIsLoadingStates(true);
      try {
        // Petición GET a tu microservicio de estados a través del Gateway
        const response = await fetch(`${API_BASE_URL}/states?limit=100`); // Pedimos límite alto para traer todos
        if (response.ok) {
          const data = await response.json();
          // Nuestra API devuelve paginación { data: [...], totalItems: ... }
          // Así que usamos data.data si existe, o data si es un array directo.
          setStatesList(data.data || []);
        } else {
          console.error("Error al cargar estados");
        }
      } catch (error) {
        console.error("Error de red al cargar estados:", error);
      } finally {
        setIsLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // 3. Función actualizada para cuando el usuario cambia el estado
  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    
    // Limpiamos los municipios anteriores
    setMunicipalitiesList([]);

    if (stateId) {
      setIsLoadingMunicipalities(true);
      try {
        // Petición GET para traer municipios específicos de ese estado
        const response = await fetch(`${API_BASE_URL}/states/${stateId}/municipalities?limit=500`);
        if (response.ok) {
          const data = await response.json();
          setMunicipalitiesList(data.data || []);
        } else {
          console.error("Error al cargar municipios");
        }
      } catch (error) {
        console.error("Error de red al cargar municipios:", error);
      } finally {
        setIsLoadingMunicipalities(false);
      }
    }
  };

  // 4. Función de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      name: data.kitchen_name,
      description: data.description,
      contact_phone: data.contact_phone,
      contact_email: data.contact_email,
      // Convertimos a números los IDs de ubicación
      state_id: parseInt(data.state_id),
      municipality_id: parseInt(data.municipality_id),
      street_address: data.street_address,
      neighborhood: data.neighborhood,
      postal_code: data.postal_code,
      // Datos fijos temporales hasta tener autenticación real en el front
      owner_id: 1, 
    };

    try {
      // NOTA: Asegúrate de que esta ruta '/kitchens' exista en tu Gateway cuando la necesites.
      // Por ahora la dejamos apuntando al Gateway con /v1.
      const response = await fetch(`${API_BASE_URL}/kitchens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("¡Solicitud de registro enviada con éxito!");
        onBack();
      } else {
        // Si el microservicio de kitchens no está listo, esto fallará, es normal por ahora.
        alert("Hubo un error al enviar la solicitud. (Verifica que el microservicio de cocinas esté listo)");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar al servidor.");
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-header">
        <h2>Registra tu Cocina Comunitaria</h2>
        <p>Completa los siguientes datos para dar de alta tu espacio en nuestra comunidad.</p>
      </div>
      
      <form className="registration-form" onSubmit={handleSubmit}>
        {/* SECCIÓN 1: DATOS DEL RESPONSABLE */}
        <fieldset className="form-section">
          <legend>1. Datos del Responsable</legend>
          <input name="names" type="text" placeholder="Nombres" required />
          <input name="first_last_name" type="text" placeholder="Primer Apellido" required />
          <input name="second_last_name" type="text" placeholder="Segundo Apellido" />
          <input name="email" type="email" placeholder="Correo Electrónico" required />
          <input name="password" type="password" placeholder="Contraseña" required />
          <input name="phone_number" type="tel" placeholder="Número de Teléfono" required />
        </fieldset>

        {/* SECCIÓN 2: DATOS DE LA COCINA */}
        <fieldset className="form-section">
          <legend>2. Datos de la Cocina</legend>
          <input name="kitchen_name" type="text" placeholder="Nombre de la cocina" required />
          <textarea name="description" placeholder="Pequeña descripción de la cocina" rows="3" required></textarea>
          <input name="contact_phone" type="tel" placeholder="Teléfono de contacto de la cocina" required />
          <input name="contact_email" type="email" placeholder="Email de contacto de la cocina" required />
        </fieldset>

        {/* SECCIÓN 3: UBICACIÓN (CON DATOS REALES DE LA API) */}
        <fieldset className="form-section">
          <legend>3. Ubicación</legend>
          <input name="street_address" type="text" placeholder="Dirección (Calle y Número)" required />
          <input name="neighborhood" type="text" placeholder="Barrio o Colonia" required />
          
          {/* Dropdown de Estados Dinámico */}
          <select name="state_id" value={selectedState} onChange={handleStateChange} required>
            <option value="" disabled>
              {isLoadingStates ? "Cargando estados..." : "Selecciona un estado"}
            </option>
            {statesList.map(state => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>

          {/* Dropdown de Municipios Dinámico */}
          <select name="municipality_id" disabled={!selectedState || isLoadingMunicipalities} required>
            <option value="" disabled>
              {isLoadingMunicipalities ? "Cargando municipios..." : "Selecciona un municipio"}
            </option>
            {municipalitiesList.map(mun => (
              <option key={mun.id} value={mun.id}>{mun.name}</option>
            ))}
          </select>

          <input name="postal_code" type="text" placeholder="Código Postal" required />
        </fieldset>
        
        <div className="form-actions">
           <Button text="Volver" type="secondary" onClick={onBack} />
           <button type="submit" className="btn primary">
             Registrar mi Cocina
           </button>
        </div>
      </form>
    </div>
  );
}

export default KitchenRegistrationForm;