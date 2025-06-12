import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HeaderActions from "../components/HeaderActions";
import CompanyForm from "../components/CompanyForm";
import CompanyService from "../services/companyService";

export default function CompanyRegistration() {
    const [cadastroAberto, setCadastroAberto] = useState(false);
    const navigate = useNavigate();

    const handleCreate = async (payload) => {
        await CompanyService.create(payload);
        navigate("/empresas");
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
