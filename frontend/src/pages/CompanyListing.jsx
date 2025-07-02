// src/pages/CompanyListing.jsx
import React, { useState, useMemo } from "react";
import { useNavigate }              from "react-router-dom";
import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import DetailModal    from "../components/DetailModal";

import CompanyService from "../services/companyService";
import "../styles/companyRegistration.css";

const ADMIN_PWD  = "sasa0309";
const PAGE_LIMIT = 10;

export default function CompanyListing() {
    /* estado local */
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search,      setSearch]      = useState("");
    const [page,        setPage]        = useState(1);

    const [detailItem,  setDetailItem]  = useState(null);
    const [deleteId,    setDeleteId]    = useState(null);
    const [deletePwd,   setDeletePwd]   = useState("");

    const navigate    = useNavigate();
    const queryClient = useQueryClient();

    /* <-----------  AQUI: desembrulha res.data  ------------> */
    const { data, isLoading, isError } = useQuery({
        queryKey : ["companies", page, search],
        queryFn  : () =>
            CompanyService
                .list({
                    skip : (page - 1) * PAGE_LIMIT,
                    limit: PAGE_LIMIT,
                    q    : search || undefined,
                })
                .then((res) => res.data),       // <- 🔑
        keepPreviousData: true,
    });

    /* se o backend devolve array simples, data já É a lista
       se devolve  {items,total}, tratamos igual               */
    const empresas = Array.isArray(data) ? data : data?.items ?? [];
    const total    = Array.isArray(data) ? data.length : data?.total ?? 0;

    const pagesCount  = Math.ceil(total / PAGE_LIMIT);
    const pageNumbers = useMemo(
        () => Array.from({ length: pagesCount }, (_, i) => i + 1),
        [pagesCount],
    );

    /* exclusão */
    const deleteMutation = useMutation({
        mutationFn : (id) => CompanyService.remove(id),
        onSuccess  : () => {
            queryClient.invalidateQueries(["companies"]);
            setDeleteId(null);
        },
    });

    const handleDelete = () => {
        if (deletePwd !== ADMIN_PWD) {
            alert("Senha incorreta");
            return;
        }
        deleteMutation.mutate(deleteId);
    };

    const handleEdit = (id) => navigate(`/editar-empresa/${id}`);

    /* UI */
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
                        <div className="form-header">
                            <h2>Empresas Cadastradas</h2>
                        </div>

                        <input
                            className="input"
                            placeholder="Pesquisar por razão social, nome fantasia ou CNPJ…"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            style={{ marginBottom: 16 }}
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
                                {isLoading && (
                                    <tr><td style={td} colSpan={6}>Carregando…</td></tr>
                                )}

                                {isError && (
                                    <tr><td style={td} colSpan={6}>Erro ao carregar dados</td></tr>
                                )}

                                {empresas.map((emp) => (
                                    <tr key={emp.id}>
                                        <td style={td}>{emp.razao_social}</td>
                                        <td style={td}>{emp.nome_fantasia}</td>
                                        <td style={td}>{emp.cnpj}</td>
                                        <td style={td}>{emp.endereco?.estado ?? "-"}</td>
                                        <td style={td}>{emp.endereco?.cidade ?? "-"}</td>

                                        <td className="actions-cell" style={td}>
                                            <button
                                                className="btn small-btn"
                                                onClick={() => handleEdit(emp.id)}
                                            >✏️</button>

                                            <button
                                                className="btn small-btn info"
                                                onClick={() => setDetailItem(emp)}
                                            >👁️</button>

                                            <button
                                                className="btn small-btn danger"
                                                onClick={() => {
                                                    setDeleteId(emp.id);
                                                    setDeletePwd("");
                                                }}
                                            >🗑️</button>
                                        </td>
                                    </tr>
                                ))}

                                {!isLoading && empresas.length === 0 && (
                                    <tr><td style={td} colSpan={6}>Nenhuma empresa encontrada</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {pagesCount > 1 && (
                            <div
                                style={{
                                    marginTop: 12,
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: 8,
                                }}
                            >
                                <button
                                    className="btn small-btn"
                                    disabled={page === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >◀</button>

                                {pageNumbers.map((n) => (
                                    <button
                                        key={n}
                                        className={`btn small-btn ${n === page ? "info" : ""}`}
                                        onClick={() => setPage(n)}
                                    >{n}</button>
                                ))}

                                <button
                                    className="btn small-btn"
                                    disabled={page === pagesCount}
                                    onClick={() => setPage((p) => p + 1)}
                                >▶</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {detailItem && (
                <DetailModal
                    title={`Empresa – ${detailItem.razao_social}`}
                    item={detailItem}
                    onClose={() => setDetailItem(null)}
                />
            )}

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
                            <button className="btn back" onClick={() => setDeleteId(null)}>
                                Cancelar
                            </button>
                            <button className="btn danger" onClick={handleDelete}>
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* estilos inline */
const th       = { padding: 10, textAlign: "left", fontWeight: 600, borderBottom: "2px solid #c9e2ff" };
const thCenter = { ...th, textAlign: "center", width: 140 };
const td       = { padding: "8px 10px", borderBottom: "1px solid #e0e0e0", fontSize: "0.95rem" };
