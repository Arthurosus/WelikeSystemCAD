/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate }     from "react-router-dom";

import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import CompanyForm    from "../components/CompanyForm";

import CompanyService from "../services/companyService";

export default function CompanyEditing() {
  const { id }                 = useParams();
  const navigate               = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [empresa,      setEmpresa]    = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await CompanyService.getCompany(id);
        setEmpresa(data);
      } catch (err) {
        console.error("Erro ao buscar empresa:", err);
        navigate("/empresas");
      }
    })();
  }, [id, navigate]);

  const handleUpdate = async (payload) => {
    await CompanyService.updateCompany(id, payload);
    navigate("/empresas");
  };

  if (!empresa) return null; /* ou <Spinner/> */

  return (
      <div className="main-layout">
        <Sidebar
            cadastroAberto={sidebarOpen}
            setCadastroAberto={setSidebarOpen}
        />

        <div className="content">
          <HeaderActions categoria="empresas" />
          <div className="header-bar" />

          <div className="registration-container">
            <CompanyForm
                mode="edit"
                initialData={empresa}
                onSubmit={handleUpdate}
            />
          </div>
        </div>
      </div>
  );
}
