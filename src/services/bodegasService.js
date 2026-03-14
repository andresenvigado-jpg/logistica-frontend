import api from './api';

export const getBodegas  = ()         => api.get('/bodegas');
export const getBodega   = (id)       => api.get(`/bodegas/${id}`);
export const createBodega= (data)     => api.post('/bodegas', data);
export const updateBodega= (id, data) => api.put(`/bodegas/${id}`, data);
export const deleteBodega= (id)       => api.delete(`/bodegas/${id}`);
