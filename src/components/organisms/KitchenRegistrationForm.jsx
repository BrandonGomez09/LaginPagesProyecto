// src/components/organisms/KitchenRegistrationForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components.css";
import Button from "../atoms/Button";

const GATEWAY_URL = 'https://api-gateway.bim2.xyz/api/v1';

const predefinedImages = [
  { label: 'Imagen de Cocina Interior', value: 'https://storage.googleapis.com/b_bienestar_integral_assets/kitchen_covers/cover_1.jpg' },
  { label: 'Imagen de Voluntarios', value: 'https://storage.googleapis.com/b_bienestar_integral_assets/kitchen_covers/cover_2.jpg' },
  { label: 'Imagen de Fachada', value: 'https://storage.googleapis.com/b_bienestar_integral_assets/kitchen_covers/cover_3.jpg' },
  { label: 'Imagen de Platillo', value: 'https://storage.googleapis.com/b_bienestar_integral_assets/kitchen_covers/cover_4.jpg' },
];
const placeholderText = "Selecciona una imagen de portada (Opcional)";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/; 
const postalCodeRegex = /^\d{5}$/;
const nameRegex = /^[A-Za-z\s]+$/;

function KitchenRegistrationForm() {
  const navigate = useNavigate();

  const [selectedState, setSelectedState] = useState("");
  const [statesList, setStatesList] = useState([]);
  const [municipalitiesList, setMunicipalitiesList] = useState([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [isImageDropdownOpen, setIsImageDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchStates = async () => {
      setIsLoadingStates(true);
      try {
        const response = await fetch(`${GATEWAY_URL}/states?limit=100`);
        if (response.ok) {
          const data = await response.json();
          setStatesList(data.data || []);
        }
      } catch (error) {
        console.error("Error cargando estados", error);
      } finally {
        setIsLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  const handleStateChange = async (e) => {
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
        }
      } catch (error) { console.error(error); } 
      finally { setIsLoadingMunicipalities(false); }
    }
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.names || !nameRegex.test(data.names)) newErrors.names = "Nombre inválido (solo letras).";
    if (!data.first_last_name || !nameRegex.test(data.first_last_name)) newErrors.first_last_name = "Apellido inválido.";
    if (data.second_last_name && !nameRegex.test(data.second_last_name)) newErrors.second_last_name = "Apellido inválido.";
    if (!data.email || !emailRegex.test(data.email)) newErrors.email = "Correo inválido.";
    if (!data.password || data.password.length < 8) newErrors.password = "Mínimo 8 caracteres.";
    if (!data.phone_number || !phoneRegex.test(data.phone_number)) newErrors.phone_number = "Debe tener 10 dígitos.";

    if (!data.kitchen_name) newErrors.kitchen_name = "Nombre requerido.";
    if (!data.description) newErrors.description = "Descripción requerida.";
    if (!data.contact_phone || !phoneRegex.test(data.contact_phone)) newErrors.contact_phone = "Debe tener 10 dígitos.";
    if (!data.contact_email || !emailRegex.test(data.contact_email)) newErrors.contact_email = "Email inválido.";

    if (!data.street_address) newErrors.street_address = "Dirección requerida.";
    if (!data.neighborhood) newErrors.neighborhood = "Barrio requerido.";
    if (!data.postal_code || !postalCodeRegex.test(data.postal_code)) newErrors.postal_code = "C.P. de 5 dígitos.";
    if (!data.state_id) newErrors.state_id = "Selecciona un estado.";
    if (!data.municipality_id) newErrors.municipality_id = "Selecciona un municipio.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (!validateForm(data)) {
      alert("Por favor corrige los errores marcados en rojo antes de enviar.");
      const firstError = document.querySelector('.input-error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return; 
    }

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
        stateId: parseInt(data.state_id, 10),
        municipalityId: parseInt(data.municipality_id, 10),
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
        navigate('/'); 
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Error al registrar: ${errorData.message || "Verifica los datos."}`);
      }
    } catch (error) {
      console.error(error);
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
      
      <form className="registration-form" onSubmit={handleSubmit} noValidate>
        
        <fieldset className="form-section">
          <legend>1. Datos del Responsable</legend>
          <div className="form-grid">
            <div className="input-wrapper">
              <input name="names" type="text" placeholder="Nombres" required className={errors.names ? 'input-error' : ''} />
              {errors.names && <span className="error-message">{errors.names}</span>}
            </div>
            <div className="input-wrapper">
              <input name="first_last_name" type="text" placeholder="Primer Apellido" required className={errors.first_last_name ? 'input-error' : ''} />
              {errors.first_last_name && <span className="error-message">{errors.first_last_name}</span>}
            </div>
            <div className="input-wrapper full-width">
              <input name="second_last_name" type="text" placeholder="Segundo Apellido" className={errors.second_last_name ? 'input-error' : ''} />
              {errors.second_last_name && <span className="error-message">{errors.second_last_name}</span>}
            </div>
            <div className="input-wrapper full-width">
              <input name="email" type="email" placeholder="Correo Electrónico" required className={errors.email ? 'input-error' : ''} />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="input-wrapper">
              <input name="password" type="password" placeholder="Contraseña" required className={errors.password ? 'input-error' : ''} />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <div className="input-wrapper">
              <input name="phone_number" type="tel" placeholder="Teléfono (10 dígitos)" required className={errors.phone_number ? 'input-error' : ''} />
              {errors.phone_number && <span className="error-message">{errors.phone_number}</span>}
            </div>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>2. Datos de la Cocina</legend>
          <div className="form-grid">
            <div className="input-wrapper full-width">
              <input name="kitchen_name" type="text" placeholder="Nombre de la cocina" required className={errors.kitchen_name ? 'input-error' : ''} />
              {errors.kitchen_name && <span className="error-message">{errors.kitchen_name}</span>}
            </div>
            <div className="input-wrapper full-width">
              <textarea name="description" placeholder="Pequeña descripción" rows="3" required className={errors.description ? 'input-error' : ''}></textarea>
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
            <div className="input-wrapper">
              <input name="contact_phone" type="tel" placeholder="Teléfono de cocina" required className={errors.contact_phone ? 'input-error' : ''} />
              {errors.contact_phone && <span className="error-message">{errors.contact_phone}</span>}
            </div>
            <div className="input-wrapper">
              <input name="contact_email" type="email" placeholder="Email de cocina" required className={errors.contact_email ? 'input-error' : ''} />
              {errors.contact_email && <span className="error-message">{errors.contact_email}</span>}
            </div>
            
            <div className="custom-image-select-container full-width">
              <input type="hidden" name="imageUrl" value={selectedImageUrl} />
              <div className="custom-select-trigger" onClick={() => setIsImageDropdownOpen(!isImageDropdownOpen)}>
                {selectedImageObj ? (
                  <img src={selectedImageObj.value} alt={selectedImageObj.label} className="trigger-preview-img" />
                ) : <div className="trigger-placeholder-icon"></div>}
                <span className="trigger-label">{selectedImageObj ? selectedImageObj.label : placeholderText}</span>
                <span className={`dropdown-arrow ${isImageDropdownOpen ? 'open' : ''}`}>▼</span>
              </div>
              {isImageDropdownOpen && (
                <ul className="custom-select-options">
                  <li className="custom-select-option" onClick={() => { setSelectedImageUrl(""); setIsImageDropdownOpen(false); }}>
                    <div className="option-placeholder-icon"></div><span>Quitar selección</span>
                  </li>
                  {predefinedImages.map((img) => (
                    <li key={img.label} className={`custom-select-option ${selectedImageUrl === img.value ? 'selected' : ''}`}
                      onClick={() => { setSelectedImageUrl(img.value); setIsImageDropdownOpen(false); }}>
                      <img src={img.value} alt={img.label} className="option-img" /><span>{img.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>3. Ubicación</legend>
          <div className="form-grid">
            <div className="input-wrapper full-width">
              <input name="street_address" type="text" placeholder="Dirección (Calle y Número)" required className={errors.street_address ? 'input-error' : ''} />
              {errors.street_address && <span className="error-message">{errors.street_address}</span>}
            </div>
            <div className="input-wrapper">
              <input name="neighborhood" type="text" placeholder="Colonia/Barrio" required className={errors.neighborhood ? 'input-error' : ''} />
              {errors.neighborhood && <span className="error-message">{errors.neighborhood}</span>}
            </div>
            <div className="input-wrapper">
              <select name="state_id" value={selectedState} onChange={handleStateChange} required className={errors.state_id ? 'input-error' : ''}>
                  <option value="">{isLoadingStates ? "Cargando..." : "Selecciona Estado"}</option>
                  {statesList.map(state => (<option key={state.id} value={state.id}>{state.name}</option>))}
              </select>
              {errors.state_id && <span className="error-message">{errors.state_id}</span>}
            </div>
            <div className="input-wrapper">
              <select name="municipality_id" disabled={!selectedState || isLoadingMunicipalities} required className={errors.municipality_id ? 'input-error' : ''}>
                  <option value="">{isLoadingMunicipalities ? "Cargando..." : "Selecciona Municipio"}</option>
                  {municipalitiesList.map(mun => (<option key={mun.id} value={mun.id}>{mun.name}</option>))}
              </select>
              {errors.municipality_id && <span className="error-message">{errors.municipality_id}</span>}
            </div>
            <div className="input-wrapper">
              <input name="postal_code" type="text" placeholder="C.P." required className={errors.postal_code ? 'input-error' : ''} />
              {errors.postal_code && <span className="error-message">{errors.postal_code}</span>}
            </div>
          </div>
        </fieldset>
        
        <div className="form-actions">
           {/* AQUI PASAMOS htmlType="button" PARA EVITAR QUE SE ENVÍE EL FORMULARIO */}
           <Button 
             text="Volver" 
             type="secondary" 
             onClick={() => navigate('/')} 
             disabled={isSubmitting} 
             htmlType="button" 
           />
           <button type="submit" className="btn primary" disabled={isSubmitting}>
             {isSubmitting ? "Enviando..." : "Registrar mi Cocina"}
           </button>
        </div>
      </form>
    </div>
  );
}

export default KitchenRegistrationForm;   