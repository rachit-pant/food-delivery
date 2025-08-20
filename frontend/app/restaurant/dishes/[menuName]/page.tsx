import { api } from '@/api/api';
import PopularMenu from '@/components/GridRestro/PopularMenu';
import { handleError } from '@/lib/handleError';
import React from 'react';
import Filter from '@/components/filters/Filter';
const page = async ({ params }: { params: Promise<{ menuName: string }> }) => {
  let data;
  let Name;
  try {
    const menuName = (await params).menuName;
    Name = menuName;
    data = (await api.get(`/restaurants/dish/${menuName}`)).data;
  } catch (error) {
    const err = handleError(error);
    console.log(err);
    throw err;
  }
  return (
    <div>
      <Filter />
      <PopularMenu data={data} Name={Name} />
    </div>
  );
};

export default page;
