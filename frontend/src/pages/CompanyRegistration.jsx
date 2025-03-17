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
    telefones: [
      { numero: "", principal: false, whatsapp: false },
      { numero: "", principal: false, whatsapp: false },
      { numero: "", principal: false, whatsapp: false },
      { numero: "", principal: false, whatsapp: false },
    ],
    tipoEmpresa: "",
    regimeEmpresarial: "",
    estadoEmpresa: "",
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
    axios.get("http://127.0.0.1:8000/tipos_empresa/").then((response) => setTiposEmpresa(response.data));
    axios.get("http://127.0.0.1:8000/regimes_empresariais/").then((response) => setRegimesEmpresariais(response.data));
    axios.get("http://127.0.0.1:8000/estados_empresa/").then((response) => setEstadosEmpresa(response.data));
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
        </div>

        <div className="form-group">
          <label>CNPJ:</label>
          <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} />
          <label>Inscrição Municipal:</label>
          <input type="text" name="inscricaoMunicipal" value={formData.inscricaoMunicipal} onChange={handleChange} />
          <label>Inscrição Estadual:</label>
          <input type="text" name="inscricaoEstadual" value={formData.inscricaoEstadual} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Razão Social:</label>
          <input type="text" name="razaoSocial" value={formData.razaoSocial} onChange={handleChange} />
          <label>Nome Fantasia:</label>
          <input type="text" name="nomeFantasia" value={formData.nomeFantasia} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Sigla:</label>
          <input type="text" name="sigla" value={formData.sigla} onChange={handleChange} />
          <label>Nome Site:</label>
          <input type="text" name="nomeSite" value={formData.nomeSite} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Tipo de Empresa:</label>
          <select name="tipoEmpresa" value={formData.tipoEmpresa} onChange={handleChange}>
            {tiposEmpresa.map((tipo) => (
              <option key={tipo.id} value={tipo.nome}>{tipo.nome}</option>
            ))}
          </select>

          <label>Regime Empresarial:</label>
          <select name="regimeEmpresarial" value={formData.regimeEmpresarial} onChange={handleChange}>
            {regimesEmpresariais.map((regime) => (
              <option key={regime.id} value={regime.nome}>{regime.nome}</option>
            ))}
          </select>

          <label>Estado da Empresa:</label>
          <select name="estadoEmpresa" value={formData.estadoEmpresa} onChange={handleChange}>
            {estadosEmpresa.map((estado) => (
              <option key={estado.id} value={estado.nome}>{estado.nome}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Telefones:</label>
          {formData.telefones.map((tel, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder={`Telefone ${index + 1}`}
                value={tel.numero}
                onChange={(e) => {
                  let newTels = [...formData.telefones];
                  newTels[index].numero = e.target.value;
                  setFormData({ ...formData, telefones: newTels });
                }}
              />
              <input
                type="checkbox"
                checked={tel.principal}
                disabled={formData.telefones.some((t) => t.principal)}
                onChange={() => {
                  let newTels = [...formData.telefones];
                  newTels.forEach((t) => (t.principal = false));
                  newTels[index].principal = true;
                  setFormData({ ...formData, telefones: newTels });
                }}
              />{" "}
              Principal
              <input
                type="checkbox"
                checked={tel.whatsapp}
                onChange={() => {
                  let newTels = [...formData.telefones];
                  newTels[index].whatsapp = !newTels[index].whatsapp;
                  setFormData({ ...formData, telefones: newTels });
                }}
              />{" "}
              WhatsApp
            </div>
          ))}
        </div>

        <div className="form-group">
          <label>Endereço:</label>
          <input type="text" name="cep" placeholder="CEP" value={formData.endereco.cep} onChange={handleEnderecoChange} />
          <input type="text" name="rua" placeholder="Rua / Avenida" value={formData.endereco.rua} onChange={handleEnderecoChange} />
          <input type="text" name="numero" placeholder="Número" value={formData.endereco.numero} onChange={handleEnderecoChange} />
          <input type="text" name="bairro" placeholder="Bairro" value={formData.endereco.bairro} onChange={handleEnderecoChange} />
          <input type="text" name="cidade" placeholder="Cidade" value={formData.endereco.cidade} onChange={handleEnderecoChange} />
          <input type="text" name="linkMaps" placeholder="Link Google Maps" value={formData.endereco.linkMaps} onChange={handleEnderecoChange} />
        </div>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default CompanyRegistration;
