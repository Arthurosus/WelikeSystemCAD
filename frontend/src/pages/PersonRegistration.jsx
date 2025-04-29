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
  const [mesmoEndereco, setMesmoEndereco] = useState(false);

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
    enderecoMoradia: {
      formato: "brasil",
      cep: "",
      zip: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      regiao: "",
      pais: "Brasil",
    },
    enderecoCorrespondencia: {
      formato: "brasil",
      cep: "",
      zip: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      regiao: "",
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

  const handleEnderecoChange = (section, e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));
  };

  const toggleFormatoEndereco = (section) => {
    const novoFormato = formData[section].formato === "brasil" ? "internacional" : "brasil";
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], formato: novoFormato },
    }));
  };

  const buscarEnderecoViaCEP = async (section) => {
    const cep = formData[section].cep.replace(/\D/g, "");
    if (cep.length === 8) {
      try {
        const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!res.data.erro) {
          setFormData((prev) => ({
            ...prev,
            [section]: {
              ...prev[section],
              endereco: res.data.logradouro,
              bairro: res.data.bairro,
              cidade: res.data.localidade,
              estado: res.data.uf,
              pais: "Brasil",
            },
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
      }
    }
  };

  const buscarEnderecoViaZIP = async (section) => {
    const zip = formData[section].zip;
    if (zip.length >= 5) {
      try {
        const res = await axios.get(`https://api.zippopotam.us/us/${zip}`);
        const info = res.data.places[0];
        setFormData((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
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

    if (field === "whatsapp") {
      novos[index].whatsapp = !novos[index].whatsapp;
    } else if (field === "codigo_pais") {
      novos[index].codigo_pais = value;
    } else if (field === "numero") {
      novos[index].numero = value;
    }

    setFormData({ ...formData, telefones: novos });
  };


  const addTelefone = () => {
    setFormData((prev) => ({
      ...prev,
      telefones: [...prev.telefones, { tipo: "", numero: "", whatsapp: false }],
    }));
  };

  const removeTelefone = (index) => {
    const novos = formData.telefones.filter((_, i) => i !== index);
    setFormData({ ...formData, telefones: novos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const renderEndereco = (section, label) => (
      <div className="endereco-section">
        <h3>{label}</h3>

        {/* Botão fora do grid */}
        <div className="form-toggle-format">
          <button
              type="button"
              onClick={() => toggleFormatoEndereco(section)}
              className="add-btn"
          >
            Usar formato {formData[section].formato === "brasil" ? "Internacional" : "Brasil"}
          </button>
        </div>

        {/* Agora começa o GRID apenas para campos */}
        <div className="address-grid">
          {formData[section].formato === "brasil" ? (
              <>
                <div className="input-group">
                  <label>CEP</label>
                  <input className="input" name="cep" value={formData[section].cep} onChange={(e) => handleEnderecoChange(section, e)} onBlur={() => buscarEnderecoViaCEP(section)} />
                </div>
                <div className="input-group">
                  <label>Número</label>
                  <input className="input" name="numero" value={formData[section].numero} onChange={(e) => handleEnderecoChange(section, e)} />
                </div>
              </>
          ) : (
              <>
                <div className="input-group">
                  <label>ZIP Code</label>
                  <input className="input" name="zip" value={formData[section].zip} onChange={(e) => handleEnderecoChange(section, e)} onBlur={() => buscarEnderecoViaZIP(section)} />
                </div>
                <div className="input-group">
                  <label>Número</label>
                  <input className="input" name="numero" value={formData[section].numero} onChange={(e) => handleEnderecoChange(section, e)} />
                </div>
              </>
          )}

          <div className="input-group">
            <label>Endereço</label>
            <input className="input" name="endereco" value={formData[section].endereco} onChange={(e) => handleEnderecoChange(section, e)} />
          </div>
          <div className="input-group">
            <label>Complemento</label>
            <input className="input" name="complemento" value={formData[section].complemento} onChange={(e) => handleEnderecoChange(section, e)} />
          </div>

          <div className="input-group">
            <label>Bairro</label>
            <input className="input" name="bairro" value={formData[section].bairro} onChange={(e) => handleEnderecoChange(section, e)} />
          </div>
          <div className="input-group">
            <label>Cidade</label>
            <input className="input" name="cidade" value={formData[section].cidade} onChange={(e) => handleEnderecoChange(section, e)} />
          </div>

          <div className="input-group">
            <label>Estado</label>
            <input className="input" name="estado" value={formData[section].estado} onChange={(e) => handleEnderecoChange(section, e)} />
          </div>
          <div className="input-group">
            <label>Região</label>
            <input className="input" name="regiao" value={formData[section].regiao} onChange={(e) => handleEnderecoChange(section, e)} />
          </div>

          <div className="input-group" style={{ gridColumn: "1 / span 2" }}>
            <label>País</label>
            <input className="input" name="pais" value={formData[section].pais} onChange={(e) => handleEnderecoChange(section, e)} />
          </div>
        </div>
      </div>
  );



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
                    {[
                      ["Nome", "nome"],
                      ["Login", "login"],
                      ["Senha", "senha"],
                      ["Data de Nascimento", "dtNascimento"],
                      ["Sexo", "sexo"],
                      ["Nome da Mãe", "mae"],
                      ["Email", "email"],
                      ["CPF", "cpf"],
                      ["RG", "rg"],
                      ["RNE", "rne"],
                    ].map(([label, name]) => (
                        <div className="input-group" key={name}>
                          <label>{label}</label>
                          <input className="input" type={name === "senha" ? "password" : (name === "dtNascimento" ? "date" : "text")} name={name} value={formData[name]} onChange={handleChange} />
                        </div>
                    ))}
                  </div>
              )}

              {step === 2 && (
                  <div className="form-step">
                    <div className="address-grid">
                      {renderEndereco("enderecoMoradia", "Endereço de Moradia")}
                    </div>

                    <div className="checkbox-endereco-wrapper">
                      <label className="checkbox-endereco-mesmo">
                        <input
                            type="checkbox"
                            checked={mesmoEndereco}
                            onChange={(e) => setMesmoEndereco(e.target.checked)}
                        />
                        Endereço de Correspondência é o mesmo
                      </label>
                    </div>

                    {!mesmoEndereco && (
                        <div className="address-grid">
                          {renderEndereco("enderecoCorrespondencia", "Endereço de Correspondência")}
                        </div>
                    )}
                  </div>
              )}

              {step === 3 && (
                  <div className="form-step">
                    <h4>Telefones</h4>
                    {formData.telefones.map((tel, index) => (
                        <div className="telefone-group" key={index}>
                          <div className="telefone-inputs">

                            <select
                                className="select-codigo-pais"
                                value={tel.codigo_pais || "+55"}
                                onChange={(e) => handleTelefoneChange(index, "codigo_pais", e.target.value)}
                            >
                              <option value="+55">🇧🇷 +55</option>
                              <option value="+1">🇺🇸 +1</option>
                              <option value="+44">🇬🇧 +44</option>
                              <option value="+351">🇵🇹 +351</option>
                              <option value="+81">🇯🇵 +81</option>
                            </select>

                            <input
                                className="input"
                                placeholder="Número"
                                value={tel.numero}
                                onChange={(e) => handleTelefoneChange(index, "numero", e.target.value)}
                                maxLength={11}
                            />

                            <label>
                              <input
                                  type="checkbox"
                                  checked={tel.whatsapp}
                                  onChange={() => handleTelefoneChange(index, "whatsapp")}
                              /> WhatsApp
                            </label>

                            {index > 0 && (
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeTelefone(index)}
                                >
                                  X
                                </button>
                            )}
                          </div>
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={addTelefone}>
                      Adicionar Telefone
                    </button>
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
