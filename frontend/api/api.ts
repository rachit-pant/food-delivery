import axios from 'axios';
export const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 1000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.error === 'JWTtokenexpired'
    ) {
      if (originalRequest._retry) {
        throw error;
      }

      originalRequest._retry = true;

      await api.get('/auths/refreshToken');

      return api(originalRequest);
    }

    throw error;
  }
);
