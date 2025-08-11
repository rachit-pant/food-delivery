'use client';
import React, { useEffect, useState } from 'react';
import CardRestra from './CardRestra';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';

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
  const [fetchedData, setfetchedData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await api.get('/restaurants');
        setfetchedData(data);
        setLoading(false);
      } catch (error) {
        const err = handleError(error);
        console.log(err);
        setLoading(false);
        throw err;
      }
    }
    fetchData();
  }, []);
  {
    if (loading) return <p>Loading</p>;
  }
  return (
    <div className="max-w-[1100px] mx-auto px-4">
      <div
        className="grid grid-cols-3 gap-x-10 gap-y-10 justify-center"
        style={{ userSelect: 'none' }}
      >
        {fetchedData.map((restaurants: restaurants) => (
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
