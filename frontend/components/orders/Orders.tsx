'use client';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import { useEffect, useState } from 'react';
import PayNow from './PayNow';
import Image from 'next/image';

export interface Orders {
  orderId: number;
  placedAt: Date;
  status: string;
  amounts: Amounts;
  payment: Payment;
  restaurant: Restaurant;
  deliveryAddress: DeliveryAddress;
  items: Item[];
}

export interface Amounts {
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
}

export interface DeliveryAddress {
  street: string;
  city: string;
}

export interface Item {
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Payment {
  mode: string;
  status: string;
}

export interface Restaurant {
  name: string;
  image: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    async function getOrders() {
      try {
        const res = (await api.get('/orders')).data;
        setOrders(res);
      } catch (error) {
        const err = handleError(error);
        console.log(err);
      }
    }
    getOrders();
  }, [refresh]);
  async function deleteOrder(orderId: number) {
    try {
      const res = await api.delete(`/orders/${orderId}`);
      console.log('success', res.data);
      setRefresh((prev) => !prev);
    } catch (error) {
      const err = handleError(error);
      console.log(err);
      throw err;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/30 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl font-bold gradient-text">My Orders</h1>
          <p className="text-muted-foreground text-lg">
            Track your delicious orders
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <p className="text-xl text-muted-foreground">No orders found</p>
            <p className="text-muted-foreground mt-2">
              Start ordering your favorite meals!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 food-card-hover"
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/30">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Image
                        src={`http://localhost:5000${order.restaurant.image}`}
                        alt={order.restaurant.name}
                        width={100}
                        height={100}
                        className="w-16 h-16 object-cover rounded-xl shadow-md"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-primary-foreground"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-card-foreground">
                        {order.restaurant.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.placedAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'preparing'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </div>
                </div>

                <div className="grid gap-4 mb-6">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-background/50 rounded-xl border border-border/30"
                    >
                      <Image
                        src={`http://localhost:5000${item.image}`}
                        width={100}
                        height={100}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-card-foreground">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.variant}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <span>×{item.quantity}</span>
                        </div>
                        <p className="font-bold text-primary">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-6 p-4 bg-muted/30 rounded-xl">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-card-foreground">
                      Delivery Address
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.deliveryAddress.street},{' '}
                      {order.deliveryAddress.city}
                    </p>
                  </div>
                </div>

                <div className="bg-background/50 rounded-xl p-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      ${order.amounts.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-green-600">
                      -${order.amounts.discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium">
                      ${order.amounts.delivery.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-border/30 pt-3">
                    <div className="flex justify-between">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-xl text-primary">
                        ${order.amounts.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-primary"
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
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Payment: {order.payment.mode}
                      </p>
                      {order.payment.status === 'not_paid' ? (
                        <PayNow orderId={order.orderId} />
                      ) : (
                        <p className="text-sm text-green-600 font-medium">
                          ✓ Paid
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteOrder(order.orderId)}
                    className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors duration-200 font-medium"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
