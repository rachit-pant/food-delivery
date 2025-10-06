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
import { useForm, type SubmitHandler } from 'react-hook-form';
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
import { useRouter } from 'next/navigation';
import { LoadScript, Libraries, Autocomplete } from '@react-google-maps/api';

type Country = {
  id: number;
  country_name: string;
};

type State = {
  id: number;
  state_name: string;
  country_id: number;
};

type City = {
  id: number;
  city_name: string;
  state_id: number;
};

interface AddressEnterProps {
  update: () => void;
  redirect?: string;
}

const AddressEnter = ({ update, redirect }: AddressEnterProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: '',
      country: '',
      state: '',
      city: '',
    },
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: null,
    lng: null,
  });

  const libraries: Libraries = ['places'];

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/address/countryAll');
        setCountries(data);
      } catch (error) {
        console.error(handleError(error));
      }
    })();
  }, []);

  const onLoad = (autoC: google.maps.places.Autocomplete) =>
    setAutocomplete(autoC);

  const onPlaceChanged = () => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (place.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setCoordinates({ lat, lng });
      form.setValue('address', place.formatted_address ?? '');
    }
  };

  const fetchStates = async (countryId: string) => {
    try {
      const { data } = await api.get(`/address/countryAll/${countryId}`);
      setStates(data);
    } catch (error) {
      console.error(handleError(error));
    }
  };

  const fetchCities = async (stateId: string) => {
    try {
      const { data } = await api.get(`/address/countryAll/states/${stateId}`);
      setCities(data);
    } catch (error) {
      console.error(handleError(error));
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof addressSchema>> = async (
    data
  ) => {
    if (!coordinates.lat || !coordinates.lng) {
      form.setError('root', {
        type: 'server',
        message: 'Please select a location',
      });
      return;
    }

    const payload = {
      ...data,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    };

    try {
      const res = await AddreessPost(payload);
      console.log('Address added successfully:', res);

      update();
      form.reset({
        address: '',
        country: '',
        state: '',
        city: '',
      });
      setStates([]);
      setCities([]);

      if (redirect && redirect !== '0') {
        router.push('/cart');
      }
    } catch (error) {
      const errMsg = handleError(error);
      form.setError('root', { type: 'server', message: errMsg });
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_MAPS_PLACES_API_KEY!}
      libraries={libraries}
    >
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
                  <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                    <Input
                      placeholder="123 Main Street, Apt 4B"
                      {...field}
                      className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                    />
                  </Autocomplete>
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
                      setStates([]);
                      setCities([]);
                      fetchStates(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-all duration-200">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {countries.map((c) => (
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
                        setCities([]);
                        fetchCities(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-all duration-200">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {states.map((s) => (
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
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-400 transition-all duration-200">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {cities.map((c) => (
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
    </LoadScript>
  );
};

export default AddressEnter;
