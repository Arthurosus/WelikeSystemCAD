// ─────────────────────────────────────────────────────────────
// src/pages/StudentListing.jsx
// Listagem de Alunos – ver / editar / excluir (mock)
// ─────────────────────────────────────────────────────────────
import React, { useEffect, useMemo, useState } from "react";
import axios           from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar       from "../components/Sidebar";
import HeaderActions from "../components/HeaderActions";
import DetailModal   from "../components/DetailModal";
import "../styles/companyRegistration.css";

/* 1. MOCK ------------------------------------------------------------ */
const MOCK_ALUNOS = [
    { id:1,nome:"Maria Eduarda Souza",  cpf:"111.222.333‑44", email:"maria.souza@email.com",
        empresa:"Empresa Teste LTDA", curso:"Inglês Básico" },
    { id:2,nome:"Gabriel Almeida",     cpf:"555.666.777‑88", email:"gabriel.almeida@email.com",
        empresa:"Alpha Serviços",       curso:"Espanhol Intermediário" },
    { id:3,nome:"Laura Fernandes",     cpf:"999.000.111‑22", email:"laura.fernandes@email.com",
        empresa:"Beta Tech",            curso:"Francês Avançado" },
];

const USE_MOCK  = true;
const ADMIN_PWD = "sasa0309";

/* 2. Componente ------------------------------------------------------ */
export default function StudentListing() {
    const [cadastroAberto,setCadastroAberto] = useState(false);
    const [alunos,setAlunos]                 = useState([]);
    const [search,setSearch]                 = useState("");

    /* modais */
    const [showDeleteModal,setShowDeleteModal] = useState(false);
    const [deletePwd,setDeletePwd]             = useState("");
    const [targetId,setTargetId]               = useState(null);

    const [showDetail,setShowDetail] = useState(false);
    const [detailItem,setDetailItem] = useState(null);

    const navigate = useNavigate();

    /* carregar */
    useEffect(()=>{
        if(USE_MOCK){ setAlunos(MOCK_ALUNOS); return; }
        (async()=>{
            try{ const {data}=await axios.get("/alunos/"); setAlunos(data); }
            catch(err){ console.error("Erro ao buscar alunos:",err); }
        })();
    },[]);

    /* filtro + ordem */
    const alunosFiltrados = useMemo(()=>(
        alunos
            .filter(a=>
                a.nome.toLowerCase().includes(search.toLowerCase()) ||
                a.cpf .toLowerCase().includes(search.toLowerCase()) ||
                (a.email??"").toLowerCase().includes(search.toLowerCase())
            )
            .sort((a,b)=>a.nome.localeCompare(b.nome))
    ),[alunos,search]);

    /* handlers --------------------------------------------------------- */
    const askDelete = id =>{ setTargetId(id); setDeletePwd(""); setShowDeleteModal(true); };

    const confirmDelete = async()=>{
        if(deletePwd!==ADMIN_PWD){ alert("Senha incorreta!"); return; }
        if(!targetId) return;
        try{
            if(!USE_MOCK) await axios.delete(`/alunos/${targetId}`);
            setAlunos(prev=>prev.filter(a=>a.id!==targetId));
        }catch(err){
            console.error("Falha ao excluir:",err);
            alert("Erro ao excluir aluno.");
        }
        setShowDeleteModal(false);
    };

    const handleEdit = id  => navigate(`/editar-aluno/${id}`);
    const handleView = row => { setDetailItem(row); setShowDetail(true); };

    /* JSX -------------------------------------------------------------- */
    return(
        <div className="main-layout">
            <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto}/>
            <div className="content">
                <HeaderActions categoria="alunos"/>
                <div className="header-bar"/>

                <div className="registration-container">
                    <div className="form-box" style={{maxWidth:1100,width:"100%"}}>
                        <div className="form-header"><h2>Alunos Cadastrados</h2></div>

                        <input
                            className="input" style={{margin:"0 0 1rem 0"}}
                            placeholder="Pesquisar por nome, CPF ou e‑mail…"
                            value={search} onChange={e=>setSearch(e.target.value)}
                        />

                        <div style={{overflowX:"auto"}}>
                            <table style={{width:"100%",borderCollapse:"collapse"}}>
                                <thead>
                                <tr style={{background:"#eaf3fc"}}>
                                    <th style={th}>Nome</th>
                                    <th style={th}>CPF</th>
                                    <th style={th}>E‑mail</th>
                                    <th style={th}>Empresa</th>
                                    <th style={th}>Curso</th>
                                    <th style={thCenter}>Ações</th>
                                </tr>
                                </thead>
                                <tbody>
                                {alunosFiltrados.map(a=>(
                                    <tr key={a.id}>
                                        <td style={td}>{a.nome}</td>
                                        <td style={td}>{a.cpf}</td>
                                        <td style={td}>{a.email}</td>
                                        <td style={td}>{a.empresa}</td>
                                        <td style={td}>{a.curso}</td>

                                        {/* coluna de ações padronizada */}
                                        <td className="action-cell">
                                            <div className="action-buttons">
                                                <button className="btn small-btn"       onClick={()=>handleEdit(a.id)}>✏️</button>
                                                <button className="btn small-btn info"  onClick={()=>handleView(a)}>👁️</button>
                                                <button className="btn small-btn danger" onClick={()=>askDelete(a.id)}>🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {alunosFiltrados.length===0 && (
                                    <tr><td style={td} colSpan={6}>Nenhum aluno encontrado</td></tr>
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
                    title={`Aluno – ${detailItem.nome}`}
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

/* estilos tabela */
const th      ={padding:"10px",textAlign:"left",fontWeight:600,borderBottom:"2px solid #c9e2ff"};
const thCenter={...th,textAlign:"center",width:120};
const td      ={padding:"8px 10px",borderBottom:"1px solid #e0e0e0",fontSize:"0.95rem"};
