'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/sockets';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, MapPin, CreditCard, Clock, Star } from 'lucide-react';
import Image from 'next/image';

interface Items {
  id: number;
  order_id: number;
  menu_id: number;
  variant_id: number;
  price: number;
  quantity: number;
  total_amount: number;
  product_name: string;
}

interface Notification {
  orderId: number;
  total: number;
  payments: string;
  items: Items[];
  restaurant_name: string;
  restaurant_image: string;
}

export default function Notification() {
  const [notifications, setNotifications] = useState<Notification | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    socket.on('newOrder', (data: Notification) => {
      setNotifications(data);
      console.log(data);
      toast('🎉 New Order Received!', {
        description: `Order #${data.orderId} • Total: $${data.total}`,
        duration: 10000,
        action: {
          label: 'View Details',
          onClick: () => setOpen(true),
        },
      });
    });

    return () => {
      socket.off('newOrder');
    };
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) setNotifications(null);
      }}
    >
      <DialogContent className="max-w-md border-0 bg-gradient-to-br from-background to-secondary p-0 shadow-2xl">
        {notifications && (
          <>
            <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-r from-primary via-primary to-accent p-6 text-primary-foreground">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/5" />
              <div className="relative">
                <DialogHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                      <ShoppingBag className="h-5 w-5" />
                      Order #{notifications.orderId}
                    </DialogTitle>
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-primary-foreground hover:bg-white/30"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      New
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <CreditCard className="h-4 w-4" />
                    <span className="capitalize">{notifications.payments}</span>
                  </div>
                </DialogHeader>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="mb-4 flex items-center gap-3">
                {notifications.restaurant_image && (
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      width={60}
                      height={60}
                      src={`http://localhost:5000${notifications.restaurant_image}`}
                      alt={notifications.restaurant_name}
                      className="h-15 w-15 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {notifications.restaurant_name}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Restaurant Partner</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    <span className="text-muted-foreground">4.8 Rating</span>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Order Items</h4>
                <ScrollArea className="max-h-48 pr-2">
                  <div className="space-y-2">
                    {notifications.items.map((item) => (
                      <Card
                        key={item.id}
                        className="border-l-4 border-l-primary/30 bg-gradient-to-r from-card to-secondary/30 shadow-sm transition-all hover:shadow-md"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-card-foreground">
                                {item.product_name}
                              </p>
                              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">Qty:</span>
                                  <Badge
                                    variant="outline"
                                    className="h-5 px-2 text-xs"
                                  >
                                    {item.quantity}
                                  </Badge>
                                </span>
                                <span>${item.price}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-primary">
                                ${item.total_amount}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <Separator className="my-4" />

              <div className="rounded-lg bg-gradient-to-r from-primary/5 to-accent/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Order Total
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    ${notifications.total}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ShoppingBag className="h-3 w-3" />
                    {notifications.items.length} item
                    {notifications.items.length > 1 ? 's' : ''}
                  </span>
                  <span>•</span>
                  <span className="capitalize">
                    {notifications.payments} payment
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
