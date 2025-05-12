// src/components/CompanyForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/companyRegistration.css";

/* ───── Configuração mock / API ───── */
const USE_MOCK   = false;                      // true → ignora requisições
const API_PREFIX = "http://127.0.0.1:8000";    // ajuste se necessário

export default function CompanyForm({
                                        mode = "create",          // "create" | "edit"
                                        initialData = null,       // objeto vindo da página de edição
                                        onSubmit,                 // callback(data)
                                    }) {
    /* ─── 1. estado principal ────────────────────────────────────── */
    const [step, setStep]           = useState(1);
    const [tiposEmpresa, setTipos]  = useState([]);
    const [regimes, setRegimes]     = useState([]);
    const [estados, setEstados]     = useState([]);
    const [msgSucesso, setMsg]      = useState("");

    const emptyForm = {
        codigo: "", cnpj: "", inscricaoMunicipal: "", inscricaoEstadual: "",
        razaoSocial: "", nomeFantasia: "", sigla: "", nomeSite: "",
        tipoEmpresa: "", regimeEmpresarial: "", estadoEmpresa: "",
        telefones: [{ codigo_pais: "+55", numero: "", principal: true, whatsapp: false }],
        redesSociais: { email: "", instagram: "", twitter: "", tiktok: "" },
        endereco: {
            formato: "brasil", cep: "", zip: "", rua: "", numero: "", complemento: "",
            bairro: "", cidade: "", estado: "", regiao: "", pais: "", latitude: "",
            longitude: "", linkMaps: "",
        },
        exibirSite: false,
    };
    const [formData, setFormData] = useState(initialData || emptyForm);

    /* ─── 2. carregar opções (selects) ───────────────────────────── */
    useEffect(() => {
        if (USE_MOCK) return;
        axios.get(`${API_PREFIX}/tipos_empresa/`).then(r => setTipos(r.data));
        axios.get(`${API_PREFIX}/regimes_empresariais/`).then(r => setRegimes(r.data));
        axios.get(`${API_PREFIX}/estados_empresa/`).then(r => setEstados(r.data));
    }, []);

    /* ─── 3. handlers genéricos ──────────────────────────────────── */
    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };
    const handleEndChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, endereco: { ...formData.endereco, [name]: value } });
    };
    const handleTelChange = (idx, field, value) => {
        const telefones = [...formData.telefones];
        telefones[idx][field] = value;
        setFormData({ ...formData, telefones });
    };

    /* ─── 4. CEP / ZIP helpers ───────────────────────────────────── */
    const buscarCEP = async () => {
        const cep = formData.endereco.cep.replace(/\D/g, "");
        if (cep.length !== 8) return;
        try {
            const r = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (!r.data.erro) {
                setFormData(prev => ({
                    ...prev,
                    endereco: {
                        ...prev.endereco,
                        rua: r.data.logradouro,
                        bairro: r.data.bairro,
                        cidade: r.data.localidade,
                        estado: r.data.uf,
                        pais: "Brasil",
                    },
                }));
            }
        } catch {/* ignore */}
    };

    const buscarZIP = async () => {
        const zip = formData.endereco.zip;
        if (zip.length < 5) return;
        try {
            const r = await axios.get(`https://api.zippopotam.us/us/${zip}`);
            const p = r.data.places?.[0];
            if (p) {
                setFormData(prev => ({
                    ...prev,
                    endereco: {
                        ...prev.endereco,
                        cidade: p["place name"],
                        estado: p["state abbreviation"],
                        pais: r.data.country,
                    },
                }));
            }
        } catch {/* ignore */}
    };

    /* ─── 5. submit interno ─────────────────────────────────────── */
    const internalSubmit = async e => {
        e.preventDefault();
        await onSubmit(formData);
        setMsg(mode === "create" ? "Empresa cadastrada!" : "Alterações salvas!");
        setTimeout(() => setMsg(""), 4000);
    };

    /* ─── 6. UI ──────────────────────────────────────────────────── */
    const stepsTitles = ["Empresa", "Endereço", "Redes Sociais"]; // ← agora só 3

    return (
        <>
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

                {/* ---------- STEP 1 ---------- */}
                {step === 1 && (
                    <div className="form-step grid">
                        {[
                            ["Código", "codigo"], ["Sigla", "sigla"], ["CNPJ", "cnpj"],
                            ["Inscrição Municipal", "inscricaoMunicipal"],
                            ["Inscrição Estadual", "inscricaoEstadual"],
                            ["Razão Social", "razaoSocial"], ["Nome Fantasia", "nomeFantasia"],
                            ["Nome do Site", "nomeSite"],
                        ].map(([lbl, name]) => (
                            <label key={name} className="input-group">
                                {lbl}
                                <input className="input" name={name}
                                       value={formData[name]} onChange={handleChange} />
                            </label>
                        ))}

                        <label className="input-group">Tipo de Empresa
                            <select className="input" name="tipoEmpresa"
                                    value={formData.tipoEmpresa} onChange={handleChange}>
                                <option value="">Selecione</option>
                                {tiposEmpresa.map(t => (
                                    <option key={t.id} value={t.id}>{t.nome}</option>
                                ))}
                            </select>
                        </label>

                        <label className="input-group">Regime Empresarial
                            <select className="input" name="regimeEmpresarial"
                                    value={formData.regimeEmpresarial} onChange={handleChange}>
                                <option value="">Selecione</option>
                                {regimes.map(r => (
                                    <option key={r.id} value={r.id}>{r.nome}</option>
                                ))}
                            </select>
                        </label>

                        <label className="input-group">Estado da Empresa
                            <select className="input" name="estadoEmpresa"
                                    value={formData.estadoEmpresa} onChange={handleChange}>
                                <option value="">Selecione</option>
                                {estados.map(e => (
                                    <option key={e.id} value={e.id}>{e.nome}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                )}

                {/* ---------- STEP 2 ---------- */}
                {step === 2 && (
                    <div className="form-step">
                        {/* formato BR / INTL */}
                        <button type="button" className="add-btn"
                                onClick={() =>
                                    setFormData(f => ({
                                        ...f,
                                        endereco: {
                                            ...f.endereco,
                                            formato: f.endereco.formato === "brasil" ? "internacional" : "brasil",
                                        },
                                    }))}>
                            Usar formato {formData.endereco.formato === "brasil" ? "Internacional" : "Brasil"}
                        </button>

                        {formData.endereco.formato === "brasil" ? (
                            <label className="input-group">CEP
                                <input className="input" name="cep"
                                       value={formData.endereco.cep}
                                       onChange={handleEndChange} onBlur={buscarCEP} />
                            </label>
                        ) : (
                            <label className="input-group">ZIP Code
                                <input className="input" name="zip"
                                       value={formData.endereco.zip}
                                       onChange={handleEndChange} onBlur={buscarZIP} />
                            </label>
                        )}

                        {["rua","numero","complemento","bairro","cidade","estado","regiao","pais","linkMaps"]
                            .map(f => (
                                <label key={f} className="input-group">
                                    {f.charAt(0).toUpperCase()+f.slice(1)}
                                    <input className="input" name={f}
                                           value={formData.endereco[f]} onChange={handleEndChange}/>
                                </label>
                            ))}

                        {/* Telefones */}
                        <label className="sub-label">Telefones</label>
                        {formData.telefones.map((tel, idx) => (
                            <div key={idx} className="telefone-group">
                                <div className="telefone-inputs">
                                    <select className="select-codigo-pais" value={tel.codigo_pais}
                                            onChange={e => handleTelChange(idx,"codigo_pais",e.target.value)}>
                                        <option value="+55">🇧🇷 +55</option>
                                        <option value="+1">🇺🇸 +1</option>
                                        <option value="+44">🇬🇧 +44</option>
                                        <option value="+351">🇵🇹 +351</option>
                                    </select>
                                    <input type="text" maxLength={11} placeholder="Número"
                                           value={tel.numero}
                                           onChange={e=>handleTelChange(idx,"numero",e.target.value)} />
                                    <label>
                                        <input type="checkbox" checked={tel.whatsapp}
                                               onChange={() => handleTelChange(idx,"whatsapp",!tel.whatsapp)}/> WhatsApp
                                    </label>
                                    {idx>0 && (
                                        <button type="button" className="remove-btn"
                                                onClick={() =>
                                                    setFormData(f => ({
                                                        ...f,
                                                        telefones: f.telefones.filter((_, i) => i !== idx),
                                                    }))}>
                                            X
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <button type="button" className="add-btn"
                                onClick={() =>
                                    setFormData(f => ({
                                        ...f,
                                        telefones: [...f.telefones,
                                            { codigo_pais:"+55", numero:"", principal:false, whatsapp:false }],
                                    }))}>
                            Adicionar novo telefone
                        </button>
                    </div>
                )}

                {/* ---------- STEP 3 ---------- */}
                {step === 3 && (
                    <div className="form-step">
                        {["email","instagram","twitter","tiktok"].map(f => (
                            <label key={f} className="input-group">
                                {f.charAt(0).toUpperCase()+f.slice(1)}
                                <input className="input"
                                       value={formData.redesSociais[f]}
                                       onChange={e =>
                                           setFormData(d => ({
                                               ...d,
                                               redesSociais: { ...d.redesSociais, [f]: e.target.value },
                                           }))}/>
                            </label>
                        ))}
                    </div>
                )}

                {/* navegação */}
                <div className="navigation-buttons">
                    {step > 1 && (
                        <button type="button" className="btn back"
                                onClick={() => setStep(s => s - 1)}>Voltar</button>
                    )}
                    {step < 3 && (
                        <button type="button" className="btn continue"
                                onClick={() => setStep(s => s + 1)}>Continuar</button>
                    )}
                    {step === 3 && (
                        <button type="submit" className="btn submit">
                            {mode === "create" ? "Cadastrar" : "Salvar Alterações"}
                        </button>
                    )}
                </div>
            </form>
        </>
    );
}
