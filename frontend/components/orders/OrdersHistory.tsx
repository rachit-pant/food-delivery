'use client';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

type Root = Root2[];

interface Root2 {
  orderId: number;
  placedAt: string;
  status: string;
  amounts: Amounts;
  payment: Payment;
  restaurant: Restaurant;
  deliveryAddress: DeliveryAddress;
  items: Item[];
}

interface Amounts {
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
}

interface Payment {
  mode: string;
  status: string;
}

interface Restaurant {
  name: string;
  image: string;
}

interface DeliveryAddress {
  street: string;
  city: string;
}

interface Item {
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

const OrdersHistory = () => {
  const [orders, setOrders] = useState<Root>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = (await api.get('/users/orders')).data as Root;
        setOrders(res);
      } catch (error) {
        const err = handleError(error);
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Order History</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No past orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.orderId} className="shadow-lg border rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Order #{order.orderId}</CardTitle>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.placedAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  className={
                    order.status === 'delivered'
                      ? 'bg-green-500 text-white'
                      : order.status === 'preparing'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-red-500 text-white'
                  }
                >
                  {order.status}
                </Badge>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={`http://localhost:5000${order.restaurant.image}`}
                    alt={order.restaurant.name}
                    width={50}
                    height={50}
                    className="rounded-lg"
                  />
                  <div>
                    <p className="font-semibold">{order.restaurant.name}</p>
                    <p className="text-sm text-gray-500">
                      {order.deliveryAddress.street},{' '}
                      {order.deliveryAddress.city}
                    </p>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={`http://localhost:5000${item.image}`}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.variant} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">
                        ${item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-3" />

                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${order.amounts.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-green-600">
                      -${order.amounts.discount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>${order.amounts.delivery}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${order.amounts.total}</span>
                  </div>
                </div>

                <Separator className="my-3" />

                <p className="text-sm text-gray-500">
                  Paid via {order.payment.mode} (
                  <span
                    className={
                      order.payment.status === 'Completed'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {order.payment.status}
                  </span>
                  )
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersHistory;
