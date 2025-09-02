import React from 'react';
import { ArrowRight, BadgeCheck, HelpCircle } from 'lucide-react';
import { Plans } from './AlltypesSubPlan';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PricingCardProps {
  plan: Plans;
  onSubscribe?: (id: string) => void;
}

export const PricingCard = ({ plan, onSubscribe }: PricingCardProps) => {
  const price = plan.price;

  return (
    <TooltipProvider>
      <div className="relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 p-8 shadow-lg transition-all duration-300 hover:border-neutral-500 hover:shadow-2xl hover:scale-[1.02] w-full max-w-sm h-full">
        <div className="relative z-10 flex flex-col gap-6 h-full text-white">
          {/* Card Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold capitalize mb-2 tracking-tight">
              {plan.name}
            </h2>
            <div className="w-16 h-1 bg-white/50 mx-auto rounded-full" />
          </div>

          {/* Price Section */}
          <div className="text-center py-4">
            {typeof price === 'string' ? (
              <>
                <div className="text-6xl font-bold tracking-tighter mb-2">
                  ${price}
                </div>
                <p className="text-sm font-medium text-neutral-400">
                  Per {plan.duration === 'month' ? 'month' : 'year'}/user
                </p>
              </>
            ) : (
              <div className="text-6xl font-bold tracking-tighter">{price}</div>
            )}
          </div>

          {/* Features */}
          <div className="flex-1 space-y-4">
            <h3 className="text-lg font-semibold text-center tracking-wide">
              Features
            </h3>
            <ul className="space-y-3">
              {Object.entries(plan.features).map(([key, value]) => (
                <li
                  key={key}
                  className="flex items-center gap-3 text-sm font-medium text-neutral-300"
                >
                  <BadgeCheck
                    className="w-5 h-5 text-green-500 flex-shrink-0"
                    strokeWidth={2}
                  />
                  <span className="flex-1">{plan.features.discount}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-neutral-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-neutral-800 text-white border-neutral-700">
                      <p>
                        More information about {plan.features.free_delivery}.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </div>

          {/* Call to Action Button */}
          <button
            onClick={() =>
              plan.stripe_price_id && onSubscribe?.(plan.stripe_price_id)
            }
            disabled={!plan.stripe_price_id}
            className="w-full py-4 px-6 rounded-xl font-semibold text-black bg-white hover:bg-neutral-200 disabled:bg-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 group"
          >
            {plan.stripe_price_id ? 'Subscribe Now' : 'Not Available'}
            {plan.stripe_price_id && (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
};
