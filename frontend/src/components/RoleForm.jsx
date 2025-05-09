/**
 * Formulário reutilizável para **Cargo**.
 *
 * • mode:        "create" | "edit"
 * • initialData: objeto com shape igual ao DEFAULT_DATA
 * • onSubmit:    callback(data)  ← recebe os dados finais
 *
 * Estilo reaproveita companyRegistration.css
 */

import React, { useState, useEffect } from "react";

const DEFAULT_DATA = {
    codEmpresa: "",
    codCargo: "",
    professor: false,
    descricao: "",
    ativo: false,
};

export default function RoleForm({
                                     mode = "create",
                                     initialData = null,
                                     onSubmit,
                                 }) {
    /* state */
    const [formData, setFormData] = useState(() => ({
        ...DEFAULT_DATA,
        ...(initialData || {}),
    }));

    /* carrega dados quando vierem (modo edit) */
    useEffect(() => {
        if (initialData) setFormData({ ...DEFAULT_DATA, ...initialData });
    }, [initialData]);

    /* handlers */
    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((p) => ({
            ...p,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(formData);
    };

    /* JSX */
    return (
        <form className="form-box" onSubmit={handleSubmit}>
            <div className="form-header">
                <h2>{mode === "edit" ? "Edição de Cargo" : "Cadastro de Cargo"}</h2>
                <span className="step-info">Etapa 1 de 1</span>
            </div>

            <div className="form-step grid">
                {/* código empresa */}
                <div className="input-group">
                    <label htmlFor="codEmpresa">Código da Empresa</label>
                    <input
                        className="input"
                        id="codEmpresa"
                        name="codEmpresa"
                        value={formData.codEmpresa}
                        onChange={handleChange}
                    />
                </div>

                {/* código cargo */}
                <div className="input-group">
                    <label htmlFor="codCargo">Código do Cargo</label>
                    <input
                        className="input"
                        id="codCargo"
                        name="codCargo"
                        value={formData.codCargo}
                        onChange={handleChange}
                    />
                </div>

                {/* professor? */}
                <div className="input-group checkbox-container">
                    <input
                        type="checkbox"
                        id="professor"
                        name="professor"
                        checked={formData.professor}
                        onChange={handleChange}
                    />
                    <label className="checkbox-label" htmlFor="professor">
                        É Professor(a)
                    </label>
                </div>

                {/* descrição */}
                <div className="input-group" style={{ gridColumn: "1 / span 2" }}>
                    <label htmlFor="descricao">Descrição</label>
                    <input
                        className="input"
                        id="descricao"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                    />
                </div>

                {/* ativo? */}
                <div className="input-group checkbox-container">
                    <input
                        type="checkbox"
                        id="ativo"
                        name="ativo"
                        checked={formData.ativo}
                        onChange={handleChange}
                    />
                    <label className="checkbox-label" htmlFor="ativo">
                        Cargo Ativo
                    </label>
                </div>
            </div>

            <div className="navigation-buttons">
                <button type="submit" className="btn submit">
                    {mode === "edit" ? "Salvar" : "Cadastrar"}
                </button>
            </div>
        </form>
    );
}
