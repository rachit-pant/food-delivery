import React from 'react';
import MenusList from '@/components/Merchant/MenusList';

const page = async ({
  params,
}: {
  params: Promise<{ restaurantId: string }>;
}) => {
  const restaurantId = (await params).restaurantId;
  return (
    <div>
      <MenusList restaurantId={restaurantId} />
    </div>
  );
};

export default page;
