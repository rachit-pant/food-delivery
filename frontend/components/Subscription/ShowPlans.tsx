'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { CircleCheck, CircleHelp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
const tooltipContent = {
  styles: 'Choose from a variety of styles to suit your preferences.',
  filters: 'Choose from a variety of filters to enhance your portraits.',
  credits: 'Use these credits to retouch your portraits.',
};
import { useRouter } from 'next/navigation';
import { MerchantFeatures, Plans, UserFeatures } from './AlltypesSubPlan';
import { useAppSelector } from '@/lib/hooks';

const YEARLY_DISCOUNT = 20;

const Pricing03 = () => {
  const role = useAppSelector((state) => state.roleMiddleware.role);
  const router = useRouter();
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState('monthly');
  const [fetchedPlans, setFetchedPlans] = useState<Plans[]>([]);
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = (await api.get('/extra/plans')).data;
        console.log(response);
        setFetchedPlans(response as Plans[]);
      } catch (error) {
        const errorData = handleError(error);
        console.log(errorData);
      }
    };
    fetchPlans();
  }, [role]);

  const monthlyPlans = fetchedPlans.filter((plan) => plan.duration === 'month');
  const yearlyPlans = fetchedPlans.filter((plan) => plan.duration === 'year');
  let monthlyPlan;
  let yearlyPlan;

  if (role == 1) {
    monthlyPlan = monthlyPlans.map((plan) => {
      const features = plan.features as UserFeatures;
      return {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        description:
          'Get 20 AI-generated portraits with 2 unique styles and filters.',
        features: [
          { title: 'Discount upto', value: features.discount },
          { title: 'Free Delivery', value: features.free_delivery },
          { title: 'Choice of 2 styles', tooltip: tooltipContent.styles },
          { title: 'Choice of 2 filters', tooltip: tooltipContent.filters },
          { title: '2 retouch credits', tooltip: tooltipContent.credits },
        ],
        buttonText: 'Subscribe Now',
        stripe_price_id: plan.stripe_price_id,
      };
    });
    yearlyPlan = yearlyPlans.map((plan) => {
      const features = plan.features as UserFeatures;
      return {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        description:
          'Get 20 AI-generated portraits with 2 unique styles and filters.',
        features: [
          { title: 'Discount upto', value: features.discount },
          { title: 'Free Delivery', value: features.free_delivery },
          { title: 'Choice of 2 styles', tooltip: tooltipContent.styles },
          { title: 'Choice of 2 filters', tooltip: tooltipContent.filters },
          { title: '2 retouch credits', tooltip: tooltipContent.credits },
        ],
        buttonText: 'Subscribe Now',
        stripe_price_id: plan.stripe_price_id,
      };
    });
  } else {
    monthlyPlan = monthlyPlans.map((plan) => {
      const features = plan.features as MerchantFeatures;
      return {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        description:
          'Get 20 AI-generated portraits with 2 unique styles and filters.',
        features: [
          { title: 'Commission rate', value: features.commission_rate },
          { title: 'Promotion slots', value: features.promotion_slots },
          { title: 'Choice of 2 styles', tooltip: tooltipContent.styles },
          { title: 'Choice of 2 filters', tooltip: tooltipContent.filters },
          { title: '2 retouch credits', tooltip: tooltipContent.credits },
        ],
        buttonText: 'Subscribe Now',
        stripe_price_id: plan.stripe_price_id,
      };
    });
    yearlyPlan = yearlyPlans.map((plan) => {
      const features = plan.features as MerchantFeatures;
      return {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        description:
          'Get 20 AI-generated portraits with 2 unique styles and filters.',
        features: [
          { title: 'Commission rate', value: features.commission_rate },
          { title: 'Promotion slots', value: features.promotion_slots },
          { title: 'Choice of 2 styles', tooltip: tooltipContent.styles },
          { title: 'Choice of 2 filters', tooltip: tooltipContent.filters },
          { title: '2 retouch credits', tooltip: tooltipContent.credits },
        ],
        buttonText: 'Subscribe Now',
        stripe_price_id: plan.stripe_price_id,
      };
    });
  }

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
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-6  sm:mt-10 md:mt-10 lg:-mt-20">
      <h1 className="text-5xl font-bold text-center tracking-tight">Pricing</h1>
      <Tabs
        value={selectedBillingPeriod}
        onValueChange={setSelectedBillingPeriod}
        className="mt-8"
      >
        <TabsList className="h-11 px-1.5 rounded-full">
          <TabsTrigger value="monthly" className="py-1.5 rounded-full">
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" className="py-1.5 rounded-full">
            Yearly (Save {YEARLY_DISCOUNT}%)
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-12 max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-3 items-center gap-8">
        {(selectedBillingPeriod === 'monthly' ? monthlyPlan : yearlyPlan).map(
          (plan) => (
            <div
              key={plan.name}
              className={cn('relative border rounded-xl p-6', {
                'border-[2px] border-primary py-10': plan,
              })}
            >
              <h3 className="text-lg font-medium">{plan.name}</h3>
              <p className="mt-2 text-4xl font-bold">
                ${plan.price}
                <span className="ml-1.5 text-sm text-muted-foreground font-normal">
                  /month
                </span>
              </p>
              <p className="mt-4 font-medium text-muted-foreground">
                {plan.description}
              </p>
              <Button
                size="lg"
                className="w-full mt-6"
                onClick={() => handleSubscribe(plan.stripe_price_id)}
              >
                {plan.buttonText}
              </Button>
              <Separator className="my-8" />
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature.title} className="flex items-start gap-1.5">
                    <CircleCheck className="h-4 w-4 mt-1 text-green-600" />
                    {feature.title}
                    {feature.tooltip && (
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">
                          <CircleHelp className="h-4 w-4 mt-1 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>{feature.tooltip}</TooltipContent>
                      </Tooltip>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Pricing03;
