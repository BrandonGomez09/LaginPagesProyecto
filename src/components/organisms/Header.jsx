import React from "react";
import "../../styles/components.css";
import logo from "../../assets/images/logo.png";

function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="logo-section">
          <img src={logo} alt="Bienestar Integral logo" className="logo" />
          <h2 className="logo-text">Bienestar Integral</h2>
        </div>
        {/* La navegación se elimina para enfocar la conversión */}
      </div>
    </header>
  );
}

export default Header;