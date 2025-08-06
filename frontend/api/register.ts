import { api } from './api';

export async function registerUsers(data: {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}) {
  const payload = {
    full_name: data.fullName,
    phone_number: data.phoneNumber,
    email: data.email,
    password: data.password,
  };
  const res = await api.post('/users/register', payload);
  return await res.data;
}
