'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/api/api';
import { Month, Plan } from './AlltypesSubPlan';
const ShowPlans = () => {
  const [plans, setPlans] = useState<Plan>({
    month: [],
    year: [],
  });

  useEffect(() => {
    const fetchPlans = async () => {
      const response = (await api.get('/extra/plans')).data;
      console.log(response);
      setPlans(response);
    };
    fetchPlans();
  }, []);

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
              {plan.features.commission_rate}
              {plan.features.promotion_slots}
              {plan.features.priority_support}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ShowPlans;
