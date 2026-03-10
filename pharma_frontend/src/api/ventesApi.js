import axiosInstance from './axiosConfig';

export const fetchVentes = async () => {
  const response = await axiosInstance.get('/ventes/');
  return response.data;
};

export const createVente = async (data) => {
  const response = await axiosInstance.post('/ventes/', data);
  return response.data;
};

export const annulerVente = async (id) => {
  const response = await axiosInstance.post(`/ventes/${id}/annuler/`);
  return response.data;
};