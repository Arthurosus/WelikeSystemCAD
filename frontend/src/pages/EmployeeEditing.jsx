// ────────────────────────────────────────────────────────────────
// src/pages/EmployeeEditing.jsx
// ────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { useParams }                  from "react-router-dom";
import axios                          from "axios";

import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import EmployeeForm   from "../components/EmployeeForm";

import "../styles/companyRegistration.css";

/* mesma lista simples – ou busque do back‑end */
const CARGOS_PADRAO = ["Instrutor", "Recepção", "Gerente"];

export default function EmployeeEditing() {
    const { id } = useParams();                 // /editar-funcionario/:id
    const [cadastroAberto, setCadastroAberto] = useState(false);
    const [funcionario, setFuncionario]       = useState(null);

    /* carrega (ou mocka) dados do funcionário */
    useEffect(() => {
        (async () => {
            // ── MOCK: dados fixos ─────────────────────────────────────
            setFuncionario({
                id,
                codEmpresa: "EMP002",
                status: "Ativo",
                dtAdmissao: "2024-01-15",
                dtAfastamento: "",
                observacao: "Funcionário destaque do mês",
                cargo: "Instrutor",
                ativo: true,
            });

            /* // integração real:
            const { data } = await axios.get(`http://127.0.0.1:8000/funcionarios/${id}`);
            setFuncionario(data);
            */
        })();
    }, [id]);

    const handleUpdate = async (data) => {
        console.log("SALVAR (mock):", data);
        /* // integração real:
        await axios.put(`http://127.0.0.1:8000/funcionarios/${id}`, data);
        */
        alert("Alterações salvas (mock)!");
    };

    if (!funcionario) return null; // ou coloque um spinner

    return (
        <div className="main-layout">
            <Sidebar
                cadastroAberto={cadastroAberto}
                setCadastroAberto={setCadastroAberto}
            />

            <div className="content">
                <HeaderActions categoria="funcionarios" />
                <div className="header-bar" />

                <div className="registration-container">
                    <EmployeeForm
                        mode="edit"
                        initialData={funcionario}
                        cargos={CARGOS_PADRAO}
                        onSubmit={handleUpdate}
                    />
                </div>
            </div>
        </div>
    );
}
