'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import { CheckCircle } from 'lucide-react';
const Success = () => {
  const [session, setSession] = useState([]);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  useEffect(() => {
    const fetchSession = async () => {
      if (sessionId) {
        console.log(sessionId);
        try {
          const session = await api.get(
            `/auths/checkoutItemsView?sessionId=${sessionId}`
          );
          setSession(session.data);
          console.log('success', session.data);
        } catch (error) {
          console.log(error);
          const err = handleError(error);
          console.log(err);
        }
      }
    };
    fetchSession();
  }, [sessionId]);
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
            Your subscription has been confirmed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
