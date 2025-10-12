import axios from 'axios';
const backendUrl =
  typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : 'http://localhost:5000';
export const api = axios.create({
  baseURL: backendUrl,
  timeout: 1000,
  withCredentials: true,
});

let refreshRequest: Promise<unknown> | null = null;
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log('token');
    if (
      (error.response &&
        error.response.status === 401 &&
        error.response.data?.message === 'Token expired') ||
      (error.response &&
        error.response.status == 401 &&
        error.response.data?.message === 'No access token provided')
    ) {
      if (originalRequest._retry) {
        throw error;
      }
      if (refreshRequest) {
        await refreshRequest;
        return api(originalRequest);
      }

      originalRequest._retry = true;

      try {
        refreshRequest = api.get('/auths/refreshToken');
        await refreshRequest;
        console.log('token 5 ', refreshRequest);
        return api(originalRequest);
      } catch (error) {
        throw error;
      } finally {
        refreshRequest = null;
      }
    }

    throw error;
  }
);
