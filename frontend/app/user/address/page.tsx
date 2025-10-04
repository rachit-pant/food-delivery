import AddressForm from '@/components/UserPanel/AddressForm';
import React from 'react';

const Address = async ({
  searchParams,
}: {
  searchParams?: { redirect?: string };
}) => {
  const param = await searchParams;
  const redirect = param?.redirect || '0';
  return (
    <div>
      <AddressForm redirect={redirect} />
    </div>
  );
};

export default Address;
