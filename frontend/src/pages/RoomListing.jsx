// ─────────────────────────────────────────────────────────────────────────────
// src/pages/RoomListing.jsx
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState } from "react";
import axios           from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import "../styles/companyRegistration.css";

/* ─── 1. MOCK opcional ────────────────────────────────────────── */
const MOCK_SALAS = [
    { id: 1, nomeSala: "Sala 101", limiteAlunos: 30, descricao: "Laboratório de Informática", ativo: true },
    { id: 2, nomeSala: "Sala 202", limiteAlunos: 25, descricao: "Sala Multimídia",           ativo: true },
    { id: 3, nomeSala: "Auditório", limiteAlunos: 120, descricao: "Eventos / Palestras",      ativo: false },
];

const USE_MOCK  = true;        //  ← troque para false quando ligar o back‑end
const ADMIN_PWD = "sasa0309";  //  ← futuramente virá de config / login

/* ─── 2. Componente ───────────────────────────────────────────── */
export default function RoomListing() {
    const [cadastroAberto,   setCadastroAberto]   = useState(false);
    const [salas,            setSalas]            = useState([]);
    const [search,           setSearch]           = useState("");
    const [showDeleteModal,  setShowDeleteModal]  = useState(false);
    const [deletePwd,        setDeletePwd]        = useState("");
    const [targetId,         setTargetId]         = useState(null);

    const navigate = useNavigate();

    /* carregar salas */
    useEffect(() => {
        if (USE_MOCK) {
            setSalas(MOCK_SALAS);
            return;
        }
        (async () => {
            try {
                const { data } = await axios.get("/salas/");
                setSalas(data);
            } catch (err) {
                console.error("Erro ao buscar salas:", err);
            }
        })();
    }, []);

    /* filtro + ordenação */
    const salasFiltradas = useMemo(
        () =>
            salas
                .filter((s) =>
                    s.nomeSala.toLowerCase().includes(search.toLowerCase())
                )
                .sort((a, b) => a.nomeSala.localeCompare(b.nomeSala)),
        [salas, search]
    );

    /* ─── handlers ─────────────────────────────────────────────── */
    const askDelete = (id) => {
        setTargetId(id);
        setDeletePwd("");
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (deletePwd !== ADMIN_PWD) {
            alert("Senha incorreta!");
            return;
        }
        if (!targetId) return;

        if (USE_MOCK) {
            setSalas((prev) => prev.filter((s) => s.id !== targetId));
        } else {
            try {
                await axios.delete(`/salas/${targetId}`);
                setSalas((prev) => prev.filter((s) => s.id !== targetId));
            } catch (err) {
                console.error("Falha ao excluir:", err);
                alert("Erro ao excluir sala.");
            }
        }
        setShowDeleteModal(false);
    };

    const handleEdit = (id) => navigate(`/editar-sala/${id}`);

    /* ─── JSX ──────────────────────────────────────────────────── */
    return (
        <div className="main-layout">
            <Sidebar
                cadastroAberto={cadastroAberto}
                setCadastroAberto={setCadastroAberto}
            />

            <div className="content">
                <HeaderActions categoria="salas" />
                <div className="header-bar" />

                <div className="registration-container">
                    <div className="form-box" style={{ width: "100%", maxWidth: 1100 }}>
                        <div className="form-header">
                            <h2>Salas Cadastradas</h2>
                        </div>

                        {/* barra de pesquisa */}
                        <div style={{ marginBottom: "1rem" }}>
                            <input
                                type="text"
                                className="input"
                                placeholder="Pesquisar por nome da sala…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* tabela */}
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                <tr style={{ background: "#eaf3fc" }}>
                                    <th style={th}>Nome da Sala</th>
                                    <th style={th}>Limite de Alunos</th>
                                    <th style={th}>Descrição</th>
                                    <th style={th}>Ativa?</th>
                                    <th style={thCenter}>Ações</th>
                                </tr>
                                </thead>
                                <tbody>
                                {salasFiltradas.map((s) => (
                                    <tr key={s.id}>
                                        <td style={td}>{s.nomeSala}</td>
                                        <td style={td}>{s.limiteAlunos}</td>
                                        <td style={td}>{s.descricao || "-"}</td>
                                        <td style={td}>{s.ativo ? "Sim" : "Não"}</td>
                                        <td style={{ ...td, textAlign: "center" }}>
                                            <button
                                                className="btn small-btn"
                                                onClick={() => handleEdit(s.id)}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn small-btn danger"
                                                style={{ marginLeft: 8 }}
                                                onClick={() => askDelete(s.id)}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {salasFiltradas.length === 0 && (
                                    <tr>
                                        <td style={td} colSpan={5}>
                                            Nenhuma sala encontrada
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── modal de confirmação (mesmo desenho das outras páginas) ─── */}
            {showDeleteModal && (
                <div style={overlay}>
                    <div style={modal}>
                        <h3 style={{ marginTop: 0 }}>Confirmação de Exclusão</h3>
                        <p style={{ marginBottom: 12 }}>
                            Digite a senha de administrador para EXCLUIR:
                        </p>
                        <input
                            type="password"
                            className="input"
                            value={deletePwd}
                            onChange={(e) => setDeletePwd(e.target.value)}
                            placeholder="Senha"
                            style={{ marginBottom: 16 }}
                        />
                        <div style={{ textAlign: "right" }}>
                            <button
                                className="btn back"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn danger"
                                style={{ marginLeft: 8 }}
                                onClick={confirmDelete}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── estilos pequenos (mesmo padrão das outras listagens) ───────────── */
const th = {
    padding: "10px",
    textAlign: "left",
    fontWeight: 600,
    borderBottom: "2px solid #c9e2ff",
};
const thCenter = { ...th, textAlign: "center", width: 120 };
const td = {
    padding: "8px 10px",
    borderBottom: "1px solid #e0e0e0",
    fontSize: "0.95rem",
};

/* modal */
const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
};
const modal = {
    background: "#fff",
    borderRadius: 8,
    padding: 24,
    width: 400,
    maxWidth: "90%",
    boxShadow: "0 4px 18px rgba(0,0,0,.3)",
};
