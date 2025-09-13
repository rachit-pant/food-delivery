'use client';

import type React from 'react';
import { useEffect } from 'react';
export interface List {
  id: number;
  user_id: number;
  name: string;
  address: string;
  city_id: number;
  rating: number;
  status: string;
  imageurl: string;
  franchiseId: number;
  restaurant_categories_id: number;
  restaurant_categories: RestaurantCategories;
}

export interface RestaurantCategories {
  id: number;
  cat_name: string;
}

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import { useState } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Star, Trash2, Tag, Building } from 'lucide-react';

const FranchiseList = ({
  open,
  setOpen,
  franchiseId,
  setRefresh,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  franchiseId: number | null;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [list, setList] = useState<List[]>([]);

  useEffect(() => {
    if (!open) return;
    const fetchData = async () => {
      try {
        const res = await api.get(`/franchise/list/${franchiseId}`);
        setList(res.data);
      } catch (e) {
        console.error(handleError(e));
      }
    };
    fetchData();
  }, [open, franchiseId]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/franchise/list/${id}/${franchiseId}`);
      setList((prev) => {
        const updated = prev.filter((list) => list.id !== id);
        if (updated.length === 0) {
          setOpen(false);
          setRefresh((prev) => !prev);
        }
        return updated;
      });
    } catch (e) {
      console.error(handleError(e));
    }
  };

  const getStatusBadge = (status: string) => {
    const variant =
      status.toLowerCase() === 'active'
        ? 'default'
        : status.toLowerCase() === 'inactive'
        ? 'secondary'
        : 'outline';
    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Building className="w-6 h-6 text-blue-500" />
              Franchise Restaurants
            </DialogTitle>
            <DialogDescription>
              {list.length > 0
                ? `Managing ${list.length} restaurant${
                    list.length !== 1 ? 's' : ''
                  } in this franchise`
                : 'No restaurants found in this franchise'}
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[60vh] pr-2">
            {list.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Building className="w-12 h-12 text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      No restaurants found
                    </h3>
                    <p className="text-muted-foreground">
                      This franchise doesn&apos;t have any restaurants yet
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {list.map((items) => (
                  <Card key={items.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-1">
                          {items.name}
                        </CardTitle>
                        {getStatusBadge(items.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                        <Image
                          src={`http://localhost:5000${items.imageurl}`}
                          alt={items.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">
                            {items.address}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">
                            {items.rating}/5
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-muted-foreground" />
                          <Badge variant="outline" className="text-xs">
                            {items.restaurant_categories.cat_name}
                          </Badge>
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>ID: {items.id}</span>
                          <span>User: {items.user_id}</span>
                          <span>City: {items.city_id}</span>
                        </div>

                        <Button
                          onClick={() => handleDelete(items.id)}
                          variant="destructive"
                          size="sm"
                          className="w-full gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Restaurant
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FranchiseList;
