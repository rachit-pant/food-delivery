'use client';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useEffect, useState } from 'react';
import { SelectGroup } from '@radix-ui/react-select';
import Card from '../orders/Card';
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
  async function Orders() {
    try {
      const res = await api.post('/orders', {
        addressId: Number(storage),
        amount: cartInfo.reduce(
          (sum, item) => sum + item.menu_variants.price * item.quantity,
          0
        ),
        payment: payment,
        payment_status: paymentstatus,
        restaurant_id: cartInfo[0].restaurant_id,
      });
      console.log('success', res);
    } catch (error) {
      const err = handleError(error);
      console.log(err);
      throw err;
    }
  }
  if (loading) {
    return <p className="text-gray-500 text-center mt-10">Loading cart...</p>;
  }

  if (cartInfo.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        🛒 Your Cart
      </h1>

      <div className="space-y-4">
        {cartInfo?.map((items) => (
          <div
            key={items.id}
            className="flex items-center gap-4 border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow duration-200"
          >
            {/* Image */}
            <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden">
              <Image
                src={`http://localhost:5000${items.menus.image_url}`}
                alt={items.menus.item_name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>

            {/* Item details */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-800">
                {items.menus.item_name}
              </h2>
              <p className="text-sm text-gray-500">
                {items.menu_variants.variety_name}
              </p>
              <p className="mt-1 text-lg font-bold text-green-600">
                ${(items.menu_variants.price * items.quantity).toFixed(2)}
              </p>
            </div>
            {/* Quantity controls */}
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold"
                onClick={() => updateQuantity(items.quantity - 1, items.id)}
              >
                −
              </button>
              <span className="min-w-[2rem] text-center text-lg font-semibold">
                {items.quantity}
              </span>
              <button
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-lg font-bold"
                onClick={() => updateQuantity(items.quantity + 1, items.id)}
              >
                +
              </button>
            </div>
          </div>
        ))}
        <div>
          <Select onValueChange={(value) => setStorage(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Address" />
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
            <SelectTrigger>
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="COD">Cash On Delivery</SelectItem>
                <SelectItem value="Debit_Credit_Card">Card</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {payment === 'Debit_Credit_Card' && (
          <Card cart={cartInfo} onPaymentSuccess={Orders} />
        )}
        {/* Total and Place Order */}
        <div className="mt-6 p-4 border-t flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <span className="text-lg font-semibold text-gray-700">
            Total:
            <span className="ml-2 text-2xl font-bold text-green-600">
              $
              {cartInfo
                .reduce(
                  (sum, item) => sum + item.menu_variants.price * item.quantity,
                  0
                )
                .toFixed(2)}
            </span>
          </span>
          <button
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-md transition-colors duration-200"
            onClick={Orders}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};
export default CartInfo;
