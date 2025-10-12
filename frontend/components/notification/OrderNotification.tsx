'use client';
import { getSocket } from '@/lib/sockets';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { api } from '@/api/api';
interface Orders {
  id: number;
  net_amount: number;
  payment_status: string;
  order_items: OrderItems[];
  order_addresses: {
    address: string;
  };
  restaurants: {
    name: string;
  };
}
interface OrderItems {
  product_name: string;
  quantity: number;
}
const OrderNotification = () => {
  const [orderRequest, setOrderRequest] = useState<Orders | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    socket.on('OrderRequest', (data: Orders) => {
      setOrderRequest(data);

      toast('🎉 New Order Received!', {
        description: `Order #${data.id} • Total: $${data.net_amount}`,
        duration: 10000,
        action: {
          label: 'View Details',
          onClick: () => setOpen(true),
        },
      });
    });

    return () => {
      socket.off('OrderRequest');
    };
  }, []);
  const handleAccept = async () => {
    try {
      const res = await api.patch(`/orders/delivered/${orderRequest?.id}`);
      toast('Order Accepted!', {
        duration: 5000,
      });
      setOrderRequest(null);
    } catch (error) {
      console.log(error);
      toast('Order Rejected!', {
        duration: 5000,
      });
    }
    setOpen(false);
  };
  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setOrderRequest(null);
        }}
      >
        <DialogContent>
          {orderRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Order Request</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <p>{orderRequest.restaurants.name}</p>
                <p>{orderRequest.order_addresses.address}</p>
                <p>
                  Order #{orderRequest.id} • Total: $
                  {orderRequest.net_amount.toFixed(2)}
                </p>
                <p>{orderRequest.payment_status}</p>
                {orderRequest.order_items.map((item) => (
                  <p key={item.product_name}>
                    {item.product_name} x {item.quantity}
                  </p>
                ))}
                <Button onClick={handleAccept}>Accept</Button>
              </DialogDescription>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderNotification;
