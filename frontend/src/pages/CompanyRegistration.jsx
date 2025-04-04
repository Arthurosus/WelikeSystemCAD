import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/companyRegistration.css";

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
    telefones: [
      { numero: "", principal: false, whatsapp: false },
    ],
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
    <div className="registration-container">
      <div className="header">
        <h2>Cadastro de Empresa</h2>
        <div className="progress-bar">
          {steps.map((_, index) => (
            <div key={index} className={`bar ${step - 1 >= index ? "active" : ""}`}></div>
          ))}
        </div>
      </div>

      {mensagemSucesso && <p className="success-message">{mensagemSucesso}</p>}

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="form-step fade-in">
            <div className="form-grid">
              <input className="input" placeholder="Código" name="codigo" value={formData.codigo} onChange={handleChange} required />
              <input className="input" placeholder="Sigla" name="sigla" value={formData.sigla} onChange={handleChange} required />
              <input className="input" placeholder="CNPJ" name="cnpj" value={formData.cnpj} onChange={handleChange} required />
              <input className="input" placeholder="Inscrição Municipal" name="inscricaoMunicipal" value={formData.inscricaoMunicipal} onChange={handleChange} />
              <input className="input" placeholder="Inscrição Estadual" name="inscricaoEstadual" value={formData.inscricaoEstadual} onChange={handleChange} />
              <input className="input" placeholder="Razão Social" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} required />
              <input className="input" placeholder="Nome Fantasia" name="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} required />
              <input className="input" placeholder="Nome Site" name="nomeSite" value={formData.nomeSite} onChange={handleChange} />
              <select className="input" name="tipoEmpresa" value={formData.tipoEmpresa} onChange={handleChange} required>
                <option value="">Tipo de Empresa</option>
                {tiposEmpresa.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                ))}
              </select>
              <select className="input" name="regimeEmpresarial" value={formData.regimeEmpresarial} onChange={handleChange} required>
                <option value="">Regime Empresarial</option>
                {regimesEmpresariais.map((regime) => (
                  <option key={regime.id} value={regime.id}>{regime.nome}</option>
                ))}
              </select>
              <select className="input" name="estadoEmpresa" value={formData.estadoEmpresa} onChange={handleChange} required>
                <option value="">Estado da Empresa</option>
                {estadosEmpresa.map((estado) => (
                  <option key={estado.id} value={estado.id}>{estado.nome}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step fade-in">
            <div className="form-grid">
              <input className="input" placeholder="CEP" name="cep" value={formData.endereco.cep} onChange={handleEnderecoChange} />
              <input className="input" placeholder="Rua / Avenida" name="rua" value={formData.endereco.rua} onChange={handleEnderecoChange} />
              <input className="input" placeholder="Número" name="numero" value={formData.endereco.numero} onChange={handleEnderecoChange} />
              <input className="input" placeholder="Bairro" name="bairro" value={formData.endereco.bairro} onChange={handleEnderecoChange} />
              <input className="input" placeholder="Cidade" name="cidade" value={formData.endereco.cidade} onChange={handleEnderecoChange} />
              <input className="input" placeholder="Link Google Maps" name="linkMaps" value={formData.endereco.linkMaps} onChange={handleEnderecoChange} />
            </div>
            <div className="form-grid">
              {formData.telefones.map((tel, index) => (
                <div key={index}>
                  <input
                    className="input"
                    placeholder={`Telefone ${index + 1}`}
                    value={tel.numero}
                    onChange={(e) => handleTelefoneChange(index, "numero", e.target.value)}
                  />
                  <label>
                    <input type="checkbox" checked={tel.principal} onChange={() => handleTelefoneChange(index, "principal")} /> Principal
                  </label>
                  <label>
                    <input type="checkbox" checked={tel.whatsapp} onChange={() => handleTelefoneChange(index, "whatsapp")} /> WhatsApp
                  </label>
                </div>
              ))}
              <button type="button" className="btn continue" onClick={addTelefone}>Adicionar novo telefone</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step fade-in">
            <div className="form-grid">
              <input className="input" placeholder="E-mail" name="email" value={formData.redesSociais.email} onChange={(e) => setFormData({ ...formData, redesSociais: { ...formData.redesSociais, email: e.target.value } })} />
              <input className="input" placeholder="Instagram" name="instagram" value={formData.redesSociais.instagram} onChange={(e) => setFormData({ ...formData, redesSociais: { ...formData.redesSociais, instagram: e.target.value } })} />
              <input className="input" placeholder="Twitter" name="twitter" value={formData.redesSociais.twitter} onChange={(e) => setFormData({ ...formData, redesSociais: { ...formData.redesSociais, twitter: e.target.value } })} />
              <input className="input" placeholder="TikTok" name="tiktok" value={formData.redesSociais.tiktok} onChange={(e) => setFormData({ ...formData, redesSociais: { ...formData.redesSociais, tiktok: e.target.value } })} />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="form-step fade-in confirmation-box">
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
  );
};

export default CompanyRegistration;
