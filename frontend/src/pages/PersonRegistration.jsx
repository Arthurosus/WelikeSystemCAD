
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/companyRegistration.css";

const estadosBrasil = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const paises = ["Brasil", "Estados Unidos", "Canadá", "Argentina", "Portugal"];

const PersonRegistration = () => {
  const [step, setStep] = useState(1);
  const [cadastroAberto, setCadastroAberto] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    login: "",
    senha: "",
    dtNascimento: "",
    sexo: "",
    mae: "",
    email: "",
    cpf: "",
    rg: "",
    rne: "",
    ativo: true,
    sTel: "",
    estadoCivil: "",
    franquado: false,
    endereco: {
      cep: "",
      tipoEnd: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      pais: "Brasil",
    },
    telefones: [
      { tipo: "Celular", numero: "", whatsapp: false },
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEnderecoChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      endereco: { ...formData.endereco, [name]: value },
    });
  };

  const handleTelefoneChange = (index, field, value) => {
    const novosTelefones = [...formData.telefones];
    novosTelefones[index][field] = field === "whatsapp" ? !novosTelefones[index][field] : value;
    setFormData({ ...formData, telefones: novosTelefones });
  };

  const addTelefone = () => {
    setFormData({
      ...formData,
      telefones: [...formData.telefones, { tipo: "", numero: "", whatsapp: false }],
    });
  };

  const removeTelefone = (index) => {
    const novos = formData.telefones.filter((_, i) => i !== index);
    setFormData({ ...formData, telefones: novos });
  };

  const buscarCEP = async () => {
    const cep = formData.endereco.cep.replace(/\D/g, "");
    if (cep.length === 8) {
      try {
        const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!res.data.erro) {
          setFormData({
            ...formData,
            endereco: {
              ...formData.endereco,
              endereco: res.data.logradouro,
              bairro: res.data.bairro,
              cidade: res.data.localidade,
              estado: res.data.uf,
            },
          });
        }
      } catch (err) {
        console.error("Erro ao buscar CEP", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
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
                <span className="step-info">Etapa {step} de 3</span>
              </div>

              <div className="progress-bar">
                {[1, 2, 3].map((n) => (
                    <div key={n} className={`bar ${step >= n ? "active" : ""}`} />
                ))}
              </div>

              {step === 1 && (
                  <div className="form-step grid">
                    <div className="input-group">
                      <label>Nome Completo</label>
                      <input className="input" name="nome" value={formData.nome} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label>Login</label>
                      <input className="input" name="login" value={formData.login} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label>Senha</label>
                      <input className="input" type="password" name="senha" value={formData.senha} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label>Data de Nascimento</label>
                      <input className="input" type="date" name="dtNascimento" value={formData.dtNascimento} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label>Sexo</label>
                      <input className="input" name="sexo" value={formData.sexo} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label>Nome da Mãe</label>
                      <input className="input" name="mae" value={formData.mae} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label>Email</label>
                      <input className="input" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label>CPF</label>
                      <input className="input" name="cpf" value={formData.cpf} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label>RG</label>
                      <input className="input" name="rg" value={formData.rg} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label>RNE</label>
                      <input className="input" name="rne" value={formData.rne} onChange={handleChange} />
                    </div>
                  </div>
              )}

              {step === 2 && (
                  <div className="form-step grid">
                    <div className="input-group">
                      <label>CEP</label>
                      <input className="input" name="cep" value={formData.endereco.cep} onBlur={buscarCEP} onChange={handleEnderecoChange} />
                    </div>
                    <div className="input-group">
                      <label>Endereço</label>
                      <input className="input" name="endereco" value={formData.endereco.endereco} onChange={handleEnderecoChange} />
                    </div>
                    <div className="input-group">
                      <label>Número</label>
                      <input className="input" name="numero" value={formData.endereco.numero} onChange={handleEnderecoChange} />
                    </div>
                    <div className="input-group">
                      <label>Complemento</label>
                      <input className="input" name="complemento" value={formData.endereco.complemento} onChange={handleEnderecoChange} />
                    </div>
                    <div className="input-group">
                      <label>Bairro</label>
                      <input className="input" name="bairro" value={formData.endereco.bairro} onChange={handleEnderecoChange} />
                    </div>
                    <div className="input-group">
                      <label>Cidade</label>
                      <input className="input" name="cidade" value={formData.endereco.cidade} onChange={handleEnderecoChange} />
                    </div>
                    <div className="input-group">
                      <label>Estado</label>
                      <select className="input" name="estado" value={formData.endereco.estado} onChange={handleEnderecoChange}>
                        <option value="">Estado</option>
                        {estadosBrasil.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                      </select>
                    </div>
                    <div className="input-group">
                      <label>País</label>
                      <select className="input" name="pais" value={formData.endereco.pais} onChange={handleEnderecoChange}>
                        <option value="">País</option>
                        {paises.map((pais) => <option key={pais} value={pais}>{pais}</option>)}
                      </select>
                    </div>
                  </div>
              )}

              {step === 3 && (
                  <div className="form-step">
                    <h4>Telefones</h4>
                    {formData.telefones.map((tel, index) => (
                        <div className="telefone-group" key={index}>
                          <div className="telefone-inputs">
                            <input className="input" placeholder="Tipo" value={tel.tipo} onChange={(e) => handleTelefoneChange(index, "tipo", e.target.value)} />
                            <input className="input" placeholder="Número" value={tel.numero} onChange={(e) => handleTelefoneChange(index, "numero", e.target.value)} />
                            <label><input type="checkbox" checked={tel.whatsapp} onChange={() => handleTelefoneChange(index, "whatsapp")} /> WhatsApp</label>
                            {index > 0 && <button type="button" className="remove-btn" onClick={() => removeTelefone(index)}>X</button>}
                          </div>
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={addTelefone}>Adicionar Telefone</button>
                  </div>
              )}

              <div className="navigation-buttons">
                {step > 1 && <button type="button" className="btn back" onClick={() => setStep(step - 1)}>Voltar</button>}
                {step < 3 && <button type="button" className="btn continue" onClick={() => setStep(step + 1)}>Continuar</button>}
                {step === 3 && <button type="submit" className="btn submit">Cadastrar</button>}
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default PersonRegistration;
