
import React, { useEffect, useState, memo } from "react";

const DEFAULT_DATA = {
    codEmpresa:   "",
    codigo:       "",
    descricao:    "",
    tipo:         "",
    preRequisito: "",
    observacao:   "",
    estagio:      "",
    codTipo:      "",
    ativo:        true,
    alias:        "",
    codEstagio:   "",
    flgOnline:    false,
};

function LessonForm({ mode = "create", initialData = {}, onSubmit }) {
    /* ── state ─────────────────────────────────────────────────────────── */
    const [formData, setFormData] = useState({ ...DEFAULT_DATA, ...initialData });

    /* quando abrir em modo edição                                        */
    useEffect(() => {
        setFormData({ ...DEFAULT_DATA, ...initialData });
    }, [initialData]);

    /* ── handlers ─────────────────────────────────────────────────────── */
    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(formData);
    };

    /* ── JSX ──────────────────────────────────────────────────────────── */
    return (
        <form className="form-box" onSubmit={handleSubmit}>
            <div className="form-header">
                <h2>{mode === "edit" ? "Edição de Aula" : "Cadastro de Aula"}</h2>
                <span className="step-info">Etapa 1 de 1</span>
            </div>

            <div className="progress-bar">
                <div className="bar active" />
            </div>

            <div className="form-step grid">
                {/* primeira coluna */}
                {[
                    ["codEmpresa", "Código da Empresa"],
                    ["codigo", "Código da Aula"],
                    ["descricao", "Descrição"],
                    ["tipo", "Tipo"],
                    ["preRequisito", "Pré‑requisito"],
                    ["estagio", "Estágio"],
                    ["codTipo", "Código do Tipo"],
                    ["alias", "Alias"],
                    ["codEstagio", "Código do Estágio"],
                ].map(([name, label]) => (
                    <div className="input-group" key={name}>
                        <label>{label}</label>
                        <input
                            className="input"
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                        />
                    </div>
                ))}

                {/* observação textarea ocupa linha inteira */}
                <div className="input-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Observação</label>
                    <textarea
                        className="input"
                        name="observacao"
                        rows={3}
                        style={{ resize: "vertical" }}
                        value={formData.observacao}
                        onChange={handleChange}
                    />
                </div>

                {/* check‑boxes */}
                <div className="input-group checkbox large-checkbox colored">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="ativo"
                            checked={formData.ativo}
                            onChange={handleChange}
                        />{" "}
                        Aula Ativa
                    </label>
                </div>

                <div className="input-group checkbox large-checkbox colored">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="flgOnline"
                            checked={formData.flgOnline}
                            onChange={handleChange}
                        />{" "}
                        Aula Online
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

export default memo(LessonForm);
