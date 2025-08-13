import { api } from './api';

export const AddreessPost = async (data: {
  address: string;
  city: string;
  country: string;
  state: string;
}) => {
  const payload = {
    address: data.address,
    city_id: data.city,
  };
  const res = await api.post('/users/address', payload);
  return res.data;
};

export const DeleteButton = async (data: number) => {
  const res = await api.delete(`/users/address/${data}`);
  return res.data;
};
