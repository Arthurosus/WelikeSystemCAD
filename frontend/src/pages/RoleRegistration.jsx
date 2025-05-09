// ─────────────────────────────────────────────────────────────
// src/pages/RoleRegistration.jsx
// ─────────────────────────────────────────────────────────────
import React, { useState } from "react";
import axios from "axios";

import Sidebar       from "../components/Sidebar";
import HeaderActions from "../components/HeaderActions";
import RoleForm      from "../components/RoleForm";

import "../styles/companyRegistration.css";   // mesmo CSS base

const USE_MOCK = true;   // mude para false quando conectar ao back‑end

/**                CADASTRO DE CARGO (usa RoleForm)                    **/
export default function RoleRegistration() {
  const [cadastroAberto, setCadastroAberto] = useState(false);

  /* callback chamado quando RoleForm conclui */
  const handleCreate = async (data) => {
    if (USE_MOCK) {
      console.log("ENVIAR CARGO (mock):", data);
      alert("Cargo cadastrado (mock)!");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/cargos/", data);
      alert("Cargo cadastrado com sucesso!");
    } catch (err) {
      console.error("Erro ao criar cargo:", err);
      alert("Falha ao cadastrar cargo.");
    }
  };

  return (
      <div className="main-layout">
        <Sidebar
            cadastroAberto={cadastroAberto}
            setCadastroAberto={setCadastroAberto}
        />

        <div className="content">
          {/* barra azul com botões da categoria */}
          <HeaderActions categoria="cargos" />
          <div className="header-bar" />

          {/* formulário */}
          <div className="registration-container">
            <RoleForm mode="create" onSubmit={handleCreate} />
          </div>
        </div>
      </div>
  );
}
