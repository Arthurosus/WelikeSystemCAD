import React, { useEffect, useMemo, useState } from "react";
import axios           from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import "../styles/companyRegistration.css";

const MOCK_AULAS = [
    {
        id: 1,
        codigo:      "AUL001",
        descricao:   "Inglês Básico",
        tipo:        "Presencial",
        codEmpresa:  "EMP001",
        ativo:       true,
    },
    {
        id: 2,
        codigo:      "AUL002",
        descricao:   "Inglês Intermediário Online",
        tipo:        "On‑line",
        codEmpresa:  "EMP002",
        ativo:       true,
    },
    {
        id: 3,
        codigo:      "AUL003",
        descricao:   "Espanhol Conversação",
        tipo:        "Presencial",
        codEmpresa:  "EMP001",
        ativo:       false,
    },
];

const USE_MOCK  = true;          // ← troque quando o back‑end estiver pronto
const ADMIN_PWD = "sasa0309";    // (mock) senha de exclusão

/* ─── 2. componente ──────────────────────────────────────────── */
export default function LessonListing() {
    const [cadastroAberto, setCadastroAberto] = useState(false);
    const [aulas,  setAulas]  = useState([]);
    const [search, setSearch] = useState("");

    /* modal simples de confirmação */
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePwd,       setDeletePwd]       = useState("");
    const [targetId,        setTargetId]        = useState(null);

    const navigate = useNavigate();

    /* carregar aulas */
    useEffect(() => {
        if (USE_MOCK) {
            setAulas(MOCK_AULAS);
            return;
        }
        (async () => {
            try {
                const { data } = await axios.get("/aulas/");
                setAulas(data);
            } catch (err) {
                console.error("Erro ao buscar aulas:", err);
            }
        })();
    }, []);

    /* filtro + ordenação */
    const aulasFiltradas = useMemo(
        () =>
            aulas
                .filter(
                    (a) =>
                        a.descricao.toLowerCase().includes(search.toLowerCase()) ||
                        a.codigo.toLowerCase().includes(search.toLowerCase())    ||
                        a.tipo.toLowerCase().includes(search.toLowerCase())
                )
                .sort((a, b) => a.descricao.localeCompare(b.descricao)),
        [aulas, search]
    );

    /* handlers */
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
            setAulas((prev) => prev.filter((a) => a.id !== targetId));
        } else {
            try {
                await axios.delete(`/aulas/${targetId}`);
                setAulas((prev) => prev.filter((a) => a.id !== targetId));
            } catch (err) {
                console.error("Falha ao excluir aula:", err);
                alert("Erro ao excluir aula.");
            }
        }
        setShowDeleteModal(false);
    };

    const handleEdit = (id) => navigate(`/editar-aula/${id}`);

    /* ─── 3. JSX ────────────────────────────────────────────────── */
    return (
        <div className="main-layout">
            <Sidebar
                cadastroAberto={cadastroAberto}
                setCadastroAberto={setCadastroAberto}
            />

            <div className="content">
                <HeaderActions categoria="aulas" />
                <div className="header-bar" />

                <div className="registration-container">
                    <div className="form-box" style={{ width: "100%", maxWidth: 1100 }}>
                        <div className="form-header">
                            <h2>Aulas Cadastradas</h2>
                        </div>

                        {/* barra de pesquisa */}
                        <div style={{ marginBottom: "1rem" }}>
                            <input
                                type="text"
                                className="input"
                                placeholder="Pesquisar por descrição, código ou tipo…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* tabela */}
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                <tr style={{ background: "#eaf3fc" }}>
                                    <th style={th}>Descrição</th>
                                    <th style={th}>Código</th>
                                    <th style={th}>Tipo</th>
                                    <th style={th}>Empresa</th>
                                    <th style={th}>Ativa?</th>
                                    <th style={thCenter}>Ações</th>
                                </tr>
                                </thead>
                                <tbody>
                                {aulasFiltradas.map((a) => (
                                    <tr key={a.id}>
                                        <td style={td}>{a.descricao}</td>
                                        <td style={td}>{a.codigo}</td>
                                        <td style={td}>{a.tipo}</td>
                                        <td style={td}>{a.codEmpresa}</td>
                                        <td style={td}>{a.ativo ? "Sim" : "Não"}</td>
                                        <td style={{ ...td, textAlign: "center" }}>
                                            <button
                                                className="btn small-btn"
                                                onClick={() => handleEdit(a.id)}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn small-btn danger"
                                                style={{ marginLeft: 8 }}
                                                onClick={() => askDelete(a.id)}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {aulasFiltradas.length === 0 && (
                                    <tr>
                                        <td style={td} colSpan={6}>
                                            Nenhuma aula encontrada
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Modal de exclusão ─── */}
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
                            <button className="btn back" onClick={() => setShowDeleteModal(false)}>
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

/* ─── estilos inline (iguais aos outros listings) ────────────────── */
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
