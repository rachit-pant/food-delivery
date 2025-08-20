'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setFilter } from '@/components/filters/filterSlice';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function FilterButtons() {
  const dispatch = useAppDispatch();
  const activeFilter = useAppSelector((state) => state.filter.filterName);
  console.log('success', activeFilter);

  return (
    <>
      <Select
        onValueChange={(value: string) => dispatch(setFilter(value))}
        value={activeFilter}
      >
        <SelectTrigger className="w-[160px] bg-gray-50 border border-gray-300 rounded-lg hover:border-gray-400 focus:ring-2 focus:ring-gray-400">
          <SelectValue placeholder="Select Rating" />
        </SelectTrigger>
        <SelectContent className="bg-white shadow-lg rounded-lg border border-gray-200">
          <SelectGroup>
            <SelectItem
              value="4"
              className="hover:bg-yellow-100 rounded-md px-2 py-1"
            >
              4.0+
            </SelectItem>
            <SelectItem
              value="3"
              className="hover:bg-yellow-100 rounded-md px-2 py-1"
            >
              3.0+
            </SelectItem>
            <SelectItem
              value="None"
              className="hover:bg-gray-200 rounded-md px-2 py-1"
            >
              Ratings
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
