import GridRestra from '@/components/GridRestro/GridRestra';
import Navbar from '@/components/Navbar/Navbar';
import React from 'react';

const Restaurant = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <GridRestra />
      </div>
    </div>
  );
};

export default Restaurant;
