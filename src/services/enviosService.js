import api from './api';

// ── Terrestres ────────────────────────────────────────────────────────────
export const getTerrestres   = ()         => api.get('/envios/terrestres');
export const getTerresre     = (id)       => api.get(`/envios/terrestres/${id}`);
export const createTerresre  = (data)     => api.post('/envios/terrestres', data);
export const updateTerresre  = (id, data) => api.put(`/envios/terrestres/${id}`, data);
export const deleteTerresre  = (id)       => api.delete(`/envios/terrestres/${id}`);

// ── Marítimos ─────────────────────────────────────────────────────────────
export const getMaritimos    = ()         => api.get('/envios/maritimos');
export const getMaritimo     = (id)       => api.get(`/envios/maritimos/${id}`);
export const createMaritimo  = (data)     => api.post('/envios/maritimos', data);
export const updateMaritimo  = (id, data) => api.put(`/envios/maritimos/${id}`, data);
export const deleteMaritimo  = (id)       => api.delete(`/envios/maritimos/${id}`);
