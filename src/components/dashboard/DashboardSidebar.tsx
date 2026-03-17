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
  { title: "Dự án", url: "/dashboard/projects", icon: Briefcase },
  { title: "Hợp đồng", url: "/dashboard/contracts", icon: FileText },
  { title: "Milestone", url: "/dashboard/milestones", icon: Milestone },
  { title: "Ví Escrow", url: "/dashboard/escrow", icon: Wallet },
  { title: "Tin nhắn", url: "/dashboard/messages", icon: MessageSquare },
  { title: "Tranh chấp", url: "/dashboard/disputes", icon: AlertTriangle },
  { title: "Thông báo", url: "/dashboard/notifications", icon: Bell },
  { title: "AI tư vấn", url: "/dashboard/ai-consultant", icon: Bot },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            FV
          </div>
          {!collapsed && (
            <span
              className="font-semibold text-lg"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              FreelanceVN
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <NavLink to={item.url}>
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
