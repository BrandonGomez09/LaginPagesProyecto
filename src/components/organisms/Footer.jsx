import React from "react";
import "../../styles/components.css";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
function Footer({ onOpenModal }) { // Recibe la prop
return (
<footer className="footer">
<div className="container footer-content">
<div className="footer-links-legal" style={{ marginBottom: '1rem' }}>
<a href="#" onClick={(e) => { e.preventDefault(); onOpenModal('privacy'); }} className="legal-link">
Política de Privacidad
</a>
<a href="#" onClick={(e) => { e.preventDefault(); onOpenModal('terms'); }} className="legal-link">
Términos y Condiciones
</a>
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