import DeliveryAgent from '@/components/Delivery/DeliveryAgent';
import React from 'react';

const page = async ({ params }: { params: { orderId: string } }) => {
  const { orderId } = await params;
  return (
    <div>
      <DeliveryAgent orderId={orderId} />
    </div>
  );
};

export default page;
