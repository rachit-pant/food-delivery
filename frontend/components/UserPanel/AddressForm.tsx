'use client';
import React, { useEffect, useState } from 'react';
import AddressEnter from './AddressEnter';
import { handleError } from '@/lib/handleError';
import { api } from '@/api/api';
import { Button } from '../ui/button';
import { DeleteButton } from '@/api/address';
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
const AddressForm = () => {
  const [data, setData] = useState<data[]>([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(true);
  function updatedData() {
    setUpdate((prev) => !prev);
  }
  async function DeleteAddress(id: number) {
    try {
      const data = await DeleteButton(id);
      console.log('success', data);
      updatedData();
    } catch (error) {
      const err = handleError(error);
      console.log(err);
      throw err;
    }
  }
  useEffect(() => {
    async function fetch() {
      try {
        const res = await api.get('/users/address');
        setData(res.data);
      } catch (error) {
        const err = handleError(error);

        console.log(err);
        throw err;
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [update]);
  if (loading) return <p>Loading....</p>;
  return (
    <div className="flex gap-8 h-screen p-6 bg-gray-50">
      {/* Left side: List of addresses */}
      <div className="flex-1 overflow-y-auto pr-6 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-lg text-gray-500 animate-pulse">Loading...</p>
          </div>
        ) : data && data.length > 0 ? (
          data.map((info) => (
            <div
              key={info.id}
              className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <h1 className="text-xl font-semibold text-gray-800">
                {info.address}
              </h1>
              <h2 className="text-lg text-gray-600">
                {info.cities?.city_name}
              </h2>
              <h3 className="text-md text-gray-500">
                {info.cities?.states?.state_name}
              </h3>
              <h4 className="text-sm text-gray-400">
                {info.cities?.states?.countries?.country_name}
              </h4>
              <Button
                onClick={() => {
                  DeleteAddress(info.id);
                }}
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 italic">No addresses found</p>
          </div>
        )}
      </div>

      {/* Right side: Address enter form */}
      <div className="flex-1 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-gray-800"></h2>
        <AddressEnter update={updatedData} />
      </div>
    </div>
  );
};

export default AddressForm;
