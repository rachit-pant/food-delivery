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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter Street Address</FormLabel>
              <FormControl>
                <Input placeholder="address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {country.map((countries) => (
                      <SelectItem
                        key={countries.id}
                        value={String(countries.id)}
                      >
                        {countries.country_name}
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
              <FormLabel>State</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setCity([]);
                  fetchCity(value);
                }}
                defaultValue={field.value as string}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {state.map((states) => (
                      <SelectItem key={states.id} value={String(states.id)}>
                        {states.state_name}
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
              <FormLabel>City</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value as string}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {city.map((cities) => (
                      <SelectItem key={cities.id} value={String(cities.id)}>
                        {cities.city_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default AddressEnter;
