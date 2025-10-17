'use client'
import React, { useCallback } from 'react';
import CardRestra from './CardRestra';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/api';
import { Skeleton } from '../ui/skeleton';
import { useAppSelector } from '@/lib/hooks';
interface Data {
  id: number;
  user_id: number;
  name: string;
  address: string;
  city_id: number;
  rating: number;
  imageurl: string;
  status: string;
  lat: number;
  lng: number;
  is_open: boolean;
}
interface userAddress {
  id: number;
  lat: number;
  lng: number;
}

const PopularMenu = ({ MenuName }: { MenuName: string }) => {
  const filter = useAppSelector((state) => state.filter.filterName);
  const country = useAppSelector((state) => state.country.countryName);
  const PopularMenu = useQuery<Data[]>({
    queryKey: ['PopularMenu', MenuName, country, filter],
    queryFn: async () => {
      const res = await api.get(`/restaurants/dish/${MenuName}`, {
        params: { country, filter },
      });
      return res.data as Data[];
    },
    staleTime: 3 * 60 * 1000,
    enabled: !!MenuName,
  })
  const address = useQuery<userAddress>({
    queryKey: ['PopularMenuaddress', country],
    queryFn: async () => {
      const data = (await api.get('/address/address/user')).data;
      return data as userAddress;
    },
    staleTime: 3 * 60 * 1000,
    enabled: !!PopularMenu.data,
  })
  const getDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }, []);
  const distances = PopularMenu.data?.map(
    (d) => {
      if (address.isSuccess && address?.data?.lat && address?.data?.lng) {
        return getDistance(address?.data?.lat, address?.data?.lng, d.lat, d.lng) / 1000;
      }
      return 20;
    }
  ) ?? [];
  return (
    <div className="max-w-7xl mx-auto px-4 mt-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          {decodeURIComponent(MenuName)}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto ">
          Discover amazing restaurants near you with the best ratings and
          fastest delivery
        </p>
      </div>


      {PopularMenu.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-56 w-full rounded-xl" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : PopularMenu.data?.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No restaurants found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your filters to see more options
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ userSelect: 'none' }}
        >
          {PopularMenu.data?.map((items, index) => (
            <CardRestra
              key={items.id}
              image={items.imageurl}
              name={items.name}
              rating={items.rating}
              id={items.id}
              distances={distances[index]}
              is_open={items.is_open}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularMenu;
