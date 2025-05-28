// ─────────────────────────────────────────────────────
// Serviço axios único usado por toda a aplicação
// ─────────────────────────────────────────────────────
import axios from "axios";

/**
 * URL base da API.
 * Prioridade →
 *   1. Variável .env para CRA (REACT_APP_API_URL)
 *   2. Variável .env para Vite (VITE_API_URL)
 *   3. Fallback local
 */
const baseURL =
    process.env.REACT_APP_API_URL ||
    import.meta?.env?.VITE_API_URL ||
    "http://127.0.0.1:8000";

/* instância configurada */
export const api = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
});

/* ── export default para suportar antigos imports --- */
export default api;
