import { api } from '@/api/api';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import AddButton from '@/components/GridRestro/AddButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Clock, MapPin, Users } from 'lucide-react';

import { cookies } from 'next/headers';
import Reviews from '@/components/GridRestro/Reviews';

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

interface Order {
  order_items: OrderItem[];
}

interface OrderItem {
  product_name: string;
  menus: Menus;
}

interface Menus {
  image_url: string;
}

export interface Reviews {
  id: number;
  review: string;
  rating: number;
  user: Use;
  order: Orde;
}

export interface Orde {
  order_items: OrderIte[];
}

export interface OrderIte {
  product_name: string;
  menus: Menu;
}

export interface Menu {
  image_url: string;
}

export interface Use {
  full_name: string;
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
  let reviews;
  try {
    restaurantId = (await params).restaurantId;
    dataRestro = (await api.get(`restaurants/${restaurantId}`))
      .data as RestroData;
    dataMenu = (await api.get(`restaurants/${restaurantId}/menus`))
      .data as MenuData;
    reviews = (await api.get(`/restaurants/${restaurantId}/menus/reviews/all`))
      .data as Reviews[];
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border shadow-lg z-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Restaurant Image with enhanced styling */}
            <div className="relative w-40 h-40 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl image-overlay group">
              <Image
                src={`http://localhost:5000${dataRestro.imageurl}`}
                alt={dataRestro.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Restaurant Info with improved typography */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2 tracking-tight">
                  {dataRestro.name}
                </h1>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <p className="text-lg">{dataRestro.address}</p>
                </div>
              </div>

              {/* Enhanced badges with better spacing and colors */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Badge
                  variant="secondary"
                  className="px-4 py-2 text-sm font-medium"
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {dataRestro.cities.city_name},{' '}
                  {dataRestro.cities.states.state_name}
                </Badge>
                <Badge
                  variant="default"
                  className="px-4 py-2 text-sm font-medium bg-primary"
                >
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {dataRestro.rating.toFixed(1)}
                </Badge>
                <Badge
                  variant={
                    dataRestro.status === 'open' ? 'default' : 'destructive'
                  }
                  className="px-4 py-2 text-sm font-medium"
                >
                  {dataRestro.status.toUpperCase()}
                </Badge>
              </div>

              {/* Enhanced timing display */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {todayTimings.length > 0 ? (
                  todayTimings.map((timing) => (
                    <Badge
                      key={timing.id}
                      variant="outline"
                      className="px-3 py-1"
                    >
                      <Clock className="w-3 h-3 mr-1" />
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
                  <Badge variant="destructive" className="px-3 py-1">
                    <Clock className="w-3 h-3 mr-1" />
                    Closed Today
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="tab-1" className="w-full">
        <div className="sticky top-[200px] lg:top-[160px] bg-background/95 backdrop-blur-md border-b border-border z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-muted p-1 rounded-lg">
              <TabsTrigger
                value="tab-1"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium transition-all duration-200"
              >
                Our Menu
              </TabsTrigger>
              <TabsTrigger
                value="tab-2"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium transition-all duration-200"
              >
                <Users className="w-4 h-4 mr-2" />
                Reviews
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="tab-1" className="mt-0">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {Object.entries(dataMenu).map(([category, items]) => (
              <div
                key={category}
                id={`category-${category}`}
                className="mb-12 animate-fade-in-up"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {category}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                  {items.map((item, index) => (
                    <Card
                      key={item.id}
                      className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row">
                          {/* Enhanced image with overlay effects */}
                          <div className="relative w-full lg:w-80 h-64 lg:h-48 flex-shrink-0 overflow-hidden rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none image-overlay">
                            <Image
                              src={`http://localhost:5000${item.image_url}`}
                              alt={item.item_name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>

                          {/* Enhanced content area */}
                          <div className="flex-1 p-6 flex flex-col justify-between">
                            <div className="space-y-3">
                              <h3 className="text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-200">
                                {item.item_name}
                              </h3>
                              <p className="text-muted-foreground leading-relaxed line-clamp-3">
                                {item.description}
                              </p>
                              <Badge variant="outline" className="w-fit">
                                {item.menu_categories.cat_name}
                              </Badge>
                            </div>

                            {/* Enhanced add button area */}
                            <div className="mt-6 flex justify-end">
                              <AddButton
                                key={item.id}
                                variant={item.menu_variants}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tab-2" className="mt-0">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review, index) => (
                <Card
                  key={review.id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 space-y-4">
                    {/* Enhanced user info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {review.user.full_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-card-foreground">
                          {review.user.full_name}
                        </h3>
                      </div>
                    </div>

                    {/* Enhanced rating display */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-5 h-5 ${
                            idx < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({review.rating}/5)
                      </span>
                    </div>

                    {/* Enhanced review text */}
                    <blockquote className="text-card-foreground italic border-l-4 border-primary pl-4 py-2">
                      {review.review}
                    </blockquote>

                    {/* Enhanced order items */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-card-foreground flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Ordered Items:
                      </h4>
                      <div className="space-y-2">
                        {review.order.order_items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={`http://localhost:5000${item.menus.image_url}`}
                                alt={item.product_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-card-foreground font-medium">
                              {item.product_name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Enhanced floating review button */}
      {refreshtoken && (
        <div className="fixed bottom-6 right-6 z-50">
          <Reviews restaurantId={restaurantId} />
        </div>
      )}
    </div>
  );
};

export default Menus;
