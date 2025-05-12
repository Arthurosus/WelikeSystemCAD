// ─────────────────────────────────────────────────────────────
// src/pages/RoomListing.jsx
// Listagem de Salas (mock + ver / editar / excluir)
// ─────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState } from "react";
import axios           from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar       from "../components/Sidebar";
import HeaderActions from "../components/HeaderActions";
import DetailModal   from "../components/DetailModal";
import "../styles/companyRegistration.css";

/* 1. MOCK ------------------------------------------------------------ */
const MOCK_SALAS = [
    { id:1, nomeSala:"Sala 101", limiteAlunos:30,  descricao:"Laboratório de Informática", ativo:true  },
    { id:2, nomeSala:"Sala 202", limiteAlunos:25,  descricao:"Sala Multimídia",            ativo:true  },
    { id:3, nomeSala:"Auditório",limiteAlunos:120, descricao:"Eventos / Palestras",        ativo:false },
];

const USE_MOCK  = true;
const ADMIN_PWD = "sasa0309";

/* 2. Componente ------------------------------------------------------ */
export default function RoomListing(){
    const [cadastroAberto,setCadastroAberto] = useState(false);
    const [salas,setSalas]                   = useState([]);
    const [search,setSearch]                 = useState("");

    /* modais */
    const [showDeleteModal,setShowDeleteModal] = useState(false);
    const [deletePwd,setDeletePwd]             = useState("");
    const [targetId,setTargetId]               = useState(null);

    const [showDetail,setShowDetail] = useState(false);
    const [detailItem,setDetailItem] = useState(null);

    const navigate = useNavigate();

    /* carregar salas */
    useEffect(()=>{
        if(USE_MOCK){ setSalas(MOCK_SALAS); return; }
        (async()=>{
            try{ const {data}=await axios.get("/salas/"); setSalas(data); }
            catch(err){ console.error("Erro ao buscar salas:",err); }
        })();
    },[]);

    /* filtro + ordenação */
    const salasFiltradas = useMemo(()=>(
        salas
            .filter(s=>s.nomeSala.toLowerCase().includes(search.toLowerCase()))
            .sort((a,b)=>a.nomeSala.localeCompare(b.nomeSala))
    ),[salas,search]);

    /* handlers --------------------------------------------------------- */
    const askDelete = id =>{ setTargetId(id); setDeletePwd(""); setShowDeleteModal(true); };

    const confirmDelete = async()=>{
        if(deletePwd!==ADMIN_PWD){ alert("Senha incorreta!"); return; }
        if(!targetId) return;
        try{
            if(!USE_MOCK) await axios.delete(`/salas/${targetId}`);
            setSalas(prev=>prev.filter(s=>s.id!==targetId));
        }catch(err){
            console.error("Falha ao excluir:",err);
            alert("Erro ao excluir sala.");
        }
        setShowDeleteModal(false);
    };

    const handleEdit = id  => navigate(`/editar-sala/${id}`);
    const handleView = row => { setDetailItem(row); setShowDetail(true); };

    /* JSX -------------------------------------------------------------- */
    return(
        <div className="main-layout">
            <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto}/>
            <div className="content">
                <HeaderActions categoria="salas"/>
                <div className="header-bar"/>

                <div className="registration-container">
                    <div className="form-box" style={{maxWidth:1100,width:"100%"}}>
                        <div className="form-header"><h2>Salas Cadastradas</h2></div>

                        <input
                            className="input" style={{margin:"0 0 1rem 0"}}
                            placeholder="Pesquisar por nome da sala…"
                            value={search} onChange={e=>setSearch(e.target.value)}
                        />

                        <div style={{overflowX:"auto"}}>
                            <table style={{width:"100%",borderCollapse:"collapse"}}>
                                <thead>
                                <tr style={{background:"#eaf3fc"}}>
                                    <th style={th}>Nome da Sala</th>
                                    <th style={th}>Limite de Alunos</th>
                                    <th style={th}>Descrição</th>
                                    <th style={thCenter}>Ativa?</th>
                                    <th style={thCenter}>Ações</th>
                                </tr>
                                </thead>
                                <tbody>
                                {salasFiltradas.map(s=>(
                                    <tr key={s.id}>
                                        <td style={td}>{s.nomeSala}</td>
                                        <td style={td}>{s.limiteAlunos}</td>
                                        <td style={td}>{s.descricao||"—"}</td>
                                        <td style={{...td,textAlign:"center"}}>{s.ativo? "✔️":"—"}</td>

                                        {/* coluna de ações padronizada */}
                                        <td className="action-cell">
                                            <div className="action-buttons">
                                                <button className="btn small-btn"       onClick={()=>handleEdit(s.id)}>✏️</button>
                                                <button className="btn small-btn info"  onClick={()=>handleView(s)}>👁️</button>
                                                <button className="btn small-btn danger" onClick={()=>askDelete(s.id)}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {salasFiltradas.length===0 && (
                                    <tr><td style={td} colSpan={5}>Nenhuma sala encontrada</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* modal detalhes */}
            {showDetail && detailItem && (
                <DetailModal
                    title={`Sala – ${detailItem.nomeSala}`}
                    item={detailItem}
                    onClose={()=>setShowDetail(false)}
                />
            )}

            {/* modal exclusão */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Confirmação de Exclusão</h3>
                        <p>Digite a senha de administrador para EXCLUIR:</p>
                        <input
                            type="password" className="input" placeholder="Senha"
                            value={deletePwd} onChange={e=>setDeletePwd(e.target.value)}
                            style={{margin:"8px 0 16px 0"}}
                        />
                        <div className="modal-actions">
                            <button className="btn back"   onClick={()=>setShowDeleteModal(false)}>Cancelar</button>
                            <button className="btn danger" style={{marginLeft:8}} onClick={confirmDelete}>Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* estilos de tabela (mesmo padrão) */
const th  ={padding:"10px",textAlign:"left",fontWeight:600,borderBottom:"2px solid #c9e2ff"};
const thCenter={...th,textAlign:"center",width:120};
const td  ={padding:"8px 10px",borderBottom:"1px solid #e0e0e0",fontSize:"0.95rem"};
