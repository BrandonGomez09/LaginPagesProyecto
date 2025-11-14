import React from "react";
import "../../styles/components.css";
import logo from "../../assets/images/logo.png";
// 1. Importa Link
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        {/* 2. Envuelve el logo y texto en un Link a "/" */}
        <Link to="/" className="logo-section" style={{ textDecoration: 'none' }}>
          <img src={logo} alt="Bienestar Integral logo" className="logo" />
          <h2 className="logo-text">Bienestar Integral</h2>
        </Link>
        {/* La navegación se elimina para enfocar la conversión */}
      </div>
    </header>
  );
}

export default Header;