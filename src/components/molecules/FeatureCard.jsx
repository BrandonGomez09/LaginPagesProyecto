import React from "react";
import "../../styles/components.css";
// 1. Modifica las props para aceptar 'icon'
function FeatureCard({ icon, title, desc }) {
return (
<div className="feature-card">
{/* 2. Renderiza el icono */}
{icon}
<h3>{title}</h3>
<p>{desc}</p>
</div>
);
}
export default FeatureCard;