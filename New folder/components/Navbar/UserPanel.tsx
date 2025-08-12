'use client';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
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
    <div>
      {Loading ? (
        <p>Loading....</p>
      ) : Profile?.full_name ? (
        <Button variant="link" asChild>
          <Link href="/users/profile">{Profile.full_name}</Link>
        </Button>
      ) : (
        <div>
          <Button variant="link" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button variant="link" asChild>
            <Link href="/auth/register">Register</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserPanel;
