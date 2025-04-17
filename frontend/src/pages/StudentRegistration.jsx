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

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const StudentRegistration = () => {
  const [step, setStep] = useState(1);
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [pessoas, setPessoas] = useState([]);
  const [buscaPessoa, setBuscaPessoa] = useState("");
  const [pessoaSelecionada, setPessoaSelecionada] = useState(null);

  const [formData, setFormData] = useState({
    codEmpresa: "",
    nomeEmpresa: "",
    cargo: "",
    referencia: "",
    foto: "",
    sexo: "",
    idadeAluno: "",
    idadeCTR: "",
    rmCTR: "",
    especialCTR: "",
    complementoCTR: "",
    codContato: "",
    codCurso: "",
    dtContrato: "",
    nomeCTR: "",
    rgCTR: "",
    cpfCTR: "",
    dtNascCTR: "",
    sexoCTR: "",
    numeroCTR: "",
    bairroCTR: "",
    cidadeCTR: "",
    estadoCTR: "",
    cepCTR: "",
    telefoneCTR: "",
    celularCTR: "",
    emailCTR: "",
    dtSolicitacaoCancelamento: "",
    nivelamento: false,
    reembolsoCTR: false,
    emancipadoCTR: false,
    aprovado: false
  });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/pessoas/`)
      .then((res) => setPessoas(res.data))
      .catch((err) => console.error("Erro ao buscar pessoas:", err));
  }, []);

  const filtrarPessoas = pessoas.filter(p =>
    p.nome.toLowerCase().includes(buscaPessoa.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/.test(formData.cpfCTR)) {
      alert("CPF inválido. Use o formato 000.000.000-00.");
      return;
    }
    console.log("Dados do Aluno:", formData);
  };

  return (
    <div className="main-layout">
      <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />
      <div className="content">
        <div className="header-bar"></div>
        <div className="registration-container">
          <form onSubmit={handleSubmit} className="form-box">
            <div className="form-header">
              <h2>Cadastro de Aluno</h2>
              <span className="step-info">Etapa {step} de 3</span>
            </div>
            <div className="progress-bar">
              {[1, 2, 3].map((n) => (
                <div key={n} className={`bar ${step >= n ? "active" : ""}`} />
              ))}
            </div>

            {step === 1 && (
              <div className="form-step grid">
                <div className="autocomplete-container">
                  <input
                    className="input search-input distinct-input"
                    placeholder="Buscar Pessoa..."
                    value={buscaPessoa}
                    onChange={(e) => setBuscaPessoa(e.target.value)}
                  />
                  {buscaPessoa && filtrarPessoas.length > 0 && (
                    <div className="autocomplete-results">
                      {filtrarPessoas.map((pessoa) => (
                        <div
                          key={pessoa.id}
                          className="autocomplete-item"
                          onClick={() => {
                            setPessoaSelecionada(pessoa);
                            setBuscaPessoa(pessoa.nome);
                          }}
                        >
                          {pessoa.nome}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input className="input" name="codEmpresa" placeholder="Código da Empresa" value={formData.codEmpresa} onChange={handleChange} />
                <input className="input" name="nomeEmpresa" placeholder="Nome da Empresa" value={formData.nomeEmpresa} onChange={handleChange} />
                <input className="input" name="cargo" placeholder="Cargo" value={formData.cargo} onChange={handleChange} />
                <input className="input" name="referencia" placeholder="Referência" value={formData.referencia} onChange={handleChange} />
              </div>
            )}

            {step === 2 && (
              <div className="form-step grid">
                <input className="input" name="codCurso" placeholder="Código do Curso" value={formData.codCurso} onChange={handleChange} />
                <input className="input" type="date" name="dtContrato" placeholder="Data Contrato" value={formData.dtContrato} onChange={handleChange} />
                <input className="input" name="nomeCTR" placeholder="Nome do Responsável" value={formData.nomeCTR} onChange={handleChange} />
                <input className="input" name="cpfCTR" placeholder="CPF do Responsável (000.000.000-00)" value={formData.cpfCTR} onChange={handleChange} />
                <input className="input" name="telefoneCTR" placeholder="Telefone do Responsável" value={formData.telefoneCTR} onChange={handleChange} />
                <input className="input" name="emailCTR" placeholder="Email do Responsável" value={formData.emailCTR} onChange={handleChange} />
              </div>
            )}

            {step === 3 && (
              <div className="form-step checkbox-grid">
                <label className="checkbox-label large">
                  <input type="checkbox" name="nivelamento" checked={formData.nivelamento} onChange={handleChange} /> Nivelamento
                </label>
                <label className="checkbox-label large">
                  <input type="checkbox" name="emancipadoCTR" checked={formData.emancipadoCTR} onChange={handleChange} /> Emancipado
                </label>
                <label className="checkbox-label large">
                  <input type="checkbox" name="aprovado" checked={formData.aprovado} onChange={handleChange} /> Aprovado
                </label>
              </div>
            )}

            <div className="navigation-buttons">
              {step > 1 && <button type="button" className="btn btn-lg back" onClick={() => setStep(step - 1)}>Voltar</button>}
              {step < 3 && <button type="button" className="btn btn-lg continue" onClick={() => setStep(step + 1)}>Continuar</button>}
              {step === 3 && <button type="submit" className="btn btn-lg submit">Cadastrar</button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;
