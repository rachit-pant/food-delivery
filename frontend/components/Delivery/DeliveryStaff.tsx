'use client';
import { api } from '@/api/api';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Bike, Store, DollarSign, CheckCircle2, Clock } from 'lucide-react';

export interface DeliveryAgent {
  id: number;
  user_id: number;
  status: 'ACTIVE' | 'INACTIVE';
  orders: Order[];
}

export interface Order {
  id: number;
  restaurants: Restaurant;
  net_amount: number;
  payment_status: 'paid' | 'not_paid';
  order_items: OrderItem[];
}

export interface Restaurant {
  id: number;
  name: string;
}

export interface OrderItem {
  id: number;
  product_name: string;
}

interface Status {
  id: number;
  status: 'ACTIVE' | 'INACTIVE';
}

const DeliveryStaff = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}) => {
  const [deliveryAgent, setDeliveryAgent] = useState<DeliveryAgent | null>(
    null
  );
  const [status, setStatus] = useState<Status | null>(null);
  useEffect(() => {
    async function deliveryStaffData() {
      const result = (await api.get('/delivery')).data;
      setDeliveryAgent(result);
    }
    deliveryStaffData();
    async function getStatus() {
      const result = (await api.get('/delivery/status')).data;
      setStatus(result);
    }
    getStatus();
  }, []);
  const router = useRouter();
  function handleSelectChange(value: string) {
    console.log(value);
    api.patch('/delivery/updateStatus', { status: value });
  }

  const statusLabel =
    status?.status === 'ACTIVE'
      ? 'Online'
      : status?.status === 'INACTIVE'
      ? 'Offline'
      : 'Select status';
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
    }).format(n);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl w-[95vw] p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl">Delivery Agent</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Delivery Agent
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pb-6">
            <div className="mb-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Status
              </p>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder={statusLabel} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Online</SelectItem>
                  <SelectItem value="2">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {deliveryAgent ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bike className="h-5 w-5 text-muted-foreground" />
                    {'Agent #' + deliveryAgent.user_id}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="mt-1">
                      <Badge
                        variant={
                          deliveryAgent.status === 'ACTIVE'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {deliveryAgent.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Orders</p>
                    <p className="text-lg font-medium mt-1">
                      {deliveryAgent.orders.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Agent ID</p>
                    <p className="text-lg font-medium mt-1">
                      {deliveryAgent.id}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-20 w-full" />
              </div>
            )}

            <Separator className="my-4" />

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Recent Orders</h3>

              {deliveryAgent ? (
                deliveryAgent.orders.length ? (
                  <ScrollArea className="h-64 pr-4">
                    <div className="space-y-3">
                      {deliveryAgent.orders.map((order) => (
                        <Card key={order.id}>
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between gap-4">
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <Store className="h-4 w-4 text-muted-foreground shrink-0" />
                                  <p className="font-medium truncate">
                                    {order.restaurants.name}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <DollarSign className="h-4 w-4" />
                                  <span className="tabular-nums">
                                    {formatCurrency(order.net_amount)}
                                  </span>
                                  <span>•</span>
                                  <span>{order.order_items.length} items</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <Badge
                                  variant={
                                    order.payment_status === 'paid'
                                      ? 'default'
                                      : 'secondary'
                                  }
                                  className="flex items-center gap-1"
                                >
                                  {order.payment_status === 'paid' ? (
                                    <CheckCircle2 className="h-3 w-3" />
                                  ) : (
                                    <Clock className="h-3 w-3" />
                                  )}
                                  <span className="capitalize">
                                    {order.payment_status}
                                  </span>
                                </Badge>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    router.push(`/deliveryView/${order.id}`);
                                  }}
                                >
                                  Go
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No orders yet.
                  </div>
                )
              ) : null}
            </div>
          </div>

          <DialogFooter className="px-6 pb-6">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryStaff;
