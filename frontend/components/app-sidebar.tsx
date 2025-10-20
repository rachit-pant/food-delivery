'use client';
import {
  Calendar,
  Home,
  Inbox,
  Search,
  ChartBarDecreasing,
  LayoutDashboard,
  BookText,
  Badge,
  Route,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAppSelector } from '@/lib/hooks';
import { useState } from 'react';
import { Button } from './ui/button';
import DeliveryStaff from './Delivery/DeliveryStaff';
import Link from 'next/link';
export function AppSidebar() {
  const role = useAppSelector((state) => state.roleMiddleware.role);
  const items = [
    {
      title: 'Profile',
      url: '/user',
      icon: Home,
    },
    {
      title: 'Address',
      url: '/user/address',
      icon: Inbox,
    },
    {
      title: 'Orders',
      url: '/user/orders',
      icon: Search,
    },
  ];
  const isMerchant = [2].includes(role);
  const isSubscription = [1, 2].includes(role);
  const isStaff = [4].includes(role);
  const isDeliveryAgent = [5].includes(role);
  const [isDeliveryAgentOpen, setIsDeliveryAgentOpen] = useState(false);
  return (
    <>
      <Sidebar className="sticky top-0 left-0 h-[calc(100vh-5rem)]">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem key="home">
                  <SidebarMenuButton asChild>
                    <Link href="/restaurant" >
                      <Badge />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {isMerchant && (
                  <SidebarMenuItem key="merchant">
                    <SidebarMenuButton asChild>
                      <Link href="/merchant">
                        <ChartBarDecreasing />
                        <span>Merchant</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isMerchant && (
                  <SidebarMenuItem key="merchantDashboard">
                    <SidebarMenuButton asChild>
                      <Link href="/merchant/dashboard">
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isSubscription && (
                  <SidebarMenuItem key="subscription">
                    <SidebarMenuButton asChild>
                      <Link href="/subscription">
                        <Calendar />
                        <span>Subscription</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isMerchant && (
                  <SidebarMenuItem key="merchantFranchise">
                    <SidebarMenuButton asChild>
                      <Link href="/merchant/franchise">
                        <BookText />
                        <span>Franchise</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isMerchant && (
                  <SidebarMenuItem key="merchantFranchise">
                    <SidebarMenuButton asChild>
                      <Link href="/merchant/franchise/manage">
                        <Route />
                        <span>Staff</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isStaff && (
                  <SidebarMenuItem key="staffFranchise">
                    <SidebarMenuButton asChild>
                      <Link href="/staff">
                        <Route />
                        <span>Jobs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isDeliveryAgent && (
                  <SidebarMenuItem key="deliveryAgent">
                    <SidebarMenuButton asChild>
                      <Button
                        variant="link"
                        className="hover:cursor-pointer font-normal -ml-1"
                        onClick={() => setIsDeliveryAgentOpen(true)}
                      >
                        <BookText />
                        <span>Delivery Agent</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isDeliveryAgentOpen && (
                  <DeliveryStaff
                    isOpen={isDeliveryAgentOpen}
                    setIsOpen={setIsDeliveryAgentOpen}
                  />
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
