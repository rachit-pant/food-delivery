'use client';
import { api } from '@/api/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { handleError } from '@/lib/handleError';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { SelectGroup } from '@radix-ui/react-select';

import Image from 'next/image';
import { setOrders } from './OrdersSlice';
import { Button } from '../ui/button';
import { useAppDispatch } from '@/lib/hooks';
type data = {
  id: number;
  quantity: number;
  restaurant_id: number;
  menus: {
    item_name: string;
    image_url: string;
  };
  menu_variants: {
    variety_name: string;
    price: number;
  };
};
type address = {
  id: number;
  address: string;
  cities: {
    city_name: string;
    states: {
      state_name: string;
      countries: {
        country_name: string;
      };
    };
  };
};
const CartInfo = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [cartInfo, setcartInfo] = useState<data[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(true);
  const [address, setAddress] = useState<address[]>([]);
  const [storage, setStorage] = useState('');
  const [payment, setPayment] = useState('');
  const [paymentstatus, setPaymentstatus] = useState('');
  useEffect(() => {
    async function fetchData() {
      try {
        const res = (await api.get('/cart')).data;
        setcartInfo(res);
      } catch (error) {
        const err = handleError(error);
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [quantity]);
  useEffect(() => {
    async function fetchAddress() {
      try {
        const res = await api.get('/users/address');
        setAddress(res.data);
      } catch (error) {
        const err = handleError(error);
        console.log(err);
        throw err;
      }
    }
    fetchAddress();
  }, []);
  async function updateQuantity(quantity: number, cartId: number) {
    try {
      await api.patch(`/cart/${cartId}`, {
        quantity,
      });
      setQuantity((prev) => !prev);
      console.log(cartInfo[0].restaurant_id);
    } catch (error) {
      const err = handleError(error);
      console.log(err);
      throw err;
    }
  }

  const TotalAmount = cartInfo.reduce(
    (sum, item) => sum + item.menu_variants.price * item.quantity,
    0
  );
  if (!cartInfo || cartInfo.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center shadow-lg rounded-2xl p-6">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <CardTitle className="text-xl font-semibold">
              Your cart is empty
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-gray-500 mb-6">
              Looks like you haven’t added anything yet. Start exploring our
              menu!
            </p>
            <Link href="/restaurant">
              <Button size="lg" className="rounded-xl">
                Browse Menu
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const resId: number = cartInfo[0].restaurant_id;
  async function handleCheckout() {
    const payload = {
      addressId: Number(storage),
      amount: TotalAmount,
      payment: payment,
      payment_status: paymentstatus,
      restaurant_id: resId,
    };
    dispatch(setOrders(payload));
    localStorage.setItem('orderPayload', JSON.stringify(payload));
    try {
      const res = (await api.post('/auths/create-payment-intent')).data;
      router.push(res.url);
    } catch (error) {
      const err = handleError(error);
      console.log(err);
      throw err;
    }
  }
  async function Orders() {
    try {
      const res = await api.post('/orders', {
        addressId: Number(storage),
        amount: TotalAmount,
        payment: payment,
        payment_status: paymentstatus,
        restaurant_id: resId,
      });
      console.log('success', res);
      router.push('/orders');
    } catch (error) {
      const err = handleError(error);
      console.log(err);
      throw err;
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartInfo.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/30 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto bg-muted rounded-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground">
              Add some delicious items to get started!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/30 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 py-8">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold gradient-text">Your Cart</h1>
          <p className="text-muted-foreground text-lg">
            Review your delicious selections
          </p>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
          <div className="space-y-4 mb-8">
            {cartInfo?.map((items) => (
              <div
                key={items.id}
                className="flex items-center gap-6 p-4 bg-background/50 rounded-xl border border-border/30 hover:shadow-md transition-all duration-300"
              >
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                  <Image
                    src={`http://localhost:5000${items.menus.image_url}`}
                    alt={items.menus.item_name}
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-bold text-card-foreground">
                    {items.menus.item_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {items.menu_variants.variety_name}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    ${(items.menu_variants.price * items.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-2">
                  <button
                    className="w-10 h-10 bg-background border border-border rounded-lg hover:bg-muted transition-colors duration-200 flex items-center justify-center font-bold text-lg"
                    onClick={() => updateQuantity(items.quantity - 1, items.id)}
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-lg font-bold text-card-foreground">
                    {items.quantity}
                  </span>
                  <button
                    className="w-10 h-10 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center font-bold text-lg"
                    onClick={() => updateQuantity(items.quantity + 1, items.id)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6 mb-8">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                Delivery Address
              </label>
              <Select onValueChange={(value) => setStorage(value)}>
                <SelectTrigger className="h-12 bg-background border-border/50 rounded-xl">
                  <SelectValue placeholder="Select delivery address" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {address.map((details) => (
                      <SelectItem key={details.id} value={String(details.id)}>
                        {details.address}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Payment Method
              </label>
              <Select
                onValueChange={(value) => {
                  if (value === 'COD') {
                    setPaymentstatus('not_paid');
                  } else {
                    setPaymentstatus('paid');
                  }
                  setPayment(value);
                }}
              >
                <SelectTrigger className="h-12 bg-background border-border/50 rounded-xl">
                  <SelectValue placeholder="Choose payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="COD">💵 Cash On Delivery</SelectItem>
                    <SelectItem value="Debit_Credit_Card">
                      💳 Card Payment
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {payment === 'Debit_Credit_Card' && (
            <div>
              <Button
                className="w-full h-14 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 pulse-glow mb-8"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          )}

          {payment === 'COD' && (
            <button
              className="w-full h-14 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 pulse-glow mb-8"
              onClick={Orders}
            >
              Place Order - Cash on Delivery
            </button>
          )}

          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-3xl font-bold gradient-text">
                  $
                  {cartInfo
                    .reduce(
                      (sum, item) =>
                        sum + item.menu_variants.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </p>
              </div>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartInfo;
