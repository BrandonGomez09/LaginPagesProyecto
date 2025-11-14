// src/components/organisms/Footer.jsx
import React from "react";
import "../../styles/components.css";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
// 1. Importa Link para la navegación
import { Link } from "react-router-dom";

// 2. Ya NO necesitamos 'onOpenModal'
function Footer() { 
return (
<footer className="footer">
<div className="container footer-content">
<div className="footer-links-legal" style={{ marginBottom: '1rem' }}>

{/* El enlace de Privacidad ya debería estar así (apuntando a /privacidad) */}
<Link to="/privacidad" className="legal-link">
  Política de Privacidad
</Link>

{/* 3. CAMBIO: Convertimos el 'a' en un 'Link' a la nueva ruta */}
<Link to="/terminos" className="legal-link">
  Términos y Condiciones
</Link>

</div>
<p>© 2025 Bienestar Integral. Todos los derechos reservados.</p>
        <div className="footer-links">
          <a
            href="#"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="social-icon" />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="social-icon" />
          </a>
          <a
            href="#"
            aria-label="Twitter / X"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter className="social-icon" />
          </a>
        </div>
</div>
</footer>
);
}
export default Footer;