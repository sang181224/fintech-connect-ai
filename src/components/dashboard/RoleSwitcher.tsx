import { Briefcase, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type UserRole = "contractor" | "freelancer";

interface RoleSwitcherProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function RoleSwitcher({ role, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="inline-flex items-center rounded-xl bg-muted p-1 gap-1">
      <button
        onClick={() => onRoleChange("contractor")}
        className={cn(
          "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
          role === "contractor"
            ? "bg-card text-primary shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Briefcase className="h-4 w-4" />
        Nhà thầu
      </button>
      <button
        onClick={() => onRoleChange("freelancer")}
        className={cn(
          "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
          role === "freelancer"
            ? "bg-card text-primary shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Code2 className="h-4 w-4" />
        Freelancer
      </button>
    </div>
  );
}
