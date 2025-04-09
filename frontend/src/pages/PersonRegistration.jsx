import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/companyRegistration.css"; // reutilizando o mesmo estilo

const PersonRegistration = () => {
  const [cadastroAberto, setCadastroAberto] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    endereco: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados da pessoa:", formData);
  };

  return (
    <div className="main-layout">
      <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />
      <div className="content">
        <div className="header-bar"></div>
        <div className="registration-container">
          <form onSubmit={handleSubmit} className="form-box">
            <div className="form-header">
              <h2>Cadastro de Pessoa</h2>
            </div>
            <div className="form-step grid">
              <input className="input" placeholder="Nome" name="nome" value={formData.nome} onChange={handleChange} />
              <input className="input" placeholder="CPF" name="cpf" value={formData.cpf} onChange={handleChange} />
              <input className="input" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
              <input className="input" placeholder="Telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
              <input className="input" placeholder="Endereço" name="endereco" value={formData.endereco} onChange={handleChange} />
            </div>
            <div className="navigation-buttons">
              <button type="submit" className="btn submit">Cadastrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonRegistration;
