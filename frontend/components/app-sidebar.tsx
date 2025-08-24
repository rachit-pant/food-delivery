import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

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
  {
    title: 'Merchant',
    url: '/user/restaurant',
    icon: Calendar,
  },
];

export function AppSidebar() {
  return (
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
