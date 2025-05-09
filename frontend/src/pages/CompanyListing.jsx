// ─────────────────────────────────────────────────────────────
// src/pages/CompanyListing.jsx
// ─────────────────────────────────────────────────────────────
import React, { useEffect, useState, useMemo } from "react";
import axios                   from "axios";
import { useNavigate }         from "react-router-dom";

import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import DetailModal    from "../components/DetailModal";
import "../styles/companyRegistration.css";   // css principal

/* —————————————————————————————————— */
/* 1. MOCK opcional                                                       */
/* —————————————————————————————————— */
const MOCK_EMPRESAS = [
  { id: 1, codigo:"EMP001", razao_social:"Empresa Teste LTDA",
    nome_fantasia:"Empresa Teste", cnpj:"12.345.678/0001‑90",
    endereco:{ estado:"SP", cidade:"São Paulo" } },
  { id: 2, codigo:"EMP002", razao_social:"Alpha Serviços S.A.",
    nome_fantasia:"Alpha Serviços", cnpj:"98.765.432/0001‑10",
    endereco:{ estado:"RJ", cidade:"Rio de Janeiro" } },
  { id: 3, codigo:"EMP003", razao_social:"Beta Tecnologia e Sistemas Ltda.",
    nome_fantasia:"Beta Tech", cnpj:"31.987.654/0001‑12",
    endereco:{ estado:"MG", cidade:"Belo Horizonte" } },
  { id: 4, codigo:"EMP004", razao_social:"Gamma Alimentos do Brasil S.A.",
    nome_fantasia:"Gamma Foods", cnpj:"44.222.333/0001‑55",
    endereco:{ estado:"RS", cidade:"Porto Alegre" } },
  { id: 5, codigo:"EMP005", razao_social:"Delta Construções e Engenharia Ltda.",
    nome_fantasia:"Delta Engenharia", cnpj:"55.444.333/0001‑77",
    endereco:{ estado:"BA", cidade:"Salvador" } },
  { id: 6, codigo:"EMP006", razao_social:"Épsilon Moda e Vestuário S.A.",
    nome_fantasia:"Épsilon Fashion", cnpj:"66.555.444/0001‑88",
    endereco:{ estado:"PE", cidade:"Recife" } },
  { id: 7, codigo:"EMP007", razao_social:"Zeta Logística Integrada Ltda.",
    nome_fantasia:"Zeta Log", cnpj:"77.666.555/0001‑99",
    endereco:{ estado:"PR", cidade:"Curitiba" } },
];

const USE_MOCK  = true;               // mude p/ false quando usar o backend
const ADMIN_PWD = "sasa0309";

