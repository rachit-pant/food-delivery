'use client';
import React from 'react';
import ExistingUser from '@/components/invite/ExisitngUser';

const page = async ({ searchParams }: { searchParams: { token?: string } }) => {
  const { token } = await searchParams;
  if (!token) {
    return null;
  }
  return <ExistingUser query={token} />;
};

export default page;
