import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components.css";
import Button from "../atoms/Button";
import { API_BASE_URL } from "../../api/config"; 

const predefinedImages = [
  { label: 'Imagen de Cocina Interior', value: 'https://storage.googleapis.com/b_bienestar_integral_assets/kitchen_covers/cover_1.jpg' },
  { label: 'Imagen de Voluntarios', value: 'https://storage.googleapis.com/b_bienestar_integral_assets/kitchen_covers/cover_2.jpg' },
  { label: 'Imagen de Fachada', value: 'https://storage.googleapis.com/b_bienestar_integral_assets/kitchen_covers/cover_3.jpg' },
  { label: 'Imagen de Platillo', value: 'https://storage.googleapis.com/b_bienestar_integral_assets/kitchen_covers/cover_4.jpg' },
];

const placeholderText = "Selecciona una imagen de portada (Opcional)";

// Expresiones regulares
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const postalCodeRegex = /^\d{5}$/;
const nameRegex = /^[A-Za-z\sÁÉÍÓÚáéíóúñÑ]+$/; 

function KitchenRegistrationForm() {
  const navigate = useNavigate();
  
  // Estados
  const [selectedState, setSelectedState] = useState("");
  const [statesList, setStatesList] = useState([]);
  const [municipalitiesList, setMunicipalitiesList] = useState([]);
  
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [isImageDropdownOpen, setIsImageDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // 1. Cargar Estados
  useEffect(() => {
    const fetchStates = async () => {
      setIsLoadingStates(true);
      try {
        const response = await fetch(`${API_BASE_URL}/states?limit=100`);
        if (response.ok) {
          const data = await response.json();
          setStatesList(data.data || []);
        } else {
          console.error("Error al cargar estados:", response.status);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setIsLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  // 2. Cargar Municipios al cambiar Estado
  const handleStateChange = async (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    setMunicipalitiesList([]); 
    
    if (stateId) {
      setIsLoadingMunicipalities(true);
      try {
        const response = await fetch(`${API_BASE_URL}/states/${stateId}/municipalities?limit=500`);
        if (response.ok) {
          const data = await response.json();
          setMunicipalitiesList(data.data || []);
        } else {
          console.error("Error al cargar municipios:", response.status);
        }
      } catch (error) { 
        console.error("Error de conexión:", error);
      } finally { 
        setIsLoadingMunicipalities(false); 
      }
    }
  };

  // 3. Validación
  const validateForm = (data) => {
    const newErrors = {};
    if (!data.names || !nameRegex.test(data.names)) newErrors.names = "Nombre inválido (solo letras).";
    if (!data.firstLastName || !nameRegex.test(data.firstLastName)) newErrors.firstLastName = "Apellido inválido.";
    if (!data.secondLastName || !nameRegex.test(data.secondLastName)) {newErrors.secondLastName = "Apellido inválido.";}
    
    if (!data.email || !emailRegex.test(data.email)) newErrors.email = "Correo inválido.";
    if (!data.password || data.password.length < 8) newErrors.password = "Mínimo 8 caracteres.";
    if (!data.phoneNumber || !phoneRegex.test(data.phoneNumber)) newErrors.phoneNumber = "Debe tener 10 dígitos.";

    if (!data.kitchenName) newErrors.kitchenName = "Nombre requerido.";
    if (!data.description) newErrors.description = "Descripción requerida.";
    if (!data.contactPhone || !phoneRegex.test(data.contactPhone)) newErrors.contactPhone = "Debe tener 10 dígitos.";
    if (!data.contactEmail || !emailRegex.test(data.contactEmail)) newErrors.contactEmail = "Email inválido.";

    if (!data.streetAddress) newErrors.streetAddress = "Dirección requerida.";
    if (!data.neighborhood) newErrors.neighborhood = "Barrio requerido.";
    if (!data.postalCode || !postalCodeRegex.test(data.postalCode)) newErrors.postalCode = "C.P. de 5 dígitos.";
    if (!data.stateId) newErrors.stateId = "Selecciona un estado.";
    if (!data.municipalityId) newErrors.municipalityId = "Selecciona un municipio.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 4. Enviar Registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (!validateForm(data)) {
      alert("Por favor corrige los errores antes de enviar.");
      return; 
    }

    setIsSubmitting(true);

    const payload = {
      responsible: {
        names: data.names,
        firstLastName: data.firstLastName,
        secondLastName: data.secondLastName || "", 
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password 
      },
      kitchen: {
        name: data.kitchenName,
        description: data.description,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail
      },
      location: {
        streetAddress: data.streetAddress,
        neighborhood: data.neighborhood,
        postalCode: data.postalCode,
        stateId: parseInt(data.stateId, 10),
        municipalityId: parseInt(data.municipalityId, 10)
      }
    };

    try {
      const response = await fetch(`${API_BASE_URL}/kitchens/request`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("¡Solicitud enviada con éxito! Un administrador revisará tu cocina.");
        navigate('/');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error respuesta:", errorData);
        alert(`Error al registrar: ${errorData.message || "Verifica los datos"}`);
      }
    } catch (error) {
      console.error(error);
      alert("No se pudo conectar al servidor. Intenta más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedImageObj = predefinedImages.find(img => img.value === selectedImageUrl);

  return (
    <div className="registration-container">
      <div className="registration-header">
        <h2>Registra tu Cocina Comunitaria</h2>
        <p>Completa los datos para dar de alta tu espacio.</p>
      </div>
      
      <form className="registration-form" onSubmit={handleSubmit} noValidate>
        
        {/* SECCIÓN 1: RESPONSABLE */}
        <fieldset className="form-section">
          <legend>1. Datos del Responsable</legend>
          <div className="form-grid">
            <div className="input-wrapper">
              <input name="names" type="text" placeholder="Nombres" required className={errors.names ? 'input-error' : ''} />
              {errors.names && <span className="error-message">{errors.names}</span>}
            </div>
            <div className="input-wrapper">
              <input name="firstLastName" type="text" placeholder="Primer Apellido" required className={errors.firstLastName ? 'input-error' : ''} />
              {errors.firstLastName && <span className="error-message">{errors.firstLastName}</span>}
            </div>
            <div className="input-wrapper full-width">
              <input name="secondLastName" type="text" placeholder="Segundo Apellido" required className={errors.secondLastName ? 'input-error' : ''} />
              {errors.secondLastName && <span className="error-message">{errors.secondLastName}</span>}
            </div>
            <div className="input-wrapper full-width">
              <input name="email" type="email" placeholder="Correo Electrónico (Usuario)" required className={errors.email ? 'input-error' : ''} />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="input-wrapper">
              <input name="password" type="password" placeholder="Contraseña" required className={errors.password ? 'input-error' : ''} />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <div className="input-wrapper">
              <input name="phoneNumber" type="tel" placeholder="Teléfono Personal" required className={errors.phoneNumber ? 'input-error' : ''} />
              {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
            </div>
          </div>
        </fieldset>

        {/* SECCIÓN 2: COCINA */}
        <fieldset className="form-section">
          <legend>2. Datos de la Cocina</legend>
          <div className="form-grid">
            <div className="input-wrapper full-width">
              <input name="kitchenName" type="text" placeholder="Nombre de la cocina" required className={errors.kitchenName ? 'input-error' : ''} />
              {errors.kitchenName && <span className="error-message">{errors.kitchenName}</span>}
            </div>
            <div className="input-wrapper full-width">
              <textarea name="description" placeholder="Descripción de la cocina" rows="3" required className={errors.description ? 'input-error' : ''}></textarea>
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
            <div className="input-wrapper">
              <input name="contactPhone" type="tel" placeholder="Teléfono de contacto" required className={errors.contactPhone ? 'input-error' : ''} />
              {errors.contactPhone && <span className="error-message">{errors.contactPhone}</span>}
            </div>
            <div className="input-wrapper">
              <input name="contactEmail" type="email" placeholder="Email de contacto" required className={errors.contactEmail ? 'input-error' : ''} />
              {errors.contactEmail && <span className="error-message">{errors.contactEmail}</span>}
            </div>
            
            {/* SELECTOR DE IMAGEN (Visualmente activo*/}
            <div className="custom-image-select-container full-width">
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

        {/* SECCIÓN 3: UBICACIÓN */}
        <fieldset className="form-section">
          <legend>3. Ubicación</legend>
          <div className="form-grid">
            <div className="input-wrapper full-width">
              <input name="streetAddress" type="text" placeholder="Calle y Número" required className={errors.streetAddress ? 'input-error' : ''} />
              {errors.streetAddress && <span className="error-message">{errors.streetAddress}</span>}
            </div>
            <div className="input-wrapper">
              <input name="neighborhood" type="text" placeholder="Colonia" required className={errors.neighborhood ? 'input-error' : ''} />
              {errors.neighborhood && <span className="error-message">{errors.neighborhood}</span>}
            </div>
            <div className="input-wrapper">
              <select name="stateId" value={selectedState} onChange={handleStateChange} required className={errors.stateId ? 'input-error' : ''}>
                  <option value="">{isLoadingStates ? "Cargando..." : "Selecciona Estado"}</option>
                  {statesList.map(state => (<option key={state.id} value={state.id}>{state.name}</option>))}
              </select>
              {errors.stateId && <span className="error-message">{errors.stateId}</span>}
            </div>
            <div className="input-wrapper">
              <select name="municipalityId" disabled={!selectedState || isLoadingMunicipalities} required className={errors.municipalityId ? 'input-error' : ''}>
                  <option value="">{isLoadingMunicipalities ? "Cargando..." : "Selecciona Municipio"}</option>
                  {municipalitiesList.map(mun => (<option key={mun.id} value={mun.id}>{mun.name}</option>))}
              </select>
              {errors.municipalityId && <span className="error-message">{errors.municipalityId}</span>}
            </div>
            <div className="input-wrapper">
              <input name="postalCode" type="text" placeholder="Código Postal" required className={errors.postalCode ? 'input-error' : ''} />
              {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
            </div>
          </div>
        </fieldset>

        <div className="form-actions">
           <Button 
             text="Cancelar" 
             type="secondary" 
             onClick={() => navigate('/')} 
             disabled={isSubmitting}
             htmlType="button" 
           />
           <button type="submit" className="btn" disabled={isSubmitting}>
             {isSubmitting ? "Enviando..." : "Registrar Solicitud"}
           </button>
        </div>
      </form>
    </div>
  );
}

export default KitchenRegistrationForm;