import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-full">{children}</div>
      </main>
    </SidebarProvider>
  );
}
