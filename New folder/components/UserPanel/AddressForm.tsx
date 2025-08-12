import React from 'react';
import AddressEnter from './AddressEnter';
import { handleError } from '@/lib/handleError';
import fetchWithRefresh from '@/api/fetchapi';
type data = {
  id: number;
  address: string;
  cities: {
    city_name: string;
    states: {
      state_name: string;
      countries: {
        country_name: string;
      };
    };
  };
};
const AddressForm = async () => {
  let data: data[] = [];
  try {
    const res = await fetchWithRefresh('http://localhost:5000/users/address');

    if (!res.ok) {
      throw new Error(`Failed to fetch addresses: ${res.statusText}`);
    }

    data = await res.json();

    // Render your UI with `data`
  } catch (error) {
    console.log(error);

    throw error;
  }
  return (
    <div className="flex gap-8 h-screen p-4">
      {/* Left side: List of addresses */}
      <div className="flex-1 overflow-y-auto border-r border-gray-300 pr-6">
        {data.map((info) => (
          <div key={info.id} className="mb-8">
            <h1 className="text-xl font-bold">{info.address}</h1>
            <h2 className="text-lg text-gray-700">{info.cities?.city_name}</h2>
            <h3 className="text-md text-gray-600">
              {info.cities?.states?.state_name}
            </h3>
            <h4 className="text-sm text-gray-500">
              {info.cities?.states?.countries?.country_name}
            </h4>
          </div>
        ))}
      </div>

      {/* Right side: Address enter form */}
      <div className="flex-1">
        <AddressEnter />
      </div>
    </div>
  );
};

export default AddressForm;
