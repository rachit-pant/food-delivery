'use client';

import { api } from '@/api/api';
import React, { useEffect, useState } from 'react';
import CountryPopup from './CountryPopup';

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
      const Usercountry = data.cities.states.countries.county_name;
      setOriginalCountry(Usercountry);
      setCountry(Usercountry);
    }
    fetchData();
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="country"
        value={Country}
        onChange={(e) => setCountry(e.target.value)}
      />
      {Country !== OriginalCountry && (
        <CountryPopup change={selectedCountry} country={Country} />
      )}
    </div>
  );
};

export default Location;
