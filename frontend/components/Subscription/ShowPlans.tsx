'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/api/api';
import { Month, Plan } from './AlltypesSubPlan';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { handleError } from '@/lib/handleError';
const ShowPlans = () => {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan>({
    month: [],
    year: [],
  });
  const allowedPlans = [
    '0',
    'price_1S2UE7FuZCtCjNMxpXi1IBpe',
    '0',
    '0',
    'price_1S2UHJFuZCtCjNMxX5aN10hH',
    '0',
    '0',
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
  async function handleSubscribe(id: string) {
    const stipeData = (
      await api.post('/auths/subscribe', {
        priceId: id,
      })
    ).data;
    router.push(stipeData.url);
  }

  return (
    <div>
      {Object.entries(plans).map(([key, value]) => (
        <div key={key}>
          {key}
          {value.map((plan: Month) => (
            <div key={plan.id}>
              {plan.name}
              {plan.price}
              {plan.duration}
              {plan.features.discount}
              {plan.features.free_delivery}
              <Button
                onClick={() => {
                  handleSubscribe(allowedPlans[plan.id - 1]);
                }}
              >
                Subscribe
              </Button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ShowPlans;
