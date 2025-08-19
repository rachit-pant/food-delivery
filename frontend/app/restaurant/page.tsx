import Filter from '@/components/filters/Filter';
import GridRestra from '@/components/GridRestro/GridRestra';
import PopularDishes from '@/components/GridRestro/PopularDishes';
import TopBrands from '@/components/GridRestro/TopBrands';

import React from 'react';

const Restaurant = () => {
  return (
    <div className="">
      <Filter />

      <PopularDishes />
      <TopBrands />
      <GridRestra />
    </div>
  );
};

export default Restaurant;
