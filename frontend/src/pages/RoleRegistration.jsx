import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/companyRegistration.css";

const RoleRegistration = () => {
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [roles, setRoles] = useState([
    "Administrativo financeiro",
    "Coordenador pedagógico",
    "Recepção",
    "Instrutor",
    "Gerente comercial",
    "Consultor comercial",
    "Consultor comercial MEI",
    "Supervisor comercial",
    "Auxiliar de serviços gerais",
    "Desenvolvedor/TI do sistema",
    "Coordenador Regional de Unidades",
    "Coordenador geral de unidade",
    "Diretor executivo",
  ]);


  return (
    <div className="main-layout">
      <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />
      <div className="content">
        <div className="header-bar"></div>
        <div className="registration-container">
          <div className="form-box">
            <h2>Cadastro de Cargos</h2>
            <ul>
              {roles.map((role, index) => (
                <li key={index}>{role}.</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleRegistration;
