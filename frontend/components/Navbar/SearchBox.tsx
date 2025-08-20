import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SearchBox = () => {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search restaurants, cuisines, or dishes..."
        className="pl-10 h-11 bg-input border-border shadow-sm focus:shadow-md transition-shadow rounded-r-lg border-l-0 rounded-l-none"
      />
    </div>
  );
};

export default SearchBox;
