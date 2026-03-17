import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col">
          {/* Top bar */}
          <header className="flex h-14 items-center justify-between border-b px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  U
                </AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
