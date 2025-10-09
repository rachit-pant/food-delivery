'use client';
import {
  Calendar,
  Home,
  Inbox,
  Search,
  ChartBarDecreasing,
  LayoutDashboard,
  BookText,
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
      <Sidebar className="sticky top-17 left-0 h-[calc(100vh-5rem)]">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {isMerchant && (
                  <SidebarMenuItem key="merchant">
                    <SidebarMenuButton asChild>
                      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                      <a href="/merchant">
                        <ChartBarDecreasing />
                        <span>Merchant</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isMerchant && (
                  <SidebarMenuItem key="merchantDashboard">
                    <SidebarMenuButton asChild>
                      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                      <a href="/merchant/dashboard">
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isSubscription && (
                  <SidebarMenuItem key="subscription">
                    <SidebarMenuButton asChild>
                      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                      <a href="/subscription">
                        <Calendar />
                        <span>Subscription</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isMerchant && (
                  <SidebarMenuItem key="merchantFranchise">
                    <SidebarMenuButton asChild>
                      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                      <a href="/merchant/franchise">
                        <BookText />
                        <span>Franchise</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isMerchant && (
                  <SidebarMenuItem key="merchantFranchise">
                    <SidebarMenuButton asChild>
                      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                      <a href="/merchant/franchise/manage">
                        <BookText />
                        <span>Staff</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isStaff && (
                  <SidebarMenuItem key="staffFranchise">
                    <SidebarMenuButton asChild>
                      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                      <a href="/staff">
                        <BookText />
                        <span>Jobs</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {isDeliveryAgent && (
                  <SidebarMenuItem key="deliveryAgent">
                    <SidebarMenuButton asChild>
                      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
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
