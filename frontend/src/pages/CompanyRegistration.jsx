import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/companyRegistration.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const CompanyRegistration = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [cadastroAberto, setCadastroAberto] = useState(false);

  const [formData, setFormData] = useState({
    codigo: "",
    cnpj: "",
    inscricaoMunicipal: "",
    inscricaoEstadual: "",
    razaoSocial: "",
    nomeFantasia: "",
    sigla: "",
    nomeSite: "",
    tipoEmpresa: "",
    regimeEmpresarial: "",
    estadoEmpresa: "",
    telefones: [{ numero: "", principal: true, whatsapp: false }],
    redesSociais: {
      email: "",
      instagram: "",
      twitter: "",
      tiktok: "",
    },
    endereco: {
      formato: "brasil",
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      regiao: "",
      pais: "",
      latitude: "",
      longitude: "",
      linkMaps: "",
    },
    exibirSite: false,
  });

  const [tiposEmpresa, setTiposEmpresa] = useState([]);
  const [regimesEmpresariais, setRegimesEmpresariais] = useState([]);
  const [estadosEmpresa, setEstadosEmpresa] = useState([]);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/tipos_empresa/").then((res) => setTiposEmpresa(res.data || []));
    axios.get("http://127.0.0.1:8000/regimes_empresariais/").then((res) => setRegimesEmpresariais(res.data || []));
    axios.get("http://127.0.0.1:8000/estados_empresa/").then((res) => setEstadosEmpresa(res.data || []));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEnderecoChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, endereco: { ...formData.endereco, [name]: value } });
  };

  const handleTelefoneChange = (index, field, value) => {
    const novos = [...formData.telefones];
    novos[index][field] = field === "numero" ? value : !novos[index][field];
    setFormData({ ...formData, telefones: novos });
  };

  const addTelefone = () => {
    const novosTelefones = [...formData.telefones, { numero: "", principal: false, whatsapp: false }];
    setFormData({ ...formData, telefones: novosTelefones });
  };

  const removeTelefone = (index) => {
    const novosTelefones = formData.telefones.filter((_, i) => i !== index);
    setFormData({ ...formData, telefones: novosTelefones });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/empresas/", formData);
      setMensagemSucesso("Empresa cadastrada com sucesso!");
      setTimeout(() => setMensagemSucesso(""), 5000);
    } catch (error) {
      console.error("Erro ao cadastrar empresa:", error);
    }
  };

  const steps = ["Empresa", "Endereço", "Redes Sociais", "Revisão"];

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <img src={logo} alt="Logo Welike" className="logo" />
        <nav className="menu">
          <div className="menu-item" onClick={() => setCadastroAberto(!cadastroAberto)}>
            Cadastros <span className={`arrow ${cadastroAberto ? "open" : "closed"}`}>&#9662;</span>
          </div>
          {cadastroAberto && (
            <div className="submenu">
              <div className="submenu-item" onClick={() => navigate("/")}>Cadastro de Empresas</div>
            </div>
          )}
        </nav>
      </aside>

      <div className="content">
        <div className="header-bar"></div>

        <div className="registration-container">
          <form onSubmit={handleSubmit} className="form-box">
            <div className="form-header">
              <h2>Cadastro de Empresa</h2>
              <span className="step-info">Etapa {step} de 4</span>
            </div>

            <div className="progress-bar">
              {steps.map((_, index) => (
                <div key={index} className={`bar ${step - 1 >= index ? "active" : ""}`}></div>
              ))}
            </div>

            {mensagemSucesso && <p className="success-message">{mensagemSucesso}</p>}

            {step === 1 && (
              <div className="form-step grid">
                <input className="input" placeholder="Código" name="codigo" value={formData.codigo} onChange={handleChange} />
                <input className="input" placeholder="Sigla" name="sigla" value={formData.sigla} onChange={handleChange} />
                <input className="input" placeholder="CNPJ" name="cnpj" value={formData.cnpj} onChange={handleChange} />
                <input className="input" placeholder="Inscrição Municipal" name="inscricaoMunicipal" value={formData.inscricaoMunicipal} onChange={handleChange} />
                <input className="input" placeholder="Inscrição Estadual" name="inscricaoEstadual" value={formData.inscricaoEstadual} onChange={handleChange} />
                <input className="input" placeholder="Razão Social" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} />
                <input className="input" placeholder="Nome Fantasia" name="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} />
                <input className="input" placeholder="Nome Site" name="nomeSite" value={formData.nomeSite} onChange={handleChange} />
                <select className="input" name="tipoEmpresa" value={formData.tipoEmpresa} onChange={handleChange}>
                  <option value="">Tipo de Empresa</option>
                  {tiposEmpresa.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                  ))}
                </select>
                <select className="input" name="regimeEmpresarial" value={formData.regimeEmpresarial} onChange={handleChange}>
                  <option value="">Regime Empresarial</option>
                  {regimesEmpresariais.map((regime) => (
                    <option key={regime.id} value={regime.id}>{regime.nome}</option>
                  ))}
                </select>
                <select className="input" name="estadoEmpresa" value={formData.estadoEmpresa} onChange={handleChange}>
                  <option value="">Estado da Empresa</option>
                  {estadosEmpresa.map((estado) => (
                    <option key={estado.id} value={estado.id}>{estado.nome}</option>
                  ))}
                </select>
              </div>
            )}

            {step === 2 && (
              <div className="form-step">
                <input className="input" placeholder="CEP" name="cep" value={formData.endereco.cep} onChange={handleEnderecoChange} />
                <input className="input" placeholder="Rua" name="rua" value={formData.endereco.rua} onChange={handleEnderecoChange} />
                <input className="input" placeholder="Número" name="numero" value={formData.endereco.numero} onChange={handleEnderecoChange} />
                <input className="input" placeholder="Bairro" name="bairro" value={formData.endereco.bairro} onChange={handleEnderecoChange} />
                <input className="input" placeholder="Cidade" name="cidade" value={formData.endereco.cidade} onChange={handleEnderecoChange} />
                <input className="input" placeholder="E-mail" name="email" value={formData.redesSociais.email} onChange={(e) => setFormData({ ...formData, redesSociais: { ...formData.redesSociais, email: e.target.value } })} />

                <label className="sub-label">Telefone Principal</label>
                {formData.telefones.map((tel, index) => (
                  <div key={index} className="telefone-group">
                    {index === 1 && <label className="sub-label">Telefones Secundários</label>}
                    <div className="telefone-inputs">
                      <input
                        type="text"
                        value={tel.numero}
                        onChange={(e) => handleTelefoneChange(index, "numero", e.target.value)}
                        placeholder="(00) 91234-5678"
                      />
                      <label>
                        <input
                          type="checkbox"
                          checked={tel.whatsapp}
                          onChange={() => handleTelefoneChange(index, "whatsapp")}
                        /> WhatsApp
                      </label>
                      {index > 0 && (
                        <button type="button" onClick={() => removeTelefone(index)} className="remove-btn">X</button>
                      )}
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addTelefone} className="add-btn">Adicionar novo telefone</button>
              </div>
            )}

            {step === 3 && (
              <div className="form-step">
                <input className="input" placeholder="Instagram" value={formData.redesSociais.instagram} onChange={(e) => setFormData({ ...formData, redesSociais: { ...formData.redesSociais, instagram: e.target.value } })} />
                <input className="input" placeholder="Twitter" value={formData.redesSociais.twitter} onChange={(e) => setFormData({ ...formData, redesSociais: { ...formData.redesSociais, twitter: e.target.value } })} />
                <input className="input" placeholder="TikTok" value={formData.redesSociais.tiktok} onChange={(e) => setFormData({ ...formData, redesSociais: { ...formData.redesSociais, tiktok: e.target.value } })} />
              </div>
            )}

            {step === 4 && (
              <div className="form-step">
                <h3>Confirme os dados antes de enviar:</h3>
                <pre>{JSON.stringify(formData, null, 2)}</pre>
              </div>
            )}

            <div className="navigation-buttons">
              {step > 1 && <button type="button" className="btn back" onClick={prevStep}>Voltar</button>}
              {step < 4 && <button type="button" className="btn continue" onClick={nextStep}>Continuar</button>}
              {step === 4 && <button type="submit" className="btn submit">Cadastrar</button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;
