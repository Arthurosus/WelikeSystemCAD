// ────────────────────────────────────────────────────────────────
// src/components/EmployeeForm.jsx   —  versão sem loop
// ────────────────────────────────────────────────────────────────
import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import axios from "axios";

/* ------------------------------------------------------------------
   Config / defaults
---------------------------------------------------------------------- */
const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:8000";

const DEFAULT_DATA = {
    codEmpresa: "",
    status: "",
    dtAdmissao: "",
    dtAfastamento: "",
    observacao: "",
    cargo: "",
    ativo: false,
};

/* ------------------------------------------------------------------
   Componente
---------------------------------------------------------------------- */
function EmployeeForm({
                          mode = "create",      // "create" | "edit"
                          initialData = {},     // dados para edição
                          cargos = [],          // opções do <select>
                          onSubmit,             // callback(data)
                      }) {
    /* 1. state principal ------------------------------------------------ */
    const [formData, setFormData] = useState({
        ...DEFAULT_DATA,
        ...initialData,
    });

    /* 2. sincronizar com initialData… mas só se REALMENTE mudou ---------- */
    const lastInitialRef = useRef(initialData);

    useEffect(() => {
        const prev = lastInitialRef.current;
        const changed =
            Object.keys(initialData).length !== Object.keys(prev).length ||
            Object.entries(initialData).some(
                ([k, v]) => prev[k] !== v
            );

        if (changed) {
            lastInitialRef.current = initialData;
            setFormData({ ...DEFAULT_DATA, ...initialData });
        }
    }, [initialData]);

    /* 3. lista de pessoas para auto‑complete ----------------------------- */
    const [pessoas, setPessoas]   = useState([]);
    const [busca,   setBusca]     = useState("");
    const [pSel,    setPSel]      = useState(null);

    /* roda 1× — busca pessoas */
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
                p.nome.toLowerCase().includes(busca.toLowerCase())
            ),
        [pessoas, busca]
    );

    /* 4. handlers -------------------------------------------------------- */
    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    }, []);

    const submit = (e) => {
        e.preventDefault();
        onSubmit?.({ ...formData, pessoaId: pSel?.id ?? null });
    };

    /* ------------------------------------------------------------------
       JSX
    ------------------------------------------------------------------ */
    return (
        <form className="form-box" onSubmit={submit}>
            <div className="form-header">
                <h2>{mode === "edit" ? "Edição de Funcionário" : "Cadastro de Funcionário"}</h2>
                <span className="step-info">Etapa 1 de 1</span>
            </div>

            <div className="progress-bar">
                <div className="bar active" />
            </div>

            <div className="form-step grid">
                {/* -------- busca pessoa -------- */}
                <div className="input-group">
                    <label>Buscar Pessoa</label>
                    <input
                        className="input search-input distinct-input"
                        placeholder="Buscar Pessoa…"
                        value={busca}
                        onChange={(e) => {
                            setBusca(e.target.value);
                            setPSel(null);
                        }}
                    />
                    {busca && pessoasFiltradas.length > 0 && (
                        <div className="autocomplete-results">
                            {pessoasFiltradas.map((p) => (
                                <div
                                    key={p.id}
                                    className="autocomplete-item"
                                    onClick={() => {
                                        setPSel(p);
                                        setBusca(p.nome);
                                    }}
                                >
                                    {p.nome}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* -------- campos simples -------- */}
                {[
                    ["Código da Empresa", "codEmpresa"],
                    ["Status", "status"],
                    ["Data de Admissão", "dtAdmissao", "date"],
                    ["Data de Afastamento", "dtAfastamento", "date"],
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

                {/* -------- cargo -------- */}
                <div className="input-group">
                    <label>Cargo</label>
                    <select
                        className="input"
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleChange}
                    >
                        <option value="">Selecione o Cargo</option>
                        {cargos.map((c, i) => (
                            <option key={i} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                {/* -------- observações -------- */}
                <div className="input-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Observações</label>
                    <textarea
                        className="input"
                        name="observacao"
                        rows={3}
                        style={{ resize: "vertical" }}
                        value={formData.observacao}
                        onChange={handleChange}
                    />
                </div>

                {/* -------- ativo -------- */}
                <div className="input-group checkbox-container">
                    <input
                        type="checkbox"
                        id="ativo"
                        name="ativo"
                        checked={formData.ativo}
                        onChange={handleChange}
                    />
                    <label htmlFor="ativo" className="checkbox-label">
                        Funcionário Ativo
                    </label>
                </div>
            </div>

            {/* submit */}
            <div className="navigation-buttons">
                <button type="submit" className="btn submit">
                    {mode === "edit" ? "Salvar" : "Cadastrar"}
                </button>
            </div>
        </form>
    );
}

/* memo evita re‑render quando as **props** não mudam */
export default memo(EmployeeForm);
