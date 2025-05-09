// src/components/RoomForm.jsx
import React, { useState, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Valores‑padrão para um novo registro                              */
/* ------------------------------------------------------------------ */
const DEFAULT_DATA = {
    nomeSala:     "",
    limiteAlunos: "",
    descricao:    "",
    ativo:        true,
};

/**
 * Formulário reutilizável de **Sala de Aula**
 *
 * @param {"create" | "edit"} mode         – muda rótulo/título
 * @param {object|null}       initialData  – dados já existentes (ou null)
 * @param {function}          onSubmit     – callback com dados finais
 */
export default function RoomForm({
                                     mode = "create",
                                     initialData = null,
                                     onSubmit,
                                 }) {
    /* ------------------------------------------------------------------
       1. State: inicia mesclando DEFAULT_DATA + (se houver) initialData
    ------------------------------------------------------------------ */
    const [formData, setFormData] = useState(() => ({
        ...DEFAULT_DATA,
        ...(initialData || {}),
    }));

    /* ------------------------------------------------------------------
       2. Quando receber novos dados (edição), atualiza o formulário
          ⚠️ Só executa se initialData NÃO for null/undefined
    ------------------------------------------------------------------ */
    useEffect(() => {
        if (initialData) {
            setFormData({ ...DEFAULT_DATA, ...initialData });
        }
    }, [initialData]);

    /* 3. Handlers                                                        */
    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(formData);
    };

    return (
        <form className="form-box" onSubmit={handleSubmit}>
            <div className="form-header">
                <h2>{mode === "edit" ? "Edição de Sala" : "Cadastro de Sala de Aula"}</h2>
                <span className="step-info">Etapa 1 de 1</span>
            </div>

            <div className="form-step grid" style={{ maxWidth: 600 }}>
                <div className="input-group">
                    <label>Nome da Sala</label>
                    <input
                        className="input"
                        name="nomeSala"
                        value={formData.nomeSala}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group">
                    <label>Limite de Alunos</label>
                    <input
                        className="input"
                        name="limiteAlunos"
                        type="number"
                        min={0}
                        value={formData.limiteAlunos}
                        onChange={handleChange}
                    />
                </div>

                <div className="input-group" style={{ gridColumn: "1 / span 2" }}>
                    <label>Descrição (opcional)</label>
                    <input
                        className="input"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                    />
                </div>

                <div
                    className="input-group checkbox-container"
                    style={{ gridColumn: "1 / span 2" }}
                >
                    <input
                        type="checkbox"
                        id="ativo"
                        name="ativo"
                        checked={formData.ativo}
                        onChange={handleChange}
                    />
                    <label className="checkbox-label" htmlFor="ativo">
                        Sala Ativa
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
