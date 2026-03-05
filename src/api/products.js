import axiosClient from './axiosClient';

export const getProducts = async () => {
  const response = await axiosClient.get('/db.json');
  // JSON yapımız { products: [...] } şeklinde
  return response.data?.products ?? [];
};

