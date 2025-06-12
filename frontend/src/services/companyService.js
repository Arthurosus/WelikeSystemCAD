// src/services/companyService.js
import api from "./api";            // ← caminho relativo (não usa mais '@/')

// 🔹 Cria uma nova empresa ------------------------------------------
export const createCompany = (payload) => api.post("/empresas/", payload);

// 🔹 Atualiza empresa existente -------------------------------------
export const updateCompany = (id, payload) =>
    api.put(`/empresas/${id}`, payload);

// 🔹 Lista empresas (com paginação/opções de filtro) ----------------
export const listCompanies = (params = {}) =>
    api.get("/empresas/", { params });

// 🔹 Remove empresa --------------------------------------------------
export const deleteCompany = (id) => api.delete(`/empresas/${id}`);

/* ------------------------------------------------------------------
   Export default: permite usar
     import CompanyService from "../services/companyService";
   e depois chamar CompanyService.createCompany(), etc.
------------------------------------------------------------------- */
const CompanyService = {
    createCompany,
    updateCompany,
    listCompanies,
    deleteCompany,
};

export default CompanyService;
