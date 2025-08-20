import Filter from '@/components/filters/Filter';
import GridRestra from '@/components/GridRestro/GridRestra';
import PopularDishes from '@/components/GridRestro/PopularDishes';
import TopBrands from '@/components/GridRestro/TopBrands';

import React from 'react';

const Restaurant = () => {
  return (
    <div className="flex flex-col ">
      <div className="w-full max-w-[1100px] flex items-center justify-center  gap-4 bg-white p-6 rounded-xl  md:ml-18">
        <Filter />
      </div>

      <PopularDishes />
      <TopBrands />
      <GridRestra />
    </div>
  );
};

export default Restaurant;
