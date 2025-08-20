'use client';
import CardRestra from './CardRestra';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import { useAppSelector } from '@/lib/hooks';
import { useEffect, useState } from 'react';

type restaurants = {
  id: number;
  user_id: number;
  name: string;
  address: string;
  city_id: number;
  rating: number;
  imageurl: string;
  status: string;
};
const GridRestra = () => {
  const [restaurants, setRestaurants] = useState<restaurants[]>([]);

  const filter = useAppSelector((state) => state.filter.filterName);
  useEffect(() => {
    async function fetchData() {
      try {
        const data = (await api.get(`/restaurants?filter=${filter}`)).data;
        setRestaurants(data);
      } catch (error) {
        const err = handleError(error);
        console.log(err);
        throw err;
      }
    }
    fetchData();
  }, [filter]);

  return (
    <div className="max-w-[1100px] mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">
        Food Delivery Restaurants
      </h1>
      <div
        className="grid grid-cols-3 gap-x-10 gap-y-10 justify-center"
        style={{ userSelect: 'none' }}
      >
        {restaurants.map((restaurants: restaurants) => (
          <CardRestra
            key={restaurants.id}
            image={restaurants.imageurl}
            name={restaurants.name}
            rating={restaurants.rating}
            id={restaurants.id}
          />
        ))}
      </div>
    </div>
  );
};

export default GridRestra;
