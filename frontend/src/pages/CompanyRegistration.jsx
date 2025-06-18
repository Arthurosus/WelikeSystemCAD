/* src/pages/CompanyRegistration.jsx */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ---- componentes visuais da sua app ---- */
import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import CompanyForm    from "../components/CompanyForm";

/* ---- serviço de API ---- */
import CompanyService from "../services/companyService";

export default function CompanyRegistration() {
    /* controla a abertura do menu */
    const [cadastroAberto, setCadastroAberto] = useState(false);

    /* feedback interno */
    const [msgOk,  setOk ] = useState("");
    const [msgErr, setErr] = useState("");

    /* navegação após sucesso */
    const navigate = useNavigate();

    /* ---------------------------------------------------------- */
    const handleCreate = async (payload) => {
        setOk("");   setErr("");
        try {
            /* o serviço exporta tanto createCompany quanto create */
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
            /* some em 4 s */
            setTimeout(() => setErr(""), 4000);
        }
    };

    /* ---------------------------------------------------------- */
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

                {/* barra fina azul abaixo do header */}
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
