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
import { FaStar, FaFilter } from 'react-icons/fa';

export default function FilterButtons() {
  const dispatch = useAppDispatch();
  const activeFilter = useAppSelector((state) => state.filter.filterName);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <FaFilter className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">Filter by:</span>
      </div>

      <Select
        onValueChange={(value: string) => dispatch(setFilter(value))}
        value={activeFilter}
      >
        <SelectTrigger className="w-[180px] bg-background/80 backdrop-blur-sm border-border/50 rounded-xl hover:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm">
          <div className="flex items-center gap-2">
            <FaStar className="w-4 h-4 text-yellow-500" />
            <SelectValue placeholder="Select Rating" />
          </div>
        </SelectTrigger>

        <SelectContent className="bg-background/95 backdrop-blur-sm shadow-xl rounded-xl border-border/50 overflow-hidden">
          <SelectGroup>
            <SelectItem
              value="4"
              className="hover:bg-primary/10 focus:bg-primary/10 rounded-lg mx-2 my-1 px-3 py-2 cursor-pointer transition-colors duration-150"
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(4)].map((_, i) => (
                    <FaStar key={i} className="w-3 h-3 text-yellow-500" />
                  ))}
                  <span className="text-muted-foreground ml-1">& above</span>
                </div>
              </div>
            </SelectItem>

            <SelectItem
              value="3"
              className="hover:bg-primary/10 focus:bg-primary/10 rounded-lg mx-2 my-1 px-3 py-2 cursor-pointer transition-colors duration-150"
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(3)].map((_, i) => (
                    <FaStar key={i} className="w-3 h-3 text-yellow-500" />
                  ))}
                  <span className="text-muted-foreground ml-1">& above</span>
                </div>
              </div>
            </SelectItem>

            <SelectItem
              value="None"
              className="hover:bg-muted/50 focus:bg-muted/50 rounded-lg mx-2 my-1 px-3 py-2 cursor-pointer transition-colors duration-150"
            >
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">All Ratings</span>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
