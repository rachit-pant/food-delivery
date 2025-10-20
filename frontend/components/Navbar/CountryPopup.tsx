'use client';
import { api } from '@/api/api';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';

type CountryPopupProps = {
  country: string;
  change: (data: string) => void;
};

type State = {
  id: number;
  state_name: string;
};

type Country = {
  id: number;
  country_name: string;
  states: State[];
};

const CountryPopup = ({ country, change }: CountryPopupProps) => {
  const [data, setData] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!country) return;

    setLoading(true);
    async function getCountries() {
      try {
        const { data } = await api.get(
          `/users/similarcountry/homepage?country=${country}`
        );
        setData(data);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    }
    getCountries();
  }, [country]);

  if (loading) {
    return (
      <Card className="w-full max-w-sm shadow-lg border-border">
        <ScrollArea className="max-h-64">
          <CardContent className="p-4">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    );
  }

  if (!data.length) {
    return (
      <Card className="w-full max-w-sm shadow-lg border-border">
        <ScrollArea className="max-h-64">
          <CardContent className="p-4 text-center">
             <div
          className="p-4 hover:cursor-pointer hover:bg-accent/10 transition-colors border-b border-border last:border-b-0 flex items-start gap-3 "
          onClick={() => change('')}
        >
          <div className="flex-col ">
            <p className="font-semibold text-lg text-card-foreground truncate">
              Select Country
            </p>
          </div>
        </div>
            <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">No results found.</p>
          </CardContent>
        </ScrollArea>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm shadow-lg border-border bg-popover">
      <CardContent className="p-0 max-h-96 overflow-y-auto space-y-3 overflow-x-clip">
        <div
          className="p-4 hover:cursor-pointer hover:bg-accent/10 transition-colors border-b border-border last:border-b-0 flex items-start gap-3 "
          onClick={() => change('')}
        >
          <div className="flex-col ">
            <p className="font-semibold text-lg text-card-foreground truncate">
              Select Country
            </p>
          </div>
        </div>
        {data.map((country) =>
          country.states.map((state) => (
            <div
              className="p-4 hover:cursor-pointer hover:bg-accent/10 transition-colors border-b border-border last:border-b-0 flex items-start gap-3 "
              key={state.id}
              onClick={() => change(country.country_name)}
            >
              <div className="flex-col ">
                <p className="font-semibold text-lg text-card-foreground truncate">
                  {state.state_name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {country.country_name}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CountryPopup;
