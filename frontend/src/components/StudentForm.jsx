import React, { useState, useEffect, useMemo, memo } from "react";
import axios from "axios";

const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:8000";

const COURSE_OPTIONS = ["Fluency", "Teens", "VIP", "Travel", "Outros"];

/* ---------- estado vazio padrão ---------- */
const DEFAULT_DATA = {
    /* etapa 1 */
    codEmpresa: "",
    nomeEmpresa: "",
    cargo: "",
    referencia: "",

    /* etapa 2 (contrato + situação) */
    codCurso: "",
    dtContrato: "",
    nomeCTR: "",
    cpfCTR: "",
    dtNascCTR: "",
    telefoneCTR: "",
    emailCTR: "",
    mesmoEndCTR: false,
    /* situação */
    nivelamento: false,
    emancipadoCTR: false,
    aprovado: false,

    /* etapa 3 (pagamento) */
    taxaMatricula: "",
    materialDidatico: "",
    numeroParcelas: "",
    valorParcela: "",
    valorParcelaDesconto: "",
    regrasDesconto: "",

    /* endereço do contratante */
    enderecoCTR: {
        formato: "brasil",
        cep: "",
        zip: "",
        endereco: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        regiao: "",
        pais: "Brasil",
    },
};

function StudentForm({ mode = "create", initialData = {}, onSubmit }) {
    const [step, setStep] = useState(1);
    const [alunoEhContratante, setAlunoEhContratante] = useState(false);
    const [formData, setFormData] = useState({ ...DEFAULT_DATA, ...initialData });

    /* -------- auto-complete aluno -------- */
    const [pessoas, setPessoas] = useState([]);
    const [buscaPessoa, setBuscaPessoa] = useState("");
    const [pessoaSel, setPessoaSel] = useState(null);

    useEffect(() => setFormData({ ...DEFAULT_DATA, ...initialData }), [initialData]);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/pessoas/`);
                setPessoas(data);
            } catch (err) {
                console.error("Erro ao buscar pessoas:", err);
            }
        })();
    }, []);

    const pessoasFiltradas = useMemo(
        () => pessoas.filter((p) => p.nome.toLowerCase().includes(buscaPessoa.toLowerCase())),
        [pessoas, buscaPessoa]
    );

    /*   se aluno == contratante copiar dados básicos   */
    useEffect(() => {
        if (alunoEhContratante && pessoaSel) {
            setFormData((f) => ({
                ...f,
                nomeCTR: pessoaSel.nome ?? "",
                emailCTR: pessoaSel.email ?? "",
                cpfCTR: pessoaSel.cpf ?? "",
                telefoneCTR: pessoaSel.telefone ?? "",
                mesmoEndCTR: true,
            }));
        }
    }, [alunoEhContratante, pessoaSel]);

    /* -------------- CEP / ZIP lookup -------------- */
    const buscarCEP = async () => {
        if (formData.mesmoEndCTR || formData.enderecoCTR.formato !== "brasil") return;
        const cep = formData.enderecoCTR.cep?.replace(/\D/g, "");
        if (cep?.length !== 8) return;
        try {
            const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (!data.erro) {
                setFormData((f) => ({
                    ...f,
                    enderecoCTR: {
                        ...f.enderecoCTR,
                        endereco: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        estado: data.uf,
                        pais: "Brasil",
                    },
                }));
            }
        } catch {/* ignore */}
    };

    const buscarZIP = async () => {
        if (formData.mesmoEndCTR || formData.enderecoCTR.formato !== "internacional") return;
        const zip = formData.enderecoCTR.zip;
        if (!zip || zip.length < 5) return;
        try {
            const { data } = await axios.get(`https://api.zippopotam.us/us/${zip}`);
            const place = data.places?.[0];
            if (place) {
                setFormData((f) => ({
                    ...f,
                    enderecoCTR: {
                        ...f.enderecoCTR,
                        cidade: place["place name"],
                        estado: place["state abbreviation"],
                        pais: data.country,
                    },
                }));
            }
        } catch {/* ignore */}
    };

    /* -------------- change helpers -------------- */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };

    const handleEndCTRChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({
            ...p,
            enderecoCTR: { ...p.enderecoCTR, [name]: value },
        }));
    };

    const toggleFormatoCTR = () => {
        setFormData((p) => ({
            ...p,
            enderecoCTR: {
                ...p.enderecoCTR,
                formato: p.enderecoCTR.formato === "brasil" ? "internacional" : "brasil",
            },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(formData);
    };

    /* ---------- rótulos das etapas ---------- */
    const steps = ["Aluno", "Contrato & Situação", "Pagamento", "Finalização"];

    /* ====================================================== */
    return (
        <form className="form-box" onSubmit={handleSubmit}>
            {/* cabeçalho + barra */ }
            <div className="form-header">
                <h2>{mode === "edit" ? "Edição de Aluno" : "Cadastro de Aluno"}</h2>
                <span className="step-info">Etapa {step} de 4</span>
            </div>

            <div className="progress-bar">
                {steps.map((_, i) => (
                    <div key={i} className={`bar ${step - 1 >= i ? "active" : ""}`} />
                ))}
            </div>

            {/* ===================== ETAPA 1 ===================== */}
            {step === 1 && (
                <div className="form-step grid">
                    <div className="input-group">
                        <label>Buscar Aluno</label>
                        <input
                            className="input search-input distinct-input"
                            placeholder="Buscar Pessoa…"
                            value={buscaPessoa}
                            onChange={(e) => {
                                setBuscaPessoa(e.target.value);
                                setPessoaSel(null);
                            }}
                        />
                        {buscaPessoa && pessoasFiltradas.length > 0 && (
                            <div className="autocomplete-results">
                                {pessoasFiltradas.map((p) => (
                                    <div
                                        key={p.id}
                                        className="autocomplete-item"
                                        onClick={() => {
                                            setPessoaSel(p);
                                            setBuscaPessoa(p.nome);
                                        }}
                                    >
                                        {p.nome}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {[
                        ["Código da Empresa", "codEmpresa"],
                        ["Nome da Empresa", "nomeEmpresa"],
                        ["Cargo", "cargo"],
                        ["Referência", "referencia"],
                    ].map(([lbl, n]) => (
                        <div key={n} className="input-group">
                            <label>{lbl}</label>
                            <input
                                className="input"
                                name={n}
                                value={formData[n]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}

                    <div className="input-group checkbox large-checkbox colored">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={alunoEhContratante}
                                onChange={(e) => setAlunoEhContratante(e.target.checked)}
                            />{" "}
                            Aluno é o Contratante?
                        </label>
                    </div>
                </div>
            )}

            {/* ===================== ETAPA 2 (Contrato + Situação) ===================== */}
            {step === 2 && (
                <div className="form-step grid-two">
                    {/* contrato */}
                    <div className="input-group">
                        <label>Curso</label>
                        <select
                            className="input"
                            name="codCurso"
                            value={formData.codCurso}
                            onChange={handleChange}
                        >
                            <option value="">Selecione…</option>
                            {COURSE_OPTIONS.map((opt) => (
                                <option key={opt} value={opt.toLowerCase()}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Data do Contrato</label>
                        <input
                            className="input"
                            type="date"
                            name="dtContrato"
                            value={formData.dtContrato}
                            onChange={handleChange}
                        />
                    </div>

                    {/* se contratante ≠ aluno, mostra campos + endereço */}
                    {!alunoEhContratante && (
                        <>
                            {[
                                ["Nome do Contratante", "nomeCTR"],
                                ["CPF do Contratante", "cpfCTR"],
                                ["Data de Nascimento do Contratante", "dtNascCTR", "date"],
                                ["Telefone do Contratante", "telefoneCTR"],
                                ["Email do Contratante", "emailCTR"],
                            ].map(([lbl, n, type]) => (
                                <div key={n} className="input-group">
                                    <label>{lbl}</label>
                                    <input
                                        className="input"
                                        type={type ?? "text"}
                                        name={n}
                                        value={formData[n]}
                                        onChange={handleChange}
                                    />
                                </div>
                            ))}

                            {/* toggle endereço = mesmo */}
                            <div
                                className="input-group checkbox large-checkbox colored"
                                style={{ gridColumn: "1 / -1" }}
                            >
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="mesmoEndCTR"
                                        checked={formData.mesmoEndCTR}
                                        onChange={handleChange}
                                    />{" "}
                                    Endereço do Contratante é o mesmo do Aluno
                                </label>
                            </div>

                            {/* endereço contratante se necessário */}
                            {!formData.mesmoEndCTR && (
                                <div
                                    className="address-grid"
                                    style={{ gridColumn: "1 / -1", marginTop: "1rem" }}
                                >
                                    <h4 style={{ gridColumn: "1 / -1" }}>
                                        Endereço do Contratante
                                    </h4>

                                    <button
                                        type="button"
                                        className="add-btn"
                                        style={{ gridColumn: "1 / -1", marginBottom: "0.5rem" }}
                                        onClick={toggleFormatoCTR}
                                    >
                                        Usar formato{" "}
                                        {formData.enderecoCTR.formato === "brasil"
                                            ? "Internacional"
                                            : "Brasil"}
                                    </button>

                                    {formData.enderecoCTR.formato === "brasil" ? (
                                        <>
                                            <div className="input-group">
                                                <label>CEP</label>
                                                <input
                                                    className="input"
                                                    name="cep"
                                                    value={formData.enderecoCTR.cep}
                                                    onChange={handleEndCTRChange}
                                                    onBlur={buscarCEP}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Número</label>
                                                <input
                                                    className="input"
                                                    name="numero"
                                                    value={formData.enderecoCTR.numero}
                                                    onChange={handleEndCTRChange}
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
                                                    value={formData.enderecoCTR.zip}
                                                    onChange={handleEndCTRChange}
                                                    onBlur={buscarZIP}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label>Número</label>
                                                <input
                                                    className="input"
                                                    name="numero"
                                                    value={formData.enderecoCTR.numero}
                                                    onChange={handleEndCTRChange}
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
                                            style={f === "pais" ? { gridColumn: "1 / -1" } : undefined}
                                        >
                                            <label>{f[0].toUpperCase() + f.slice(1)}</label>
                                            <input
                                                className="input"
                                                name={f}
                                                value={formData.enderecoCTR[f]}
                                                onChange={handleEndCTRChange}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* -------- blocos de Situação (checkboxes) -------- */}
                    {[
                        ["nivelamento", "Nivelamento"],
                        ["emancipadoCTR", "Emancipado"],
                        ["aprovado", "Aprovado"],
                    ].map(([n, lbl]) => (
                        <div key={n} className="input-group checkbox large-checkbox colored">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name={n}
                                    checked={formData[n]}
                                    onChange={handleChange}
                                />{" "}
                                {lbl}
                            </label>
                        </div>
                    ))}
                </div>
            )}

            {/* ===================== ETAPA 3 (Pagamento) ===================== */}
            {step === 3 && (
                <div className="form-step grid">
                    <h4
                        className="section-title"
                        style={{ gridColumn: "1 / -1", margin: "0 0 0.75rem 0", fontSize: "20px" }} > Plano de Pagamento
                    </h4>
                    {[
                        ["taxaMatricula", "Taxa de Matrícula (R$)", "number"],
                        ["materialDidatico", "Material Didático (R$)", "number"],
                        ["numeroParcelas", "Número de Parcelas", "number"],
                        ["valorParcela", "Valor da Parcela (R$)", "number"],
                        ["valorParcelaDesconto", "Valor da Parcela c/ Desconto", "number"],
                    ].map(([n, lbl, type]) => (
                        <div key={n} className="input-group">
                            <label>{lbl}</label>
                            <input
                                className="input"
                                name={n}
                                type={type}
                                step={type === "number" ? "0.01" : undefined}
                                value={formData[n]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}

                    <div className="input-group" style={{ gridColumn: "1 / -1" }}>
                        <label>Regras do Desconto</label>
                        <textarea
                            className="input"
                            name="regrasDesconto"
                            rows={4}
                            style={{ resize: "vertical" }}
                            value={formData.regrasDesconto}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            )}

            {/* ===================== ETAPA 4 (placeholder) ===================== */}
            {step === 4 && (
                <div className="form-step">
                    <p>Etapa reservada para confirmações ou uploads futuros.</p>
                </div>
            )}

            {/* navegação */}
            <div className="navigation-buttons">
                {step > 1 && (
                    <button type="button" className="btn back" onClick={() => setStep(step - 1)}>
                        Voltar
                    </button>
                )}
                {step < 4 && (
                    <button type="button" className="btn continue" onClick={() => setStep(step + 1)}>
                        Continuar
                    </button>
                )}
                {step === 4 && (
                    <button type="submit" className="btn submit">
                        {mode === "edit" ? "Salvar" : "Cadastrar"}
                    </button>
                )}
            </div>
        </form>
    );
}

export default memo(StudentForm);
