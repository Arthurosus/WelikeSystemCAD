import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar       from "../components/Sidebar";
import HeaderActions from "../components/HeaderActions";
import "../styles/companyRegistration.css";

/* ─── MOCK opcional ───────────────────── */
const MOCK_PESSOAS = [
  { id:1,nome:"Ana Beatriz da Silva", cpf:"123.456.789‑01", email:"ana@email.com",
    telefone:"(11) 99999‑1234", endereco:{estado:"SP",cidade:"São Paulo"} },
  { id:2,nome:"Carlos Eduardo Souza", cpf:"987.654.321‑00", email:"carlos@email.com",
    telefone:"(21) 98888‑4321", endereco:{estado:"RJ",cidade:"Rio de Janeiro"} },
  { id:3,nome:"Fernanda Ramos", cpf:"111.222.333‑44", email:"fer@email.com",
    telefone:"(31) 97777‑5555", endereco:{estado:"MG",cidade:"Belo Horizonte"} },
];

const USE_MOCK  = true;
const ADMIN_PWD = "sasa0309";

/* ─── Componente ─────────────────────── */
const PersonListing = () => {
  const [cadastroAberto,setCadastroAberto] = useState(false);
  const [pessoas,setPessoas]               = useState([]);
  const [search,setSearch]                 = useState("");

  /* modal */
  const [showDeleteModal,setShowDeleteModal] = useState(false);
  const [deletePwd,setDeletePwd]             = useState("");
  const [targetId,setTargetId]               = useState(null);

  const navigate = useNavigate();

  /* carregar pessoas */
  useEffect(()=>{
    if (USE_MOCK){ setPessoas(MOCK_PESSOAS); return; }
    (async()=>{
      try{ const {data}=await axios.get("/pessoas/"); setPessoas(data); }
      catch(err){ console.error("Erro ao buscar pessoas:",err); }
    })();
  },[]);

  /* filtro + ordenação */
  const pessoasFiltradas = useMemo(()=>(
      pessoas
          .filter(p=>
              p.nome .toLowerCase().includes(search.toLowerCase())||
              p.cpf  .toLowerCase().includes(search.toLowerCase())||
              (p.email??"").toLowerCase().includes(search.toLowerCase()))
          .sort((a,b)=>a.nome.localeCompare(b.nome))
  ),[pessoas,search]);

  /* handlers */
  const askDelete = id => { setTargetId(id); setDeletePwd(""); setShowDeleteModal(true); };

  const confirmDelete = async () => {
    if(deletePwd!==ADMIN_PWD){ alert("Senha incorreta!"); return; }
    if(!targetId) return;
    try{
      if(!USE_MOCK) await axios.delete(`/pessoas/${targetId}`);
      setPessoas(prev=>prev.filter(p=>p.id!==targetId));
    }catch(err){
      console.error("Falha ao excluir:",err);
      alert("Erro ao excluir pessoa.");
    }
    setShowDeleteModal(false);
  };

  const handleEdit = id => navigate(`/editar-pessoa/${id}`);

  /* JSX */
  return(
      <div className="main-layout">
        <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto}/>
        <div className="content">
          <HeaderActions categoria="pessoas"/>
          <div className="header-bar"/>

          <div className="registration-container">
            <div className="form-box" style={{maxWidth:1100,width:"100%"}}>
              <div className="form-header"><h2>Pessoas Cadastradas</h2></div>

              <input className="input" style={{margin:"0 0 1rem 0"}}
                     placeholder="Pesquisar por nome, CPF ou e‑mail…"
                     value={search} onChange={e=>setSearch(e.target.value)}/>

              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                  <tr style={{background:"#eaf3fc"}}>
                    <th style={th}>Nome</th>
                    <th style={th}>CPF</th>
                    <th style={th}>E‑mail</th>
                    <th style={th}>Estado</th>
                    <th style={th}>Cidade</th>
                    <th style={thCenter}>Ações</th>
                  </tr>
                  </thead>
                  <tbody>
                  {pessoasFiltradas.map(p=>(
                      <tr key={p.id}>
                        <td style={td}>{p.nome}</td>
                        <td style={td}>{p.cpf}</td>
                        <td style={td}>{p.email}</td>
                        <td style={td}>{p.endereco?.estado??"-"}</td>
                        <td style={td}>{p.endereco?.cidade??"-"}</td>
                        <td style={{...td,textAlign:"center"}}>
                          <button className="btn small-btn"       onClick={()=>handleEdit(p.id)}>✏️</button>
                          <button className="btn small-btn danger" style={{marginLeft:8}}
                                  onClick={()=>askDelete(p.id)}>🗑️</button>
                        </td>
                      </tr>
                  ))}
                  {pessoasFiltradas.length===0&&(
                      <tr><td style={td} colSpan={6}>Nenhuma pessoa encontrada</td></tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* modal (mesmo visual do CompanyListing) */}
        {showDeleteModal&&(
            <div className="modal-overlay">
              <div className="modal-box">
                <h3>Confirmação de Exclusão</h3>
                <p>Digite a senha de administrador para EXCLUIR:</p>
                <input type="password" className="input" placeholder="Senha"
                       value={deletePwd} onChange={e=>setDeletePwd(e.target.value)}
                       style={{margin:"8px 0 16px 0"}}/>
                <div className="modal-actions">
                  <button className="btn back"   onClick={()=>setShowDeleteModal(false)}>Cancelar</button>
                  <button className="btn danger" style={{marginLeft:8}} onClick={confirmDelete}>Excluir</button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

/* estilos inline de tabela (iguais) */
const th={padding:"10px",textAlign:"left",fontWeight:600,borderBottom:"2px solid #c9e2ff"};
const thCenter={...th,textAlign:"center",width:120};
const td={padding:"8px 10px",borderBottom:"1px solid #e0e0e0",fontSize:"0.95rem"};

export default PersonListing;
