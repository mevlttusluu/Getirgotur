import axiosClient from './axiosClient';

export const getProducts = async () => {
  const response = await axiosClient.get('/api/products');
  return response.data?.products ?? [];
};

export const addProduct = async (payload) => {
  const response = await axiosClient.post('/api/products', payload);
  return response.data?.product ?? null;
};

export const updateProduct = async (id, payload) => {
  const response = await axiosClient.put(`/api/products/${id}`, payload);
  return response.data?.product ?? null;
};

export const deleteProduct = async (id) => {
  await axiosClient.delete(`/api/products/${id}`);
  return true;
};

