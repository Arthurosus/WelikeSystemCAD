import React, { useState } from "react";
import { useNavigate }     from "react-router-dom";
import logo                from "../assets/logo.png";
import { ROUTES }          from "../routes";
import "../styles/sidebar.css";

export default function Sidebar({ cadastroAberto, setCadastroAberto }) {
  const navigate = useNavigate();
  const [operacoesAbertos,  setOperacoesAbertos]  = useState(false);
  const [relatoriosAbertos, setRelatoriosAbertos] = useState(false);

  return (
      <aside className="sidebar">
        {/* LOGO – leva à tela inicial */}
        <div
            className="logo-wrapper"
            onClick={() => navigate(ROUTES.WELCOME)}
            title="Página inicial"
        >
          <img src={logo} alt="Logo Welike" className="logo" />
        </div>

        <nav className="menu">
          {/* ───────── Cadastros ───────── */}
          <div
              className={`menu-item ${cadastroAberto ? "open" : ""}`}
              onClick={() => setCadastroAberto(!cadastroAberto)}
          >
            Cadastros{" "}
            <span className={`arrow ${cadastroAberto ? "open" : "closed"}`}>▼</span>
          </div>

          <div className={`submenu ${cadastroAberto ? "visible" : "hidden"}`}>
            <div className="submenu-item" onClick={() => navigate(ROUTES.EMP_NEW)}>
              Cadastro de Empresas
            </div>
            <div className="submenu-item" onClick={() => navigate(ROUTES.PERSON_NEW)}>
              Cadastro de Pessoas
            </div>
            <div className="submenu-item" onClick={() => navigate(ROUTES.ROLE_NEW)}>
              Cadastro de Cargos
            </div>
            <div className="submenu-item" onClick={() => navigate(ROUTES.ROOM_NEW)}>
              Cadastro de Sala de Aula
            </div>
            <div className="submenu-item" onClick={() => navigate(ROUTES.STUD_NEW)}>
              Cadastro de Aluno
            </div>
            <div className="submenu-item" onClick={() => navigate(ROUTES.EMPLOYEE_NEW)}>
              Cadastro de Funcionário
            </div>
            <div className="submenu-item" onClick={() => navigate(ROUTES.LESSON_NEW)}>
              Cadastro de Aula
            </div>
          </div>

          {/* ───────── Operações ───────── */}
          {/* mantido igual – não havia rotas constantes para estes ainda */}
          <div
              className={`menu-item ${operacoesAbertos ? "open" : ""}`}
              onClick={() => setOperacoesAbertos(!operacoesAbertos)}
          >
            Operações{" "}
            <span className={`arrow ${operacoesAbertos ? "open" : "closed"}`}>▼</span>
          </div>
          <div className={`submenu ${operacoesAbertos ? "visible" : "hidden"}`}>
            <div className="submenu-item" onClick={() => navigate("/operacao-financeiro")}>
              Operação Financeira
            </div>
            <div className="submenu-item" onClick={() => navigate("/operacao-pedagogico")}>
              Operação Pedagógica
            </div>
          </div>

          {/* ───────── Relatórios ───────── */}
          <div
              className={`menu-item ${relatoriosAbertos ? "open" : ""}`}
              onClick={() => setRelatoriosAbertos(!relatoriosAbertos)}
          >
            Relatórios{" "}
            <span className={`arrow ${relatoriosAbertos ? "open" : "closed"}`}>▼</span>
          </div>
          <div className={`submenu ${relatoriosAbertos ? "visible" : "hidden"}`}>
            <div className="submenu-item" onClick={() => navigate("/relatorio-financeiro")}>
              Relatório Financeiro
            </div>
            <div className="submenu-item" onClick={() => navigate("/relatorio-pedagogico")}>
              Relatório Pedagógico
            </div>
          </div>
        </nav>
      </aside>
  );
}
