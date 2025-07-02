import React, { useState } from "react";
import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import CompanyForm    from "../components/CompanyForm";
import CompanyService from "../services/companyService";
import { WizardProvider } from "../contexts/WizardContext";

export default function CompanyRegistration() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [alert, setAlert] = useState({ type:"", msg:"" });

    const handleSend = async (payload) => {
        try {
            await CompanyService.createCompany(payload);
            setAlert({ type:"ok", msg:"Empresa cadastrada!" });
        } catch (e) {
            const msg =
                e.response?.data?.detail?.[0]?.msg ||
                e.response?.data?.detail           ||
                "Erro ao cadastrar.";
            setAlert({ type:"err", msg });
        }
    };

    return (
        <WizardProvider>
            <div className="main-layout">
                <Sidebar cadastroAberto={sidebarOpen}
                         setCadastroAberto={setSidebarOpen}/>
                <div className="content">
                    <HeaderActions categoria="empresas"/>
                    <div className="header-bar"/>

                    <div className="registration-container">
                        {alert.msg && (
                            <p className={alert.type==="ok" ? "success-message" : "error-message"}>
                                {alert.msg}
                            </p>
                        )}
                        <CompanyForm mode="create" onFinish={handleSend}/>
                    </div>
                </div>
            </div>
        </WizardProvider>
    );
}
