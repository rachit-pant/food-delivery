'use client';
import { api } from '@/api/api';
import React, { useEffect, useState } from 'react';
type CountryPopupProps = {
  country: string;
  change: (data: string) => void;
};
const CountryPopup = ({ country, change }: CountryPopupProps) => {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    async function getCountries() {
      const { data } = await api.get(`/users/${country}`);
      setData(data);
    }
    getCountries();
  }, [country]);
  return (
    <div>
      {data.map((details) => (
        <div key={details.id} onClick={() => change(details.country)}>
          <p>{details.states.state_name}</p>
          <p>{details.country_name}</p>
        </div>
      ))}
    </div>
  );
};

export default CountryPopup;
