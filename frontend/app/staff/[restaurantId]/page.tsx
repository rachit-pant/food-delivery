import React from 'react';
import SeeOrders from '@/components/Franchise/SeeOrders';

interface PageProps {
  params: { restaurantId: string };
  searchParams?: { franchiseId?: string };
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { restaurantId } = await params;
  const param = await searchParams;
  const franchiseId = param?.franchiseId || '0';
  return (
    <div>
      <SeeOrders restaurantId={restaurantId} franchiseId={franchiseId} />
    </div>
  );
};

export default Page;
