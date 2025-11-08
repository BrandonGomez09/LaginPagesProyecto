import React from "react";
import "../../styles/components.css";
import RoleCard from "../molecules/RoleCard";
// 1. Importa los iconos
import { FaHandsHelping, FaStoreAlt } from "react-icons/fa";

function Roles() {
  // 2. Añade los iconos a la data de los roles
  const roles = [
    {
      icon: <FaHandsHelping className="role-card-icon" />,
      title: "Voluntarios",
      desc: "Pueden unirse a diferentes cocinas, apoyar eventos, donar productos o dinero, y compartir su tiempo y habilidades.",
    },
    {
      icon: <FaStoreAlt className="role-card-icon" />,
      title: "Dueños de Cocina",
      desc: "Administran los recursos de su cocina, crean eventos, asignan tareas y gestionan a los voluntarios inscritos.",
    },
  ];

  return (
    <section id="roles" className="section roles">
      <div className="container">
        <h2>Los dos pilares de nuestra comunidad</h2>
        <div className="roles-grid">
          {roles.map((r, i) => (
            // 3. Pasa el icono como prop
            <RoleCard key={i} icon={r.icon} title={r.title} desc={r.desc} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Roles;