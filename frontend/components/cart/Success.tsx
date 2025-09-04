'use client';

import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
const Success = () => {
  useEffect(() => {
    async function postOrders() {}
    postOrders();
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-200">
            Payment Successful!
          </h1>
          <p className="text-green-700 dark:text-green-300">
            Your order has been confirmed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
