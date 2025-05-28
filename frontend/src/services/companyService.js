// -----------------------------------------------------------------------------
// Todas as chamadas relacionadas à entidade Empresa
// -----------------------------------------------------------------------------
import api from "./api";

export const CompanyService = {
    list:   (skip = 0, limit = 20) => api.get(`/empresas/?skip=${skip}&limit=${limit}`),
    get:    (id)                   => api.get(`/empresas/${id}`),
    create: (payload)              => api.post("/empresas/", payload),
    update: (id, payload)          => api.put(`/empresas/${id}`, payload),
    remove: (id)                   => api.delete(`/empresas/${id}`),
};
