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
          <div className="form-box">
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

            {/* AQUI CONTINUAM OS CAMPOS DO FORMULÁRIO (step === 1, 2, 3, 4) - já existentes */}
            {/* Use os mesmos blocos de "form-step", "form-grid", etc., já definidos */}

            <div className="navigation-buttons">
              {step > 1 && <button type="button" className="btn back" onClick={prevStep}>Voltar</button>}
              {step < 4 && <button type="button" className="btn continue" onClick={nextStep}>Continuar</button>}
              {step === 4 && <button type="submit" className="btn submit">Cadastrar</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistration;
