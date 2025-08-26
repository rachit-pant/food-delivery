'use client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';
import SearchPopup from './SearchPopup';
const SearchBox = () => {
  const [search, setSearch] = useState<string>('Search');
  const [originalSearch, setOriginalSearch] = useState<string>('Search');
  const selectedSearch = (data: string) => {
    setSearch(data);
    setOriginalSearch(data);
  };
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search restaurants, cuisines, or dishes..."
        className="pl-10 h-11 bg-input border-border shadow-sm focus:shadow-md transition-shadow rounded-r-lg border-l-0 rounded-l-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search !== originalSearch && (
        <div className="absolute top-full mt-2 w-full z-50">
          <SearchPopup change={selectedSearch} search={search} />
        </div>
      )}
    </div>
  );
};

export default SearchBox;
