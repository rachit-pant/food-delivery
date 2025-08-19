import React from 'react';
import HorizaontalCarousel from './HorizaontalCarousel';

const PopularDishes = () => {
  const arr = [
    {
      id: 1,
      name: 'Pizza',
      image: '/images/pizza',
    },
    {
      id: 2,
      name: 'Bread',
      image: '/images/pizza',
    },
    {
      id: 3,
      name: 'Paneer',
      image: '/images/pizza',
    },
    {
      id: 4,
      name: 'Butter',
      image: '/images/pizza',
    },
    {
      id: 5,
      name: 'Masala',
      image: '/images/pizza',
    },
    {
      id: 6,
      name: 'Biryani',
      image: '/images/pizza',
    },
    {
      id: 7,
      name: 'Dal',
      image: '/images/pizza',
    },
    {
      id: 8,
      name: 'Chapati',
      image: '/images/pizza',
    },
    {
      id: 10,
      name: 'Shake',
      image: '/images/pizza',
    },
    {
      id: 11,
      name: 'Choclate',
      image: '/images/pizza',
    },
    {
      id: 12,
      name: 'Butter',
      image: '/images/pizza',
    },
  ];
  return (
    <div className=" flex justify-center bg-gray-100 p-5">
      <div className="flex flex-col gap-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Inspiration for Your First Order
        </h1>
        <div className="w-5xl ">
          <HorizaontalCarousel items={arr} />
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;
