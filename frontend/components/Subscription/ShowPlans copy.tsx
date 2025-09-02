'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/api/api';
import { Plans } from './AlltypesSubPlan';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { handleError } from '@/lib/handleError';
import { PricingCard } from './PricingCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
const ShowPlans = () => {
  const router = useRouter();
  const [plans, setPlans] = useState<Plans[]>([]);

  const allowedPlans = [
    'price_1S2UE7FuZCtCjNMxpXi1IBpe',
    'price_1S2qniFuZCtCjNMxyYhqD9Fj',
    'price_1S2qp5FuZCtCjNMx2iiBNqT3',
    'price_1S2UHJFuZCtCjNMxX5aN10hH',
    'price_1S2qoGFuZCtCjNMxyo0vKeve',
    'price_1S2qpMFuZCtCjNMxtE38g6q8',
  ];
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = (await api.get('/extra/plans')).data;
        console.log(response);
        setPlans(response);
      } catch (error) {
        const errorData = handleError(error);
        console.log(errorData);
      }
    };
    fetchPlans();
  }, []);
  const monthly = plans.filter((plan) => plan.duration === 'month');
  const yearly = plans.filter((plan) => plan.duration === 'year');
  async function handleSubscribe(id: string) {
    const stipeData = (
      await api.post('/auths/subscribe', {
        priceId: id,
      })
    ).data;
    router.push(stipeData.url);
  }
  async function handleBilling() {
    console.log('Billing');
    const stipeData = (await api.get('/extra/billing')).data;
    console.log(stipeData.data.url);
    router.push(stipeData.data.url);
  }

  return (
    <div className="flex w-full justify-center px-4 py-8">
      <Tabs defaultValue="monthly" className="w-full max-w-6xl">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {monthly.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="yearly">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {yearly.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                onSubscribe={handleSubscribe}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShowPlans;
