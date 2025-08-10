'use client';
import { api } from '@/api/api';
import { handleError } from '@/lib/handleError';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
type Profile = {
  name: string;
};
const UserPanel = () => {
  const [Profile, setProfile] = useState<Profile>({ name: '' });
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    async function profile() {
      try {
        const profile = (await api.get('/users')).data;
        console.log(profile);
        setProfile(profile);
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
      ) : Profile.name ? (
        <Button variant="link" asChild>
          <Link href="/users/profile">{Profile.name}</Link>
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
