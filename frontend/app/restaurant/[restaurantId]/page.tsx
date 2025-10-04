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

export interface ReviewsType {
  id: number;
  review: string;
  rating: number;
  user: { full_name: string };
  order: {
    order_items: { product_name: string; menus: { image_url: string } }[];
  };
}

type MenuData = Record<string, MenuItem[]>;

function isRestaurantOpen(timings: RestaurantTiming[], now: Date): boolean {
  if (!timings || timings.length === 0) return false;

  return timings.some((timing) => {
    const start = new Date(timing.start_time);
    const end = new Date(timing.end_time);

    const todayStart = new Date(now);
    todayStart.setHours(start.getHours(), start.getMinutes(), 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(end.getHours(), end.getMinutes(), 0, 0);

    if (todayEnd <= todayStart) {
      todayEnd.setDate(todayEnd.getDate() + 1);
    }

    return now >= todayStart && now <= todayEnd;
  });
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const Menus = async ({
  params,
}: {
  params: Promise<{ restaurantId: number }>;
}) => {
  let dataMenu: MenuData;
  let dataRestro: RestroData;
  let reviews: ReviewsType[];
  let restaurantId: number;

  try {
    restaurantId = (await params).restaurantId;
    dataRestro = (await api.get(`restaurants/${restaurantId}`))
      .data as RestroData;
    dataMenu = (await api.get(`restaurants/${restaurantId}/menus`))
      .data as MenuData;
    reviews = (await api.get(`/restaurants/${restaurantId}/menus/reviews/all`))
      .data as ReviewsType[];
  } catch (error) {
    console.error(error);
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

  const now = new Date();
  const isOpen = isRestaurantOpen(todayTimings, now);

  const Header = (
    <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border shadow-lg z-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="relative w-40 h-40 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl image-overlay group">
            <Image
              src={`http://localhost:5000${dataRestro.imageurl}`}
              alt={dataRestro.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          <div className="flex-1 text-center lg:text-left space-y-5">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-3">
                {dataRestro.name}
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5" />
                <p className="text-lg leading-relaxed">
                  {dataRestro.address}, {dataRestro.cities.city_name},{' '}
                  {dataRestro.cities.states.state_name}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Badge
                variant="default"
                className="px-4 py-2 text-sm font-medium bg-primary"
              >
                <Star className="w-3 h-3 mr-1 fill-current" />
                {dataRestro.rating.toFixed(1)}
              </Badge>

              {isOpen ? (
                <Badge
                  variant="default"
                  className="px-4 py-1.5 text-sm font-medium"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Open Now {formatTime(now)}
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="px-4 py-1.5 text-sm font-medium"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Closed Now {formatTime(now)}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {todayTimings.length > 0 &&
                todayTimings.map((timing) => (
                  <Badge
                    key={timing.id}
                    variant="outline"
                    className="px-4 py-1.5 text-sm font-medium"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {timing.week_day}: {formatTime(timing.start_time)} -{' '}
                    {formatTime(timing.end_time)}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        {Header}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {Header}

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

        <TabsContent value="tab-1">
          <div className="max-w-6xl mx-auto px-6 py-8">
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

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item, index) => (
                    <Card
                      key={item.id}
                      className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm animate-scale-in p-5"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-0">
                        <div className="flex flex-col">
                          <div className="relative w-full h-64 lg:h-48 overflow-hidden rounded-t-lg image-overlay">
                            <Image
                              src={`http://localhost:5000${item.image_url}`}
                              alt={item.item_name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110 my-2"
                            />
                          </div>

                          <div className="flex-1 p-6 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <h3 className="text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors duration-200">
                                {item.item_name}
                              </h3>
                              <Badge variant="outline">
                                {item.menu_categories.cat_name}
                              </Badge>
                            </div>

                            <div className="mt-3">
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

        <TabsContent value="tab-2">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review, index) => (
                <Card
                  key={review.id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {review.user.full_name.charAt(0)}
                      </div>
                      <h3 className="font-semibold text-lg text-card-foreground">
                        {review.user.full_name}
                      </h3>
                    </div>

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

                    <blockquote className="text-card-foreground italic border-l-4 border-primary pl-4 py-2">
                      {review.review}
                    </blockquote>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-card-foreground flex items-center gap-2">
                        <Users className="w-4 h-4" /> Ordered Items:
                      </h4>
                      <div className="space-y-2">
                        {review.order.order_items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
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

      {refreshtoken && (
        <div className="fixed bottom-6 right-6 z-50">
          <Reviews restaurantId={restaurantId} />
        </div>
      )}
    </div>
  );
};

export default Menus;
