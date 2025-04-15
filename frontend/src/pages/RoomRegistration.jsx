import React, { useState } from "react";
import Sidebar from "../components/Sidebar"; // ajuste o caminho se necessário
import "../styles/companyRegistration.css"; // ou crie uma css própria
import { useNavigate } from "react-router-dom";

const RoomRegistration = () => {
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="main-layout">
      <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />

      <div className="content">
        <div className="header-bar"></div>

        <div className="registration-container">
          <form className="form-box">
            <div className="form-header">
              <h2>Cadastro de Sala de Aula</h2>
            </div>

            <div className="form-step">
              <input className="input" placeholder="Nome da Sala" name="nomeSala" />
              <input className="input" placeholder="Limite de Alunos" name="limiteAlunos" type="number" />
              <button type="submit" className="btn submit">Cadastrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomRegistration;
