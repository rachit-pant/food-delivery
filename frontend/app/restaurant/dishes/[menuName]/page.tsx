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
      <div className="container mx-auto px-4 py-8  ">
        <div className="flex justify-center">
          <div className="rounded-2xl p-6 border-1 inset-shadow-sm mt-5">
            <Filter />
          </div>
        </div>
        <PopularMenu data={data} Name={Name} />
      </div>
    </div>
  );
};

export default page;
