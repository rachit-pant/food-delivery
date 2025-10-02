import React from 'react';
import CreateUser from '@/components/invite/CreateUser';

const page = async ({ searchParams }: { searchParams: { token?: string } }) => {
  const { token } = await searchParams;
  if (!token) {
    return null;
  }
  return <CreateUser query={token} />;
};

export default page;
