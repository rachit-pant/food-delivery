'use client';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { User, ShoppingCart, Package, LogIn, UserPlus } from 'lucide-react';

type Profile = {
  full_name: string;
  email: string;
  user_roles: {
    role_name: string;
  };
};

const UserPanel = () => {
  const [Profile, setProfile] = useState<Profile | null>(null);
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    async function profile() {
      try {
        const res = (await api.get('/users')).data;
        console.log(res);
        setProfile(res);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        const err = handleError(error);
        console.log(err);
      }
    }
    profile();
  }, []);

  return (
    <div className="flex items-center gap-3">
      {Loading ? (
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ) : Profile?.full_name ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {Profile.full_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" asChild className="font-medium">
              <Link href="/user" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {Profile.full_name}
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/cart" className="flex items-center gap-1">
                <ShoppingCart className="h-4 w-4" />
                Cart
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/orders" className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                Orders
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login" className="flex items-center gap-1">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/register" className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              Register
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserPanel;
