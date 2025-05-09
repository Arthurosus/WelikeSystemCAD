/**
 * Formulário reutilizável para **Pessoa**.
 *
 * • `mode`:        "create" | "edit"
 * • `initialData`: objeto com o mesmo shape de DEFAULT_DATA  (ou null)
 * • `onSubmit`:    callback(data)  → recebe os dados finais
 *
 * Este componente contém TODO o fluxo de 3 etapas, busca CEP/ZIP,
 * telefones dinâmicos etc.  O CSS vem de companyRegistration.css.
 */

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

/* ─────────── dados vazios padrão ─────────── */
const DEFAULT_DATA = {
    nome: "", dtNascimento: "", sexo: "", mae: "", email: "",
    cpf: "", rg: "", rne: "", ativo: true, sTel: "", estadoCivil: "",
    franquado: false,

    enderecoMoradia: {
        formato: "brasil", cep: "", zip: "", endereco: "", numero: "",
        complemento: "", bairro: "", cidade: "", estado: "", regiao: "", pais: "Brasil",
    },
    enderecoCorrespondencia: {
        formato: "brasil", cep: "", zip: "", endereco: "", numero: "",
        complemento: "", bairro: "", cidade: "", estado: "", regiao: "", pais: "Brasil",
    },
    telefones: [
        { tipo: "Celular", codigo_pais: "+55", numero: "", whatsapp: false },
    ],
};

