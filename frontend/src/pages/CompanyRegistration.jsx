import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/companyRegistration.css";
import logo from "../assets/logo.png";

const CompanyRegistration = () => {
  const [step, setStep] = useState(1);
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
    telefones: [{ numero: "", principal: false, whatsapp: false }],
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
    setFormData({
      ...formData,
      telefones: [...formData.telefones, { numero: "", principal: false, whatsapp: false }],
    });
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
          {Array(6).fill("Texto").map((item, i) => (
            <div key={i} className="menu-item">{item}</div>
          ))}
        </nav>
      </aside>

      <div className="content">
        <div className="header-bar"></div>

        <div className="registration-container">
          <form className="form-box" onSubmit={handleSubmit}>
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
              <div className="form-step form-grid">
                <input name="codigo" value={formData.codigo} onChange={handleChange} placeholder="Código" required />
                <input name="sigla" value={formData.sigla} onChange={handleChange} placeholder="Sigla" required />
                <input name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="CNPJ" required />
                <input name="inscricaoMunicipal" value={formData.inscricaoMunicipal} onChange={handleChange} placeholder="Inscrição Municipal" />
                <input name="inscricaoEstadual" value={formData.inscricaoEstadual} onChange={handleChange} placeholder="Inscrição Estadual" />
                <input name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} placeholder="Razão Social" required />
                <input name="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} placeholder="Nome Fantasia" required />
                <input name="nomeSite" value={formData.nomeSite} onChange={handleChange} placeholder="Nome Site" />
                <select name="tipoEmpresa" value={formData.tipoEmpresa} onChange={handleChange} required>
                  <option value="">Tipo de Empresa</option>
                  {tiposEmpresa.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
                <select name="regimeEmpresarial" value={formData.regimeEmpresarial} onChange={handleChange} required>
                  <option value="">Regime Empresarial</option>
                  {regimesEmpresariais.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}
                </select>
                <select name="estadoEmpresa" value={formData.estadoEmpresa} onChange={handleChange} required>
                  <option value="">Estado da Empresa</option>
                  {estadosEmpresa.map((e) => <option key={e.id} value={e.id}>{e.nome}</option>)}
                </select>
              </div>
            )}

            {step === 2 && (
              <div className="form-step form-grid">
                <input name="cep" value={formData.endereco.cep} onChange={handleEnderecoChange} placeholder="CEP" />
                <input name="rua" value={formData.endereco.rua} onChange={handleEnderecoChange} placeholder="Rua / Avenida" />
                <input name="numero" value={formData.endereco.numero} onChange={handleEnderecoChange} placeholder="Número" />
                <input name="bairro" value={formData.endereco.bairro} onChange={handleEnderecoChange} placeholder="Bairro" />
                <input name="cidade" value={formData.endereco.cidade} onChange={handleEnderecoChange} placeholder="Cidade" />
                <input name="linkMaps" value={formData.endereco.linkMaps} onChange={handleEnderecoChange} placeholder="Link Google Maps" />

                <input name="email" value={formData.redesSociais.email} onChange={(e) => setFormData({ ...formData, redesSociais: { ...formData.redesSociais, email: e.target.value } })} placeholder="E-mail" />
                {formData.telefones.map((tel, i) => (
                  <div key={i} className="telefone-box">
                    <input
                      placeholder={`Telefone ${i + 1}`}
                      value={tel.numero}
                      onChange={(e) => handleTelefoneChange(i, "numero", e.target.value)}
                    />
                    <label><input type="checkbox" checked={tel.principal} onChange={() => handleTelefoneChange(i, "principal")} /> Principal</label>
                    <label><input type="checkbox" checked={tel.whatsapp} onChange={() => handleTelefoneChange(i, "whatsapp")} /> WhatsApp</label>
                  </div>
                ))}
                <button type="button" onClick={addTelefone} className="btn secondary">Adicionar novo telefone</button>
              </div>
            )}

            {step === 3 && (
              <div className="form-step form-grid">
                <input name="instagram" value={formData.redesSociais.instagram} onChange={(e) => setFormData({ ...formData, redesSociais: { ...formData.redesSociais, instagram: e.target.value } })} placeholder="Instagram" />
                <input name="twitter" value={formData.redesSociais.twitter} onChange={(e) => setFormData({ ...formData, redesSociais: { ...formData.redesSociais, twitter: e.target.value } })} placeholder="Twitter" />
                <input name="tiktok" value={formData.redesSociais.tiktok} onChange={(e) => setFormData({ ...formData, redesSociais: { ...formData.redesSociais, tiktok: e.target.value } })} placeholder="TikTok" />
              </div>
            )}

            {step === 4 && (
              <div className="form-step">
                <h3>Confirme os dados antes de enviar:</h3>
                <pre className="json-preview">{JSON.stringify(formData, null, 2)}</pre>
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
