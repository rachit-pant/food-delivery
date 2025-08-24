'use client';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star, MessageSquarePlus, Sparkles } from 'lucide-react';

export interface Orders {
  order_id: number;
  product_name: string;
  menu_variants: MenuVariants;
}

export interface MenuVariants {
  variety_name: string;
}

const formSchema = z.object({
  product: z.string().nonempty('Please select a product'),
  review: z.string().min(3, 'Review must be at least 3 characters'),
  rating: z.string().nonempty('Please select a rating'),
});

const Reviews = ({ restaurantId }: { restaurantId: number }) => {
  const [data, setData] = useState<Orders[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = (
          await api.get(`/restaurants/${restaurantId}/menus/reviews`)
        ).data;
        setData(res);
      } catch (error) {
        const err = handleError(error);
        console.log(err);
      }
    }
    fetchData();
  }, [restaurantId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: '',
      review: '',
      rating: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await api.post('/restaurants/:restaurantId/menus/reviews', {
        orderId: values.product,
        review: values.review,
        rating: values.rating,
        restaurantId: restaurantId,
      });
      console.log('success', res);
    } catch (error) {
      const err = handleError(error);
      console.log(err);
      throw err;
    }
  }

  if (data.length === 0) {
    return (
      <div className="text-center p-8 bg-card rounded-lg shadow-lg">
        <MessageSquarePlus className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-card-foreground mb-2">
          No Orders Yet
        </h2>
        <p className="text-muted-foreground">
          Order from this restaurant to leave a review!
        </p>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="group relative h-14 w-14 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <MessageSquarePlus className="w-6 h-6 text-primary-foreground transition-transform duration-300 group-hover:rotate-12" />
          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-card border-0 shadow-2xl">
        <DialogHeader className="space-y-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-card-foreground">
                Share Your Experience
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                Help others discover great food by sharing your review
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-6"
          >
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-card-foreground">
                    Which item would you like to review?
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-input border-border focus:ring-2 focus:ring-primary">
                        <SelectValue placeholder="Select a product you ordered" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border">
                      {data.map((order) => (
                        <SelectItem
                          key={order.order_id}
                          value={String(order.order_id)}
                          className="hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {order.product_name}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              ({order.menu_variants.variety_name})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-card-foreground">
                    How would you rate this item?
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-input border-border focus:ring-2 focus:ring-primary">
                        <SelectValue placeholder="Select your rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border">
                      {[5, 4, 3, 2, 1].map((num) => (
                        <SelectItem
                          key={num}
                          value={String(num)}
                          className="hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star
                                  key={idx}
                                  className={`w-4 h-4 ${
                                    idx < num
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-medium">
                              {num} Star{num !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-card-foreground">
                    Tell us about your experience
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What did you love about this dish? How was the taste, presentation, and overall experience?"
                      className="min-h-[120px] bg-input border-border focus:ring-2 focus:ring-primary resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4 border-t border-border">
              <Button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Star className="w-4 h-4 mr-2" />
                Submit Review
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default Reviews;
