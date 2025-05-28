/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/companyRegistration.css";

/* ---------- util → camelCase ► snake_case onde a API espera ---------- */
const toApiPayload = (d) => ({
    codigo:               d.codigo,
    sigla:                d.sigla,
    razao_social:         d.razaoSocial,
    cnpj:                 d.cnpj,
    nome_fantasia:        d.nomeFantasia,
    nome_site:            d.nomeSite,
    inscricao_municipal:  d.inscricaoMunicipal,
    inscricao_estadual:   d.inscricaoEstadual,
    exibir_site:          d.exibirSite,

    tipo_empresa:         d.tipoEmpresa,
    regime_empresarial:   d.regimeEmpresarial,
    estado_empresa:       d.estadoEmpresa,

    telefones:     d.telefones,
    redes_sociais: {
        email:     d.redesSociais.email     || null,
        instagram: d.redesSocios?.instagram || null,
        twitter:   d.redesSociais.twitter   || null,
        tiktok:    d.redesSociais.tiktok    || null,
    },
    endereco: {
        ...d.endereco,
        link_maps: d.endereco.linkMaps,
    },
});

export default function CompanyForm({
                                        mode = "create",          // "create" | "edit"
                                        initialData = null,
                                        onSubmit,
                                    }) {
    /* ─────────── 1. estado principal ─────────── */
    const [step, setStep]       = useState(1);
    const [tiposEmpresa, setTipos]  = useState([]);
    const [regimes, setRegimes]     = useState([]);
    const [estados, setEstados]     = useState([]);
    const [msgSucesso, setMsg]      = useState("");

    const emptyForm = {
        codigo: "", sigla: "", razaoSocial: "", cnpj: "",
        nomeFantasia: "", nomeSite: "",
        inscricaoMunicipal: "", inscricaoEstadual: "",
        tipoEmpresa: "", regimeEmpresarial: "", estadoEmpresa: "",
        telefones: [{ codigo_pais: "+55", numero: "", principal: true, whatsapp: false }],
        redesSociais: { email: "", instagram: "", twitter: "", tiktok: "" },
        endereco: {
            formato: "brasil", cep: "", zip: "", rua: "", numero: "", complemento: "",
            bairro: "", cidade: "", estado: "", regiao: "", pais: "",
            latitude: "", longitude: "", linkMaps: "",
        },
        exibirSite: false,
    };
    const [formData, setFormData] = useState(initialData || emptyForm);

    /* ─────────── 2. carregar opções dos selects ─────────── */
    useEffect(() => {
        (async () => {
            const [t, r, e] = await Promise.all([
                api.get("/tipos_empresa/"),
                api.get("/regimes_empresariais/"),
                api.get("/estados_empresa/"),
            ]);
            setTipos(t.data);
            setRegimes(r.data);
            setEstados(e.data);
        })();
    }, []);

    /* ─────────── 3. handlers genéricos ─────────── */
    const handleChange = ({ target }) => {
        const { name, value, type, checked } = target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };
    const handleEndChange = ({ target }) => {
        const { name, value } = target;
        setFormData({ ...formData, endereco: { ...formData.endereco, [name]: value } });
    };
    const handleTelChange = (idx, key, value) => {
        const telefones = [...formData.telefones];
        telefones[idx][key] = value;
        setFormData({ ...formData, telefones });
    };

    /* ─────────── 4. helpers CEP / ZIP ─────────── */
    const buscarCEP = async () => {
        const cep = formData.endereco.cep.replace(/\D/g, "");
        if (cep.length !== 8) return;
        const { data } = await api.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!data.erro) {
            setFormData((f) => ({
                ...f,
                endereco: {
                    ...f.endereco,
                    rua: data.logradouro,
                    bairro: data.bairro,
                    cidade: data.localidade,
                    estado: data.uf,
                    pais: "Brasil",
                },
            }));
        }
    };
    const buscarZIP = async () => {
        const zip = formData.endereco.zip;
        if (zip.length < 5) return;
        const { data } = await api.get(`https://api.zippopotam.us/us/${zip}`);
        const p = data.places?.[0];
        if (p) {
            setFormData((f) => ({
                ...f,
                endereco: {
                    ...f.endereco,
                    cidade: p["place name"],
                    estado: p["state abbreviation"],
                    pais: data.country,
                },
            }));
        }
    };

    /* ─────────── 5. submit ─────────── */
    const internalSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(toApiPayload(formData));
        setMsg(mode === "create" ? "Empresa cadastrada!" : "Alterações salvas!");
        setTimeout(() => setMsg(""), 4000);
    };

    /* ─────────── 6. UI ─────────── */
    const stepsTitles = ["Empresa", "Endereço", "Redes Sociais"];

    return (
        <form onSubmit={internalSubmit} className="form-box">
            {/* cabeçalho */}
            <div className="form-header">
                <h2>{mode === "create" ? "Cadastro de Empresa" : "Edição de Cadastro"}</h2>
                <span className="step-info">Etapa {step} de 3</span>
            </div>

            {/* barra de progresso */}
            <div className="progress-bar">
                {stepsTitles.map((_, i) => (
                    <div key={i} className={`bar ${step - 1 >= i ? "active" : ""}`} />
                ))}
            </div>

            {msgSucesso && <p className="success-message">{msgSucesso}</p>}

            {/* ---------- STEP 1 ---------- */}
            {step === 1 && (
                <div className="form-step grid">
                    {/* inputs principais */}
                    {[
                        ["Código", "codigo"],
                        ["Sigla", "sigla"],
                        ["CNPJ", "cnpj"],
                        ["Inscrição Municipal", "inscricaoMunicipal"],
                        ["Inscrição Estadual", "inscricaoEstadual"],
                        ["Razão Social", "razaoSocial"],
                        ["Nome Fantasia", "nomeFantasia"],
                        ["Nome do Site", "nomeSite"],
                    ].map(([lbl, name]) => (
                        <label key={name} className="input-group">
                            {lbl}
                            <input
                                className="input"
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                            />
                        </label>
                    ))}

                    <label className="input-group">
                        Tipo de Empresa
                        <select
                            className="input"
                            name="tipoEmpresa"
                            value={formData.tipoEmpresa}
                            onChange={handleChange}
                        >
                            <option value="">Selecione</option>
                            {tiposEmpresa.map((t) => (
                                <option key={t.id} value={t.nome}>
                                    {t.nome}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="input-group">
                        Regime Empresarial
                        <select
                            className="input"
                            name="regimeEmpresarial"
                            value={formData.regimeEmpresarial}
                            onChange={handleChange}
                        >
                            <option value="">Selecione</option>
                            {regimes.map((r) => (
                                <option key={r.id} value={r.nome}>
                                    {r.nome}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="input-group">
                        Estado da Empresa
                        <select
                            className="input"
                            name="estadoEmpresa"
                            value={formData.estadoEmpresa}
                            onChange={handleChange}
                        >
                            <option value="">Selecione</option>
                            {estados.map((e) => (
                                <option key={e.id} value={e.nome}>
                                    {e.nome}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            )}

            {/* ---------- STEP 2 ---------- */}
            {step === 2 && (
                <div className="form-step">
                    {/* formato BR / INTL */}
                    <button
                        type="button"
                        className="add-btn"
                        onClick={() =>
                            setFormData((f) => ({
                                ...f,
                                endereco: {
                                    ...f.endereco,
                                    formato: f.endereco.formato === "brasil" ? "internacional" : "brasil",
                                },
                            }))
                        }
                    >
                        Usar formato {formData.endereco.formato === "brasil" ? "Internacional" : "Brasil"}
                    </button>

                    {formData.endereco.formato === "brasil" ? (
                        <label className="input-group">
                            CEP
                            <input
                                className="input"
                                name="cep"
                                value={formData.endereco.cep}
                                onChange={handleEndChange}
                                onBlur={buscarCEP}
                            />
                        </label>
                    ) : (
                        <label className="input-group">
                            ZIP Code
                            <input
                                className="input"
                                name="zip"
                                value={formData.endereco.zip}
                                onChange={handleEndChange}
                                onBlur={buscarZIP}
                            />
                        </label>
                    )}

                    {[
                        "rua",
                        "numero",
                        "complemento",
                        "bairro",
                        "cidade",
                        "estado",
                        "regiao",
                        "pais",
                        "linkMaps",
                    ].map((f) => (
                        <label key={f} className="input-group">
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            <input
                                className="input"
                                name={f}
                                value={formData.endereco[f]}
                                onChange={handleEndChange}
                            />
                        </label>
                    ))}

                    {/* Telefones */}
                    <label className="sub-label">Telefones</label>
                    {formData.telefones.map((tel, idx) => (
                        <div key={idx} className="telefone-group">
                            <div className="telefone-inputs">
                                <select
                                    className="select-codigo-pais"
                                    value={tel.codigo_pais}
                                    onChange={(e) => handleTelChange(idx, "codigo_pais", e.target.value)}
                                >
                                    <option value="+55">🇧🇷 +55</option>
                                    <option value="+1">🇺🇸 +1</option>
                                    <option value="+44">🇬🇧 +44</option>
                                    <option value="+351">🇵🇹 +351</option>
                                </select>

                                <input
                                    type="text"
                                    maxLength={11}
                                    placeholder="Número"
                                    value={tel.numero}
                                    onChange={(e) => handleTelChange(idx, "numero", e.target.value)}
                                />

                                <label>
                                    <input
                                        type="checkbox"
                                        checked={tel.whatsapp}
                                        onChange={() => handleTelChange(idx, "whatsapp", !tel.whatsapp)}
                                    />{" "}
                                    WhatsApp
                                </label>

                                {idx > 0 && (
                                    <button
                                        type="button"
                                        className="remove-btn"
                                        onClick={() =>
                                            setFormData((f) => ({
                                                ...f,
                                                telefones: f.telefones.filter((_, i) => i !== idx),
                                            }))
                                        }
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        className="add-btn"
                        onClick={() =>
                            setFormData((f) => ({
                                ...f,
                                telefones: [
                                    ...f.telefones,
                                    { codigo_pais: "+55", numero: "", principal: false, whatsapp: false },
                                ],
                            }))
                        }
                    >
                        Adicionar novo telefone
                    </button>
                </div>
            )}

            {/* ---------- STEP 3 ---------- */}
            {step === 3 && (
                <div className="form-step">
                    {["email", "instagram", "twitter", "tiktok"].map((f) => (
                        <label key={f} className="input-group">
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            <input
                                className="input"
                                value={formData.redesSociais[f]}
                                onChange={(e) =>
                                    setFormData((d) => ({
                                        ...d,
                                        redesSociais: { ...d.redesSociais, [f]: e.target.value },
                                    }))
                                }
                            />
                        </label>
                    ))}
                </div>
            )}

            {/* navegação */}
            <div className="navigation-buttons">
                {step > 1 && (
                    <button type="button" className="btn back" onClick={() => setStep((s) => s - 1)}>
                        Voltar
                    </button>
                )}
                {step < 3 && (
                    <button type="button" className="btn continue" onClick={() => setStep((s) => s + 1)}>
                        Continuar
                    </button>
                )}
                {step === 3 && (
                    <button type="submit" className="btn submit">
                        {mode === "create" ? "Cadastrar" : "Salvar Alterações"}
                    </button>
                )}
            </div>
        </form>
    );
}
