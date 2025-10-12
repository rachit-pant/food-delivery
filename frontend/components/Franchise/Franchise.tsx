'use client';
import { useEffect } from 'react';
import AddFranchise from './AddFranchise';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import FranchiseList from './FranchiseList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Store, Link2 } from 'lucide-react';
import Link from 'next/link';

export interface Franchise {
  id: number;
  name: string;
  image_url: string;
}

const Franchise = () => {
  const [franchise, setFranchise] = useState<Franchise[]>([]);
  const [franchiseId, setFranchiseId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/franchise');
        setFranchise(res.data);
      } catch (e) {
        console.error(handleError(e));
      }
    })();
  }, [refresh]);

  const handleRemove = async (id: number) => {
    try {
      await api.delete(`/franchise/${id}`);
      setFranchise((prev) => prev.filter((franchise) => franchise.id !== id));
      setRefresh((prev) => !prev);
    } catch (e) {
      console.error(handleError(e));
    }
  };

  return (
    <div className="space-y-10 p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Franchise Management
          </h1>
          <p className="text-muted-foreground">
            Manage your franchise locations and restaurants
          </p>
        </div>
        <AddFranchise franchise={franchise} setRefresh={setRefresh} />
      </div>

      {franchise.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Store className="w-12 h-12 text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No franchises yet</h3>
              <p className="text-muted-foreground">
                Get started by adding your first franchise
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {franchise.map((franchise) => (
            <Card
              key={franchise.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{franchise.name}</CardTitle>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Store className="w-3 h-3" />
                    ID: {franchise.id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${franchise.image_url}`}
                    alt={franchise.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setOpen(true);
                      setFranchiseId(franchise.id);
                    }}
                    className="flex-1 gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    View Restaurants
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(franchise.id)}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                  <Button asChild>
                    <Link href={`/merchant/franchise/${franchise.id}`}>
                      <Link2 className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {open && (
        <FranchiseList
          open={open}
          setOpen={setOpen}
          franchiseId={franchiseId}
          setRefresh={setRefresh}
        />
      )}
    </div>
  );
};

export default Franchise;
