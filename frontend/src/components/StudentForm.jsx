import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    memo,
} from "react";
import axios from "axios";

const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:8000";

const DEFAULT_DATA = {
    /* etapa 1 */
    codEmpresa: "",
    nomeEmpresa: "",
    cargo: "",
    referencia: "",

    /* etapa 2 */
    codCurso: "",
    dtContrato: "",
    nomeCTR: "",
    cpfCTR: "",
    telefoneCTR: "",
    emailCTR: "",

    /* etapa 3 */
    nivelamento: false,
    emancipadoCTR: false,
    aprovado: false,

    /* etapa 4 */
    taxaMatricula: "",
    materialDidatico: "",
    numeroParcelas: "",
    valorParcela: "",
    valorParcelaDesconto: "",
    regrasDesconto: "",
};

/* ─── componente ─────────────────────────────────────────────── */
function StudentForm(
    { mode = "create", initialData = {}, onSubmit } /* props */
) {
    const [step, setStep] = useState(1);
    const [alunoEhContratante, setAlunoEhContratante] = useState(false);

    const [formData, setFormData] = useState({
        ...DEFAULT_DATA,
        ...initialData,
    });

    /* auto‑complete pessoas */
    const [pessoas, setPessoas] = useState([]);
    const [buscaPessoa, setBuscaPessoa] = useState("");
    const [pessoaSel, setPessoaSel] = useState(null);

    /* sempre que mudar `initialData` (edição) */
    useEffect(() => {
        setFormData({ ...DEFAULT_DATA, ...initialData });
    }, [initialData]);

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
        () =>
            pessoas.filter((p) =>
                p.nome.toLowerCase().includes(buscaPessoa.toLowerCase())
            ),
        [pessoas, buscaPessoa]
    );

    useEffect(() => {
        if (alunoEhContratante && pessoaSel) {
            setFormData((p) => ({
                ...p,
                nomeCTR: pessoaSel.nome ?? "",
                emailCTR: pessoaSel.email ?? "",
                cpfCTR: pessoaSel.cpf ?? "",
                telefoneCTR: pessoaSel.telefone ?? "",
            }));
        }
    }, [alunoEhContratante, pessoaSel]);

    /* ─── handlers genéricos ──────────────────────────────────── */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };

    const goNext = () => setStep((s) => Math.min(s + 1, 4));
    const goPrev = () => setStep((s) => Math.max(s - 1, 1));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(formData);
    };

    /* ─── steps titles (memo) ─────────────────────────────────── */
    const steps = useMemo(
        () => ["Aluno", "Contrato", "Situação", "Pagamento"],
        []
    );

    /* ─────────────────────────────────────────────────────────── */
    return (
        <form className="form-box" onSubmit={handleSubmit}>
            {/* cabeçalho + progresso */}
            <div className="form-header">
                <h2>{mode === "edit" ? "Edição de Aluno" : "Cadastro de Aluno"}</h2>
                <span className="step-info">Etapa {step} de 4</span>
            </div>

            <div className="progress-bar">
                {steps.map((_, i) => (
                    <div key={i} className={`bar ${step - 1 >= i ? "active" : ""}`} />
                ))}
            </div>

            {/* ========================= ETAPA 1 ========================= */}
            {step === 1 && (
                <div className="form-step grid">
                    {/* busca aluno */}
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

                    {/* empresa / cargo / ref */}
                    {[
                        ["Código da Empresa", "codEmpresa"],
                        ["Nome da Empresa", "nomeEmpresa"],
                        ["Cargo", "cargo"],
                        ["Referência", "referencia"],
                    ].map(([lbl, name]) => (
                        <div key={name} className="input-group">
                            <label>{lbl}</label>
                            <input
                                className="input"
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}

                    {/* check aluno=contratante */}
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

            {/* ========================= ETAPA 2 ========================= */}
            {step === 2 && (
                <div className="form-step grid">
                    {[
                        ["Código do Curso", "codCurso"],
                        ["Data do Contrato", "dtContrato", "date"],
                    ].map(([lbl, name, type]) => (
                        <div key={name} className="input-group">
                            <label>{lbl}</label>
                            <input
                                className="input"
                                name={name}
                                type={type ?? "text"}
                                value={formData[name]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}

                    {/* contratante se diferente */}
                    {!alunoEhContratante &&
                        [
                            ["Nome do Contratante", "nomeCTR"],
                            ["CPF do Contratante", "cpfCTR"],
                            ["Telefone do Contratante", "telefoneCTR"],
                            ["Email do Contratante", "emailCTR"],
                        ].map(([lbl, name]) => (
                            <div key={name} className="input-group">
                                <label>{lbl}</label>
                                <input
                                    className="input"
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                </div>
            )}

            {/* ========================= ETAPA 3 ========================= */}
            {step === 3 && (
                <div className="form-step grid">
                    {[
                        ["nivelamento", "Nivelamento"],
                        ["emancipadoCTR", "Emancipado"],
                        ["aprovado", "Aprovado"],
                    ].map(([name, lbl]) => (
                        <div key={name} className="input-group checkbox large-checkbox colored">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name={name}
                                    checked={formData[name]}
                                    onChange={handleChange}
                                />{" "}
                                {lbl}
                            </label>
                        </div>
                    ))}
                </div>
            )}

            {/* ========================= ETAPA 4 ========================= */}
            {step === 4 && (
                <div className="form-step grid">
                    {[
                        ["taxaMatricula", "Taxa de Matrícula (R$)", "number"],
                        ["materialDidatico", "Material Didático (R$)", "number"],
                        ["numeroParcelas", "Número de Parcelas", "number"],
                        ["valorParcela", "Valor da Parcela (R$)", "number"],
                        ["valorParcelaDesconto", "Valor da Parcela c/ Desconto", "number"],
                    ].map(([name, lbl, type]) => (
                        <div key={name} className="input-group">
                            <label>{lbl}</label>
                            <input
                                className="input"
                                name={name}
                                type={type}
                                step={type === "number" ? "0.01" : undefined}
                                value={formData[name]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}

                    {/* regras de desconto */}
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

            {/* navegação / submit */}
            <div className="navigation-buttons">
                {step > 1 && (
                    <button type="button" className="btn back" onClick={goPrev}>
                        Voltar
                    </button>
                )}
                {step < 4 && (
                    <button type="button" className="btn continue" onClick={goNext}>
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
