/* ---------------------------------------------------------------
   companyService.js
   Serviço responsável por todas as chamadas ao endpoint /empresas
   ------------------------------------------------------------- */
import api from "./api";           // instância do axios

/* helper - monta query-string a partir de um objeto */
const query = (p = {}) =>
    "?" +
    Object.entries(p)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join("&");

/* ---------- CRUD ---------- */
export const createCompany  = (payload)          => api.post("/empresas/",        payload);
export const listCompanies  = (p = {})           => api.get(`/empresas/${query(p)}`);
export const getCompany     = (id)               => api.get(`/empresas/${id}`);
export const updateCompany  = (id, payload)      => api.put(`/empresas/${id}`,    payload);
export const removeCompany  = (id)               => api.delete(`/empresas/${id}`);

/* ---------- default compatível com código legado ---------- */
export default {
    /* novos nomes “claros” */
    createCompany,  listCompanies,  getCompany,
    updateCompany,  removeCompany,

    /* aliases usados em partes antigas do front */
    create : createCompany,
    list   : listCompanies,
    get    : getCompany,
    update : updateCompany,
    remove : removeCompany,
};
