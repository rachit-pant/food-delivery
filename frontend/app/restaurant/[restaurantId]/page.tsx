import React from 'react';
import { api } from '@/api/api';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import AddButton from '@/components/GridRestro/AddButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Reviews from '@/components/GridRestro/Reviews';
import { cookies } from 'next/headers';

type MenuItem = {
  id: number;
  item_name: string;
  description: string;
  image_url: string;
  menu_categories: { id: number; cat_name: string };
  menu_variants: {
    id: number;
    variety_name: string;
    price: number;
    menu_id: number;
  }[];
};

interface RestroData {
  id: number;
  user_id: number;
  name: string;
  address: string;
  city_id: number;
  rating: number;
  imageurl: string;
  status: string;
  restaurant_timings: RestaurantTiming[];
  cities: Cities;
}

interface Cities {
  city_name: string;
  states: States;
}

interface States {
  state_name: string;
}

interface RestaurantTiming {
  id: number;
  restaurant_id: number;
  week_day: string;
  start_time: Date;
  end_time: Date;
}

type MenuData = Record<string, MenuItem[]>;

const Menus = async ({
  params,
}: {
  params: Promise<{ restaurantId: number }>;
}) => {
  let dataMenu;
  let dataRestro;
  let restaurantId;
  try {
    restaurantId = (await params).restaurantId;
    dataRestro = (await api.get(`restaurants/${restaurantId}`))
      .data as RestroData;
    dataMenu = (await api.get(`restaurants/${restaurantId}/menus`))
      .data as MenuData;
  } catch (error) {
    console.log(error);
    throw error;
  }
  const cookieStore = await cookies();
  const refreshtoken = cookieStore.get('refreshtoken')?.value;
  const todayWeekDay = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
  });
  const todayTimings = dataRestro.restaurant_timings.filter(
    (timing) => timing.week_day === todayWeekDay
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Restaurant Info */}
      <div className="sticky top-17 bg-white w-full shadow-md z-1 p-2">
        <div className="flex flex-col sm:flex-row items-center gap-6 max-w-7xl mx-auto p-6">
          <div className="relative w-32 h-32 flex-shrink-0 rounded-full overflow-hidden shadow-lg">
            <Image
              src={`http://localhost:5000${dataRestro.imageurl}`}
              alt={dataRestro.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center text-center sm:text-left space-y-2 flex-1">
            <h1 className="text-3xl font-bold">{dataRestro.name}</h1>
            <p className="text-gray-600">{dataRestro.address}</p>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Badge variant="secondary">
                City: {dataRestro.cities.city_name}
              </Badge>
              <Badge variant="secondary">
                State: {dataRestro.cities.states.state_name}
              </Badge>
              <Badge variant="secondary">
                Rating: {dataRestro.rating.toFixed(1)} ⭐
              </Badge>
              <Badge
                variant={
                  dataRestro.status === 'open' ? 'default' : 'destructive'
                }
              >
                {dataRestro.status.toUpperCase()}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              {todayTimings.length > 0 ? (
                todayTimings.map((timing) => (
                  <Badge key={timing.id} variant="outline">
                    {timing.week_day}:{' '}
                    {new Date(timing.start_time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    -{' '}
                    {new Date(timing.end_time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Badge>
                ))
              ) : (
                <Badge variant="destructive">Closed Today</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="tab-1" className="items-center">
        <div className="w-full flex justify-center bg-white sticky top-67 z-1 p-2 ">
          <TabsList className="h-auto rounded-none border-b p-0 bg-white">
            <TabsTrigger
              value="tab-1"
              className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Menus
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="data-[state=active]:after:bg-primary relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Reviews
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="tab-1">
          <div className="flex justify-center py-4">
            <div className="w-full max-w-4xl px-4 space-y-4">
              {/* Menu Items */}
              {Object.entries(dataMenu).map(([category, items]) => (
                <div
                  key={category}
                  id={`category-${category}`}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold mb-2 border-b-2 border-gray-200 pb-2 text-center">
                    {category}
                  </h2>

                  <div className="flex flex-col gap-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-center bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 mx-auto sm:mx-0">
                          <Image
                            src={`http://localhost:5000${item.image_url}`}
                            alt={item.item_name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>

                        <div className="flex flex-col justify-between flex-grow p-3 mt-2 sm:mt-0 sm:ml-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">
                              {item.item_name}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="ml-auto p-3">
                          <AddButton
                            key={item.id}
                            variant={item.menu_variants}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tab-2">
          <p className="text-muted-foreground p-4 text-center text-xs">
            Content for Tab 2
          </p>
        </TabsContent>
      </Tabs>
      <div className="fixed bottom-6 right-6 z-1">
        {refreshtoken ? <Reviews restaurantId={restaurantId} /> : ''}
      </div>
    </div>
  );
};

export default Menus;
