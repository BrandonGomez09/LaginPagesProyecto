// src/components/organisms/KitchenRegistrationForm.jsx
import React, { useState, useEffect } from "react";
import "../../styles/components.css";
import Button from "../atoms/Button";

// 1. URL base GENÉRICA del Gateway (sin incluir microservicios específicos)
const GATEWAY_URL = 'https://api-gateway.bim2.xyz/api/v1';

function KitchenRegistrationForm({ onBack }) {
  // Estados para manejar los datos y listas dinámicas
  const [selectedState, setSelectedState] = useState("");
  const [statesList, setStatesList] = useState([]);
  const [municipalitiesList, setMunicipalitiesList] = useState([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Nuevo estado para feedback de envío

  // 2. Cargar estados al montar el componente
  useEffect(() => {
    const fetchStates = async () => {
      setIsLoadingStates(true);
      try {
        const response = await fetch(`${GATEWAY_URL}/states?limit=100`);
        if (response.ok) {
          const data = await response.json();
          setStatesList(data.data || []);
        } else {
          console.error("Error al cargar estados:", response.status);
        }
      } catch (error) {
        console.error("Error de red al cargar estados:", error);
      } finally {
        setIsLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  // 3. Manejar cambio de estado para cargar municipios
  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    setMunicipalitiesList([]); // Limpiar lista anterior

    if (stateId) {
      setIsLoadingMunicipalities(true);
      try {
        const response = await fetch(`${GATEWAY_URL}/states/${stateId}/municipalities?limit=500`);
        if (response.ok) {
          const data = await response.json();
          setMunicipalitiesList(data.data || []);
        } else {
          console.error("Error al cargar municipios:", response.status);
        }
      } catch (error) {
        console.error("Error de red al cargar municipios:", error);
      } finally {
        setIsLoadingMunicipalities(false);
      }
    }
  };

  // 4. Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Construcción del payload
    const payload = {
      name: data.kitchen_name,
      description: data.description,
      contact_phone: data.contact_phone,
      contact_email: data.contact_email,
      state_id: data.state_id ? parseInt(data.state_id, 10) : null,
      municipality_id: data.municipality_id ? parseInt(data.municipality_id, 10) : null,
      street_address: data.street_address,
      neighborhood: data.neighborhood,
      postal_code: data.postal_code,
      owner_id: 1, 
    };

    try {
      // Petición POST al servicio de cocinas
      const response = await fetch(`${GATEWAY_URL}/kitchens`, {
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
        const errorData = await response.json().catch(() => ({}));
        alert(`Error al registrar: ${errorData.message || "Verifica los datos o el servicio."}`);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("No se pudo conectar al servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-header">
        <h2>Registra tu Cocina Comunitaria</h2>
        <p>Completa los siguientes datos para dar de alta tu espacio.</p>
      </div>
      
      <form className="registration-form" onSubmit={handleSubmit}>
        {/* SECCIÓN 1: DATOS DEL RESPONSABLE (Visual por ahora) */}
        <fieldset className="form-section">
          <legend>1. Datos del Responsable</legend>
          <div className="form-row">
            <input name="names" type="text" placeholder="Nombres" required />
            <input name="first_last_name" type="text" placeholder="Primer Apellido" required />
          </div>
          <input name="second_last_name" type="text" placeholder="Segundo Apellido" />
          <input name="email" type="email" placeholder="Correo Electrónico" required />
          <div className="form-row">
             <input name="password" type="password" placeholder="Contraseña" required />
             <input name="phone_number" type="tel" placeholder="Teléfono" required />
          </div>
        </fieldset>

        {/* SECCIÓN 2: DATOS DE LA COCINA */}
        <fieldset className="form-section">
          <legend>2. Datos de la Cocina</legend>
          <input name="kitchen_name" type="text" placeholder="Nombre de la cocina" required />
          <textarea name="description" placeholder="Pequeña descripción" rows="3" required></textarea>
          <div className="form-row">
            <input name="contact_phone" type="tel" placeholder="Teléfono de contacto" required />
            <input name="contact_email" type="email" placeholder="Email de contacto" required />
          </div>
        </fieldset>

        {/* SECCIÓN 3: UBICACIÓN */}
        <fieldset className="form-section">
          <legend>3. Ubicación</legend>
          <input name="street_address" type="text" placeholder="Dirección (Calle y Número)" required />
          <div className="form-row">
            <input name="neighborhood" type="text" placeholder="Colonia/Barrio" required />
            <input name="postal_code" type="text" placeholder="C.P." required style={{ flex: '0 0 120px' }} />
          </div>
          
          <div className="form-row">
            <select name="state_id" value={selectedState} onChange={handleStateChange} required>
                <option value="">
                {isLoadingStates ? "Cargando..." : "Selecciona Estado"}
                </option>
                {statesList.map(state => (
                <option key={state.id} value={state.id}>{state.name}</option>
                ))}
            </select>

            <select name="municipality_id" disabled={!selectedState || isLoadingMunicipalities} required>
                <option value="">
                {isLoadingMunicipalities ? "Cargando..." : "Selecciona Municipio"}
                </option>
                {municipalitiesList.map(mun => (
                <option key={mun.id} value={mun.id}>{mun.name}</option>
                ))}
            </select>
          </div>
        </fieldset>
        
        <div className="form-actions">
           <Button text="Volver" type="secondary" onClick={onBack} disabled={isSubmitting} />
           <button type="submit" className="btn primary" disabled={isSubmitting}>
             {isSubmitting ? "Enviando..." : "Registrar mi Cocina"}
           </button>
        </div>
      </form>
    </div>
  );
}

export default KitchenRegistrationForm;