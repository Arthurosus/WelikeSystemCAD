import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/companyRegistration.css";
import HeaderActions from "../components/HeaderActions";


const RoleRegistration = () => {
  const [formData, setFormData] = useState({
    codEmpresa: "",
    codCargo: "",
    professor: false,
    descricao: "",
    ativo: false,
  });

  const [cadastroAberto, setCadastroAberto] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do cargo:", formData);
    // Aqui entraria o POST para a API futuramente
  };

  return (
      <div className="main-layout">
        <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />
        <div className="content">
          <HeaderActions categoria="cargos" />
          <div className="header-bar"></div>
          <div className="registration-container">
            <form className="form-box" onSubmit={handleSubmit}>
              <div className="form-header">
                <h2>Cadastro de Cargo</h2>
                <span className="step-info">Etapa 1 de 1</span>
              </div>

              <div className="form-step grid">
                <div className="input-group">
                  <label htmlFor="codEmpresa">Código da Empresa</label>
                  <input
                      className="input"
                      id="codEmpresa"
                      name="codEmpresa"
                      value={formData.codEmpresa}
                      onChange={handleChange}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="codCargo">Código do Cargo</label>
                  <input
                      className="input"
                      id="codCargo"
                      name="codCargo"
                      value={formData.codCargo}
                      onChange={handleChange}
                  />
                </div>

                <div className="input-group checkbox-container">
                  <input
                      type="checkbox"
                      id="professor"
                      name="professor"
                      checked={formData.professor}
                      onChange={handleChange}
                  />
                  <label className="checkbox-label" htmlFor="professor">
                    É Professor(a)
                  </label>
                </div>

                <div className="input-group">
                  <label htmlFor="descricao">Descrição</label>
                  <input
                      className="input"
                      id="descricao"
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleChange}
                  />
                </div>

                <div className="input-group checkbox-container">
                  <input
                      type="checkbox"
                      id="ativo"
                      name="ativo"
                      checked={formData.ativo}
                      onChange={handleChange}
                  />
                  <label className="checkbox-label" htmlFor="ativo">
                    Cargo Ativo
                  </label>
                </div>
              </div>

              <div className="navigation-buttons">
                <button type="submit" className="btn submit">
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default RoleRegistration;
