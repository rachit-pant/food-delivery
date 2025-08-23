'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type z from 'zod';
import { addressSchema } from '@/schema/addressSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import { AddreessPost } from '@/api/address';
import { MapPin, Globe, Building, Home } from 'lucide-react';

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

const AddressEnter = ({ update }: { update: () => void }) => {
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: '',
      country: '',
      state: '',
      city: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof addressSchema>> = async (
    data
  ) => {
    try {
      const res = await AddreessPost(data);
      console.log('success', res);
      update();
      form.reset({
        address: '',
        country: '',
        state: '',
        city: '',
      });
      setState([]);
      setCity([]);
    } catch (error) {
      console.error('Error', error);
      const err = handleError(error);
      form.setError('root', {
        type: 'server',
        message: err,
      });
    }
  };

  const [country, setCountry] = useState<countries[]>([]);
  const [state, setState] = useState<state[]>([]);
  const [city, setCity] = useState<city[]>([]);

  useEffect(() => {
    async function fetchCountry() {
      try {
        const { data } = await api.get('/address/countryAll');
        setCountry(data);
      } catch (error) {
        const err = handleError(error);
        console.log(err);
        throw err;
      }
    }
    fetchCountry();
  }, []);

  async function fetchState(value: string) {
    try {
      const { data } = await api.get(`/address/countryAll/${value}`);
      setState(data);
    } catch (error) {
      const err = handleError(error);
      console.log(err);
      throw err;
    }
  }

  async function fetchCity(value: string) {
    try {
      const { data } = await api.get(`/address/countryAll/states/${value}`);
      setCity(data);
    } catch (error) {
      const err = handleError(error);
      console.log(err);
      throw err;
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                <Home className="w-4 h-4 text-blue-500" />
                Street Address
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="123 Main Street, Apt 4B"
                  {...field}
                  className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                  <Globe className="w-4 h-4 text-blue-500" />
                  Country
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setState([]);
                    setCity([]);
                    fetchState(value);
                  }}
                  defaultValue={field.value as string}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-all duration-200">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {country.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.country_name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <Building className="w-4 h-4 text-blue-500" />
                    State/Province
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setCity([]);
                      fetchCity(value);
                    }}
                    defaultValue={field.value as string}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-all duration-200">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {state.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.state_name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    City
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value as string}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-all duration-200">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {city.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.city_name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {form.formState.errors.root && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm text-center font-medium">
              {form.formState.errors.root.message}
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Adding Address...' : 'Add Address'}
        </Button>
      </form>
    </Form>
  );
};

export default AddressEnter;
