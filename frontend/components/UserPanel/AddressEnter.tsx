'use client';
import React, { useEffect, useState } from 'react';
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
import { SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6 w-full"
      >
        <div>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Street Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123 Main St"
                    {...field}
                    className="rounded-lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Country</FormLabel>
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
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select Country" />
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

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium ml-2.5">State</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setCity([]);
                    fetchCity(value);
                  }}
                  defaultValue={field.value as string}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-lg ml-2.5">
                      <SelectValue placeholder="Select State" />
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
                <FormLabel className="font-medium">City</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value as string}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select City" />
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

        {/* Errors */}
        {form.formState.errors.root && (
          <p className="text-red-500 text-sm text-center">
            {form.formState.errors.root.message}
          </p>
        )}

        {/* Submit button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            className="w-full md:w-auto px-6 py-2 rounded-lg"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddressEnter;
