import React, { useState, useEffect } from "react";
import axios from "axios";

const CompanyRegistration = () => {
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
      { numero: "", principal: false, whatsapp: false },
      { numero: "", principal: false, whatsapp: false },
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
      .then((response) => {
        console.log("Tipos de Empresa carregados:", response.data);
        setTiposEmpresa(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => console.error("Erro ao carregar tipos de empresa:", error));

    axios.get("http://127.0.0.1:8000/regimes_empresariais/")
      .then((response) => {
        console.log("Regimes Empresariais carregados:", response.data);
        setRegimesEmpresariais(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => console.error("Erro ao carregar regimes empresariais:", error));

    axios.get("http://127.0.0.1:8000/estados_empresa/")
      .then((response) => {
        console.log("Estados da Empresa carregados:", response.data);
        setEstadosEmpresa(Array.isArray(response.data) ? response.data : []);
      })
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
        <div className="form-group">
          <label>Código:</label>
          <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} />
          <label>CNPJ:</label>
          <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} />
          <label>Inscrição Municipal:</label>
          <input type="text" name="inscricaoMunicipal" value={formData.inscricaoMunicipal} onChange={handleChange} />
          <label>Inscrição Estadual:</label>
          <input type="text" name="inscricaoEstadual" value={formData.inscricaoEstadual} onChange={handleChange} />
          <label>Razão Social:</label>
          <input type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} />
          <label>Nome Fantasia:</label>
          <input type="text" name="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} />
          <label>Sigla:</label>
          <input type="text" name="sigla" value={formData.sigla} onChange={handleChange} />
          <label>Nome Site:</label>
          <input type="text" name="nomeSite" value={formData.nomeSite} onChange={handleChange} />

          <label>Tipo de Empresa:</label>
          <select name="tipoEmpresa" value={String(formData.tipoEmpresa)} onChange={handleChange}>
            <option value="">Selecione...</option>
            {tiposEmpresa.map((tipo) => (
              <option key={tipo.id} value={String(tipo.id)}>{tipo.nome}</option>
            ))}
          </select>

          <label>Regime Empresarial:</label>
          <select name="regimeEmpresarial" value={String(formData.regimeEmpresarial)} onChange={handleChange}>
            <option value="">Selecione...</option>
            {regimesEmpresariais.map((regime) => (
              <option key={regime.id} value={String(regime.id)}>{regime.nome}</option>
            ))}
          </select>

          <label>Estado da Empresa:</label>
          <select name="estadoEmpresa" value={String(formData.estadoEmpresa)} onChange={handleChange}>
            <option value="">Selecione...</option>
            {estadosEmpresa.map((estado) => (
              <option key={estado.id} value={String(estado.id)}>{estado.nome}</option>
            ))}
          </select>

          <div>
            <label>Telefones:</label>
            {formData.telefones.map((telefone, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder={`Telefone ${index + 1}`}
                  value={telefone.numero}
                  onChange={(e) => handleTelefoneChange(index, "numero", e.target.value)}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={telefone.principal}
                    onChange={() => handleTelefoneChange(index, "principal")}
                  /> Principal
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={telefone.whatsapp} 
                    onChange={() => handleTelefoneChange(index, "whatsapp")}
                  /> WhatsApp
                </label>
              </div>
            ))}
          </div>

          <label>Endereço:</label>
          <input type="text" placeholder="CEP" name="cep" value={formData.endereco.cep} onChange={handleEnderecoChange} />
          <input type="text" placeholder="Rua / Avenida" name="rua" value={formData.endereco.rua} onChange={handleEnderecoChange} />
          <input type="text" placeholder="Número" name="numero" value={formData.endereco.numero} onChange={handleEnderecoChange} />
          <input type="text" placeholder="Bairro" name="bairro" value={formData.endereco.bairro} onChange={handleEnderecoChange} />
          <input type="text" placeholder="Cidade" name="cidade" value={formData.endereco.cidade} onChange={handleEnderecoChange} />
          <input type="text" placeholder="Link Google Maps" name="linkMaps" value={formData.endereco.linkMaps} onChange={handleEnderecoChange} />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default CompanyRegistration;
