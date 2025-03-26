import React, { useState, useEffect } from "react";
import axios from "axios";

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
    axios.get("http://127.0.0.1:8000/tipos_empresa/")
      .then((response) => setTiposEmpresa(response.data || []))
      .catch((error) => console.error("Erro ao carregar tipos de empresa:", error));

    axios.get("http://127.0.0.1:8000/regimes_empresariais/")
      .then((response) => setRegimesEmpresariais(response.data || []))
      .catch((error) => console.error("Erro ao carregar regimes empresariais:", error));

    axios.get("http://127.0.0.1:8000/estados_empresa/")
      .then((response) => setEstadosEmpresa(response.data || []))
      .catch((error) => console.error("Erro ao carregar estados da empresa:", error));
  }, []);

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
    novosTelefones[index][field] = field === "numero" ? value : !novosTelefones[index][field];
    setFormData({ ...formData, telefones: novosTelefones });
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

  return (
    <div className="container">
      <h2>Cadastro de Empresa</h2>
      {mensagemSucesso && <p style={{ color: "green" }}>{mensagemSucesso}</p>}
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="step step-1">
            <input placeholder="Código" name="codigo" value={formData.codigo} onChange={handleChange} />
            <input placeholder="Sigla" name="sigla" value={formData.sigla} onChange={handleChange} />
            <input placeholder="CNPJ" name="cnpj" value={formData.cnpj} onChange={handleChange} />
            <input placeholder="Inscrição Municipal" name="inscricaoMunicipal" value={formData.inscricaoMunicipal} onChange={handleChange} />
            <input placeholder="Inscrição Estadual" name="inscricaoEstadual" value={formData.inscricaoEstadual} onChange={handleChange} />
            <input placeholder="Razão Social" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} />
            <input placeholder="Nome Fantasia" name="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} />
            <input placeholder="Nome Site" name="nomeSite" value={formData.nomeSite} onChange={handleChange} />
            <select name="tipoEmpresa" value={String(formData.tipoEmpresa)} onChange={handleChange}>
              <option value="">Tipo de Empresa</option>
              {tiposEmpresa.map((tipo) => (
                <option key={tipo.id} value={String(tipo.id)}>{tipo.nome}</option>
              ))}
            </select>
            <select name="regimeEmpresarial" value={String(formData.regimeEmpresarial)} onChange={handleChange}>
              <option value="">Regime Empresarial</option>
              {regimesEmpresariais.map((regime) => (
                <option key={regime.id} value={String(regime.id)}>{regime.nome}</option>
              ))}
            </select>
            <select name="estadoEmpresa" value={String(formData.estadoEmpresa)} onChange={handleChange}>
              <option value="">Estado da Empresa</option>
              {estadosEmpresa.map((estado) => (
                <option key={estado.id} value={String(estado.id)}>{estado.nome}</option>
              ))}
            </select>
          </div>
        )}

        {step === 2 && (
          <div className="step step-2">
            <input placeholder="CEP" name="cep" value={formData.endereco.cep} onChange={handleEnderecoChange} />
            <input placeholder="Rua / Avenida" name="rua" value={formData.endereco.rua} onChange={handleEnderecoChange} />
            <input placeholder="Número" name="numero" value={formData.endereco.numero} onChange={handleEnderecoChange} />
            <input placeholder="Bairro" name="bairro" value={formData.endereco.bairro} onChange={handleEnderecoChange} />
            <input placeholder="Cidade" name="cidade" value={formData.endereco.cidade} onChange={handleEnderecoChange} />
            <input placeholder="Link Google Maps" name="linkMaps" value={formData.endereco.linkMaps} onChange={handleEnderecoChange} />
            {formData.telefones.map((tel, index) => (
              <div key={index}>
                <input
                  placeholder={`Telefone ${index + 1}`}
                  value={tel.numero}
                  onChange={(e) => handleTelefoneChange(index, "numero", e.target.value)}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={tel.principal}
                    onChange={() => handleTelefoneChange(index, "principal")}
                  /> Principal
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={tel.whatsapp}
                    onChange={() => handleTelefoneChange(index, "whatsapp")}
                  /> WhatsApp
                </label>
              </div>
            ))}
            <button type="button" onClick={addTelefone}>Adicionar novo telefone</button>
          </div>
        )}

        {step === 3 && (
          <div className="step step-3">
            <input placeholder="E-mail" name="email" value={formData.redesSociais.email} onChange={(e) => setFormData({ ...formData, redesSociais: { ...formData.redesSociais, email: e.target.value } })} />
            <input placeholder="Instagram" name="instagram" value={formData.redesSociais.instagram} onChange={(e) => setFormData({ ...formData, redesSociais: { ...formData.redesSociais, instagram: e.target.value } })} />
            <input placeholder="Twitter" name="twitter" value={formData.redesSociais.twitter} onChange={(e) => setFormData({ ...formData, redesSociais: { ...formData.redesSociais, twitter: e.target.value } })} />
            <input placeholder="TikTok" name="tiktok" value={formData.redesSociais.tiktok} onChange={(e) => setFormData({ ...formData, redesSociais: { ...formData.redesSociais, tiktok: e.target.value } })} />
          </div>
        )}

        {step === 4 && (
          <div className="step step-4">
            <h3>Confirme os dados antes de enviar</h3>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </div>
        )}

        <div className="step-navigation">
          {step > 1 && <button type="button" onClick={prevStep}>Voltar</button>}
          {step < 4 && <button type="button" onClick={nextStep}>Continuar</button>}
          {step === 4 && <button type="submit">Cadastrar</button>}
        </div>
      </form>
    </div>
  );
};

export default CompanyRegistration;
