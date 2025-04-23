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
  const [alunoEhContratante, setAlunoEhContratante] = useState(false);

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

  useEffect(() => {
    if (alunoEhContratante && pessoaSelecionada) {
      setFormData((prev) => ({
        ...prev,
        nomeCTR: pessoaSelecionada.nome || "",
        emailCTR: pessoaSelecionada.email || "",
        cpfCTR: pessoaSelecionada.cpf || "",
        telefoneCTR: pessoaSelecionada.telefone || ""
      }));
    }
  }, [alunoEhContratante, pessoaSelecionada]);

  const handleSubmit = (e) => {
    e.preventDefault();
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
                    <div className="input-group">
                      <label htmlFor="buscaPessoa">Buscar Aluno</label>
                      <input
                          id="buscaPessoa"
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

                    <div className="input-group">
                      <label htmlFor="codEmpresa">Código da Empresa</label>
                      <input id="codEmpresa" className="input" name="codEmpresa" value={formData.codEmpresa} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                      <label htmlFor="nomeEmpresa">Nome da Empresa</label>
                      <input id="nomeEmpresa" className="input" name="nomeEmpresa" value={formData.nomeEmpresa} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                      <label htmlFor="cargo">Cargo</label>
                      <input id="cargo" className="input" name="cargo" value={formData.cargo} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                      <label htmlFor="referencia">Referência</label>
                      <input id="referencia" className="input" name="referencia" value={formData.referencia} onChange={handleChange} />
                    </div>

                    <div className="input-group checkbox large-checkbox colored">
                      <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={alunoEhContratante}
                            onChange={(e) => setAlunoEhContratante(e.target.checked)}
                        /> Aluno é o Contratante?
                      </label>
                    </div>
                  </div>
              )}

              {step === 2 && (
                  <div className="form-step grid">
                    <div className="input-group">
                      <label htmlFor="codCurso">Código do Curso</label>
                      <input id="codCurso" className="input" name="codCurso" value={formData.codCurso} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                      <label htmlFor="dtContrato">Data do Contrato</label>
                      <input id="dtContrato" className="input" type="date" name="dtContrato" value={formData.dtContrato} onChange={handleChange} />
                    </div>

                    {!alunoEhContratante && (
                        <>
                          <div className="input-group">
                            <label htmlFor="nomeCTR">Nome do Contratante</label>
                            <input id="nomeCTR" className="input" name="nomeCTR" value={formData.nomeCTR} onChange={handleChange} />
                          </div>
                          <div className="input-group">
                            <label htmlFor="cpfCTR">CPF do Contratante</label>
                            <input id="cpfCTR" className="input" name="cpfCTR" value={formData.cpfCTR} onChange={handleChange} />
                          </div>
                          <div className="input-group">
                            <label htmlFor="telefoneCTR">Telefone do Contratante</label>
                            <input id="telefoneCTR" className="input" name="telefoneCTR" value={formData.telefoneCTR} onChange={handleChange} />
                          </div>
                          <div className="input-group">
                            <label htmlFor="emailCTR">Email do Contratante</label>
                            <input id="emailCTR" className="input" name="emailCTR" value={formData.emailCTR} onChange={handleChange} />
                          </div>
                        </>
                    )}
                  </div>
              )}

              {step === 3 && (
                  <div className="form-step grid">
                    <div className="input-group checkbox large-checkbox colored">
                      <label className="checkbox-label">
                        <input type="checkbox" name="nivelamento" checked={formData.nivelamento} onChange={handleChange} /> Nivelamento
                      </label>
                    </div>
                    <div className="input-group checkbox large-checkbox colored">
                      <label className="checkbox-label">
                        <input type="checkbox" name="emancipadoCTR" checked={formData.emancipadoCTR} onChange={handleChange} /> Emancipado
                      </label>
                    </div>
                    <div className="input-group checkbox large-checkbox colored">
                      <label className="checkbox-label">
                        <input type="checkbox" name="aprovado" checked={formData.aprovado} onChange={handleChange} /> Aprovado
                      </label>
                    </div>
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
