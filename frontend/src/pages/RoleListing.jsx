// ─────────────────────────────────────────────────────────────
// src/pages/RoleListing.jsx
// Listagem de Cargos (mock + senha p/ excluir)
// ─────────────────────────────────────────────────────────────
import React, { useEffect, useState, useMemo } from "react";
import axios           from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar       from "../components/Sidebar";
import HeaderActions from "../components/HeaderActions";
import "../styles/companyRegistration.css";

/* ─── 1. MOCK opcional ─────────────────────────────────────── */
const MOCK_CARGOS = [
    {
        id: 1,
        codEmpresa: "EMP001",
        codCargo:   "CAR001",
        descricao:  "Professor de Inglês",
        professor:  true,
        ativo:      true,
    },
    {
        id: 2,
        codEmpresa: "EMP002",
        codCargo:   "CAR002",
        descricao:  "Coordenador Pedagógico",
        professor:  false,
        ativo:      true,
    },
    {
        id: 3,
        codEmpresa: "EMP001",
        codCargo:   "CAR003",
        descricao:  "Assistente Administrativo",
        professor:  false,
        ativo:      false,
    },
];

const USE_MOCK  = true;          // troque qdo houver back‑end
const ADMIN_PWD = "sasa0309";    // senha fixa (mock)

/* ─── 2. Componente ────────────────────────────────────────── */
export default function RoleListing() {
    const [cadastroAberto, setCadastroAberto] = useState(false);
    const [cargos, setCargos]                 = useState([]);
    const [search, setSearch]                 = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePwd, setDeletePwd]             = useState("");
    const [targetId, setTargetId]               = useState(null);

    const navigate = useNavigate();

    /* carregar */
    useEffect(() => {
        if (USE_MOCK) {
            setCargos(MOCK_CARGOS);
            return;
        }
        (async () => {
            try {
                const { data } = await axios.get("/cargos/");
                setCargos(data);
            } catch (err) {
                console.error("Erro ao buscar cargos:", err);
            }
        })();
    }, []);

    /* filtro + ordenação */
    const cargosFiltrados = useMemo(
        () =>
            cargos
                .filter(
                    (c) =>
                        c.codCargo.toLowerCase().includes(search.toLowerCase()) ||
                        c.codEmpresa.toLowerCase().includes(search.toLowerCase()) ||
                        c.descricao.toLowerCase().includes(search.toLowerCase())
                )
                .sort((a, b) => a.codCargo.localeCompare(b.codCargo)),
        [cargos, search]
    );

    /* ── manipulação edição / exclusão ───────────────────────── */
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
            setCargos((prev) => prev.filter((c) => c.id !== targetId));
        } else {
            try {
                await axios.delete(`/cargos/${targetId}`);
                setCargos((prev) => prev.filter((c) => c.id !== targetId));
            } catch (err) {
                console.error("Falha ao excluir:", err);
                alert("Erro ao excluir cargo.");
            }
        }
        setShowDeleteModal(false);
    };

    const handleEdit = (id) => navigate(`/editar-cargo/${id}`);

    /* ─── 3. JSX ─────────────────────────────────────────────── */
    return (
        <div className="main-layout">
            <Sidebar
                cadastroAberto={cadastroAberto}
                setCadastroAberto={setCadastroAberto}
            />

            <div className="content">
                <HeaderActions categoria="cargos" />
                <div className="header-bar" />

                <div className="registration-container">
                    <div className="form-box" style={{ width: "100%", maxWidth: 1100 }}>
                        <div className="form-header">
                            <h2>Cargos Cadastrados</h2>
                        </div>

                        {/* busca */}
                        <div style={{ marginBottom: "1rem" }}>
                            <input
                                type="text"
                                className="input"
                                placeholder="Pesquisar por código, empresa ou descrição…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* tabela */}
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                <tr style={{ background: "#eaf3fc" }}>
                                    <th style={th}>Empresa</th>
                                    <th style={th}>Código Cargo</th>
                                    <th style={th}>Descrição</th>
                                    <th style={thCenter}>Professor?</th>
                                    <th style={thCenter}>Ativo?</th>
                                    <th style={thCenter}>Ações</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cargosFiltrados.map((c) => (
                                    <tr key={c.id}>
                                        <td style={td}>{c.codEmpresa}</td>
                                        <td style={td}>{c.codCargo}</td>
                                        <td style={td}>{c.descricao}</td>
                                        <td style={{ ...td, textAlign: "center" }}>
                                            {c.professor ? "✔️" : "—"}
                                        </td>
                                        <td style={{ ...td, textAlign: "center" }}>
                                            {c.ativo ? "✔️" : "—"}
                                        </td>
                                        <td style={{ ...td, textAlign: "center" }}>
                                            <button
                                                className="btn small-btn"
                                                onClick={() => handleEdit(c.id)}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn small-btn danger"
                                                style={{ marginLeft: 8 }}
                                                onClick={() => askDelete(c.id)}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {cargosFiltrados.length === 0 && (
                                    <tr>
                                        <td style={td} colSpan={6}>
                                            Nenhum cargo encontrado
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* modal senha/excluir */}
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

/* estilos p/ tabela ‑ reuso visual */
const th = {
    padding: "10px",
    textAlign: "left",
    fontWeight: 600,
    borderBottom: "2px solid #c9e2ff",
};
const thCenter = { ...th, textAlign: "center", width: 100 };
const td = {
    padding: "8px 10px",
    borderBottom: "1px solid #e0e0e0",
    fontSize: "0.95rem",
};

/* modal */
const overlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
