'use client';

import { api } from '@/api/api';
import { useEffect, useState } from 'react';
import CountryPopup from './CountryPopup';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { useAppDispatch } from '@/lib/hooks';
import { setCountry as DispatchCountry } from './LocationSlice';
const Location = () => {
  const [OriginalCountry, setOriginalCountry] = useState('');
  const [Country, setCountry] = useState('');
  const dispatch = useAppDispatch();
  function selectedCountry(data: string) {
    setOriginalCountry(data);
    setCountry(data);
  }

  useEffect(() => {
    dispatch(DispatchCountry(OriginalCountry));
  }, [OriginalCountry, dispatch]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await api.get('/users/address/homepage');
      const Usercountry = data.cities.states.countries.country_name;
      setOriginalCountry(Usercountry);
      setCountry(Usercountry);
    }
    fetchData();
  }, []);

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter location"
          value={Country}
          onChange={(e) => setCountry(e.target.value)}
          className="pl-10 h-11 w-48 bg-input border-border shadow-sm focus:shadow-md transition-shadow rounded-l-lg border-r-0 rounded-r-none"
        />
      </div>
      {Country !== OriginalCountry && (
        <div className="absolute top-full mt-2 w-full z-50">
          <CountryPopup change={selectedCountry} country={Country} />
        </div>
      )}
    </div>
  );
};

export default Location;
