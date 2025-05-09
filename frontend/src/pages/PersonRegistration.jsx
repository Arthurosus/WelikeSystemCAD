import React, { useState } from "react";
import axios from "axios";

import Sidebar       from "../components/Sidebar";
import HeaderActions from "../components/HeaderActions";
import PersonForm    from "../components/PersonForm";

import "../styles/companyRegistration.css";

/* -------------- página de CADASTRO de pessoa -------------- */
export default function PersonRegistration() {
  const [cadastroAberto, setCadastroAberto] = useState(false);

  /* callback quando o PersonForm terminar */
  const handleCreate = async (data) => {
    console.log("ENVIAR (mock):", data);
    /* // Quando tiver back‑end:
       await axios.post("http://127.0.0.1:8000/pessoas/", data);
    */
    alert("Pessoa cadastrada com sucesso (mock)!");
  };

  return (
      <div className="main-layout">
        <Sidebar
            cadastroAberto={cadastroAberto}
            setCadastroAberto={setCadastroAberto}
        />

        <div className="content">
          <HeaderActions categoria="pessoas" />
          <div className="header-bar" />

          <div className="registration-container">
            {/* initialData=null evita loop; é o default, mas explicitamos */}
            <PersonForm mode="create" initialData={null} onSubmit={handleCreate} />
          </div>
        </div>
      </div>
  );
}
