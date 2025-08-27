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
import { useForm } from 'react-hook-form';
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
import { useState } from 'react';
import { useEffect } from 'react';
import { handleError } from '@/lib/handleError';
import type { Category } from './Merchanttypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, ImageIcon, Tag, DollarSign } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import Dropzone from '@/components/Merchant/Dropzone';
const variantSchema = z.object({
  name: z.string().min(3),
  price: z.number(),
});
const formSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  image: z.instanceof(File).optional().nullable(),
  category_id: z.string().min(1, 'Select a category'),
  variant: z.array(variantSchema).min(1, 'Add at least one variant'),
});
type FormSchema = z.infer<typeof formSchema>;

const AddMenus = ({
  restaurantId,
  setOpen,
  open,
  refetch,
}: {
  restaurantId: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  refetch: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      image: null,
      category_id: '',
      variant: [{ name: '', price: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'variant',
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('restaurants/merchant/categories');
        setCategories(res.data);
      } catch (e) {
        console.error(handleError(e));
      }
    })();
  }, []);

  const onSubmit = async (data: FormSchema) => {
    try {
      if (!(data.image instanceof File)) {
        const payload = {
          item_name: data.name,
          description: data.description,
          category_id: data.category_id,
          variant: data.variant,
        };
        const res = await api.post(
          `/restaurants/${restaurantId}/menus`,
          payload
        );
        console.log(res.data);
        refetch((prev) => !prev);
        setOpen(false);
        return;
      }
      const formData = new FormData();
      console.log(data.category_id);
      formData.append('item_name', data.name);
      formData.append('description', data.description);
      formData.append('category_id', data.category_id);
      formData.append('image', data.image as File);
      formData.append('variant', JSON.stringify(data.variant));
      const res = await api.post(
        `/restaurants/${restaurantId}/menus`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(res.data);
      refetch((prev) => !prev);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <ChefHat className="w-6 h-6 text-orange-500" />
              Add New Menu Item
            </DialogTitle>
            <DialogDescription>
              Create a new menu item with pricing variants for your restaurant
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="border-slate-200">
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
                        <FormLabel>Menu Item Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Margherita Pizza"
                            {...field}
                          />
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
                            placeholder="Describe your menu item..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.cat_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="border-slate-200">
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
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Menu Item Image</FormLabel>
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

              <Card className="border-slate-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    Pricing Variants
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {fields.map((item, index) => (
                    <div key={item.id}>
                      <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-semibold text-slate-900">
                          Variant {index + 1}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`variant.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Variant Name</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="e.g. Small, Half"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`variant.${index}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => append({ name: '', price: 0 })}
                  >
                    Add Variant
                  </Button>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => remove(fields.length - 1)}
                    >
                      Remove Variant
                    </Button>
                  )}
                </CardContent>
              </Card>

              <div className="flex items-center justify-end gap-3 pt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="gap-2">
                  <ChefHat className="w-4 h-4" />
                  Add Menu Item
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddMenus;
