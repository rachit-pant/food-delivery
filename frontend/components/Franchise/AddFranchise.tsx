'use client';

import type React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription } from '@/components/ui/form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/api/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { handleError } from '@/lib/handleError';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, ImageIcon, Tag, DollarSign, X } from 'lucide-react';
import Dropzone from '@/components/Merchant/Dropzone';
import type { Franchise } from './Franchise';

const restaurantSchema = z.object({
  restaurant_id: z.string().min(1),
  restaurant_name: z.string().min(1),
});

const formSchema = z.object({
  name: z.string().min(3, 'Franchise name must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  image: z.instanceof(File).optional().nullable(),
  restaurants: z
    .array(restaurantSchema)
    .min(1, 'Select at least one restaurant'),
});

type FormSchema = z.infer<typeof formSchema>;

const AddFranchise = ({
  franchise,
  setRefresh,
}: {
  franchise: Franchise[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      image: null,
      restaurants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'restaurants',
  });

  interface Restaurant {
    id: string;
    name: string;
  }
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/franchise/getRestaurants');
        setRestaurants(res.data);
      } catch (e) {
        console.error(handleError(e));
      }
    })();
  }, [franchise]);

  const onSubmit = async (data: FormSchema) => {
    console.log('submit');
    console.log(data);
    try {
      let res;
      if (data.image instanceof File) {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('restaurants', JSON.stringify(data.restaurants));
        formData.append('image', data.image);

        res = await api.post('/franchise', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await api.post('/franchise', {
          name: data.name,
          description: data.description,
          restaurants: data.restaurants,
        });
      }
      console.log('Franchise created:', res.data);
      setOpen(false);
      setRefresh((prev) => !prev);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Add Franchise</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <ChefHat className="w-6 h-6 text-orange-500" />
              Add New Franchise
            </DialogTitle>
            <DialogDescription>
              Create a new franchise and link restaurants
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) =>
                console.log(errors)
              )}
              className="space-y-6"
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Tag className="w-5 h-5 text-blue-500" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Franchise Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. KFC" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your franchise..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon className="w-5 h-5 text-green-500" />
                    Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Franchise Image</FormLabel>
                        <FormControl>
                          <Dropzone
                            onFileUpload={(file: File) => field.onChange(file)}
                          />
                        </FormControl>
                        <FormDescription>PNG/JPG up to ~5MB</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    Restaurants
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    required
                    disabled={restaurants.length === 0}
                    onValueChange={(value) => {
                      const selected = restaurants.find((r) => r.id === value);
                      if (
                        selected &&
                        !fields.some((f) => f.restaurant_id === value)
                      ) {
                        append({
                          restaurant_id: String(value),
                          restaurant_name: selected.name,
                        });
                        setRestaurants((prev) =>
                          prev.filter((r) => r.id !== value)
                        );
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a restaurant" />
                    </SelectTrigger>
                    <SelectContent>
                      {restaurants.map((restaurant) => (
                        <SelectItem key={restaurant.id} value={restaurant.id}>
                          {restaurant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex flex-wrap gap-2">
                    {fields.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full"
                      >
                        <span>{item.restaurant_name}</span>
                        <span>
                          {typeof item.restaurant_id !== 'string' &&
                            item.restaurant_id}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            remove(index);
                            setRestaurants((prev) =>
                              prev.concat({
                                id: item.restaurant_id,
                                name: item.restaurant_name,
                              })
                            );
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </CardContent>
              </Card>

              <div className="flex items-center justify-end gap-3 pt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="gap-2 hover:cursor-pointer">
                  <ChefHat className="w-4 h-4" />
                  Add Franchise
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddFranchise;
