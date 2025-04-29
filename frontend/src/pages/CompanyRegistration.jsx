import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/companyRegistration.css";
import Sidebar from "../components/Sidebar";
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
    telefones: [{ codigo_pais: "+55", numero: "", principal: true, whatsapp: false }],
    redesSociais: {
      email: "",
      instagram: "",
      twitter: "",
      tiktok: "",
    },
    endereco: {
      formato: "brasil",
      cep: "",
      zip: "",
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

  const toggleFormatoEndereco = () => {
    const novoFormato = formData.endereco.formato === "brasil" ? "internacional" : "brasil";
    setFormData({
      ...formData,
      endereco: {
        ...formData.endereco,
        formato: novoFormato,
      },
    });
  };

  const buscarEnderecoViaCEP = async () => {
    const cep = formData.endereco.cep.replace(/\D/g, "");
    if (cep.length === 8) {
      try {
        const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!res.data.erro) {
          setFormData((prev) => ({
            ...prev,
            endereco: {
              ...prev.endereco,
              rua: res.data.logradouro,
              bairro: res.data.bairro,
              cidade: res.data.localidade,
              estado: res.data.uf,
            },
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
      }
    }
  };

  const buscarEnderecoViaZip = async () => {
    const zip = formData.endereco.zip;
    if (zip.length >= 5) {
      try {
        const res = await axios.get(`https://api.zippopotam.us/us/${zip}`);
        const info = res.data.places[0];
        setFormData((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            cidade: info["place name"],
            estado: info["state abbreviation"],
            pais: res.data.country,
          },
        }));
      } catch (err) {
        console.error("Erro ao buscar ZIP Code:", err);
      }
    }
  };

  const handleTelefoneChange = (index, field, value) => {
    const novos = [...formData.telefones];
    novos[index][field] = value;
    setFormData({ ...formData, telefones: novos });
  };

  const addTelefone = () => {
    setFormData({
      ...formData,
      telefones: [...formData.telefones, { codigo_pais: "+55", numero: "", principal: false, whatsapp: false }],
    });
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
        <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />
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

              {/* Step 1: Dados da Empresa */}
              {step === 1 && (
                  <div className="form-step grid">
                    {[
                      ["Código", "codigo"],
                      ["Sigla", "sigla"],
                      ["CNPJ", "cnpj"],
                      ["Inscrição Municipal", "inscricaoMunicipal"],
                      ["Inscrição Estadual", "inscricaoEstadual"],
                      ["Razão Social", "razaoSocial"],
                      ["Nome Fantasia", "nomeFantasia"],
                      ["Nome do Site", "nomeSite"]
                    ].map(([label, name]) => (
                        <label key={name} className="input-group">
                          {label}
                          <input className="input" name={name} value={formData[name]} onChange={handleChange} />
                        </label>
                    ))}

                    <label className="input-group">Tipo de Empresa
                      <select className="input" name="tipoEmpresa" value={formData.tipoEmpresa} onChange={handleChange}>
                        <option value="">Selecione</option>
                        {tiposEmpresa.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                        ))}
                      </select>
                    </label>

                    <label className="input-group">Regime Empresarial
                      <select className="input" name="regimeEmpresarial" value={formData.regimeEmpresarial} onChange={handleChange}>
                        <option value="">Selecione</option>
                        {regimesEmpresariais.map((regime) => (
                            <option key={regime.id} value={regime.id}>{regime.nome}</option>
                        ))}
                      </select>
                    </label>

                    <label className="input-group">Estado da Empresa
                      <select className="input" name="estadoEmpresa" value={formData.estadoEmpresa} onChange={handleChange}>
                        <option value="">Selecione</option>
                        {estadosEmpresa.map((estado) => (
                            <option key={estado.id} value={estado.id}>{estado.nome}</option>
                        ))}
                      </select>
                    </label>
                  </div>
              )}

              {/* Step 2: Endereço e Telefones */}
              {step === 2 && (
                  <div className="form-step">
                    <label className="sub-label">Formato do Endereço</label>
                    <button type="button" onClick={toggleFormatoEndereco} className="add-btn">
                      Usar formato {formData.endereco.formato === "brasil" ? "Internacional" : "Brasil"}
                    </button>

                    {formData.endereco.formato === "brasil" ? (
                        <label className="input-group">CEP
                          <input className="input" name="cep" value={formData.endereco.cep} onChange={handleEnderecoChange} onBlur={buscarEnderecoViaCEP} />
                        </label>
                    ) : (
                        <label className="input-group">ZIP Code
                          <input className="input" name="zip" value={formData.endereco.zip} onChange={handleEnderecoChange} onBlur={buscarEnderecoViaZip} />
                        </label>
                    )}

                    {["rua", "numero", "complemento", "bairro", "cidade", "estado", "regiao", "pais", "linkMaps"].map((field) => (
                        <label key={field} className="input-group">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                          <input className="input" name={field} value={formData.endereco[field]} onChange={handleEnderecoChange} />
                        </label>
                    ))}

                    {/* Telefones */}
                    <label className="sub-label">Telefones</label>
                    {formData.telefones.map((tel, index) => (
                        <div key={index} className="telefone-group">
                          <div className="telefone-inputs">
                            <select
                                className="select-codigo-pais"
                                value={tel.codigo_pais}
                                onChange={(e) => handleTelefoneChange(index, "codigo_pais", e.target.value)}

                            >
                              <option value="+55">🇧🇷 +55</option>
                              <option value="+1">🇺🇸 +1</option>
                              <option value="+44">🇬🇧 +44</option>
                              <option value="+351">🇵🇹 +351</option>
                              <option value="+81">🇯🇵 +81</option>
                            </select>

                            <input
                                type="text"
                                value={tel.numero}
                                onChange={(e) => handleTelefoneChange(index, "numero", e.target.value)}
                                placeholder="Número"
                                maxLength={11}
                            />

                            <label>
                              <input
                                  type="checkbox"
                                  checked={tel.whatsapp}
                                  onChange={(e) => handleTelefoneChange(index, "whatsapp", e.target.checked)}
                              />
                              WhatsApp
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
              {/* Step 3: Redes Sociais */}
              {step === 3 && (
                  <div className="form-step">
                    {["email", "instagram", "twitter", "tiktok"].map((field) => (
                        <label key={field} className="input-group">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                          <input
                              className="input"
                              value={formData.redesSociais[field]}
                              onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    redesSociais: { ...formData.redesSociais, [field]: e.target.value },
                                  })
                              }
                          />
                        </label>
                    ))}
                  </div>
              )}

              {/* Step 4: Revisão Final */}
              {step === 4 && (
                  <div className="form-step">
                    <h3>Confirmação dos Dados</h3>
                    <div className="confirmation-box">

                      <div className="confirm-section">
                        <h4>Empresa</h4>
                        <p><strong>Código:</strong> {formData.codigo}</p>
                        <p><strong>Sigla:</strong> {formData.sigla}</p>
                        <p><strong>CNPJ:</strong> {formData.cnpj}</p>
                        <p><strong>Inscrição Municipal:</strong> {formData.inscricaoMunicipal}</p>
                        <p><strong>Inscrição Estadual:</strong> {formData.inscricaoEstadual}</p>
                        <p><strong>Razão Social:</strong> {formData.razaoSocial}</p>
                        <p><strong>Nome Fantasia:</strong> {formData.nomeFantasia}</p>
                        <p><strong>Nome do Site:</strong> {formData.nomeSite}</p>
                        <p><strong>Tipo de Empresa:</strong> {formData.tipoEmpresa}</p>
                        <p><strong>Regime Empresarial:</strong> {formData.regimeEmpresarial}</p>
                        <p><strong>Estado da Empresa:</strong> {formData.estadoEmpresa}</p>
                      </div>

                      <div className="confirm-section">
                        <h4>Endereço</h4>
                        <p><strong>Formato:</strong> {formData.endereco.formato}</p>
                        <p><strong>CEP:</strong> {formData.endereco.cep}</p>
                        <p><strong>ZIP:</strong> {formData.endereco.zip}</p>
                        <p><strong>Rua:</strong> {formData.endereco.rua}</p>
                        <p><strong>Número:</strong> {formData.endereco.numero}</p>
                        <p><strong>Complemento:</strong> {formData.endereco.complemento}</p>
                        <p><strong>Bairro:</strong> {formData.endereco.bairro}</p>
                        <p><strong>Cidade:</strong> {formData.endereco.cidade}</p>
                        <p><strong>Estado:</strong> {formData.endereco.estado}</p>
                        <p><strong>Região:</strong> {formData.endereco.regiao}</p>
                        <p><strong>País:</strong> {formData.endereco.pais}</p>
                        <p><strong>Link Google Maps:</strong> {formData.endereco.linkMaps}</p>
                      </div>

                      <div className="confirm-section">
                        <h4>Telefones</h4>
                        {formData.telefones.map((tel, index) => (
                            <p key={index}>
                              <strong>{tel.principal ? "Principal" : "Secundário"}:</strong> {tel.codigo_pais} {tel.numero} {tel.whatsapp && "(WhatsApp)"}
                            </p>
                        ))}
                      </div>

                      <div className="confirm-section">
                        <h4>Redes Sociais</h4>
                        <p><strong>Email:</strong> {formData.redesSociais.email}</p>
                        <p><strong>Instagram:</strong> {formData.redesSociais.instagram}</p>
                        <p><strong>Twitter:</strong> {formData.redesSociais.twitter}</p>
                        <p><strong>TikTok:</strong> {formData.redesSociais.tiktok}</p>
                      </div>
                    </div>
                  </div>
              )}

              {/* Botões de Navegação */}
              <div className="navigation-buttons">
                {step > 1 && (
                    <button type="button" className="btn back" onClick={prevStep}>
                      Voltar
                    </button>
                )}
                {step < 4 && (
                    <button type="button" className="btn continue" onClick={nextStep}>
                      Continuar
                    </button>
                )}
                {step === 4 && (
                    <button type="submit" className="btn submit">
                      Cadastrar
                    </button>
                )}
              </div>

            </form>
          </div>
        </div>
      </div>
  );
};

export default CompanyRegistration;
