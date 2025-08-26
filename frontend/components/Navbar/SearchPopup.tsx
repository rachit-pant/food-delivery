'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import Link from 'next/link';

interface SearchData {
  id: number;
  name: string;
  city_name: string;
  state_name: string;
  country_name: string;
  rank: number;
}

const SearchPopup = ({
  change,
  search,
}: {
  change: (data: string) => void;
  search: string;
}) => {
  const [data, setData] = useState<SearchData[]>([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`/auths/search?search=${search}`);
        setData(res.data);
      } catch (error) {
        const err = handleError(error);
        console.log(err);
      }
    }
    fetchData();
  }, [search]);
  return (
    <div className="w-full max-w-sm shadow-lg border-border bg-popover p-0 max-h-96 overflow-y-auto space-y-3 overflow-x-clip">
      {data.map((item) => (
        <div
          key={item.id}
          onClick={() => {
            change(item.name);
          }}
          className="p-2 hover:cursor-pointer hover:bg-accent/10 transition-colors flex-col"
        >
          <Link href={`/restaurant/${item.id}`}>
            <div>{item.name}</div>
            <div>{item.country_name}</div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SearchPopup;
