// ────────────────────────────────────────────────────────────────
//  src/pages/LessonListing.jsx
// ────────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState } from "react";
import axios                   from "axios";
import { useNavigate }         from "react-router-dom";

import Sidebar        from "../components/Sidebar";
import HeaderActions  from "../components/HeaderActions";
import DetailModal    from "../components/DetailModal";     // 👁️
import "../styles/companyRegistration.css";

const MOCK_AULAS = [
    { id: 1, codigo:"AUL001", descricao:"Inglês Básico",              tipo:"Presencial",
        codEmpresa:"EMP001", ativo:true },
    { id: 2, codigo:"AUL002", descricao:"Inglês Intermediário Online",tipo:"On‑line",
        codEmpresa:"EMP002", ativo:true },
    { id: 3, codigo:"AUL003", descricao:"Espanhol Conversação",       tipo:"Presencial",
        codEmpresa:"EMP001", ativo:false },
];

const USE_MOCK  = true;        // ← altere quando integrar back‑end
const ADMIN_PWD = "sasa0309";  // senha mock

export default function LessonListing() {
    /* estado geral */
    const [cadastroAberto, setCadastroAberto] = useState(false);
    const [aulas,   setAulas]   = useState([]);
    const [search,  setSearch]  = useState("");

    /* exclusão */
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePwd,       setDeletePwd]       = useState("");
    const [targetId,        setTargetId]        = useState(null);

    /* detalhe 👁️ */
    const [showDetail, setShowDetail] = useState(false);
    const [detail,     setDetail]     = useState(null);

    const navigate = useNavigate();

    /* carregar */
    useEffect(()=>{
        if (USE_MOCK){ setAulas(MOCK_AULAS); return; }
        (async()=>{
            try{ const {data}=await axios.get("/aulas/"); setAulas(data); }
            catch(err){ console.error("Erro ao buscar aulas:",err); }
        })();
    },[]);

    /* filtro + ordem */
    const aulasFiltradas = useMemo(()=>(
        aulas
            .filter(a =>
                a.descricao.toLowerCase().includes(search.toLowerCase()) ||
                a.codigo   .toLowerCase().includes(search.toLowerCase()) ||
                a.tipo     .toLowerCase().includes(search.toLowerCase()))
            .sort((a,b)=>a.descricao.localeCompare(b.descricao))
    ),[aulas,search]);

    /* handlers CRUD */
    const askDelete = id => { setTargetId(id); setDeletePwd(""); setShowDeleteModal(true); };

    const confirmDelete = async()=>{
        if(deletePwd!==ADMIN_PWD){ alert("Senha incorreta!"); return; }
        if(!targetId) return;
        if(!USE_MOCK){
            try{ await axios.delete(`/aulas/${targetId}`); }catch(e){ alert("Erro no back‑end"); }
        }
        setAulas(prev=>prev.filter(a=>a.id!==targetId));
        setShowDeleteModal(false);
    };

    const handleEdit   = id  => navigate(`/editar-aula/${id}`);
    const handleView   = row => { setDetail(row); setShowDetail(true); };

    /* JSX */
    return(
        <div className="main-layout">
            <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto}/>
            <div className="content">
                <HeaderActions categoria="aulas"/>
                <div className="header-bar"/>

                <div className="registration-container">
                    <div className="form-box" style={{maxWidth:1100,width:"100%"}}>
                        <div className="form-header"><h2>Aulas Cadastradas</h2></div>

                        <input
                            className="input" placeholder="Pesquisar por descrição, código ou tipo…"
                            value={search} onChange={e=>setSearch(e.target.value)}
                            style={{marginBottom:"1rem"}}
                        />

                        <div style={{overflowX:"auto"}}>
                            <table className="listing-table">
                                <thead>
                                <tr>
                                    <th>Descrição</th><th>Código</th><th>Tipo</th>
                                    <th>Empresa</th><th>Ativa?</th><th className="center">Ações</th>
                                </tr>
                                </thead>
                                <tbody>
                                {aulasFiltradas.map(a=>(
                                    <tr key={a.id}>
                                        <td>{a.descricao}</td>
                                        <td>{a.codigo}</td>
                                        <td>{a.tipo}</td>
                                        <td>{a.codEmpresa}</td>
                                        <td>{a.ativo?"Sim":"Não"}</td>
                                        <td className="center">
                                            <button className="btn small-btn"       onClick={()=>handleEdit(a.id)}>✏️</button>
                                            <button className="btn small-btn info"  onClick={()=>handleView(a)}>👁️</button>
                                            <button className="btn small-btn danger" onClick={()=>askDelete(a.id)} style={{marginLeft:8}}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                                {aulasFiltradas.length===0 && (
                                    <tr><td colSpan={6} className="no-data">Nenhuma aula encontrada</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* detalhe 👁️ */}
            {showDetail && detail && (
                <DetailModal
                    title={`Aula – ${detail.descricao}`}
                    item={detail}
                    onClose={()=>setShowDetail(false)}
                />
            )}

            {/* exclusão */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Confirmação de Exclusão</h3>
                        <p>Digite a senha de administrador para EXCLUIR:</p>
                        <input
                            type="password" className="input" placeholder="Senha"
                            value={deletePwd} onChange={e=>setDeletePwd(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button className="btn back"   onClick={()=>setShowDeleteModal(false)}>Cancelar</button>
                            <button className="btn danger" onClick={confirmDelete}>Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
