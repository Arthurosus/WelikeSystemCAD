// ────────────────────────────────────────────────────────────────
// src/pages/EmployeeRegistration.jsx
// ────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import axios                from "axios";

import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import EmployeeForm   from "../components/EmployeeForm";

import "../styles/companyRegistration.css";

/* cargos fixos (mock) – troque por busca ao back‑end se desejar */
const CARGOS_PADRAO = ["Instrutor", "Recepção", "Gerente"];

export default function EmployeeRegistration() {
    const [cadastroAberto, setCadastroAberto] = useState(false);

    /* quando submeter o registro */
    const handleCreate = async (data) => {
        console.log("ENVIAR (mock):", data);
        /* // integração real:
        await axios.post("http://127.0.0.1:8000/funcionarios/", data);
        */
        alert("Funcionário cadastrado (mock)!");
    };

    return (
        <div className="main-layout">
            <Sidebar
                cadastroAberto={cadastroAberto}
                setCadastroAberto={setCadastroAberto}
            />

            <div className="content">
                {/* faixa azul + botões */}
                <HeaderActions categoria="funcionarios" />
                <div className="header-bar" />

                {/* formulário */}
                <div className="registration-container">
                    <EmployeeForm
                        mode="create"
                        cargos={CARGOS_PADRAO}
                        onSubmit={handleCreate}
                    />
                </div>
            </div>
        </div>
    );
}
