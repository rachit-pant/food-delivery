'use client';
import { useEffect, useState } from 'react';
import AddressEnter from './AddressEnter';
import { handleError } from '@/lib/handleError';
import { api } from '@/api/api';
import { Button } from '../ui/button';
import { DeleteButton } from '@/api/address';
import { MapPin, Trash2, Plus, Home, ArrowUpFromLine } from 'lucide-react';

type AddressData = {
  id: number;
  is_default: boolean;
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

const AddressForm = ({ redirect }: { redirect?: string }) => {
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

  async function handleDefault(addressId: number) {
    try {
      await api.patch(`/users/address/${addressId}`);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading your addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Address Management
            </h1>
          </div>
          <p className="text-gray-600">
            Manage your saved addresses and add new ones
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-blue-500" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Your Addresses
                  </h2>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-medium">
                    {data.length}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {data.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {data.map((info) => (
                      <div
                        key={info.id}
                        className="group bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="w-4 h-4 text-blue-500" />
                              <h3 className="text-lg font-semibold text-gray-800">
                                {info.address}
                              </h3>
                            </div>
                            <div className="space-y-1 text-gray-600">
                              <p className="font-medium">
                                {info.cities?.city_name}
                              </p>
                              <p>{info.cities?.states?.state_name}</p>
                              <p className="text-sm text-gray-500">
                                {info.cities?.states?.countries?.country_name}
                              </p>
                            </div>
                          </div>
                          <div className="flex-col h-full space-y-13">
                            <div>
                              <Button
                                onClick={() => handleDelete(info.id)}
                                variant="outline"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div>
                              {info.is_default ? null : (
                                <Button
                                  onClick={() => handleDefault(info.id)}
                                  variant="outline"
                                  size="sm"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                >
                                  <ArrowUpFromLine className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-10 h-10 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      No addresses yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Add your first address to get started
                    </p>
                    <div className="flex items-center justify-center gap-2 text-blue-600">
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Use the form on the right →
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
                <div className="flex items-center gap-3 text-white">
                  <Plus className="w-5 h-5" />
                  <h2 className="text-xl font-bold">Add New Address</h2>
                </div>
              </div>
              <div className="p-6">
                <AddressEnter update={refreshData} redirect={redirect} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
