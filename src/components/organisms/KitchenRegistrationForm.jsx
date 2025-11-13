// src/components/organisms/KitchenRegistrationForm.jsx
import React, { useState, useEffect } from "react";
import "../../styles/components.css";
import Button from "../atoms/Button";

// 1. URL base GENÉRICA del Gateway
const GATEWAY_URL = 'https://api-gateway.bim2.xyz/api/v1';

// Define las imágenes predefinidas.
const predefinedImages = [
  { label: 'Imagen de Cocina Interior', value: 'https://storage.googleapis.com/b_bienestar_integral_assets/kitchen_covers/cover_1.jpg' },
  { label: 'Imagen de Voluntarios', value: 'https://storage.googleapis.com/b_bienestar_integral_assets/kitchen_covers/cover_2.jpg' },
  { label: 'Imagen de Fachada', value: 'https://storage.googleapis.com/b_bienestar_integral_assets/kitchen_covers/cover_3.jpg' },
  { label: 'Imagen de Platillo', value: 'https://storage.googleapis.com/b_bienestar_integral_assets/kitchen_covers/cover_4.jpg' },
];

const placeholderText = "Selecciona una imagen de portada (Opcional)";

// --- (NUEVO) Expresiones regulares para validación ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/; // Asume 10 dígitos para México
const postalCodeRegex = /^\d{5}$/; // Asume 5 dígitos para México
const nameRegex = /^[A-Za-z\s]+$/; // Solo letras y espacios

