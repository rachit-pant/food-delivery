'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { handleError } from '@/lib/handleError';
import { api } from '@/api/api';
import { ShoppingCart, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import {
  setCartLogin,
  setQuantityCart,
} from '@/components/GridRestro/cartloginslice';
import { useRouter } from 'next/navigation';
const AddButton = ({
  variant,
}: {
  variant: {
    id: number;
    menu_id: number;
    variety_name: string;
    price: number;
  }[];
}) => {
  const [selectVariant, setselectVariant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const role = useAppSelector((state) => state.roleMiddleware.role);
  const dispatch = useAppDispatch();
  const router = useRouter();
  async function handleSubmit() {
    if (!selectVariant) {
      alert('Please select a variant');
      return;
    }
    if (role === 0) {
      dispatch(setCartLogin(Number(selectVariant)));
      dispatch(setQuantityCart(quantity));
      alert('Please login to add to cart');
      router.push('/auth/login');
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post('/cart', {
        variant: selectVariant,
        quantity,
      });
      console.log('success', res);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      const err = handleError(error);
      console.log(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  const selectedVariantDetails = variant.find(
    (v) => String(v.id) === selectVariant
  );

  return (
    <div className="space-y-4 min-w-[280px]">
      <div className="flex flex-row justify-between items-center ">
        <Select
          value={selectVariant ?? ''}
          onValueChange={(val) => setselectVariant(val)}
        >
          <SelectTrigger className="h-12 border-2 border-border hover:border-primary/50 transition-colors duration-200 bg-card">
            <SelectValue placeholder="Choose your variant" />
          </SelectTrigger>
          <SelectContent className="bg-card border-2 border-border shadow-xl">
            {variant.map((details) => (
              <SelectItem
                key={details.id}
                value={String(details.id)}
                className="hover:bg-accent/10 focus:bg-accent/10 cursor-pointer py-3"
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-medium text-card-foreground">
                    {details.variety_name}
                  </span>
                  <span className="text-primary font-bold ml-4">
                    ₹{details.price}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedVariantDetails && (
          <div className="text-right text-sm text-muted-foreground">
            <Button
              onClick={() => setQuantity(quantity + 1)}
              className="h-8 w-8"
            >
              +
            </Button>
            <span className="mx-2">{quantity}</span>
            <Button
              onClick={() => {
                if (quantity > 1) {
                  setQuantity(quantity - 1);
                } else {
                  setselectVariant(null);
                  setQuantity(1);
                }
              }}
              className="h-8 w-8"
            >
              -
            </Button>
          </div>
        )}
      </div>

      <Button
        type="submit"
        onClick={handleSubmit}
        disabled={!selectVariant || isLoading}
        className={cn(
          'w-full h-12 font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl',
          'bg-primary  text-primary-foreground',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'group relative overflow-hidden',
          isAdded && 'bg-green-600 hover:bg-green-600'
        )}
      >
        <div className="flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Adding...</span>
            </>
          ) : isAdded ? (
            <>
              <Check className="w-5 h-5" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span>Add to Cart</span>
              <Plus className="w-4 h-4 ml-1 group-hover:rotate-90 transition-transform duration-200" />
            </>
          )}
        </div>

        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>
    </div>
  );
};

export default AddButton;