/* ──────────────────────────────────────────── */
export default function PersonForm({
                                       mode = "create",
                                       initialData = null,            // ← NULL por padrão ‑ evita loop
                                       onSubmit,
                                   }) {
    /* ---------------- state interno ---------------- */
    const [step, setStep] = useState(1);
    const [mesmoEndereco, setMesmoEndereco] = useState(false);

    /* monta o estado inicial só na 1ª renderização */
    const [formData, setFormData] = useState(() => ({
        ...DEFAULT_DATA,
        ...(initialData || {}),
    }));

    /* se chegar initialData depois (modo edit) atualiza 1x */
    useEffect(() => {
        if (initialData) {
            setFormData({ ...DEFAULT_DATA, ...initialData });
        }
    }, [initialData]);

    /* ------------- helpers genéricos ------------- */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleEnderecoChange = (section, e) => {
        const { name, value } = e.target;
        setFormData((p) => ({
            ...p,
            [section]: { ...p[section], [name]: value },
        }));
    };

    const toggleFormatoEndereco = (section) => {
        setFormData((p) => ({
            ...p,
            [section]: {
                ...p[section],
                formato: p[section].formato === "brasil" ? "internacional" : "brasil",
            },
        }));
    };

    /* ------------- CEP / ZIP look‑ups ------------- */
    const buscarEnderecoViaCEP = async (section) => {
        const cep = formData[section].cep.replace(/\D/g, "");
        if (cep.length !== 8) return;
        try {
            const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (!data.erro) {
                setFormData((p) => ({
                    ...p,
                    [section]: {
                        ...p[section],
                        endereco: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        estado: data.uf,
                        pais: "Brasil",
                    },
                }));
            }
        } catch (err) {
            console.error("CEP lookup:", err);
        }
    };

    const buscarEnderecoViaZIP = async (section) => {
        const zip = formData[section].zip;
        if (zip.length < 5) return;
        try {
            const { data } = await axios.get(`https://api.zippopotam.us/us/${zip}`);
            const info = data.places?.[0];
            if (info) {
                setFormData((p) => ({
                    ...p,
                    [section]: {
                        ...p[section],
                        cidade: info["place name"],
                        estado: info["state abbreviation"],
                        pais: data.country,
                    },
                }));
            }
        } catch (err) {
            console.error("ZIP lookup:", err);
        }
    };

    /* ------------- Telefones dinâmicos ------------- */
    const handleTelefoneChange = (idx, field, value) => {
        setFormData((p) => {
            const t = [...p.telefones];
            if (field === "whatsapp") t[idx].whatsapp = !t[idx].whatsapp;
            else t[idx][field] = value;
            return { ...p, telefones: t };
        });
    };

    const addTelefone = () =>
        setFormData((p) => ({
            ...p,
            telefones: [
                ...p.telefones,
                { tipo: "", codigo_pais: "+55", numero: "", whatsapp: false },
            ],
        }));

    const removeTelefone = (idx) =>
        setFormData((p) => ({
            ...p,
            telefones: p.telefones.filter((_, i) => i !== idx),
        }));

    /* ------------- submit ------------- */
    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            ...(mesmoEndereco
                ? { enderecoCorrespondencia: { ...formData.enderecoMoradia } }
                : {}),
        };
        onSubmit?.(finalData);
    };

    /* ------------- render endereço (reuso) ------------- */
    const renderEndereco = (section, label) => (
        <div className="endereco-section">
            <h3>{label}</h3>

            <div className="form-toggle-format">
                <button
                    type="button"
                    className="add-btn"
                    onClick={() => toggleFormatoEndereco(section)}
                >
                    Usar formato{" "}
                    {formData[section].formato === "brasil" ? "Internacional" : "Brasil"}
                </button>
            </div>

            <div className="address-grid">
                {formData[section].formato === "brasil" ? (
                    <>
                        <div className="input-group">
                            <label>CEP</label>
                            <input
                                className="input"
                                name="cep"
                                value={formData[section].cep}
                                onChange={(e) => handleEnderecoChange(section, e)}
                                onBlur={() => buscarEnderecoViaCEP(section)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Número</label>
                            <input
                                className="input"
                                name="numero"
                                value={formData[section].numero}
                                onChange={(e) => handleEnderecoChange(section, e)}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="input-group">
                            <label>ZIP Code</label>
                            <input
                                className="input"
                                name="zip"
                                value={formData[section].zip}
                                onChange={(e) => handleEnderecoChange(section, e)}
                                onBlur={() => buscarEnderecoViaZIP(section)}
                            />
                        </div>
                        <div className="input-group">
                            <label>Número</label>
                            <input
                                className="input"
                                name="numero"
                                value={formData[section].numero}
                                onChange={(e) => handleEnderecoChange(section, e)}
                            />
                        </div>
                    </>
                )}

                {[
                    "endereco",
                    "complemento",
                    "bairro",
                    "cidade",
                    "estado",
                    "regiao",
                    "pais",
                ].map((f) => (
                    <div
                        key={f}
                        className="input-group"
                        style={f === "pais" ? { gridColumn: "1 / span 2" } : undefined}
                    >
                        <label>{f[0].toUpperCase() + f.slice(1)}</label>
                        <input
                            className="input"
                            name={f}
                            value={formData[section][f]}
                            onChange={(e) => handleEnderecoChange(section, e)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    /* ------------- JSX do wizard ------------- */
    const steps = useMemo(() => ["Pessoa", "Endereço", "Telefones"], []);

    return (
        <form onSubmit={handleSubmit} className="form-box">
            {/* cabeçalho */}
            <div className="form-header">
                <h2>{mode === "edit" ? "Edição de Pessoa" : "Cadastro de Pessoa"}</h2>
                <span className="step-info">Etapa {step} de 3</span>
            </div>

            {/* progress bar */}
            <div className="progress-bar">
                {steps.map((_, i) => (
                    <div key={i} className={`bar ${step - 1 >= i ? "active" : ""}`} />
                ))}
            </div>

            {/* etapa 1 */}
            {step === 1 && (
                <div className="form-step grid">
                    {[
                        ["Nome", "nome"],
                        ["Data de Nascimento", "dtNascimento"],
                        ["Sexo", "sexo"],
                        ["Nome da Mãe", "mae"],
                        ["Email", "email"],
                        ["CPF", "cpf"],
                        ["RG", "rg"],
                        ["RNE", "rne"],
                    ].map(([lbl, n]) => (
                        <div key={n} className="input-group">
                            <label>{lbl}</label>
                            <input
                                className="input"
                                type={n === "dtNascimento" ? "date" : "text"}
                                name={n}
                                value={formData[n]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* etapa 2 */}
            {step === 2 && (
                <div className="form-step">
                    <div className="address-grid">
                        {renderEndereco("enderecoMoradia", "Endereço de Moradia")}
                    </div>

                    <div className="checkbox-endereco-wrapper">
                        <label className="checkbox-endereco-mesmo">
                            <input
                                type="checkbox"
                                checked={mesmoEndereco}
                                onChange={(e) => setMesmoEndereco(e.target.checked)}
                            />{" "}
                            Endereço de Correspondência é o mesmo
                        </label>
                    </div>

                    {!mesmoEndereco && (
                        <div className="address-grid">
                            {renderEndereco(
                                "enderecoCorrespondencia",
                                "Endereço de Correspondência"
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* etapa 3 */}
            {step === 3 && (
                <div className="form-step">
                    <h4>Telefones</h4>
                    {formData.telefones.map((tel, idx) => (
                        <div key={idx} className="telefone-group">
                            <div className="telefone-inputs">
                                <select
                                    className="select-codigo-pais"
                                    value={tel.codigo_pais}
                                    onChange={(e) =>
                                        handleTelefoneChange(idx, "codigo_pais", e.target.value)
                                    }
                                >
                                    <option value="+55">🇧🇷 +55</option>
                                    <option value="+1">🇺🇸 +1</option>
                                    <option value="+44">🇬🇧 +44</option>
                                    <option value="+351">🇵🇹 +351</option>
                                    <option value="+81">🇯🇵 +81</option>
                                </select>

                                <input
                                    className="input"
                                    placeholder="Número"
                                    value={tel.numero}
                                    onChange={(e) =>
                                        handleTelefoneChange(idx, "numero", e.target.value)
                                    }
                                    maxLength={11}
                                />

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={tel.whatsapp}
                                        onChange={() => handleTelefoneChange(idx, "whatsapp")}
                                    />{" "}
                                    WhatsApp
                                </label>

                                {idx > 0 && (
                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() => removeTelefone(idx)}
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={addTelefone}>
                        Adicionar Telefone
                    </button>
                </div>
            )}

            {/* navegação */}
            <div className="navigation-buttons">
                {step > 1 && (
                    <button
                        type="button"
                        className="btn back"
                        onClick={() => setStep(step - 1)}
                    >
                        Voltar
                    </button>
                )}
                {step < 3 && (
                    <button
                        type="button"
                        className="btn continue"
                        onClick={() => setStep(step + 1)}
                    >
                        Continuar
                    </button>
                )}
                {step === 3 && (
                    <button type="submit" className="btn submit">
                        {mode === "edit" ? "Salvar" : "Cadastrar"}
                    </button>
                )}
            </div>
        </form>
    );
}
