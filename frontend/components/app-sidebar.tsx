'use client';
import { Calendar, Home, Inbox, Search } from 'lucide-react';

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
  const isMerchant = [2, 3].includes(role);
  const isSubscription = [1, 2].includes(role);
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
                        <Calendar />
                        <span>Merchant</span>
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
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
