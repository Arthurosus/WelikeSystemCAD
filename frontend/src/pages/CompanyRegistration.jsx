import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import HeaderActions from "../components/HeaderActions";
import CompanyForm from "../components/CompanyForm";
import axios from "axios";

export default function CompanyRegistration() {
  const [cadastroAberto, setCadastroAberto] = useState(false);

  const handleCreate = async (data) => {
    // ‑‑ MOCK ‑‑ comente para usar o backend
    console.log("CRIAR (mock):", data);
    /* // real:
    await axios.post("http://127.0.0.1:8000/empresas/", data);
    */
  };

  return (
      <div className="main-layout">
        <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />
        <div className="content">
          <HeaderActions categoria="empresas" />
          <div className="header-bar" />
          <div className="registration-container">
            <CompanyForm mode="create" onSubmit={handleCreate} />
          </div>
        </div>
      </div>
  );
}
