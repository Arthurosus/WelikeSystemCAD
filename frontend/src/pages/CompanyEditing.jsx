/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate }     from "react-router-dom";

import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import CompanyForm    from "../components/CompanyForm";

import CompanyService from "../services/companyService";
import { ROUTES }     from "../routes";              // ← NOVO

export default function CompanyEditing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [empresa,      setEmpresa]    = useState(null);
  const [msg,          setMsg]        = useState("");

  /* ─────────── carrega dados uma vez ─────────── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await CompanyService.get(id);   // GET /empresas/:id
        setEmpresa(data);
      } catch (err) {
        console.error("Erro ao buscar empresa:", err);
        navigate(ROUTES.EMP_LIST);                       // fallback
      }
    })();
  }, [id, navigate]);

  /* ─────────── submit edição ─────────── */
  const handleUpdate = async (payload) => {
    try {
      await CompanyService.update(id, payload);          // PUT /empresas/:id
      setMsg("Alterações salvas!");
      setTimeout(() => setMsg(""), 3500);
      /* ▸ se quiser redirecionar, basta descomentar: */
      // navigate(ROUTES.EMP_LIST);
    } catch (err) {
      alert(
          err.response?.data?.detail?.[0]?.msg ||
          err.response?.data?.detail          ||
          "Erro ao salvar."
      );
    }
  };

  if (!empresa) return null;        // pode trocar por um spinner

  return (
      <div className="main-layout">
        {/* ────── MENU LATERAL ────── */}
        <Sidebar
            cadastroAberto={sidebarOpen}
            setCadastroAberto={setSidebarOpen}
        />

        {/* ────── CONTEÚDO ────── */}
        <div className="content">
          <HeaderActions categoria="empresas" />
          <div className="header-bar" />

          <div className="registration-container">
            {msg && <p className="success-message">{msg}</p>}

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
