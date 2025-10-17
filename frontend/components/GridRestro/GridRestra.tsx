'use client';

import { api } from '@/api/api';
import { useAppSelector } from '@/lib/hooks';
import { useCallback, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import CardRestra from './CardRestra';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

type Restaurants = {
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
};
interface userAddress {
  id: number;
  lat: number;
  lng: number;
}
const GridRestaurant = () => {
  const filter = useAppSelector((state) => state.filter.filterName);
  const country = useAppSelector((state) => state.country.countryName);
  async function fetchRestaurants() {
    const data = (
      await api.get(`/restaurants`, {
        params: {
          filter,
          country,
        },
      })
    ).data;
    return data;
  }

  async function fetchUserAddress() {
    const data = (await api.get('/address/address/user')).data;
    return data;
  }

  const restaurants = useQuery<Restaurants[]>({
    queryKey: ['restaurants', filter, country],
    queryFn: fetchRestaurants,
    staleTime: 3 * 60 * 1000,
  })

  const address = useQuery<userAddress>({
    queryKey: ['address', country],
    queryFn: fetchUserAddress,
    staleTime: 3 * 60 * 1000,
    enabled: !!restaurants.data,
  })
  useEffect(() => {
    if (restaurants.isError) {
      toast.error('Failed to fetch restaurants', {
        duration: 5000,
        description: (restaurants.error as Error)?.message
      });
    }
  }, [restaurants.isError, restaurants.error]);

  useEffect(() => {
    if (address.isError) {
      toast.error('No default address', {
        duration: 5000,
        description: (address.error as Error)?.message
      });
    }
  }, [address.isError, address.error]);



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
  const distances = restaurants.data?.map(
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
          Featured Restaurants
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto ">
          Discover amazing restaurants near you with the best ratings and
          fastest delivery
        </p>
      </div>


      {restaurants.isLoading ? (
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
      ) : restaurants.data?.length === 0 ? (
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
          {restaurants.data?.map((restaurant: Restaurants, index) => (
            <CardRestra
              key={restaurant.id}
              image={restaurant.imageurl}
              name={restaurant.name}
              rating={restaurant.rating}
              id={restaurant.id}
              distances={distances[index]}
              is_open={restaurant.is_open}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GridRestaurant;
