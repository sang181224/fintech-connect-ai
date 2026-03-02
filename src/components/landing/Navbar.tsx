import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">FreelanceVN</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Cách hoạt động</a>
          <a href="#" className="hover:text-foreground transition-colors">Lợi ích</a>
          <a href="#" className="hover:text-foreground transition-colors">Escrow</a>
          <a href="#" className="hover:text-foreground transition-colors">Testimonials</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm">Đăng nhập</Button>
          <Button variant="default" size="sm" className="rounded-lg">Bắt đầu miễn phí</Button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <a href="#" className="block text-sm text-muted-foreground">Cách hoạt động</a>
          <a href="#" className="block text-sm text-muted-foreground">Lợi ích</a>
          <a href="#" className="block text-sm text-muted-foreground">Escrow</a>
          <a href="#" className="block text-sm text-muted-foreground">Testimonials</a>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm">Đăng nhập</Button>
            <Button variant="default" size="sm">Bắt đầu miễn phí</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
