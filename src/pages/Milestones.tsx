import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RoleSwitcher, UserRole } from "@/components/dashboard/RoleSwitcher";
import { MilestoneCard } from "@/components/dashboard/MilestoneCard";
import { MilestoneData, MilestoneStatus, milestoneStatusConfig } from "@/types/milestone";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, Milestone as MilestoneIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ─── Mock data ────────────────────────────────────
const mockMilestones: MilestoneData[] = [
  { id: 1, contractId: "#1090", contractName: "Thiết kế UI/UX App", title: "MS#1 — Wireframe", amount: "₫12.5M", amountNum: 12500000, status: "released", deadline: "15/01", counterparty: "Trần Minh", },
  { id: 2, contractId: "#1090", contractName: "Thiết kế UI/UX App", title: "MS#2 — UI Design", amount: "₫12.5M", amountNum: 12500000, status: "released", deadline: "28/01", counterparty: "Trần Minh", },
  { id: 3, contractId: "#1090", contractName: "Thiết kế UI/UX App", title: "MS#3 — Prototype", amount: "₫12.5M", amountNum: 12500000, status: "submitted", deadline: "10/02", submittedAt: new Date(Date.now() - 8 * 3600000).toISOString(), counterparty: "Trần Minh", },
  { id: 4, contractId: "#1090", contractName: "Thiết kế UI/UX App", title: "MS#4 — Handoff", amount: "₫25M", amountNum: 25000000, status: "in_progress", deadline: "28/02", counterparty: "Trần Minh", },
  { id: 5, contractId: "#1092", contractName: "Backend API", title: "MS#1 — Database Schema", amount: "₫25M", amountNum: 25000000, status: "released", deadline: "05/01", counterparty: "Lê Hoàng", },
  { id: 6, contractId: "#1092", contractName: "Backend API", title: "MS#2 — Auth Module", amount: "₫25M", amountNum: 25000000, status: "revision_requested", deadline: "20/01", revisionNote: "API response chưa đúng format, cần bổ sung validation cho email và phone.", counterparty: "Lê Hoàng", },
  { id: 7, contractId: "#1092", contractName: "Backend API", title: "MS#3 — Payment Integration", amount: "₫25M", amountNum: 25000000, status: "awaiting_escrow", deadline: "10/02", counterparty: "Lê Hoàng", },
  { id: 8, contractId: "#1092", contractName: "Backend API", title: "MS#4 — Deployment", amount: "₫25M", amountNum: 25000000, status: "awaiting_escrow", deadline: "28/02", counterparty: "Lê Hoàng", },
  { id: 9, contractId: "#1088", contractName: "Nội dung SEO", title: "MS#5 — Bài viết blog", amount: "₫4M", amountNum: 4000000, status: "disputed", deadline: "15/01", counterparty: "Nguyễn Lan", },
  { id: 10, contractId: "#1095", contractName: "Branding Package", title: "MS#1 — Concept", amount: "₫8M", amountNum: 8000000, status: "accepted", deadline: "12/02", counterparty: "Võ Anh", },
];

const statusFilters: { value: MilestoneStatus | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "awaiting_escrow", label: "Chờ Escrow" },
  { value: "in_progress", label: "Đang làm" },
  { value: "submitted", label: "Chờ nghiệm thu" },
  { value: "revision_requested", label: "Chỉnh sửa" },
  { value: "accepted", label: "Chờ giải ngân" },
  { value: "released", label: "Đã giải ngân" },
  { value: "disputed", label: "Tranh chấp" },
];

const Milestones = () => {
  const [role, setRole] = useState<UserRole>(() =>
    (localStorage.getItem("dashboard_role") as UserRole) || "contractor"
  );
  const [filter, setFilter] = useState<MilestoneStatus | "all">("all");

  useEffect(() => { localStorage.setItem("dashboard_role", role); }, [role]);

  const filtered = useMemo(() => {
    if (filter === "all") return mockMilestones;
    return mockMilestones.filter((m) => m.status === filter);
  }, [filter]);

  const totalValue = mockMilestones.reduce((s, m) => s + m.amountNum, 0);
  const releasedValue = mockMilestones.filter((m) => m.status === "released").reduce((s, m) => s + m.amountNum, 0);
  const progressPct = Math.round((releasedValue / totalValue) * 100);

  const statusCounts = useMemo(() => {
    const counts: Partial<Record<MilestoneStatus, number>> = {};
    mockMilestones.forEach((m) => { counts[m.status] = (counts[m.status] || 0) + 1; });
    return counts;
  }, []);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Milestone</h1>
          <p className="text-sm text-muted-foreground mt-1">Quản lý tiến độ và nghiệm thu theo milestone</p>
        </div>
        <RoleSwitcher role={role} onRoleChange={setRole} />
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MilestoneIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng milestone</p>
                <p className="text-xl font-bold text-foreground">{mockMilestones.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đã giải ngân</p>
                <p className="text-xl font-bold text-foreground">₫{(releasedValue / 1e6).toFixed(0)}M <span className="text-sm font-normal text-muted-foreground">/ ₫{(totalValue / 1e6).toFixed(0)}M</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Tiến độ dự án</p>
              <span className="text-sm font-semibold text-foreground">{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-2.5" />
            <p className="text-xs text-muted-foreground">Dựa trên giá trị milestone đã giải ngân</p>
          </CardContent>
        </Card>
      </div>

      {/* Status filter pills */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        {statusFilters.map((sf) => {
          const count = sf.value === "all" ? mockMilestones.length : (statusCounts[sf.value] || 0);
          return (
            <button
              key={sf.value}
              onClick={() => setFilter(sf.value)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                filter === sf.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {sf.label}
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] min-w-[18px] text-center",
                filter === sf.value ? "bg-primary-foreground/20" : "bg-background"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Milestone cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${role}-${filter}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Không có milestone nào ở trạng thái này.</p>
            </div>
          ) : (
            filtered.map((ms) => (
              <MilestoneCard key={ms.id} milestone={ms} role={role} />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Milestones;
