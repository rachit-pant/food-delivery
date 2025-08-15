'use client';
import React from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { api } from '@/api/api';
import { Button } from '../ui/button';
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
const Card = ({
  onPaymentSuccess,
  cart,
}: {
  onPaymentSuccess: () => void;
  cart: data[];
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    const res = await api.post('/auths/create-payment-intent', {
      amount: cart.reduce(
        (sum, item) => sum + item.menu_variants.price * item.quantity,
        0
      ),
    });
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;
    const { clientSecret } = res.data;
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });
    if (result.error) {
      console.log(result.error.message);
    } else if (result.paymentIntent?.status === 'succeeded') {
      console.log('Payment Successful');
      onPaymentSuccess();
    }
    setLoading(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button type="submit" disabled={!stripe || loading}>
        Pay
      </Button>
    </form>
  );
};

export default Card;
