import { api } from './api';

export const userUpdate = async (data: {
  fullName: string;
  phoneNumber: string;
  password: string;
  email: string;
}) => {
  const payload = {
    full_name: data.fullName,
    phone_number: data.phoneNumber,
    password: data.password,
    email: data.email,
  };

  const res = await api.patch('/users', payload);
  return res.data;
};
