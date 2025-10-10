import DeliveryPage from '@/components/Delivery/DeliveryPage';
import React from 'react';

const page = async ({ params }: { params: { orderId: string } }) => {
  const { orderId } = await params;
  return (
    <div>
      <DeliveryPage orderId={orderId} />
    </div>
  );
};

export default page;