/* —————————————————————————————————— */
export default function CompanyListing() {
  /* estado geral */
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [empresas, setEmpresas]             = useState([]);
  const [search,   setSearch]               = useState("");

  /* modal de EXCLUSÃO */
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePwd,       setDeletePwd]       = useState("");
  const [targetId,        setTargetId]        = useState(null);

  /* modal de DETALHE */
  const [showDetail, setShowDetail] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  const navigate = useNavigate();

  /* carregar empresas */
  useEffect(() => {
    if (USE_MOCK) { setEmpresas(MOCK_EMPRESAS); return; }
    (async () => {
      try {
        const { data } = await axios.get("/empresas/");
        setEmpresas(data);
      } catch (err) { console.error("Erro ao buscar empresas:", err); }
    })();
  }, []);

  /* filtro + ordenação */
  const empresasFiltradas = useMemo(() =>
          empresas
              .filter(e =>
                  e.razao_social .toLowerCase().includes(search.toLowerCase()) ||
                  e.nome_fantasia?.toLowerCase().includes(search.toLowerCase()) ||
                  e.cnpj         ?.toLowerCase().includes(search.toLowerCase())
              )
              .sort((a,b)=>a.razao_social.localeCompare(b.razao_social)),
      [empresas, search]
  );

  /* handlers */
  const askDelete = (id) => { setTargetId(id); setDeletePwd(""); setShowDeleteModal(true); };

  const confirmDelete = async () => {
    if (deletePwd !== ADMIN_PWD) { alert("Senha incorreta!"); return; }
    if (!targetId) return;
    try {
      if (!USE_MOCK) await axios.delete(`/empresas/${targetId}`);
      setEmpresas(prev => prev.filter(e => e.id !== targetId));
    } catch (err) {
      console.error("Falha ao excluir:", err);
      alert("Erro ao excluir empresa.");
    }
    setShowDeleteModal(false);
  };

  const handleEdit  = id  => navigate(`/editar-empresa/${id}`);
  const handleView  = row => { setDetailItem(row); setShowDetail(true); };

  /* ——— JSX ——— */
  return (
      <div className="main-layout">
        <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />

        <div className="content">
          <HeaderActions categoria="empresas" />
          <div className="header-bar" />

          <div className="registration-container">
            <div className="form-box" style={{ maxWidth: 1100, width: "100%" }}>
              <div className="form-header"><h2>Empresas Cadastradas</h2></div>

              <input
                  className="input"
                  style={{ margin: "0 0 1rem 0" }}
                  placeholder="Pesquisar por razão social, nome fantasia ou CNPJ…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                  <tr style={{ background: "#eaf3fc" }}>
                    <th style={th}>Razão Social</th>
                    <th style={th}>Nome Fantasia</th>
                    <th style={th}>CNPJ</th>
                    <th style={th}>Estado</th>
                    <th style={th}>Cidade</th>
                    <th style={thCenter}>Ações</th>
                  </tr>
                  </thead>
                  <tbody>
                  {empresasFiltradas.map(emp => (
                      <tr key={emp.id}>
                        <td style={td}>{emp.razao_social}</td>
                        <td style={td}>{emp.nome_fantasia}</td>
                        <td style={td}>{emp.cnpj}</td>
                        <td style={td}>{emp.endereco?.estado ?? "-"}</td>
                        <td style={td}>{emp.endereco?.cidade ?? "-"}</td>

                        {/* célula de ações = flex‑container */}
                        <td className="actions-cell" style={td}>
                          <button className="btn small-btn"        onClick={() => handleEdit(emp.id)}>✏️</button>
                          <button className="btn small-btn info"   onClick={() => handleView(emp)}>👁️</button>
                          <button className="btn small-btn danger" onClick={() => askDelete(emp.id)}>🗑️</button>
                        </td>
                      </tr>
                  ))}

                  {empresasFiltradas.length === 0 && (
                      <tr><td style={td} colSpan={6}>Nenhuma empresa encontrada</td></tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Detalhe */}
        {showDetail && detailItem && (
            <DetailModal
                title={`Empresa – ${detailItem.razao_social}`}
                item={detailItem}
                onClose={() => setShowDetail(false)}
            />
        )}

        {/* Modal de Exclusão */}
        {showDeleteModal && (
            <div className="modal-overlay">
              <div className="modal-box">
                <h3>Confirmação de Exclusão</h3>
                <p>Digite a senha de administrador para EXCLUIR:</p>
                <input
                    type="password"
                    className="input"
                    placeholder="Senha"
                    value={deletePwd}
                    onChange={(e) => setDeletePwd(e.target.value)}
                    style={{ margin: "8px 0 16px 0" }}
                />
                <div className="modal-actions">
                  <button className="btn back"   onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                  <button className="btn danger" style={{ marginLeft: 8 }} onClick={confirmDelete}>Excluir</button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

/* estilos da tabela (inline p/ simplicidade) */
const th       = { padding: "10px", textAlign: "left", fontWeight: 600, borderBottom: "2px solid #c9e2ff" };
const thCenter = { ...th, textAlign: "center", width: 140 };
const td       = { padding: "8px 10px", borderBottom: "1px solid #e0e0e0", fontSize: "0.95rem" };
