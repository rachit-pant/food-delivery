'use client';
import { useEffect, useState } from 'react';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  Store,
  ShoppingCart,
  DollarSign,
  Star,
  TrendingUp,
  Calendar,
  Users,
  Activity,
  Crown,
  Sparkles,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
export interface Root {
  totalRestaurant: number;
  totalOrders: number;
  totalRevenue: number;
  avgRating: number;
  avgPerRestaurant: number;
  restaurantData: RestaurantDaum[];
  orders: Order[];
}

export interface RestaurantDaum {
  name: string;
  image: string;
  id: number;
}

export interface Order {
  id: number;
  user_id: number;
  restaurant_id: number;
  total_amount: number;
  discount_amount: number;
  delivery_charges: number;
  tax_amount: number;
  net_amount: number;
  payment_status: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  order_items: OrderItem[];
  restaurants: Restaurants;
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_id: number;
  variant_id: number;
  price: number;
  quantity: number;
  total_amount: number;
  product_name: string;
}

export interface Restaurants {
  id: number;
  user_id: number;
  name: string;
  address: string;
  city_id: number;
  rating: number;
  status: string;
  imageurl: string;
}
const FranchiseDashboard = ({ franchiseId }: { franchiseId: string }) => {
  const [fetched, setFetched] = useState(true);
  const [totalRestaurant, setTotalRestaurant] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [incomeAvgPerRestaurant, setIncomeAvgPerRestaurant] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurantData, setRestaurantData] = useState<RestaurantDaum[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`/franchise/dashboard/${franchiseId}`);
        setTotalRestaurant(res.data.totalRestaurant);
        setTotalOrders(res.data.totalOrders);
        setTotalRevenue(res.data.totalRevenue);
        setAvgRating(Number.parseFloat(res.data.avgRating.toFixed(1)));
        setIncomeAvgPerRestaurant(
          Number.parseFloat(res.data.avgPerRestaurant.toFixed(1))
        );
        setOrders(res.data.orders);
        setRestaurantData(res.data.restaurantData);
        setFetched(false);
      } catch (error) {
        console.error(handleError(error));
      }
    }
    fetchData();
  }, [franchiseId]);
  if (fetched) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Premium Access Required
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Unlock powerful analytics and insights for your restaurant
              business
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">
                  Real-time Dashboard Analytics
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">
                  Advanced Revenue Tracking
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">
                  Premium Restaurant Insights
                </span>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
                asChild
              >
                <Link href="/subscription">
                  <Crown className="mr-2 h-5 w-5" />
                  Buy Standard or Premium Subscription to Get Access
                </Link>
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>Secure payment • Cancel anytime</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Join thousands of restaurant owners who trust our platform
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const salesData = restaurantData.map((restaurant) => {
    const totalSales = orders
      .filter((o) => o.restaurant_id === restaurant.id)
      .reduce((sum, o) => sum + o.net_amount, 0);
    return {
      name:
        restaurant.name.length > 12
          ? restaurant.name.substring(0, 12) + '...'
          : restaurant.name,
      amount: totalSales,
      orders: orders.filter((o) => o.restaurant_id === restaurant.id).length,
    };
  });

  const revenueData = orders.slice(0, 7).map((order, index) => ({
    day: `Day ${index + 1}`,
    revenue: order.net_amount,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <Activity className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Restaurant Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Monitor your business performance
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">
                Total Restaurants
              </CardTitle>
              <Store className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {totalRestaurant}
              </div>
              <p className="text-xs text-blue-100 mt-1">Active locations</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalOrders}</div>
              <p className="text-xs text-green-100 mt-1">Orders processed</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ₹{totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-purple-100 mt-1">Total earnings</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{avgRating}</div>
              <div className="flex items-center mt-1">
                <Progress
                  value={avgRating * 20}
                  className="w-16 h-1 bg-orange-300"
                />
                <span className="text-xs text-orange-100 ml-2">out of 5</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-teal-100">
                Avg per Restaurant
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-teal-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ₹{incomeAvgPerRestaurant.toLocaleString()}
              </div>
              <p className="text-xs text-teal-100 mt-1">Average income</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Revenue Trend
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Daily revenue performance
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: 'hsl(var(--muted-foreground))',
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: 'hsl(var(--muted-foreground))',
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="url(#colorRevenue)"
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, fill: '#8b5cf6' }}
                    />
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Restaurant Performance
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Sales by restaurant
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} barCategoryGap="30%">
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: 'hsl(var(--muted-foreground))',
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 12,
                        fill: 'hsl(var(--muted-foreground))',
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Bar
                      dataKey="amount"
                      fill="url(#colorBar)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={40}
                    />
                    <defs>
                      <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  Recent Orders
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Latest order activity
                </p>
              </div>
              <Badge
                variant="secondary"
                className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                {orders.length} orders
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <div key={order.id}>
                      <div className="flex items-center justify-between py-4 px-4 rounded-lg bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 ring-2 ring-blue-200">
                            <AvatarImage
                              src={`http://localhost:5000${order.restaurants.imageurl}`}
                              alt={order.restaurants.name}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold">
                              {order.restaurants.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground leading-none">
                              {order.restaurants.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3 text-blue-500" />
                              <p className="text-sm text-muted-foreground">
                                {order.order_items.length} items
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-green-500" />
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-bold text-lg bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            ₹{order.net_amount}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                order.payment_status === 'paid'
                                  ? 'default'
                                  : 'destructive'
                              }
                              className={`text-xs ${
                                order.payment_status === 'paid'
                                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                                  : 'bg-gradient-to-r from-red-500 to-red-600'
                              }`}
                            >
                              {order.payment_status}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize border-blue-300 text-blue-600"
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {index < orders.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No orders found</p>
                    <p className="text-sm text-muted-foreground">
                      Orders will appear here once they are placed
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FranchiseDashboard;
