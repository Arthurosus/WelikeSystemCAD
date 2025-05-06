import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/companyRegistration.css";
import HeaderActions from "../components/HeaderActions";

const estadosBrasil = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const paises = ["Brasil", "Estados Unidos", "Canadá", "Argentina", "Portugal"];

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const EmployeeRegistration = () => {
    const [step, setStep] = useState(1);
    const [cadastroAberto, setCadastroAberto] = useState(false);
    const [pessoas, setPessoas] = useState([]);
    const [buscaPessoa, setBuscaPessoa] = useState("");
    const [pessoaSelecionada, setPessoaSelecionada] = useState(null);
    const [cargos, setCargos] = useState(["Instrutor", "Recepção", "Gerente"]);

    const [formData, setFormData] = useState({
        codEmpresa: "",
        status: "",
        dtAdmissao: "",
        dtAfastamento: "",
        observacao: "",
        cargo: "",
        ativo: false
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
        console.log("Dados do Funcionário:", {
            ...formData,
            pessoaId: pessoaSelecionada?.id
        });
    };

    return (
        <div className="main-layout">
            <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />
            <div className="content">
                <HeaderActions categoria="funcionarios" />
                <div className="header-bar"></div>
                <div className="registration-container">
                    <form onSubmit={handleSubmit} className="form-box">
                        <div className="form-header">
                            <h2>Cadastro de Funcionário</h2>
                            <span className="step-info">Etapa {step} de 1</span>
                        </div>
                        <div className="progress-bar">
                            <div className="bar active" />
                        </div>

                        <div className="form-step grid">
                            <div className="input-group">
                                <label>Buscar Pessoa</label>
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
                            <div className="input-group">
                                <label>Código da Empresa</label>
                                <input className="input" name="codEmpresa" value={formData.codEmpresa} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label>Status</label>
                                <input className="input" name="status" value={formData.status} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label>Data de Admissão</label>
                                <input className="input" type="date" name="dtAdmissao" value={formData.dtAdmissao} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label>Data de Afastamento</label>
                                <input className="input" type="date" name="dtAfastamento" value={formData.dtAfastamento} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label>Cargo</label>
                                <select className="input" name="cargo" value={formData.cargo} onChange={handleChange}>
                                    <option value="">Selecione o Cargo</option>
                                    {cargos.map((cargo, index) => (
                                        <option key={index} value={cargo}>{cargo}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Observações</label>
                                <textarea className="input" name="observacao" value={formData.observacao} onChange={handleChange} />
                            </div>
                            <div className="input-group checkbox-container">
                                <input
                                    type="checkbox"
                                    name="ativo"
                                    checked={formData.ativo}
                                    onChange={handleChange}
                                    id="ativo"
                                />
                                <label htmlFor="ativo" className="checkbox-label">
                                    Funcionário Ativo
                                </label>
                            </div>
                        </div>

                        <div className="navigation-buttons">
                            <button type="submit" className="btn btn-lg submit ativo-button">Cadastrar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EmployeeRegistration;
