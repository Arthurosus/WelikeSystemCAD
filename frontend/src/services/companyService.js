/* ---------------------------------------------------------------
   companyService.js
   Serviço responsável por todas as chamadas ao endpoint /empresas
----------------------------------------------------------------- */
import api from "../services/api";   // instancia do axios (já configurada)

/* ---------- helpers ---------- */
/** Constroi string de query a partir de um objeto */
function buildQuery(params = {}) {
    const entries = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== "");
    if (entries.length === 0) return "";
    const query = new URLSearchParams(entries).toString();
    return `?${query}`;
}

/* ---------- chamadas CRUD ---------- */
export const createCompany = (payload) =>
    api.post("/empresas/", payload);

export const listCompanies = ({ skip = 0, limit = 20, q } = {}) =>
    api.get(`/empresas/${buildQuery({ skip, limit, q })}`);

export const getCompany = (id) =>
    api.get(`/empresas/${id}`);

export const updateCompany = (id, payload) =>
    api.put(`/empresas/${id}`, payload);

export const removeCompany = (id) =>
    api.delete(`/empresas/${id}`);

/* ---------- export default compatível ---------- */
const CompanyService = {
    /* nomes “simples” usados nos componentes novos */
    createCompany,   listCompanies,
    getCompany,      updateCompany,
    removeCompany,

    /* aliases para código legado ---------------------------------- */
    // CompanyService.create(...)
    create : createCompany,
    // CompanyService.list(...)
    list   : listCompanies,
    // CompanyService.get(...)
    get    : getCompany,
    // CompanyService.update(...)
    update : updateCompany,
    // CompanyService.remove(...)
    remove : removeCompany,
};

export default CompanyService;
