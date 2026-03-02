import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Menu,
  X,
  Search,
  Bell,
  MessageSquare,
  Wallet,
  ChevronDown,
  Home,
  FolderSearch,
  Users,
  FileText,
  Landmark,
  Scale,
  Bot,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Trang chủ", href: "/", icon: Home },
  { label: "Tìm dự án", href: "/projects", icon: FolderSearch },
  { label: "Tìm freelancer", href: "/freelancers", icon: Users },
  { label: "Hợp đồng", href: "/contracts", icon: FileText },
  { label: "Ví Escrow", href: "/escrow", icon: Landmark },
  { label: "Tranh chấp", href: "/disputes", icon: Scale },
  { label: "AI tư vấn", href: "/ai", icon: Bot },
];

const userMenuItems = [
  { label: "Hồ sơ cá nhân", icon: User, href: "/profile" },
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Cài đặt", icon: Settings, href: "/settings" },
];

const mockNotifications = [
  { id: 1, text: "Dự án mới phù hợp với bạn", time: "2 phút trước", unread: true },
  { id: 2, text: "Thanh toán $500 đã hoàn tất", time: "1 giờ trước", unread: true },
  { id: 3, text: "Hợp đồng #1234 cần xác nhận", time: "3 giờ trước", unread: false },
];

// Dropdown hook
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return { open, setOpen, ref };
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activePath] = useState("/");

  const notifDropdown = useDropdown();
  const userDropdown = useDropdown();

  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/60 shadow-sm">
        {/* Main row */}
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <a href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground hidden sm:block">
                FreelanceVN
              </span>
            </a>

            {/* Center: Navigation (desktop) */}
            <nav className="hidden xl:flex items-center gap-1 mx-6">
              {navItems.map((item) => {
                const isActive = activePath === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <div className="relative hidden sm:block">
                {searchOpen ? (
                  <div className="flex items-center bg-muted rounded-lg px-3 py-1.5 gap-2 w-64 animate-fade-up">
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm dự án, freelancer, hợp đồng..."
                      className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
                    />
                    <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <Search className="h-4 w-4" />
                    <span className="text-sm hidden lg:inline">Tìm kiếm...</span>
                    <kbd className="hidden lg:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-background px-1.5 text-[10px] font-medium text-muted-foreground">
                      ⌘K
                    </kbd>
                  </button>
                )}
              </div>

              {/* Notifications */}
              <div className="relative" ref={notifDropdown.ref}>
                <button
                  onClick={() => notifDropdown.setOpen(!notifDropdown.open)}
                  className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifDropdown.open && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl bg-card border border-border shadow-card-hover animate-fade-up z-50">
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <span className="font-display font-semibold text-sm text-foreground">Thông báo</span>
                      <button className="text-xs text-primary hover:underline">Đánh dấu đã đọc</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {mockNotifications.map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${
                            n.unread ? "bg-secondary/30" : ""
                          }`}
                        >
                          <p className="text-sm text-foreground">{n.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-border text-center">
                      <a href="/notifications" className="text-xs text-primary hover:underline font-medium">
                        Xem tất cả thông báo
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <button className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors hidden sm:flex">
                <MessageSquare className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
              </button>

              {/* Wallet balance */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground">
                <Wallet className="h-4 w-4" />
                <span className="text-sm font-semibold">$2,450</span>
              </div>

              {/* User avatar dropdown */}
              <div className="relative" ref={userDropdown.ref}>
                <button
                  onClick={() => userDropdown.setOpen(!userDropdown.open)}
                  className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    NT
                  </div>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform hidden sm:block ${userDropdown.open ? "rotate-180" : ""}`} />
                </button>

                {userDropdown.open && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-card-hover animate-fade-up z-50">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-semibold text-sm text-foreground">Nguyễn Tuấn</p>
                      <p className="text-xs text-muted-foreground">tuan@example.com</p>
                    </div>
                    <div className="py-1.5">
                      {userMenuItems.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                        >
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          {item.label}
                        </a>
                      ))}
                    </div>
                    <div className="border-t border-border py-1.5">
                      <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors">
                        <LogOut className="h-4 w-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile hamburger */}
              <button
                className="xl:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 xl:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-72 bg-card border-l border-border shadow-card-hover z-50 xl:hidden animate-fade-up">
            <div className="flex items-center justify-between px-4 h-16 border-b border-border">
              <span className="font-display font-semibold text-foreground">Menu</span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Mobile search */}
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center bg-muted rounded-lg px-3 py-2 gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Tìm kiếm..."
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
                />
              </div>
            </div>

            {/* Wallet in mobile */}
            <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-secondary text-secondary-foreground">
              <Wallet className="h-4 w-4" />
              <span className="text-sm font-semibold">Số dư: $2,450</span>
            </div>

            {/* Nav items */}
            <nav className="px-2 py-3 space-y-0.5">
              {navItems.map((item) => {
                const isActive = activePath === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Divider + user actions */}
            <div className="border-t border-border px-2 py-3 space-y-0.5">
              {userMenuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  {item.label}
                </a>
              ))}
              <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-muted transition-colors">
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
