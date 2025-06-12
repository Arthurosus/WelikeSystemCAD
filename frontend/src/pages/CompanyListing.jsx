// ─────────────────────────────────────────────────────────────
//  CompanyListing – listagem + paginação + react-query
// ─────────────────────────────────────────────────────────────
import React, { useState, useMemo }      from "react";
import { useNavigate }                   from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import DetailModal    from "../components/DetailModal";

import CompanyService from "../services/companyService";
import "../styles/companyRegistration.css";

// ─────────── configuração ───────────
const ADMIN_PWD   = "sasa0309";
const PAGE_LIMIT  = 10;               // empresas por página

export default function CompanyListing() {
  /* 1. estado local */
  const [sidebarOpen,    setSidebarOpen] = useState(false);
  const [search,         setSearch]      = useState("");
  const [page,           setPage]        = useState(1);

  /* modal: detalhe */
  const [detailItem,     setDetailItem]  = useState(null);

  /* modal: exclusão */
  const [deleteId,       setDeleteId]    = useState(null);
  const [deletePwd,      setDeletePwd]   = useState("");

  const navigate       = useNavigate();
  const queryClient    = useQueryClient();

  /* 2. query → lista paginada */
  const { data, isLoading, isError } = useQuery(
      ["companies", page, search],
      () => CompanyService.list({
        skip : (page - 1) * PAGE_LIMIT,
        limit: PAGE_LIMIT,
        q    : search || undefined,     // backend pode ignorar se não existir
      }),
      { keepPreviousData: true }
  );

  /* 3. exclusão (mutation) */
  const deleteMutation = useMutation(
      (id) => CompanyService.remove(id),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["companies"]);
          setDeleteId(null);
        },
      }
  );

  /* 4. helpers */
  const total      = data?.total  ?? 0;
  const pagesCount = Math.ceil(total / PAGE_LIMIT);

  const empresas   = data?.items ?? [];

  const pageNumbers = useMemo(() => {
    // gera array tipo [1,2,3]
    return Array.from({ length: pagesCount }, (_, i) => i + 1);
  }, [pagesCount]);

  /* 5. handlers */
  const handleDelete = () => {
    if (deletePwd !== ADMIN_PWD) { alert("Senha incorreta"); return; }
    deleteMutation.mutate(deleteId);
  };

  const openDetail  = (row) => setDetailItem(row);
  const closeDetail = ()   => setDetailItem(null);

  const askDelete   = (id) => { setDeleteId(id); setDeletePwd(""); };
  const cancelDel   = ()   => setDeleteId(null);

  const handleEdit  = (id) => navigate(`/editar-empresa/${id}`);

  /* 6. render */
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
            <div className="form-box" style={{ maxWidth: 1100, width: "100%" }}>
              <div className="form-header"><h2>Empresas Cadastradas</h2></div>

              {/* busca */}
              <input
                  className="input"
                  placeholder="Pesquisar por razão social, nome fantasia ou CNPJ…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  style={{ marginBottom: 16 }}
              />

              {/* tabela */}
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
                  {isLoading && (
                      <tr><td style={td} colSpan={6}>Carregando…</td></tr>
                  )}

                  {isError && (
                      <tr><td style={td} colSpan={6}>Erro ao carregar dados</td></tr>
                  )}

                  {empresas.map(emp => (
                      <tr key={emp.id}>
                        <td style={td}>{emp.razao_social}</td>
                        <td style={td}>{emp.nome_fantasia}</td>
                        <td style={td}>{emp.cnpj}</td>
                        <td style={td}>{emp.endereco?.estado ?? "-"}</td>
                        <td style={td}>{emp.endereco?.cidade ?? "-"}</td>

                        <td className="actions-cell" style={td}>
                          <button className="btn small-btn"        onClick={() => handleEdit(emp.id)}>✏️</button>
                          <button className="btn small-btn info"   onClick={() => openDetail(emp)}>👁️</button>
                          <button className="btn small-btn danger" onClick={() => askDelete(emp.id)}>🗑️</button>
                        </td>
                      </tr>
                  ))}

                  {(!isLoading && empresas.length === 0) && (
                      <tr><td style={td} colSpan={6}>Nenhuma empresa encontrada</td></tr>
                  )}
                  </tbody>
                </table>
              </div>

              {/* paginação */}
              {pagesCount > 1 && (
                  <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 8 }}>
                    <button
                        className="btn small-btn"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                      ◀
                    </button>

                    {pageNumbers.map(n => (
                        <button
                            key={n}
                            className={`btn small-btn ${n === page ? "info" : ""}`}
                            onClick={() => setPage(n)}
                        >
                          {n}
                        </button>
                    ))}

                    <button
                        className="btn small-btn"
                        disabled={page === pagesCount}
                        onClick={() => setPage(p => p + 1)}
                    >
                      ▶
                    </button>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* modal de detalhes */}
        {detailItem && (
            <DetailModal
                title={`Empresa – ${detailItem.razao_social}`}
                item={detailItem}
                onClose={closeDetail}
            />
        )}

        {/* modal de exclusão */}
        {deleteId && (
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
                  <button className="btn back"   onClick={cancelDel}>Cancelar</button>
                  <button className="btn danger" onClick={handleDelete}>Excluir</button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

/* ——— estilos simples ——— */
const th       = { padding: "10px", textAlign: "left", fontWeight: 600, borderBottom: "2px solid #c9e2ff" };
const thCenter = { ...th, textAlign: "center", width: 140 };
const td       = { padding: "8px 10px", borderBottom: "1px solid #e0e0e0", fontSize: "0.95rem" };


