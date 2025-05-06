// src/pages/PersonListing.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios          from "axios";
import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import "../styles/companyRegistration.css";   // reaproveita o mesmo layout/css

const PersonListing = () => {
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [pessoas, setPessoas]               = useState([]);
  const [search, setSearch]                 = useState("");

  /* ------------------------------------------------------------------ */
  /* 1. Carrega pessoas do backend                                       */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const fetchPessoas = async () => {
      try {
        const { data } = await axios.get("/pessoas/");    // ajuste a URL se necessário
        setPessoas(data);
      } catch (err) {
        console.error("Erro ao buscar pessoas:", err);
      }
    };
    fetchPessoas();
  }, []);

  /* ------------------------------------------------------------------ */
  /* 2. Ordena alfabeticamente e filtra pelo texto digitado              */
  /* ------------------------------------------------------------------ */
  const pessoasFiltradas = useMemo(() => {
    return pessoas
        .filter((p) =>
            p.nome.toLowerCase().includes(search.toLowerCase()) ||
            p.cpf?.toLowerCase().includes(search.toLowerCase()) ||
            p.email?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [pessoas, search]);

  /* ------------------------------------------------------------------ */
  /* 3. JSX                                                              */
  /* ------------------------------------------------------------------ */
  return (
      <div className="main-layout">
        <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />

        <div className="content">
          {/* faixa azul com botões fixos */}
          <HeaderActions categoria="pessoas" />
          <div className="header-bar" />

          <div className="registration-container">
            <div className="form-box" style={{ width: "100%", maxWidth: "1100px" }}>
              <div className="form-header">
                <h2>Pessoas Cadastradas</h2>
              </div>

              {/* ---------------- Barra de pesquisa ---------------- */}
              <div style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    className="input"
                    placeholder="Pesquisar por nome, CPF ou e‑mail…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* ---------------- Tabela de resultados ------------- */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                  <tr style={{ background: "#eaf3fc" }}>
                    <th style={th}>Nome</th>
                    <th style={th}>CPF</th>
                    <th style={th}>E‑mail</th>
                    <th style={th}>Sexo</th>
                    <th style={th}>Data de Nascimento</th>
                  </tr>
                  </thead>
                  <tbody>
                  {pessoasFiltradas.map((p) => (
                      <tr key={p.id}>
                        <td style={td}>{p.nome}</td>
                        <td style={td}>{p.cpf}</td>
                        <td style={td}>{p.email ?? "-"}</td>
                        <td style={td}>{p.sexo ?? "-"}</td>
                        <td style={td}>{p.dt_nascimento ?? "-"}</td>
                      </tr>
                  ))}

                  {pessoasFiltradas.length === 0 && (
                      <tr>
                        <td style={td} colSpan={5}>
                          Nenhuma pessoa encontrada
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

export default PersonListing;
