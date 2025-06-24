import api from "./api";

/* Gera automaticamente os métodos CRUD para qualquer recurso --
   basta passar a string do endpoint, e já vem:
   list / get / create / update / remove                        */

export default (resource) => ({
    list  : (params)        => api.get(`/${resource}`, { params }),
    get   : (id)            => api.get(`/${resource}/${id}`),
    create: (payload)       => api.post(`/${resource}`, payload),
    update: (id, payload)   => api.put(`/${resource}/${id}`, payload),
    remove: (id)            => api.delete(`/${resource}/${id}`)
});
