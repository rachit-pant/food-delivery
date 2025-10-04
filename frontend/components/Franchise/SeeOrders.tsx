'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { MapPin, CreditCard, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { api } from '@/api/api';

interface OrderItem {
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  orderId: number;
  placedAt: string;
  status: string;
  amounts: {
    subtotal: number;
    discount: number;
    delivery: number;
    total: number;
  };
  payment: {
    mode: string | null;
    status: string | null;
  };
  restaurant: {
    name: string;
    image: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
  };
  items: OrderItem[];
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    limit: number;
  };
}

export default function RestaurantOrders({
  restaurantId,
  franchiseId,
}: {
  restaurantId: string;
  franchiseId: string;
}) {
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/orders/restaurant/${restaurantId}?page=${currentPage}&limit=10&franchiseId=${franchiseId}`
        );
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [restaurantId, currentPage, franchiseId]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      confirmed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      preparing: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
      ready: 'bg-green-500/10 text-green-500 border-green-500/20',
      delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const getPaymentStatusColor = (status: string | null) => {
    if (status === 'paid')
      return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (status === 'pending')
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    return 'bg-muted text-muted-foreground';
  };

  const getPageNumbers = () => {
    if (!data) return [];
    const { currentPage, totalPages } = data.pagination;
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);

    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-64 animate-pulse bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.orders.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Package className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-semibold">No orders found</h2>
          <p className="mt-2 text-muted-foreground">
            There are no orders for this restaurant yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Restaurant Orders
          </h1>
          <p className="mt-2 text-muted-foreground">
            Showing {data.orders.length} of {data.pagination.totalOrders} orders
          </p>
        </div>

        <div className="space-y-4">
          {data.orders.map((order) => (
            <Card
              key={order.orderId}
              className="overflow-hidden border-border bg-card transition-all hover:shadow-lg"
            >
              <div className="p-6">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">
                        Order #{order.orderId}
                      </h3>
                      <Badge
                        className={cn('border', getStatusColor(order.status))}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.placedAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      ${order.amounts.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Package className="h-4 w-4" />
                      Items ({order.items.length})
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
                        >
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                            {item.image ? (
                              <Image
                                src={
                                  `http://localhost:5000${item.image}` ||
                                  '/placeholder.svg'
                                }
                                alt={item.name}
                                width={48}
                                height={48}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium leading-tight">
                              {item.name}
                            </p>
                            {item.variant && (
                              <p className="text-xs text-muted-foreground">
                                {item.variant}
                              </p>
                            )}
                            <p className="mt-1 text-sm">
                              <span className="font-semibold">
                                ${item.price.toFixed(2)}
                              </span>
                              <span className="text-muted-foreground">
                                {' '}
                                × {item.quantity}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      Delivery Address
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="font-medium leading-relaxed">
                        {order.deliveryAddress.street}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {order.deliveryAddress.city}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      Payment Details
                    </div>
                    <div className="space-y-3 rounded-lg bg-muted/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Payment Mode
                        </span>
                        <span className="font-medium">
                          {order.payment.mode || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Status
                        </span>
                        <Badge
                          className={cn(
                            'border text-xs',
                            getPaymentStatusColor(order.payment.status)
                          )}
                        >
                          {order.payment.status || 'N/A'}
                        </Badge>
                      </div>
                      <div className="border-t border-border pt-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Subtotal
                          </span>
                          <span>${order.amounts.subtotal.toFixed(2)}</span>
                        </div>
                        {order.amounts.discount > 0 && (
                          <div className="flex justify-between text-sm text-green-500">
                            <span>Discount</span>
                            <span>-${order.amounts.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Delivery
                          </span>
                          <span>${order.amounts.delivery.toFixed(2)}</span>
                        </div>
                        <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold">
                          <span>Total</span>
                          <span>${order.amounts.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {data.pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page, idx) => (
                  <PaginationItem key={idx}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      if (currentPage < data.pagination.totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={
                      currentPage === data.pagination.totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
