import React, { useState } from "react";
import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import CompanyForm    from "../components/CompanyForm";
import CompanyService from "../services/companyService";

export default function CompanyRegistration() {
    const [cadastroAberto, setCadastroAberto] = useState(false);
    const [msgOk,  setOk ] = useState("");
    const [msgErr, setErr] = useState("");

    /* ------------- submit --------------- */
    const handleCreate = async (payload) => {
        setOk(""); setErr("");
        try {
            await CompanyService.create(payload);
            setOk("Empresa cadastrada com sucesso!");
            // NÃO há navegação – o usuário permanece no formulário.
            setTimeout(() => setOk(""), 4000);
        } catch (e) {
            const msg =
                e.response?.data?.detail?.[0]?.msg ||
                e.response?.data?.detail ||
                "Erro ao cadastrar.";
            setErr(msg);
            setTimeout(() => setErr(""), 4000);
        }
    };

    return (
        <div className="main-layout">
            <Sidebar
                cadastroAberto={cadastroAberto}
                setCadastroAberto={setCadastroAberto}
            />

            <div className="content">
                <HeaderActions categoria="empresas" />
                <div className="header-bar" />

                <div className="registration-container">
                    {msgOk  && <p className="success-message">{msgOk}</p>}
                    {msgErr && <p className="error-message">{msgErr}</p>}

                    <CompanyForm mode="create" onSubmit={handleCreate} />
                </div>
            </div>
        </div>
    );
}
