import React from 'react';
import HorizaontalCarousel from './HorizaontalCarousel';

const TopBrands = () => {
  const arr = [
    {
      id: 1,
      name: 'kanha',
      image: '/images/kanha',
    },
    {
      id: 2,
      name: 'Bread',
      image: '/images/kanha',
    },
    {
      id: 3,
      name: 'Paneer',
      image: '/images/kanha',
    },
    {
      id: 4,
      name: 'Butter',
      image: '/images/kanha',
    },
    {
      id: 5,
      name: 'Masala',
      image: '/images/kanha',
    },
    {
      id: 6,
      name: 'Biryani',
      image: '/images/kanha',
    },
    {
      id: 7,
      name: 'Dal',
      image: '/images/kanha',
    },
    {
      id: 8,
      name: 'Chapati',
      image: '/images/kanha',
    },
    {
      id: 10,
      name: 'Shake',
      image: '/images/kanha',
    },
    {
      id: 11,
      name: 'Choclate',
      image: '/images/kanha',
    },
    {
      id: 12,
      name: 'Butter',
      image: '/images/kanha',
    },
  ];
  return (
    <div className=" flex justify-center p-5 mb-10">
      <div className="flex flex-col gap-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sel">
          Top Brands
        </h1>
        <div className="w-5xl ">
          <HorizaontalCarousel items={arr} />
        </div>
      </div>
    </div>
  );
};

export default TopBrands;
