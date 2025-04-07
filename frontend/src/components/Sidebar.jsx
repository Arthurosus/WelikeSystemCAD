import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/sidebar.css";

const Sidebar = ({ cadastroAberto, setCadastroAberto }) => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <img src={logo} alt="Logo Welike" className="logo" />
      <nav className="menu">
        <div className="menu-item" onClick={() => setCadastroAberto(!cadastroAberto)}>
          Cadastros <span className={`arrow ${cadastroAberto ? "open" : "closed"}`}>&#9662;</span>
        </div>
        <div className={`submenu ${cadastroAberto ? "visible" : "hidden"}`}>
          <div className="submenu-item" onClick={() => navigate("/")}>Cadastro de Empresas</div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
