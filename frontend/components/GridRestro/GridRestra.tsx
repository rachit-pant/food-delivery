'use client';

import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import { useAppSelector } from '@/lib/hooks';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import CardRestra from './CardRestra';

type restaurants = {
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
  const [restaurants, setRestaurants] = useState<restaurants[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState<userAddress>({
    id: 0,
    lat: 0,
    lng: 0,
  });

  const filter = useAppSelector((state) => state.filter.filterName);
  const country = useAppSelector((state) => state.country.countryName);
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = (
          await api.get(`/restaurants?filter=${filter}&country=${country}`)
        ).data;
        console.log('data', data);
        setRestaurants(data);
      } catch (error) {
        const err = handleError(error);
        console.log(err);
        throw err;
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [filter, country]);

  useEffect(() => {
    async function fetchUserAddress() {
      try {
        const data = (await api.get('/address/address/user')).data;
        setUserAddress(data);
      } catch (error) {
        const err = handleError(error);
        console.log(err);
        throw err;
      }
    }
    fetchUserAddress();
  }, [country]);

  function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
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
  }
  const distances = restaurants.map(
    (d) => {
      if (userAddress?.lat && userAddress?.lng) {
        return getDistance(userAddress.lat, userAddress.lng, d.lat, d.lng) / 1000;
      }
      return 20;
    }
  );

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

      {loading ? (
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
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ userSelect: 'none' }}
        >
          {restaurants.map((restaurant: restaurants, index) => (
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

      {!loading && restaurants.length === 0 && (
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
      )}
    </div>
  );
};

export default GridRestaurant;
