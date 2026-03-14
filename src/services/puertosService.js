import api from './api';

export const getPuertos  = ()         => api.get('/puertos');
export const getPuerto   = (id)       => api.get(`/puertos/${id}`);
export const createPuerto= (data)     => api.post('/puertos', data);
export const updatePuerto= (id, data) => api.put(`/puertos/${id}`, data);
export const deletePuerto= (id)       => api.delete(`/puertos/${id}`);
