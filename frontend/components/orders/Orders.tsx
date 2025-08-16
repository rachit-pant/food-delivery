'use client';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import PayNow from './PayNow';
import { Button } from '../ui/button';

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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.orderId}
            className="border rounded-lg p-4 shadow-sm bg-white space-y-3"
          >
            <div className="flex items-center gap-4 border-b pb-3">
              <Image
                src={`http://localhost:5000${order.restaurant.image}`}
                alt={order.restaurant.name}
                height={100}
                width={100}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h2 className="font-semibold text-lg">
                  {order.restaurant.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(order.placedAt).toLocaleDateString()} •{' '}
                  <span className="capitalize">{order.status}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Image
                    src={`http://localhost:5000${item.image}`}
                    alt={item.name}
                    height={100}
                    width={100}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.variant}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">x{item.quantity}</p>
                    <p className="font-semibold">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-600">
              <strong>Delivery to:</strong> {order.deliveryAddress.street},{' '}
              {order.deliveryAddress.city}
            </div>

            <div className="text-sm space-y-1 border-t pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${order.amounts.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-green-600">
                  - ${order.amounts.discount}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>${order.amounts.delivery}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-1">
                <span>Total</span>
                <span>${order.amounts.total}</span>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              <strong>Payment:</strong> {order.payment.mode}
              {order.payment.status === 'not_paid' ? (
                <PayNow orderId={order.orderId} />
              ) : (
                <p>Paid</p>
              )}
            </div>
            <div>
              <Button type="submit" onClick={() => deleteOrder(order.orderId)}>
                Delete Order
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
