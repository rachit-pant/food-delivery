'use client';
import { api } from '@/api/api';
import React, { useEffect, useState } from 'react';
type CountryPopupProps = {
  country: string;
  change: (data: string) => void;
};
type State = {
  id: number;
  state_name: string;
};

type Country = {
  id: number;
  country_name: string;
  states: State[];
};

const CountryPopup = ({ country, change }: CountryPopupProps) => {
  const [data, setData] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!country) return;

    setLoading(true);
    async function getCountries() {
      try {
        const { data } = await api.get(
          `/users/similarcountry/homepage?country=${country}`
        );
        setData(data);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    }
    getCountries();
  }, [country]);

  if (loading) return <p>Loading...</p>;
  if (!data.length) return <p>No results found.</p>;

  return (
    <div className="bg-white border border-gray-300 rounded shadow-md">
      {data.map((country) =>
        country.states.map((state) => (
          <div
            className="p-1 hover:cursor-pointer hover:bg-gray-100"
            key={state.id}
            onClick={() => change(country.country_name)}
          >
            <p className="font-semibold text-xl">{state.state_name}</p>
            <p>{country.country_name}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CountryPopup;
