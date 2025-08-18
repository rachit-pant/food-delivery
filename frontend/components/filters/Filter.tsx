'use client';

import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setFilter } from '@/components/filters/filterSlice';

export default function FilterButtons() {
  const dispatch = useAppDispatch();
  const activeFilter = useAppSelector((state) => state.filter.filterName);
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => {
          console.log(activeFilter);
          dispatch(setFilter('Low To High'));
          console.log(activeFilter);
        }}
        className={
          activeFilter === 'Low To High'
            ? 'bg-amber-700 text-white hover:cursor-pointer'
            : 'bg-black text-white hover:cursor-pointer'
        }
      >
        Low To High
      </Button>
    </div>
  );
}
