import React, { useEffect, useMemo, useState } from "react";
import axios           from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import "../styles/companyRegistration.css";

const MOCK_FUNCIONARIOS = [
    {
        id: 1,
        nome: "Bruno Fernandes",
        cargo: "Instrutor",
        codEmpresa: "EMP001",
        empresa: "Empresa Teste LTDA",
        status: "Ativo",
    },
    {
        id: 2,
        nome: "Carla Mota",
        cargo: "Recepção",
        codEmpresa: "EMP002",
        empresa: "Alpha Serviços S.A.",
        status: "Férias",
    },
    {
        id: 3,
        nome: "Diego Souza",
        cargo: "Gerente",
        codEmpresa: "EMP003",
        empresa: "Beta Tech",
        status: "Ativo",
    },
];

const USE_MOCK  = true;          // mude para false quando integrar ao back‑end
const ADMIN_PWD = "sasa0309";    // senha de confirmação

/* ─── 2. Componente ───────────────────────────────────────────── */
export default function EmployeeListing() {
    const [cadastroAberto, setCadastroAberto]   = useState(false);
    const [funcionarios, setFuncionarios]       = useState([]);
    const [search, setSearch]                   = useState("");
    const [showModal, setShowModal]             = useState(false);
    const [pwd, setPwd]                         = useState("");
    const [targetId, setTargetId]               = useState(null);

    const navigate = useNavigate();

    /* carregar lista */
    useEffect(() => {
        if (USE_MOCK) {
            setFuncionarios(MOCK_FUNCIONARIOS);
            return;
        }
        (async () => {
            try {
                const { data } = await axios.get("/funcionarios/");
                setFuncionarios(data);
            } catch (err) {
                console.error("Erro ao buscar funcionários:", err);
            }
        })();
    }, []);

    /* busca + ordenação */
    const listaFiltrada = useMemo(
        () =>
            funcionarios
                .filter(
                    (f) =>
                        f.nome.toLowerCase().includes(search.toLowerCase()) ||
                        f.cargo.toLowerCase().includes(search.toLowerCase()) ||
                        (f.empresa ?? "").toLowerCase().includes(search.toLowerCase())
                )
                .sort((a, b) => a.nome.localeCompare(b.nome)),
        [funcionarios, search]
    );

    /* ─── 3. handlers ───────────────────────────────────────────── */
    const askDelete = (id) => {
        setTargetId(id);
        setPwd("");
        setShowModal(true);
    };

    const confirmDelete = async () => {
        if (pwd !== ADMIN_PWD) {
            alert("Senha incorreta!");
            return;
        }
        if (!targetId) return;

        if (USE_MOCK) {
            setFuncionarios((prev) => prev.filter((f) => f.id !== targetId));
        } else {
            try {
                await axios.delete(`/funcionarios/${targetId}`);
                setFuncionarios((prev) => prev.filter((f) => f.id !== targetId));
            } catch (err) {
                console.error("Falha ao excluir:", err);
                alert("Erro ao excluir funcionário.");
            }
        }
        setShowModal(false);
    };

    const handleEdit = (id) => navigate(`/editar-funcionario/${id}`);

    /* ─── 4. JSX ────────────────────────────────────────────────── */
    return (
        <div className="main-layout">
            <Sidebar
                cadastroAberto={cadastroAberto}
                setCadastroAberto={setCadastroAberto}
            />

            <div className="content">
                <HeaderActions categoria="funcionarios" />
                <div className="header-bar" />

                <div className="registration-container">
                    <div className="form-box" style={{ width: "100%", maxWidth: 1100 }}>
                        <div className="form-header">
                            <h2>Funcionários Cadastrados</h2>
                        </div>

                        {/* barra de pesquisa */}
                        <div style={{ marginBottom: "1rem" }}>
                            <input
                                type="text"
                                className="input"
                                placeholder="Pesquisar por nome, cargo ou empresa…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* tabela */}
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                <tr style={{ background: "#eaf3fc" }}>
                                    <th style={th}>Nome</th>
                                    <th style={th}>Cargo</th>
                                    <th style={th}>Empresa</th>
                                    <th style={th}>Status</th>
                                    <th style={thCenter}>Ações</th>
                                </tr>
                                </thead>
                                <tbody>
                                {listaFiltrada.map((f) => (
                                    <tr key={f.id}>
                                        <td style={td}>{f.nome}</td>
                                        <td style={td}>{f.cargo}</td>
                                        <td style={td}>{f.empresa}</td>
                                        <td style={td}>{f.status}</td>
                                        <td style={{ ...td, textAlign: "center" }}>
                                            <button
                                                className="btn small-btn"
                                                onClick={() => handleEdit(f.id)}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn small-btn danger"
                                                style={{ marginLeft: 8 }}
                                                onClick={() => askDelete(f.id)}
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {listaFiltrada.length === 0 && (
                                    <tr>
                                        <td style={td} colSpan={5}>
                                            Nenhum funcionário encontrado
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Modal senha ─── */}
            {showModal && (
                <div style={overlay}>
                    <div style={modal}>
                        <h3 style={{ marginTop: 0 }}>Confirmação de Exclusão</h3>
                        <p style={{ marginBottom: 12 }}>
                            Digite a senha de administrador para EXCLUIR:
                        </p>
                        <input
                            type="password"
                            className="input"
                            placeholder="Senha"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            style={{ marginBottom: 16 }}
                        />
                        <div style={{ textAlign: "right" }}>
                            <button className="btn back" onClick={() => setShowModal(false)}>
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

/* ─── pequenos estilos inline ─────────────────────────────────── */
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
    boxShadow: "0 4px 18px rgba(0,0,0,.25)",
};
