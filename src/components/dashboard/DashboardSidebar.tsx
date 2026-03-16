import {
  LayoutDashboard,
  FileText,
  Milestone,
  Wallet,
  MessageSquare,
  AlertTriangle,
  Bell,
  Bot,
  Briefcase,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Tổng quan", url: "/dashboard", icon: LayoutDashboard },
  { title: "Hợp đồng", url: "/dashboard/contracts", icon: FileText },
  { title: "Milestone", url: "/dashboard/milestones", icon: Milestone },
  { title: "Ví Escrow", url: "/dashboard/escrow", icon: Wallet },
  { title: "Tin nhắn", url: "/dashboard/messages", icon: MessageSquare },
  { title: "Tranh chấp", url: "/dashboard/disputes", icon: AlertTriangle },
  { title: "Thông báo", url: "/dashboard/notifications", icon: Bell },
  { title: "AI tư vấn", url: "/dashboard/ai", icon: Bot },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">FV</span>
          </div>
          {!collapsed && (
            <span className="font-heading text-lg font-bold text-foreground">
              FreelanceVN
            </span>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        className="hover:bg-sidebar-accent/50"
                        activeClassName="bg-sidebar-accent text-primary font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
