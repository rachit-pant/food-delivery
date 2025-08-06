import { api } from './api';

export const Login = async (data: { email: string; password: string }) => {
  const res = await api.post('/users/login', data);
  return res.data;
};
