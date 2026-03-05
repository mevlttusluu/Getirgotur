import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '',
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // İleride global hata yönetimi eklemek için uygun nokta
    return Promise.reject(error);
  },
);

export default axiosClient;
