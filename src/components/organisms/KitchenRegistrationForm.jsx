import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components.css";
import Button from "../atoms/Button";
import { API_BASE_URL } from "../../api/config"; 
import { FaCheckCircle } from "react-icons/fa"; 

// Expresiones regulares básicas
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const postalCodeRegex = /^\d{5}$/;
const nameRegex = /^[A-Za-z\sÁÉÍÓÚáéíóúñÑ]+$/; 
const repetitiveRegex = /(.)\1{3,}/;
const hasLettersRegex = /[a-zA-ZñÑáéíóúÁÉÍÓÚ]/;
const addressRegex = /^[a-zA-Z0-9\s#ÁÉÍÓÚáéíóúñÑ]+$/;

function KitchenRegistrationForm() {
  const navigate = useNavigate();
  
  // Estados de Ubicación y Listas
  const [selectedState, setSelectedState] = useState("");
  const [statesList, setStatesList] = useState([]);
  const [municipalitiesList, setMunicipalitiesList] = useState([]);
  
  // Estados para CP y Colonias
  const [postalCode, setPostalCode] = useState("");
  const [coloniasList, setColoniasList] = useState([]);
  const [isLoadingColonias, setIsLoadingColonias] = useState(false);
  
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
        }
      } catch (error) {
        console.error("Error conexión estados:", error);
      } finally {
        setIsLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  // 2. Lógica de Código Postal (Zippopotam.us)
  useEffect(() => {
    if (postalCode.length === 5) {
      const fetchColonias = async () => {
        setIsLoadingColonias(true);
        setColoniasList([]); 
        try {
          const response = await fetch(`https://api.zippopotam.us/mx/${postalCode}`);
          if (response.ok) {
            const data = await response.json();
            if (data.places && data.places.length > 0) {
              const colonias = data.places.map(place => place['place name']);
              setColoniasList(colonias);
            }
          } else {
            console.warn("No se encontraron colonias para este CP");
          }
        } catch (error) {
          console.error("Error consultando CP externo:", error);
        } finally {
          setIsLoadingColonias(false);
        }
      };

      fetchColonias();
    } else {
      setColoniasList([]);
    }
  }, [postalCode]);


  // 3. Cargar Municipios
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
        }
      } catch (error) { 
        console.error("Error conexión municipios:", error);
      } finally { 
        setIsLoadingMunicipalities(false); 
      }
    }
  };

  const isQualityText = (text, minLength = 3) => {
    if (!text) return { valid: false, msg: "Requerido" };
    if (text.length < minLength) return { valid: false, msg: `Mínimo ${minLength} caracteres` };
    if (!hasLettersRegex.test(text)) return { valid: false, msg: "Debe contener letras reales" };
    if (repetitiveRegex.test(text)) return { valid: false, msg: "Texto sospechoso" };
    return { valid: true };
  };

  // 4. Validación del Formulario
  const validateForm = (data) => {
    const newErrors = {};
    
    // Personas
    if (!data.names || !nameRegex.test(data.names)) newErrors.names = "Nombre inválido.";
    if (!data.firstLastName || !nameRegex.test(data.firstLastName)) newErrors.firstLastName = "Apellido inválido.";
    if (!data.secondLastName || !nameRegex.test(data.secondLastName)) newErrors.secondLastName = "Apellido inválido.";
    if (!data.email || !emailRegex.test(data.email)) newErrors.email = "Correo inválido.";
    if (!data.phoneNumber || !phoneRegex.test(data.phoneNumber)) newErrors.phoneNumber = "Debe tener 10 dígitos.";
    if (!data.password || data.password.length < 8) newErrors.password = "Mínimo 8 caracteres.";
    if (data.password !== data.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden.";

    // Cocina
    const nameCheck = isQualityText(data.kitchenName, 5); 
    if (!nameCheck.valid) newErrors.kitchenName = nameCheck.msg; 
    const descCheck = isQualityText(data.description, 15);
    if (!descCheck.valid) newErrors.description = descCheck.msg;

    // Contacto
    if (!data.contactPhone || !phoneRegex.test(data.contactPhone)) newErrors.contactPhone = "Debe tener 10 dígitos.";
    if (!data.contactEmail || !emailRegex.test(data.contactEmail)) newErrors.contactEmail = "Email inválido.";

    // Ubicación
    if (!data.streetAddress) {
      newErrors.streetAddress = "Dirección requerida.";
    } else if (!addressRegex.test(data.streetAddress)) {
      newErrors.streetAddress = "Solo letras, números y '#'. No negativos.";
    }

    if (!data.neighborhood) newErrors.neighborhood = "Barrio requerido.";
    if (!data.postalCode || !postalCodeRegex.test(data.postalCode)) newErrors.postalCode = "C.P. de 5 dígitos.";
    if (!data.stateId) newErrors.stateId = "Selecciona un estado.";
    if (!data.municipalityId) newErrors.municipalityId = "Selecciona un municipio.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 5. Enviar Registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (!validateForm(data)) {
      const firstError = document.querySelector('.input-error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return; 
    }

    setIsSubmitting(true);

    const payload = {
      responsible: {
        names: data.names,
        firstLastName: data.firstLastName,
        secondLastName: data.secondLastName,
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowSuccessMessage(true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Error al registrar: ${errorData.message || "Verifica los datos"}`);
      }
    } catch (error) {
      console.error(error);
      alert("No se pudo conectar al servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessMessage(false);
    navigate('/');
  };

  if (showSuccessMessage) {
    return (
      <div className="registration-container" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <FaCheckCircle style={{ fontSize: '4rem', color: '#28a745', marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>¡Solicitud Enviada!</h2>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
          Tu cocina ha sido registrada correctamente. Un administrador revisará tu información pronto.
        </p>
        <Button text="Volver al Inicio" onClick={handleCloseSuccess} />
      </div>
    );
  }

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
              <input name="phoneNumber" type="tel" placeholder="Teléfono Personal" required className={errors.phoneNumber ? 'input-error' : ''} />
              {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
            </div>
            <div className="input-wrapper">
              <input name="password" type="password" placeholder="Contraseña" required className={errors.password ? 'input-error' : ''} />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            <div className="input-wrapper">
              <input name="confirmPassword" type="password" placeholder="Confirmar Contraseña" required className={errors.confirmPassword ? 'input-error' : ''} />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
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
              <textarea 
                name="description" 
                placeholder="Ej: Cocina comunitaria que brinda apoyo alimentario a niños y adultos mayores..." 
                rows="3" 
                required 
                className={errors.description ? 'input-error' : ''}
              ></textarea>
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
          </div>
        </fieldset>

        {/* SECCIÓN 3: UBICACIÓN */}
        <fieldset className="form-section">
          <legend>3. Ubicación</legend>
          <div className="form-grid">
            
            <div className="input-wrapper full-width">
              <input 
                name="postalCode" 
                type="text" 
                placeholder="Código Postal" 
                maxLength="5"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ''))}
                required 
                className={errors.postalCode ? 'input-error' : ''} 
              />
              {isLoadingColonias && <span style={{fontSize: '0.8rem', color: '#666'}}>Buscando colonias...</span>}
              {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
            </div>

            <div className="input-wrapper full-width">
              {coloniasList.length > 0 ? (
                <select name="neighborhood" required className={errors.neighborhood ? 'input-error' : ''}>
                  <option value="">Selecciona tu Colonia</option>
                  {coloniasList.map((col, idx) => (
                    <option key={idx} value={col}>{col}</option>
                  ))}
                </select>
              ) : (
                <input 
                  name="neighborhood" 
                  type="text" 
                  placeholder={isLoadingColonias ? "Cargando..." : ""}
                  required 
                  className={errors.neighborhood ? 'input-error' : ''} 
                />
              )}
              {errors.neighborhood && <span className="error-message">{errors.neighborhood}</span>}
            </div>

            <div className="input-wrapper full-width">
              <input name="streetAddress" type="text" placeholder="Calle y Número" required className={errors.streetAddress ? 'input-error' : ''} />
              {errors.streetAddress && <span className="error-message">{errors.streetAddress}</span>}
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

          </div>
        </fieldset>

        <div className="form-actions">
           <Button text="Cancelar" type="secondary" onClick={() => navigate('/')} disabled={isSubmitting} htmlType="button" />
           <button type="submit" className="btn" disabled={isSubmitting}>
             {isSubmitting ? "Enviando..." : "Registrar Solicitud"}
           </button>
        </div>
      </form>
    </div>
  );
}

export default KitchenRegistrationForm;