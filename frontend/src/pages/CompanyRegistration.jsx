import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import CompanyForm    from "../components/CompanyForm";

import CompanyService from "../services/companyService";

export default function CompanyRegistration() {
    const [cadastroAberto, setCadastroAberto] = useState(false);

    const [msgOk,  setOk ] = useState("");
    const [msgErr, setErr] = useState("");

    const navigate = useNavigate();

    /* ---------------------------------------------------------- */
    const handleCreate = async (payload) => {
        setOk("");   setErr("");
        try {
            await CompanyService.create(payload);      // 🚀 POST /empresas/
            setOk("Empresa cadastrada com sucesso!");
            /* volta para listagem após 1 s */
            setTimeout(() => navigate("/empresas"), 1000);
        } catch (e) {
            const msg =
                e.response?.data?.detail?.[0]?.msg ||
                e.response?.data?.detail         ||
                "Erro ao cadastrar.";
            setErr(msg);
            setTimeout(() => setErr(""), 4000);
        }
    };

    return (
        <div className="main-layout">
            {/* MENU LATERAL */}
            <Sidebar
                cadastroAberto={cadastroAberto}
                setCadastroAberto={setCadastroAberto}
            />

            {/* CONTEÚDO CENTRAL */}
            <div className="content">
                {/* ações (botões + breadcrumb) */}
                <HeaderActions categoria="empresas" />

                <div className="header-bar" />

                {/* formulário */}
                <div className="registration-container">
                    {msgOk  && <p className="success-message">{msgOk}</p>}
                    {msgErr && <p className="error-message">{msgErr}</p>}

                    <CompanyForm mode="create" onSubmit={handleCreate} />
                </div>
            </div>
        </div>
    );
}
