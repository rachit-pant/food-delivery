'use client';

import { api } from '@/api/api';
import React, { useEffect, useState } from 'react';
import CountryPopup from './CountryPopup';
import { Input } from '../ui/input';

const Location = () => {
  const [OriginalCountry, setOriginalCountry] = useState('');
  const [Country, setCountry] = useState('');
  function selectedCountry(data: string) {
    setOriginalCountry(data);
    setCountry(data);
  }

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
    <div className="p-1 relative">
      <Input
        type="text"
        placeholder="country"
        value={Country}
        onChange={(e) => setCountry(e.target.value)}
        className="w-30 p-2 rounded-lg rounded-r-none border-r-0 shadow-md"
      />
      {Country !== OriginalCountry && (
        <div className="absolute top-full mt-1  w-full">
          <CountryPopup change={selectedCountry} country={Country} />
        </div>
      )}
    </div>
  );
};

export default Location;
