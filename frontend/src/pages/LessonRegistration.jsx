import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/companyRegistration.css";
import HeaderActions from "../components/HeaderActions";

const LessonRegistration = () => {
    const [cadastroAberto, setCadastroAberto] = useState(false);
    const [formData, setFormData] = useState({
        codEmpresa: "",
        codigo: "",
        descricao: "",
        tipo: "",
        preRequisito: "",
        observacao: "",
        estagio: "",
        codTipo: "",
        ativo: true,
        alias: "",
        codEstagio: "",
        flgOnline: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dados da Aula:", formData);
        // API POST aqui
    };

    return (
        <div className="main-layout">
            <Sidebar cadastroAberto={cadastroAberto} setCadastroAberto={setCadastroAberto} />
            <div className="content">
                <HeaderActions categoria="aulas" />
                <div className="header-bar"></div>
                <div className="registration-container">
                    <form onSubmit={handleSubmit} className="form-box">
                        <div className="form-header">
                            <h2>Cadastro de Aula</h2>
                            <span className="step-info">Etapa 1 de 1</span>
                        </div>

                        <div className="form-step grid">
                            <div className="input-group">
                                <label htmlFor="codEmpresa">Código da Empresa</label>
                                <input className="input" name="codEmpresa" value={formData.codEmpresa} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="codigo">Código da Aula</label>
                                <input className="input" name="codigo" value={formData.codigo} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="descricao">Descrição</label>
                                <input className="input" name="descricao" value={formData.descricao} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="tipo">Tipo</label>
                                <input className="input" name="tipo" value={formData.tipo} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="preRequisito">Pré-requisito</label>
                                <input className="input" name="preRequisito" value={formData.preRequisito} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="observacao">Observação</label>
                                <textarea className="input" name="observacao" value={formData.observacao} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="estagio">Estágio</label>
                                <input className="input" name="estagio" value={formData.estagio} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="codTipo">Código do Tipo</label>
                                <input className="input" name="codTipo" value={formData.codTipo} onChange={handleChange} />
                            </div>
                            <div className="input-group checkbox large-checkbox colored">
                                <label className="checkbox-label">
                                    <input type="checkbox" name="ativo" checked={formData.ativo} onChange={handleChange} />
                                    Aula Ativa
                                </label>
                            </div>
                            <div className="input-group">
                                <label htmlFor="alias">Alias</label>
                                <input className="input" name="alias" value={formData.alias} onChange={handleChange} />
                            </div>
                            <div className="input-group">
                                <label htmlFor="codEstagio">Código do Estágio</label>
                                <input className="input" name="codEstagio" value={formData.codEstagio} onChange={handleChange} />
                            </div>
                            <div className="input-group checkbox large-checkbox colored">
                                <label className="checkbox-label">
                                    <input type="checkbox" name="flgOnline" checked={formData.flgOnline} onChange={handleChange} />
                                    Aula Online
                                </label>
                            </div>
                        </div>

                        <div className="navigation-buttons">
                            <button type="submit" className="btn submit">Cadastrar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LessonRegistration;
