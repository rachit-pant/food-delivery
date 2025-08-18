'use client';
import React, { useEffect, useState } from 'react';
import AddressEnter from './AddressEnter';
import { handleError } from '@/lib/handleError';
import { api } from '@/api/api';
import { Button } from '../ui/button';
import { DeleteButton } from '@/api/address';

type AddressData = {
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
  const [data, setData] = useState<AddressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const refreshData = () => setRefresh((prev) => !prev);

  async function handleDelete(id: number) {
    try {
      await DeleteButton(id);
      refreshData();
    } catch (error) {
      console.error(handleError(error));
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get('/users/address');
        setData(res.data);
      } catch (error) {
        console.error(handleError(error));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refresh]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-500 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 min-h-screen p-6 mt-5">
      <div className=" flex-1 overflow-y-auto pr-6 space-y-4">
        {data.length > 0 ? (
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
                onClick={() => handleDelete(info.id)}
                variant="destructive"
                className="mt-3"
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

      <div className=" flex-1 ">
        <h2 className="text-lg  mb-4 text-gray-800 text-center font-GoogleSansCode">
          Add New Address
        </h2>
        <AddressEnter update={refreshData} />
      </div>
    </div>
  );
};

export default AddressForm;
