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
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

interface JwtPayload {
  id: number;
  role: number;
}

export async function AppSidebar() {
  let role;
  const cookieStore = await cookies();
  const refreshtoken = cookieStore.get('refreshtoken')?.value as string;
  if (!refreshtoken) {
    role = 1;
  }

  let decoded: JwtPayload;
  try {
    const { payload } = await jwtVerify(
      refreshtoken,
      new TextEncoder().encode(process.env.REFRESH_SECRET_KEY!)
    );
    console.log('Decoded JWT payload:', payload);
    decoded = payload as unknown as JwtPayload;
    console.log('Decoded JWT payload:', decoded);
    role = decoded.role;
  } catch (err) {
    console.error('JWT verify error:', err);
    role = 1;
  }
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
              {isMerchant && (
                <SidebarMenuItem key="merchant">
                  <SidebarMenuButton asChild>
                    <a href="/merchant">
                      <Calendar />
                      <span>Merchant</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
