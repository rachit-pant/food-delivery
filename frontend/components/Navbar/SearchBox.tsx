import React from 'react';
import { Input } from '../ui/input';

const SearchBox = () => {
  return (
    <div className="p-1">
      <Input
        type="text"
        placeholder="search"
        className="w-full rounded-lg border-l-0 rounded-l-none shadow-md"
      />
    </div>
  );
};

export default SearchBox;
