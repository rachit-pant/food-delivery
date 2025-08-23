'use client';
import { useEffect, useState } from 'react';
import type { Restaurant } from './Merchanttypes';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Clock,
  Star,
  Plus,
  Trash2,
  Eye,
  TrendingUp,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const MerchantControl = () => {
  const [restaurant, setRestaurant] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await api.get('/restaurants/merchant/restaurant');
        setRestaurant(res.data);
      } catch (error) {
        console.error(handleError(error));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDayAbbreviation = (day: string) => {
    const dayMap: { [key: string]: string } = {
      Monday: 'Mon',
      Tuesday: 'Tue',
      Wednesday: 'Wed',
      Thursday: 'Thu',
      Friday: 'Fri',
      Saturday: 'Sat',
      Sunday: 'Sun',
    };
    return dayMap[day] || day;
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/restaurants/${id}`);
      setRestaurant((prev) => prev.filter((rest) => rest.id !== id));
    } catch (error) {
      console.error(handleError(error));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200" />
                <CardHeader>
                  <div className="h-6 bg-slate-200 rounded mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded" />
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                Your Restaurants
              </h1>
              <p className="text-slate-600 text-lg">
                Manage and monitor your restaurant locations
              </p>
            </div>
            <Button
              variant="default"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => router.push('/user/restaurant/addform')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Restaurant
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Restaurants</p>
                    <p className="text-2xl font-bold">{restaurant.length}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Avg Rating</p>
                    <p className="text-2xl font-bold">
                      {restaurant.length > 0
                        ? (
                            restaurant.reduce((acc, r) => acc + r.rating, 0) /
                            restaurant.length
                          ).toFixed(1)
                        : '0.0'}
                    </p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Star className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Performance</p>
                    <p className="text-2xl font-bold">Excellent</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {restaurant.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Plus className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No restaurants yet
            </h3>
            <p className="text-slate-500 mb-6">
              Get started by adding your first restaurant location
            </p>
            <Button
              onClick={() => router.push('/user/restaurant/addform')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Restaurant
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {restaurant.map((restaurant, index) => (
              <Card
                key={restaurant.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white transform hover:scale-[1.02] hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                }}
              >
                <div className="relative h-48 bg-gradient-to-r from-orange-400 to-red-500 overflow-hidden">
                  {restaurant.imageurl ? (
                    <Image
                      src={`http://localhost:5000${restaurant.imageurl}`}
                      width={100}
                      height={100}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center relative">
                      <div className="text-white text-6xl font-bold opacity-30 group-hover:opacity-40 transition-opacity duration-300">
                        {restaurant.name.charAt(0)}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-500/20 group-hover:from-orange-300/30 group-hover:to-red-400/30 transition-all duration-500" />
                    </div>
                  )}

                  <div className="absolute top-4 right-4 transform group-hover:scale-110 transition-transform duration-300">
                    <Badge
                      variant="secondary"
                      className="bg-white/95 text-slate-700 font-semibold shadow-lg"
                    >
                      ID: {restaurant.id}
                    </Badge>
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center gap-1 bg-white/95 px-3 py-1 rounded-full shadow-lg">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-slate-700">
                        {restaurant.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                    {restaurant.name}
                  </CardTitle>

                  <div className="flex items-center gap-2 text-slate-600 mb-3">
                    <MapPin className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors duration-300" />
                    <span className="text-sm">{restaurant.address}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-700">
                        {restaurant.cities.city_name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {restaurant.cities.states.state_name},{' '}
                        {restaurant.cities.states.countries.country_name}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {restaurant.restaurant_timings.length > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors duration-300" />
                        <span className="font-medium text-slate-700">
                          Opening Hours
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                        {restaurant.restaurant_timings
                          .slice(0, 3)
                          .map((timing) => (
                            <div
                              key={timing.id}
                              className="flex items-center justify-between py-1 px-2 rounded bg-slate-50 group-hover:bg-orange-50 transition-colors duration-300"
                            >
                              <span className="text-sm font-medium text-slate-600 min-w-[3rem]">
                                {getDayAbbreviation(timing.week_day)}
                              </span>
                              <span className="text-sm text-slate-700 font-mono">
                                {formatTime(timing.start_time)} -{' '}
                                {formatTime(timing.end_time)}
                              </span>
                            </div>
                          ))}
                        {restaurant.restaurant_timings.length > 3 && (
                          <div className="text-xs text-slate-500 text-center py-1">
                            +{restaurant.restaurant_timings.length - 3} more
                            days
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(restaurant.id)}
                    className="flex-1 group/btn hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                    Delete
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Link
                      href={`/user/restaurant/${restaurant.id}`}
                      className="flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Menu
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MerchantControl;
