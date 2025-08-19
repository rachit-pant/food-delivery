'use client';
import React, { useEffect, useState } from 'react';
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
import { Input } from '@/components/ui/input';
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

export interface Orders {
  order_id: number;
  product_name: string;
  menu_variants: MenuVariants;
}

export interface MenuVariants {
  variety_name: string;
}

const formSchema = z.object({
  product: z.string().nonempty('Please select a product'), // will hold order_id
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
      });
      console.log('success', res);
    } catch (error) {
      const err = handleError(error);
      console.log(err);
      throw err;
    }
  }

  if (data.length === 0) {
    return <h1>No Orders From the restaurant</h1>;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="rounded-full h-12 w-12 flex items-center justify-center shadow-lg text-xl">
            +
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Reviews</DialogTitle>
            <DialogDescription>
              Add Reviews for your purchased items
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data.map((order) => (
                          <SelectItem
                            key={order.order_id}
                            value={String(order.order_id)}
                          >
                            {order.product_name} (
                            {order.menu_variants.variety_name})
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
                    <FormLabel>Review</FormLabel>
                    <FormControl>
                      <Input placeholder="Write your review..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={String(num)}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reviews;
