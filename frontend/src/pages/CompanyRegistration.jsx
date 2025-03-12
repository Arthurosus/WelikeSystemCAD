import React, { useState } from "react";

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
    tipoEmpresa: "Própria",
    regimeEmpresarial: "Simples",
    estadoEmpresa: "Ativa",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container">
      <h2>Cadastro de Empresa</h2>
      <form>
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
          <label>Nome do Site:</label>
          <input type="text" name="nomeSite" value={formData.nomeSite} onChange={handleChange} />
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
          <label>Redes Sociais:</label>
          {Object.keys(formData.redesSociais).map((key) => (
            <div key={key}>
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              <input
                type="text"
                name={key}
                value={formData.redesSociais[key]}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    redesSociais: { ...formData.redesSociais, [key]: e.target.value },
                  });
                }}
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <label>Endereço:</label>
          <input
            type="checkbox"
            checked={formData.endereco.formato === "brasil"}
            onChange={() => {
              setFormData({
                ...formData,
                endereco: {
                  ...formData.endereco,
                  formato: formData.endereco.formato === "brasil" ? "internacional" : "brasil",
                },
              });
            }}
          />{" "}
          Formato Brasil
          <input type="text" name="cep" placeholder="CEP" value={formData.endereco.cep} onChange={handleChange} />
          <input type="text" name="rua" placeholder="Rua / Avenida" value={formData.endereco.rua} onChange={handleChange} />
          <input type="text" name="numero" placeholder="Número" value={formData.endereco.numero} onChange={handleChange} />
          <input type="text" name="complemento" placeholder="Complemento" value={formData.endereco.complemento} onChange={handleChange} />
          <input type="text" name="bairro" placeholder="Bairro" value={formData.endereco.bairro} onChange={handleChange} />
          <input type="text" name="cidade" placeholder="Cidade" value={formData.endereco.cidade} onChange={handleChange} />
          <input type="text" name="estado" placeholder="Estado" value={formData.endereco.estado} onChange={handleChange} />
          <input type="text" name="regiao" placeholder="Região" value={formData.endereco.regiao} onChange={handleChange} />
          <input type="text" name="pais" placeholder="País" value={formData.endereco.pais} onChange={handleChange} />
          <input type="text" name="latitude" placeholder="Latitude" value={formData.endereco.latitude} onChange={handleChange} />
          <input type="text" name="longitude" placeholder="Longitude" value={formData.endereco.longitude} onChange={handleChange} />
          <input type="text" name="linkMaps" placeholder="Link Google Maps" value={formData.endereco.linkMaps} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Exibir no site?</label>
          <input
            type="checkbox"
            checked={formData.exibirSite}
            onChange={(e) => setFormData({ ...formData, exibirSite: e.target.checked })}
          />
        </div>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default CompanyRegistration;
