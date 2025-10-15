'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CircleCheck, CircleX, Sparkles, Crown, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';

import { useRouter } from 'next/navigation';
import type { MerchantFeatures, Plans, UserFeatures } from './AlltypesSubPlan';
import { useAppSelector } from '@/lib/hooks';

const YEARLY_DISCOUNT = 20;

const planIcons = {
  Basic: Sparkles,
  Pro: Crown,
  Enterprise: Zap,
};

const Pricing03 = () => {
  const role = useAppSelector((state) => state.roleMiddleware.role);
  const router = useRouter();
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState('monthly');
  const [fetchedPlans, setFetchedPlans] = useState<Plans[]>([]);
  const [url, setUrl] = useState('');
  const [billingerror, setBillingerror] = useState(true);

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
  useEffect(() => {
    const handleBilling = async () => {
      try {
        const stipeData = (await api.get('/extra/billing', { timeout: 5000 })).data;
        console.log(stipeData.data.url);
        setUrl(stipeData.data.url);
        setBillingerror(false);
      } catch (error) {
        const errorData = handleError(error);
        console.log(errorData);
      }
    };
    handleBilling();
  }, [fetchedPlans]);
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
        description: `Our most ${plan.name} plan that provides all the necessary features.`,
        features: features,
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
        description: `${plan.name} plan that provides all the necessary features.`,
        features: features,
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
        description: `${plan.name} plan that provides all the necessary features.`,
        features: features,
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
        description: ` ${plan.name} plan that provides all the necessary features.`,
        features: features,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-6xl font-black text-foreground mb-6 tracking-tight text-balance">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
          Select the perfect plan for your needs. Upgrade or downgrade at any
          time.
        </p>

        {billingerror ? null : (
          <Button
            variant="outline"
            onClick={() => router.push(url)}
            className="mt-8 bg-card hover:bg-muted transition-colors"
          >
            Manage Billing
          </Button>
        )}
      </div>

      <div className="flex justify-center mb-16">
        <Tabs
          value={selectedBillingPeriod}
          onValueChange={setSelectedBillingPeriod}
          className="bg-card rounded-2xl p-2 shadow-lg border"
        >
          <TabsList className="h-14 px-2 bg-transparent rounded-xl">
            <TabsTrigger
              value="monthly"
              className="py-3 px-8 rounded-lg text-base font-semibold data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-all"
            >
              Monthly
            </TabsTrigger>
            <TabsTrigger
              value="yearly"
              className="py-3 px-8 rounded-lg text-base font-semibold data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-all relative"
            >
              Yearly
              <span className="ml-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-bold">
                Save {YEARLY_DISCOUNT}%
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {(selectedBillingPeriod === 'monthly' ? monthlyPlan : yearlyPlan).map(
            (plan, index) => {
              const IconComponent =
                planIcons[plan.name as keyof typeof planIcons] || Sparkles;
              const isPopular = index === 1; // Middle plan is popular

              return (
                <div
                  key={plan.name}
                  className={cn(
                    'relative bg-card rounded-3xl p-8 shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1',
                    {
                      'border-accent ring-4 ring-accent/20 scale-105':
                        isPopular,
                      'border-border hover:border-accent/50': !isPopular,
                    }
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-accent text-accent-foreground px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div
                      className={cn(
                        'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4',
                        isPopular
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-card-foreground mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground text-pretty leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-black text-card-foreground">
                        ${plan.price}
                      </span>
                      <span className="text-lg text-muted-foreground font-medium">
                        {selectedBillingPeriod === 'monthly'
                          ? '/month'
                          : '/year'}
                      </span>
                    </div>
                    {selectedBillingPeriod === 'yearly' && (
                      <p className="text-sm text-accent font-semibold mt-2">
                        Save $
                        {Math.round(
                          (Number(plan.price) * 12 * YEARLY_DISCOUNT) / 100
                        )}{' '}
                        annually
                      </p>
                    )}
                  </div>

                  <Button
                    size="lg"
                    className={cn(
                      'w-full mb-8 h-14 text-lg font-bold rounded-2xl transition-all duration-300',
                      isPopular
                        ? 'bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl'
                        : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                    onClick={() => handleSubscribe(plan.stripe_price_id)}
                  >
                    {plan.buttonText}
                  </Button>

                  <Separator className="mb-8" />

                  <div className="space-y-4">
                    <h4 className="font-bold text-card-foreground mb-4">
                      What&apos;s included:
                    </h4>
                    <ul className="space-y-3">
                      {Object.entries(plan.features)
                        .filter(([_, value]) => value === 'True')
                        .map(([key]) => (
                          <li
                            key={key}
                            className="flex items-start gap-3 text-card-foreground"
                          >
                            <CircleCheck className="h-5 w-5 mt-0.5 text-green-500 flex-shrink-0" />
                            <span className="text-sm leading-relaxed">
                              {key}
                            </span>
                          </li>
                        ))}

                      {Object.entries(plan.features)
                        .filter(([_, value]) => value === 'False')
                        .map(([key]) => (
                          <li
                            key={key}
                            className="flex items-start gap-3 text-muted-foreground"
                          >
                            <CircleX className="h-5 w-5 mt-0.5 text-red-400 flex-shrink-0" />
                            <span className="text-sm leading-relaxed line-through">
                              {key}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-20 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <CircleCheck className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-bold text-card-foreground mb-2">
              30-Day Money Back
            </h3>
            <p className="text-sm text-muted-foreground">
              Not satisfied? Get a full refund within 30 days.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-bold text-card-foreground mb-2">
              Instant Access
            </h3>
            <p className="text-sm text-muted-foreground">
              Start using all features immediately after signup.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <Crown className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-bold text-card-foreground mb-2">
              Cancel Anytime
            </h3>
            <p className="text-sm text-muted-foreground">
              No long-term commitments. Cancel with one click.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing03;
