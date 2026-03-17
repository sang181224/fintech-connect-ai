import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  MoreHorizontal,
} from "lucide-react";

// --- Dữ liệu tĩnh ---
const primaryNavItems = [
  { label: "Trang chủ", href: "/", icon: Home },
  { label: "Tìm dự án", href: "/projects", icon: FolderSearch },
  { label: "Tìm freelancer", href: "/freelancers", icon: Users },
  { label: "Ví Escrow", href: "/escrow", icon: Landmark },
];

const secondaryNavItems = [
  { label: "Hợp đồng", href: "/contracts", icon: FileText },
  { label: "Tranh chấp", href: "/disputes", icon: Scale },
  { label: "AI tư vấn", href: "/ai", icon: Bot },
];

const allNavItems = [...primaryNavItems, ...secondaryNavItems];

const userMenuItems = [
  { label: "Hồ sơ cá nhân", icon: User, href: "/dashboard/profile" },
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Cài đặt", icon: Settings, href: "/dashboard/settings" },
];

const mockNotifications = [
  {
    id: 1,
    text: "Dự án mới phù hợp với bạn",
    time: "2 phút trước",
    unread: true,
  },
  {
    id: 2,
    text: "Thanh toán $500 đã hoàn tất",
    time: "1 giờ trước",
    unread: true,
  },
  {
    id: 3,
    text: "Hợp đồng #1234 cần xác nhận",
    time: "3 giờ trước",
    unread: false,
  },
];

// --- Custom Hooks ---
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return { open, setOpen, ref };
}

// --- Component Chính ---
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const activePath = location.pathname;

  const notifDropdown = useDropdown();
  const userDropdown = useDropdown();
  const moreDropdown = useDropdown();

  const unreadCount = mockNotifications.filter((n) => n.unread).length;
  const isSecondaryActive = secondaryNavItems.some(
    (item) => item.href === activePath,
  );
  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/60 shadow-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div
                className="h-9 w-9 rounded-lg flex items-center justify-center shadow-sm"
                style={{ background: "var(--gradient-primary, #3b82f6)" }}
              >
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-foreground hidden sm:block">
                FreelanceVN
              </span>
            </Link>

            {/* Nav Desktop */}
            <nav className="hidden xl:flex items-center gap-1 mx-6">
              {primaryNavItems.map((item) => {
                const isActive = activePath === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-secondary text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Dropdown "Thêm" */}
              <div className="relative" ref={moreDropdown.ref}>
                <button
                  onClick={() => moreDropdown.setOpen(!moreDropdown.open)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSecondaryActive
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span>Thêm</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${moreDropdown.open ? "rotate-180" : ""}`}
                  />
                </button>

                {moreDropdown.open && (
                  <div className="absolute left-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-card-hover animate-fade-up z-50">
                    <div className="py-1.5">
                      {secondaryNavItems.map((item) => {
                        const isActive = activePath === item.href;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => moreDropdown.setOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                              isActive
                                ? "text-primary bg-secondary/60"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            <item.icon className="h-4 w-4 text-muted-foreground" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Side: Actions & Auth */}
            <div className="flex items-center gap-1 sm:gap-2">
              {isAuthenticated ? (
                <>
                  {/* Search bar */}
                  <div className="relative hidden sm:block">
                    {searchOpen ? (
                      <div className="flex items-center bg-muted rounded-lg px-3 py-1.5 gap-2 w-56 animate-fade-up">
                        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                        <input
                          autoFocus
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Tìm dự án, freelancer..."
                          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
                        />
                        <button
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSearchOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <Search className="h-4 w-4" />
                        <span className="text-sm hidden 2xl:inline">
                          Tìm kiếm...
                        </span>
                        <kbd className="hidden 2xl:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-background px-1.5 text-[10px] font-medium text-muted-foreground">
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
                          <span className="font-display font-semibold text-sm text-foreground">
                            Thông báo
                          </span>
                          <button className="text-xs text-primary hover:underline">
                            Đánh dấu đã đọc
                          </button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {mockNotifications.map((n) => (
                            <div
                              key={n.id}
                              className={`px-4 py-3 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors cursor-pointer ${
                                n.unread ? "bg-secondary/30" : ""
                              }`}
                            >
                              <p className="text-sm text-foreground">
                                {n.text}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {n.time}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-2.5 border-t border-border text-center">
                          <Link
                            to="/notifications"
                            className="text-xs text-primary hover:underline font-medium"
                          >
                            Xem tất cả thông báo
                          </Link>
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

                  {/* User Dropdown */}
                  <div className="relative" ref={userDropdown.ref}>
                    <button
                      onClick={() => userDropdown.setOpen(!userDropdown.open)}
                      className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-full hover:bg-muted transition-colors"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition-transform hidden sm:block ${userDropdown.open ? "rotate-180" : ""}`}
                      />
                    </button>

                    {userDropdown.open && (
                      <div className="absolute right-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-card-hover animate-fade-up z-50">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="font-semibold text-sm text-foreground">
                            {user?.name || "Người dùng"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                        <div className="py-1.5">
                          {userMenuItems.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => userDropdown.setOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                            >
                              <item.icon className="h-4 w-4 text-muted-foreground" />
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-border py-1.5">
                          <button
                            onClick={() => {
                              logout();
                              userDropdown.setOpen(false);
                            }}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-muted transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Unauthenticated Actions */
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost">Đăng nhập</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="shadow-sm bg-primary text-primary-foreground hover:bg-primary/90">
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                className="xl:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar (Drawer) */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 xl:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-72 bg-card border-l border-border shadow-card-hover z-50 xl:hidden animate-fade-left flex flex-col">
            <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
              <span className="font-display font-semibold text-foreground">
                Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-4">
              {isAuthenticated && (
                <>
                  <div className="px-4 py-3 border-b border-border">
                    <div className="flex items-center bg-muted rounded-lg px-3 py-2 gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <input
                        placeholder="Tìm kiếm..."
                        className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
                      />
                    </div>
                  </div>
                  <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-secondary text-secondary-foreground">
                    <Wallet className="h-4 w-4" />
                    <span className="text-sm font-semibold">Số dư: $2,450</span>
                  </div>
                </>
              )}

              <nav className="px-2 py-3 space-y-0.5">
                {allNavItems.map((item) => {
                  const isActive = activePath === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-secondary text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-border px-2 py-3 space-y-0.5 mt-auto">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 mb-2 flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">
                          {user?.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-muted transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full justify-center"
                      >
                        Đăng nhập
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full justify-center">Đăng ký</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
