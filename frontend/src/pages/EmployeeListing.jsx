// ────────────────────────────────────────────────────────────────
// src/pages/EmployeeListing.jsx
// ────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState } from "react";
import axios           from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import DetailModal    from "../components/DetailModal";      // 👁️ novo
import "../styles/companyRegistration.css";

const MOCK_FUNCIONARIOS = [
    { id: 1, nome: "Bruno Fernandes", cargo: "Instrutor",  codEmpresa:"EMP001",
        empresa:"Empresa Teste LTDA",      status:"Ativo"     },
    { id: 2, nome: "Carla Mota",       cargo: "Recepção",  codEmpresa:"EMP002",
        empresa:"Alpha Serviços S.A.",     status:"Férias"    },
    { id: 3, nome: "Diego Souza",      cargo: "Gerente",   codEmpresa:"EMP003",
        empresa:"Beta Tecnologia e Sistemas Ltda.", status:"Ativo" },
];

const USE_MOCK  = true;          // ← troque para false quando conectar ao back‑end
const ADMIN_PWD = "sasa0309";    // senha (mock)

/* ─── Componente ─────────────────────────────────────────────── */
export default function EmployeeListing() {
    /* estado geral */
    const [cadastroAberto, setCadastroAberto]   = useState(false);
    const [funcionarios,   setFuncionarios]     = useState([]);
    const [search,         setSearch]           = useState("");

    /* exclusão */
    const [showDelete, setShowDelete] = useState(false);
    const [pwd,        setPwd]        = useState("");
    const [targetId,   setTargetId]   = useState(null);

    /* detalhe */
    const [detailItem, setDetailItem] = useState(null);

    const navigate = useNavigate();

    /* carregar */
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

    /* filtro + ordem */
    const lista = useMemo(
        () =>
            funcionarios
                .filter((f) =>
                    [f.nome, f.cargo, f.empresa ?? ""]
                        .some((v) => v.toLowerCase().includes(search.toLowerCase()))
                )
                .sort((a, b) => a.nome.localeCompare(b.nome)),
        [funcionarios, search]
    );

    /* ─── handlers ─────────────────────────────────────────────── */
    const handleEdit  = (id)  => navigate(`/editar-funcionario/${id}`);
    const handleView  = (row) => setDetailItem(row);

    const askDelete   = (id)  => { setTargetId(id); setPwd(""); setShowDelete(true); };
    const confirmDel  = async () => {
        if (pwd !== ADMIN_PWD) { alert("Senha incorreta!"); return; }
        try {
            if (!USE_MOCK) await axios.delete(`/funcionarios/${targetId}`);
            setFuncionarios((p) => p.filter((f) => f.id !== targetId));
        } catch (err) {
            console.error("Falha ao excluir:", err);
            alert("Erro ao excluir funcionário.");
        }
        setShowDelete(false);
    };

    /* ─── JSX ──────────────────────────────────────────────────── */
    return (
        <div className="main-layout">
            <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />

            <div className="content">
                <HeaderActions categoria="funcionarios" />
                <div className="header-bar" />

                <div className="registration-container">
                    <div className="form-box" style={{ maxWidth: 1100, width: "100%" }}>
                        <div className="form-header"><h2>Funcionários Cadastrados</h2></div>

                        <input
                            className="input"
                            placeholder="Pesquisar por nome, cargo ou empresa…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ margin: "0 0 1rem" }}
                        />

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
                                {lista.map((f) => (
                                    <tr key={f.id}>
                                        <td style={td}>{f.nome}</td>
                                        <td style={td}>{f.cargo}</td>
                                        <td style={td}>{f.empresa}</td>
                                        <td style={td}>{f.status}</td>
                                        <td style={{ ...td, textAlign: "center" }}>
                                            <div className="action-group">
                                                <button className="btn small-btn"       onClick={() => handleEdit(f.id)}>✏️</button>
                                                <button className="btn small-btn info"  onClick={() => handleView(f)}>👁️</button>
                                                <button className="btn small-btn danger" onClick={() => askDelete(f.id)}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {lista.length === 0 && (
                                    <tr>
                                        <td style={td} colSpan={5}>Nenhum funcionário encontrado</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detalhe */}
            {detailItem && (
                <DetailModal
                    title={`Funcionário – ${detailItem.nome}`}
                    item={detailItem}
                    onClose={() => setDetailItem(null)}
                />
            )}

            {/* Modal exclusão */}
            {showDelete && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Confirmação de Exclusão</h3>
                        <p>Digite a senha de administrador para EXCLUIR:</p>
                        <input
                            type="password"
                            className="input"
                            placeholder="Senha"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            style={{ margin: "8px 0 16px" }}
                        />
                        <div className="modal-actions">
                            <button className="btn back"   onClick={() => setShowDelete(false)}>Cancelar</button>
                            <button className="btn danger" onClick={confirmDel}>Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* —── estilos inline da tabela —── */
const th = { padding:"10px", textAlign:"left", fontWeight:600, borderBottom:"2px solid #c9e2ff" };
const thCenter = { ...th, textAlign:"center", width:140 };
const td = { padding:"8px 10px", borderBottom:"1px solid #e0e0e0", fontSize:"0.95rem" };
