import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HeaderActions from "../components/HeaderActions";
import CompanyForm from "../components/CompanyForm";
import { CompanyService } from "../services/companyService";

export default function CompanyEditing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [empresa, setEmpresa] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await CompanyService.get(id);
      setEmpresa(data);
    })();
  }, [id]);

  const handleUpdate = async (payload) => {
    await CompanyService.update(id, payload);
    navigate("/empresas");
  };

  if (!empresa) return null; // spinner opcional

  return (
      <div className="main-layout">
        <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />
        <div className="content">
          <HeaderActions categoria="empresas" />
          <div className="header-bar" />
          <div className="registration-container">
            <CompanyForm mode="edit" initialData={empresa} onSubmit={handleUpdate} />
          </div>
        </div>
      </div>
  );
}