function KitchenRegistrationForm({ onBack }) {
  // Estados
  const [selectedState, setSelectedState] = useState("");
  const [statesList, setStatesList] = useState([]);
  const [municipalitiesList, setMunicipalitiesList] = useState([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [isImageDropdownOpen, setIsImageDropdownOpen] = useState(false);

  // --- (NUEVO) Estado para los errores de validación ---
  const [errors, setErrors] = useState({});

  // Cargar estados
  useEffect(() => {
    // (Tu código de useEffect para fetchStates sigue aquí, no cambia)
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

  // Cargar municipios
  const handleStateChange = async (e) => {
    // (Tu código de handleStateChange sigue aquí, no cambia)
    const stateId = e.target.value;
    setSelectedState(stateId);
    setMunicipalitiesList([]);

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

  // --- (NUEVO) Función de validación ---
  const validateForm = (data) => {
    const newErrors = {};

    // 1. Datos del Responsable
    if (!data.names || !nameRegex.test(data.names)) {
      newErrors.names = "Nombre inválido (solo letras).";
    }
    if (!data.first_last_name || !nameRegex.test(data.first_last_name)) {
      newErrors.first_last_name = "Apellido inválido (solo letras).";
    }
    if (data.second_last_name && !nameRegex.test(data.second_last_name)) {
      newErrors.second_last_name = "Apellido inválido (solo letras).";
    }
    if (!data.email || !emailRegex.test(data.email)) {
      newErrors.email = "Formato de correo inválido.";
    }
    if (!data.password || data.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!data.phone_number || !phoneRegex.test(data.phone_number)) {
      newErrors.phone_number = "Teléfono inválido (debe tener 10 dígitos).";
    }

    // 2. Datos de la Cocina
    if (!data.kitchen_name) {
      newErrors.kitchen_name = "El nombre de la cocina es requerido.";
    }
    if (!data.description) {
      newErrors.description = "La descripción es requerida.";
    }
    if (!data.contact_phone || !phoneRegex.test(data.contact_phone)) {
      newErrors.contact_phone = "Teléfono de contacto inválido (10 dígitos).";
    }
    if (!data.contact_email || !emailRegex.test(data.contact_email)) {
      newErrors.contact_email = "Email de contacto inválido.";
    }

    // 3. Ubicación
    if (!data.street_address) {
      newErrors.street_address = "La dirección es requerida.";
    }
    if (!data.neighborhood) {
      newErrors.neighborhood = "La colonia/barrio es requerida.";
    }
    if (!data.postal_code || !postalCodeRegex.test(data.postal_code)) {
      newErrors.postal_code = "C.P. inválido (debe tener 5 dígitos).";
    }
    if (!data.state_id) {
      newErrors.state_id = "Debes seleccionar un estado.";
    }
    if (!data.municipality_id) {
      newErrors.municipality_id = "Debes seleccionar un municipio.";
    }

    setErrors(newErrors);
    // Devuelve 'true' si no hay errores (objeto newErrors está vacío)
    return Object.keys(newErrors).length === 0;
  };

  // --- (MODIFICADO) Envío del formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // ¡Paso 1: Validar!
    if (!validateForm(data)) {
      console.log("Errores en el formulario, no se puede enviar.", errors);
      return; // Detiene el envío si hay errores
    }

    // Si la validación pasa, continuamos con el envío
    setIsSubmitting(true);

    const payload = {
      user: {
        names: data.names,
        firstLastName: data.first_last_name,
        secondLastName: data.second_last_name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phone_number
      },
      kitchen: {
        name: data.kitchen_name,
        description: data.description,
        contactPhone: data.contact_phone,
        contactEmail: data.contact_email,
        imageUrl: data.imageUrl || null
      },
      location: {
        streetAddress: data.street_address,
        neighborhood: data.neighborhood,
        stateId: data.state_id ? parseInt(data.state_id, 10) : null,
        municipalityId: data.municipality_id ? parseInt(data.municipality_id, 10) : null,
        postalCode: data.postal_code,
      }
    };

    try {
      const response = await fetch(`${GATEWAY_URL}/register/kitchen-owner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const selectedImageObj = predefinedImages.find(img => img.value === selectedImageUrl);

  return (
    <div className="registration-container">
      <div className="registration-header">
        <h2>Registra tu Cocina Comunitaria</h2>
        <p>Completa los siguientes datos para dar de alta tu espacio.</p>
      </div>
      
      {/* --- (MODIFICADO) JSX con mensajes de error --- */}
      <form className="registration-form" onSubmit={handleSubmit}>
        
        <fieldset className="form-section">
          <legend>1. Datos del Responsable</legend>
          <div className="form-row">
            {/* Usamos un 'input-wrapper' para mantener el error junto al input */}
            <div className="input-wrapper">
              <input name="names" type="text" placeholder="Nombres" required className={errors.names ? 'input-error' : ''} />
              {errors.names && <span className="error-message">{errors.names}</span>}
            </div>
            <div className="input-wrapper">
              <input name="first_last_name" type="text" placeholder="Primer Apellido" required className={errors.first_last_name ? 'input-error' : ''} />
              {errors.first_last_name && <span className="error-message">{errors.first_last_name}</span>}
            </div>
          </div>
          <div className="input-wrapper" style={{ gridColumn: '1 / -1' }}>
            <input name="second_last_name" type="text" placeholder="Segundo Apellido" className={errors.second_last_name ? 'input-error' : ''} />
            {errors.second_last_name && <span className="error-message">{errors.second_last_name}</span>}
          </div>
          <div className="input-wrapper" style={{ gridColumn: '1 / -1' }}>
            <input name="email" type="email" placeholder="Correo Electrónico" required className={errors.email ? 'input-error' : ''} />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-row">
            <div className="input-wrapper">
              <input name="password" type="password" placeholder="Contraseña" required className={errors.password ? 'input-error' : ''} />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <div className="input-wrapper">
              <input name="phone_number" type="tel" placeholder="Teléfono" required className={errors.phone_number ? 'input-error' : ''} />
              {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
            </div>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>2. Datos de la Cocina</legend>
          <div className="input-wrapper" style={{ gridColumn: '1 / -1' }}>
            <input name="kitchen_name" type="text" placeholder="Nombre de la cocina" required className={errors.kitchen_name ? 'input-error' : ''} />
            {errors.kitchen_name && <span className="error-message">{errors.kitchen_name}</span>}
          </div>
          <div className="input-wrapper" style={{ gridColumn: '1 / -1' }}>
            <textarea name="description" placeholder="Pequeña descripción" rows="3" required className={errors.description ? 'input-error' : ''}></textarea>
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>
          <div className="form-row">
            <div className="input-wrapper">
              <input name="contact_phone" type="tel" placeholder="Teléfono de contacto" required className={errors.contact_phone ? 'input-error' : ''} />
              {errors.contact_phone && <span className="error-message">{errors.contact_phone}</span>}
            </div>
            <div className="input-wrapper">
              <input name="contact_email" type="email" placeholder="Email de contacto" required className={errors.contact_email ? 'input-error' : ''} />
              {errors.contact_email && <span className="error-message">{errors.contact_email}</span>}
            </div>
          </div>
          
          <div className="custom-image-select-container" style={{ gridColumn: '1 / -1' }}>
            {/* (El código del desplegable de imagen no cambia) */}
            <input type="hidden" name="imageUrl" value={selectedImageUrl} />
            <div className="custom-select-trigger" onClick={() => setIsImageDropdownOpen(!isImageDropdownOpen)}>
              {selectedImageObj ? (
                <img src={selectedImageObj.value} alt={selectedImageObj.label} className="trigger-preview-img" />
              ) : (
                <div className="trigger-placeholder-icon"></div>
              )}
              <span className="trigger-label">
                {selectedImageObj ? selectedImageObj.label : placeholderText}
              </span>
              <span className={`dropdown-arrow ${isImageDropdownOpen ? 'open' : ''}`}>▼</span>
            </div>
            {isImageDropdownOpen && (
              <ul className="custom-select-options">
                <li className="custom-select-option" onClick={() => { setSelectedImageUrl(""); setIsImageDropdownOpen(false); }}>
                  <div className="option-placeholder-icon"></div>
                  <span>Quitar selección</span>
                </li>
                {predefinedImages.map((img) => (
                  <li key={img.label} className={`custom-select-option ${selectedImageUrl === img.value ? 'selected' : ''}`}
                    onClick={() => { setSelectedImageUrl(img.value); setIsImageDropdownOpen(false); }}>
                    <img src={img.value} alt={img.label} className="option-img" />
                    <span>{img.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>3. Ubicación</legend>
          <div className="input-wrapper" style={{ gridColumn: '1 / -1' }}>
            <input name="street_address" type="text" placeholder="Dirección (Calle y Número)" required className={errors.street_address ? 'input-error' : ''} />
            {errors.street_address && <span className="error-message">{errors.street_address}</span>}
          </div>
          <div className="form-row">
            <div className="input-wrapper">
              <input name="neighborhood" type="text" placeholder="Colonia/Barrio" required className={errors.neighborhood ? 'input-error' : ''} />
              {errors.neighborhood && <span className="error-message">{errors.neighborhood}</span>}
            </div>
            <div className="input-wrapper" style={{ flex: '0 0 120px' }}>
              <input name="postal_code" type="text" placeholder="C.P." required className={errors.postal_code ? 'input-error' : ''} style={{ flex: '0 0 120px' }} />
              {errors.postal_code && <span className="error-message">{errors.postal_code}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="input-wrapper">
              <select name="state_id" value={selectedState} onChange={handleStateChange} required className={errors.state_id ? 'input-error' : ''}>
                  <option value="">{isLoadingStates ? "Cargando..." : "Selecciona Estado"}</option>
                  {statesList.map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
              </select>
              {errors.state_id && <span className="error-message">{errors.state_id}</span>}
            </div>
            <div className="input-wrapper">
              <select name="municipality_id" disabled={!selectedState || isLoadingMunicipalities} required className={errors.municipality_id ? 'input-error' : ''}>
                  <option value="">{isLoadingMunicipalities ? "Cargando..." : "Selecciona Municipio"}</option>
                  {municipalitiesList.map(mun => (
                  <option key={mun.id} value={mun.id}>{mun.name}</option>
                  ))}
              </select>
              {errors.municipality_id && <span className="error-message">{errors.municipality_id}</span>}
            </div>
          </div>
        </fieldset>
        
        <div className="form-actions">
           <Button text="Volver" type="secondary" onClick={onBack} disabled={isSubmitting} />
           <button type="submit" className="btn primary" disabled={isSubmitting}>
             {isSubmitting ? "Enviendo..." : "Registrar mi Cocina"}
           </button>
        </div>
      </form>
    </div>
  );
}

export default KitchenRegistrationForm;