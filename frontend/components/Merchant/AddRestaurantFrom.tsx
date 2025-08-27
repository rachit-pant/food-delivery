'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { Badge } from '@/components/ui/badge';

import { MapPin, Clock, Save, Building2 } from 'lucide-react';

import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import { useRouter } from 'next/navigation';
import Dropzone from '@/components/Merchant/Dropzone';

const daySchema = z
  .object({
    open: z.boolean(),
    start: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{2}:\d{2}$/.test(val), {
        message: 'Use HH:MM',
      }),
    end: z
      .string()
      .optional()
      .refine((val) => !val || /^\d{2}:\d{2}$/.test(val), {
        message: 'Use HH:MM',
      }),
  })
  .refine((d) => !d.open || (!!d.start && !!d.end), {
    message: 'Provide start and end time when open',
  })
  .refine(
    (d) => {
      if (!d.open || !d.start || !d.end) return true;
      return d.start < d.end; // simple string compare works for HH:MM
    },
    { message: 'End time must be after start' }
  );
type countries = {
  id: number;
  country_name: string;
};
type state = {
  id: number;
  state_name: string;
  country_id: number;
};
type city = {
  id: number;
  city_name: string;
  state_id: number;
};
const restaurantSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  address: z.string().min(5, 'Address is required'),
  description: z.string().max(500).optional(),
  countryId: z.string().min(1, 'Select a country'),
  stateId: z.string().min(1, 'Select a state'),
  cityId: z.string().min(1, 'Select a city'),
  image: z
    .instanceof(File)
    .optional()
    .or(z.any().refine((v) => v === undefined || v === null, { message: '' })),
  timings: z.object({
    Monday: daySchema,
    Tuesday: daySchema,
    Wednesday: daySchema,
    Thursday: daySchema,
    Friday: daySchema,
    Saturday: daySchema,
    Sunday: daySchema,
  }),
});

export type RestaurantFormValues = z.infer<typeof restaurantSchema>;

const defaultDay = { open: true, start: '09:00', end: '22:00' } as const;

const defaultValues: RestaurantFormValues = {
  name: '',
  address: '',
  description: '',
  countryId: '',
  stateId: '',
  cityId: '',
  image: undefined,
  timings: {
    Monday: { ...defaultDay },
    Tuesday: { ...defaultDay },
    Wednesday: { ...defaultDay },
    Thursday: { ...defaultDay },
    Friday: { ...defaultDay },
    Saturday: { ...defaultDay },
    Sunday: { ...defaultDay },
  },
};

type Option = { id: string; name: string };

const days: Array<keyof RestaurantFormValues['timings']> = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function NewRestaurantForm() {
  const form = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues,
    mode: 'onChange',
  });

  const [countries, setCountries] = useState<Option[]>([]);
  const [states, setStates] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/address/countryAll');
        setCountries(
          res.data?.map((c: countries) => ({
            id: String(c.id),
            name: c.country_name,
          })) || []
        );
      } catch (e) {
        console.error(handleError(e));
      }
    })();
  }, []);

  const countryId = form.watch('countryId');
  useEffect(() => {
    if (!countryId) {
      setStates([]);
      form.setValue('stateId', '');
      return;
    }
    (async () => {
      try {
        const res = await api.get(`address/countryAll/${countryId}`);
        setStates(
          res.data?.map((s: state) => ({
            id: String(s.id),
            name: s.state_name,
          })) || []
        );
        form.setValue('stateId', '');
        setCities([]);
        form.setValue('cityId', '');
      } catch (e) {
        console.error(handleError(e));
      }
    })();
  }, [countryId]);

  const stateId = form.watch('stateId');
  useEffect(() => {
    if (!stateId) {
      setCities([]);
      form.setValue('cityId', '');
      return;
    }
    (async () => {
      try {
        const res = await api.get(`address/countryAll/states/${stateId}`);
        setCities(
          res.data?.map((c: city) => ({
            id: String(c.id),
            name: c.city_name,
          })) || []
        );
        form.setValue('cityId', '');
      } catch (e) {
        console.error(handleError(e));
      }
    })();
  }, [stateId]);

  const onSubmit = async (values: RestaurantFormValues) => {
    try {
      setSubmitting(true);

      const hasImage = values.image instanceof File;
      if (hasImage) {
        const fd = new FormData();
        fd.append('name', values.name);
        fd.append('address', values.address);
        if (values.description) fd.append('description', values.description);
        fd.append('country_id', values.countryId);
        fd.append('state_id', values.stateId);
        fd.append('city_id', values.cityId);

        fd.append('image', values.image as File);

        const timings = days.map((d) => ({
          week_day: d,

          start_time: values.timings[d].start || null,
          end_time: values.timings[d].end || null,
        }));
        fd.append('timings', JSON.stringify(timings));

        await api.post('/restaurants', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        const payload = {
          name: values.name,
          address: values.address,
          description: values.description || undefined,
          country_id: values.countryId,
          state_id: values.stateId,
          city_id: values.cityId,

          timings: days.map((d) => ({
            week_day: d,

            start_time: values.timings[d].start || null,
            end_time: values.timings[d].end || null,
          })),
        };
        await api.post('/restaurants', payload);
      }

      alert('Restaurant created successfully');
      form.reset(defaultValues);
      router.push('/merchant');
    } catch (e) {
      console.error(handleError(e));
      alert('Failed to create restaurant');
    } finally {
      setSubmitting(false);
    }
  };

  const dayAbbrev = (d: string) => d.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Add New Restaurant
            </h1>
            <p className="text-slate-600">
              Create a restaurant with location and weekly hours
            </p>
          </div>
          <Badge variant="secondary" className="text-slate-700">
            Merchant
          </Badge>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" /> Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Restaurant Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Spice Route" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Street, Area, Landmark"
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
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          placeholder="Short description (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Cover Image</FormLabel>
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

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> Location
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="countryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
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
                  name="stateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!countryId}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              countryId
                                ? 'Select state'
                                : 'Select country first'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
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
                  name="cityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!stateId}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              stateId ? 'Select city' : 'Select state first'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Opening Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {days.map((d) => (
                  <div
                    key={d}
                    className="grid grid-cols-1  md:grid-cols-[100px_100px_1fr_1fr] items-center gap-3 px-10"
                  >
                    <div className="font-medium">{dayAbbrev(d)}</div>

                    <FormField
                      control={form.control}
                      name={`timings.${d}.open` as const}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                          <FormLabel className="text-slate-500">Open</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`timings.${d}.start` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Start</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              disabled={
                                !form.getValues(`timings.${d}.open` as const)
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`timings.${d}.end` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">End</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              disabled={
                                !form.getValues(`timings.${d}.open` as const)
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                <p className="text-xs text-slate-500 text-center">
                  If a day is closed, toggle off Open — start/end are ignored.
                </p>
              </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-3">
              <Button type="submit" disabled={submitting}>
                <Save className="w-4 h-4 mr-2" />{' '}
                {submitting ? 'Saving...' : 'Save Restaurant'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
