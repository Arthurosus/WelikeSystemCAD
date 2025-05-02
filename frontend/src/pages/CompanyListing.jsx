// src/pages/CompanyListing.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios          from "axios";
import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import "../styles/companyRegistration.css";   // reaproveita o mesmo layout/css

const CompanyListing = () => {
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [empresas, setEmpresas]             = useState([]);
  const [search, setSearch]                 = useState("");

  /* ------------------------------------------------------------------ */
  /* 1. Carrega empresas do backend                                     */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const { data } = await axios.get("/empresas/");    // ajuste a URL se preciso
        setEmpresas(data);
      } catch (err) {
        console.error("Erro ao buscar empresas:", err);
      }
    };
    fetchEmpresas();
  }, []);

  /* ------------------------------------------------------------------ */
  /* 2. Ordena alfabeticamente e filtra pelo texto digitado             */
  /* ------------------------------------------------------------------ */
  const empresasFiltradas = useMemo(() => {
    return empresas
        .filter((e) =>
            e.razao_social.toLowerCase().includes(search.toLowerCase()) ||
            e.nome_fantasia?.toLowerCase().includes(search.toLowerCase()) ||
            e.cnpj?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => a.razao_social.localeCompare(b.razao_social));
  }, [empresas, search]);

  /* ------------------------------------------------------------------ */
  /* 3. JSX                                                             */
  /* ------------------------------------------------------------------ */
  return (
      <div className="main-layout">
        <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />

        <div className="content">
          {/* faixa azul com botões fixos */}
          <HeaderActions categoria="empresas" />
          <div className="header-bar" />

          <div className="registration-container">
            <div className="form-box" style={{ width: "100%", maxWidth: "1100px" }}>
              <div className="form-header">
                <h2>Empresas Cadastradas</h2>
              </div>

              {/* ---------------- Barra de pesquisa ---------------- */}
              <div style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    className="input"
                    placeholder="Pesquisar por razão social, nome fantasia ou CNPJ…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* ---------------- Tabela de resultados ------------- */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                  <tr style={{ background: "#eaf3fc" }}>
                    <th style={th}>Razão Social</th>
                    <th style={th}>Nome Fantasia</th>
                    <th style={th}>CNPJ</th>
                    <th style={th}>Estado</th>
                    <th style={th}>Cidade</th>
                  </tr>
                  </thead>
                  <tbody>
                  {empresasFiltradas.map((emp) => (
                      <tr key={emp.id}>
                        <td style={td}>{emp.razao_social}</td>
                        <td style={td}>{emp.nome_fantasia}</td>
                        <td style={td}>{emp.cnpj}</td>
                        <td style={td}>{emp.endereco?.estado ?? "-"}</td>
                        <td style={td}>{emp.endereco?.cidade ?? "-"}</td>
                      </tr>
                  ))}

                  {empresasFiltradas.length === 0 && (
                      <tr>
                        <td style={td} colSpan={5}>
                          Nenhuma empresa encontrada
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

/* pequenas regras inline para células */
const th = {
  padding: "10px",
  textAlign: "left",
  fontWeight: 600,
  borderBottom: "2px solid #c9e2ff",
};

const td = {
  padding: "8px 10px",
  borderBottom: "1px solid #e0e0e0",
  fontSize: "0.95rem",
};

export default CompanyListing;
