'use client';
import { api } from '@/api/api';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';

interface IFranchise {
  id: string;
  name: string;
  image_url: string;
  status: string;
  roleId: string;
  role: string;
}

interface IRole {
  name: string;
  id: string;
}

interface IRestaurant {
  id: string;
  name: string;
  address: string;
  franchiseId: string;
}

const FranchiseForStaff = () => {
  const [open, setOpen] = useState(false);
  const [franchise, setFranchise] = useState<IFranchise[]>([]);
  const [restaurant, setRestaurant] = useState<IRestaurant[]>([]);
  const [role, setRole] = useState<IRole>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFranchise = async () => {
      try {
        setLoading(true);
        const response = await api.get('/franchise/getFranchiseOfStaff');
        setFranchise(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getFranchise();
  }, []);

  const fetchRole = async (id: string) => {
    try {
      const response = await api.get(`/franchise/getUserRole/${id}`);
      console.log(response.data);
      const { formatted, restaurant } = response.data;
      setRestaurant(restaurant);
      setRole(formatted);
      setOpen(true);
    } catch (error) {
      console.log(error);
      const selectedFranchise = franchise.find((f) => f.id === id);
      if (selectedFranchise) {
        setRole({ id: selectedFranchise.roleId, name: selectedFranchise.role });
        setRestaurant([]);
        setOpen(true);
      }
    }
  };
  const router = useRouter();
  const directRestroManage = (id: string) => {
    router.push(`/merchant/${id}`);
  };

  const directRestroOrders = (restaurantId: string, franchiseId: string) => {
    console.log(restaurantId, franchiseId);
    router.push(`/staff/${restaurantId}?franchiseId=${franchiseId}`);
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            My Franchises
          </h1>
          <p className="text-muted-foreground">
            Select a franchise to manage restaurants and view orders
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="aspect-video w-full bg-muted rounded-t-lg" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          My Franchises
        </h1>
        <p className="text-muted-foreground">
          Select a franchise to manage restaurants and view orders
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {franchise.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No franchises found</p>
          </div>
        )}

        {franchise.map((f) => (
          <Card
            key={f.id}
            onClick={() => fetchRole(f.id)}
            className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-border"
          >
            <CardContent className="p-0">
              <div className="relative aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                <Image
                  src={`http://localhost:5000${f.image_url}`}
                  alt={f.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-semibold text-foreground line-clamp-1">
                    {f.name}
                  </h3>
                  <Badge
                    variant={f.status === 'active' ? 'default' : 'secondary'}
                    className="shrink-0"
                  >
                    {f.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Role:</span>
                  <span className="text-sm font-medium text-foreground">
                    {f.role}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">{role?.name}</DialogTitle>
            <DialogDescription>
              Choose an action to manage your franchise operations
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {[1].includes(Number(role?.id)) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full justify-start" size="lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Manage Restaurant
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {restaurant.map((r) => (
                    <DropdownMenuItem
                      key={r.id}
                      onClick={() => directRestroManage(r.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{r.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {r.address}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {[1, 2].includes(Number(role?.id)) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    size="lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    </svg>
                    View Orders
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {restaurant.map((r) => (
                    <DropdownMenuItem
                      key={r.id}
                      onClick={() => directRestroOrders(r.id, r.franchiseId)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{r.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {r.address}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FranchiseForStaff;
