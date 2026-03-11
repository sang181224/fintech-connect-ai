import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RoleSwitcher, UserRole } from "@/components/dashboard/RoleSwitcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Search, Briefcase, SlidersHorizontal, ArrowUpDown, Plus,
  CalendarDays, DollarSign, ChevronRight, AlertTriangle, CheckCircle2,
  Pause, FileText,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────
type ContractStatus = "active" | "completed" | "paused" | "disputed";
type SortField = "name" | "totalValue" | "createdAt" | "progress";
type SortDir = "asc" | "desc";

interface ContractListItem {
  id: string;
  code: string;
  name: string;
  counterparty: string;
  status: ContractStatus;
  totalValue: number;
  releasedValue: number;
  milestonesDone: number;
  milestonesTotal: number;
  createdAt: string;
  createdAtTs: number;
  deadline: string;
}

// ─── Status config ─────────────────────────────────────
const statusCfg: Record<ContractStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Briefcase }> = {
  active:    { label: "Đang chạy",    variant: "default",     icon: Briefcase },
  completed: { label: "Hoàn thành",   variant: "outline",     icon: CheckCircle2 },
  paused:    { label: "Tạm dừng",     variant: "secondary",   icon: Pause },
  disputed:  { label: "Tranh chấp",   variant: "destructive", icon: AlertTriangle },
};

const statusFilters: { value: string; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Đang chạy" },
  { value: "completed", label: "Hoàn thành" },
  { value: "paused", label: "Tạm dừng" },
  { value: "disputed", label: "Tranh chấp" },
];

// ─── Mock Data ─────────────────────────────────────────
const allContracts: ContractListItem[] = [
  { id: "1", code: "1090", name: "Thiết kế UI/UX App", counterparty: "Trần Minh", status: "active", totalValue: 62500000, releasedValue: 25000000, milestonesDone: 2, milestonesTotal: 4, createdAt: "01/01/2025", createdAtTs: new Date("2025-01-01").getTime(), deadline: "28/02/2025" },
  { id: "2", code: "1092", name: "Phát triển Backend API", counterparty: "Lê Hoàng", status: "active", totalValue: 100000000, releasedValue: 25000000, milestonesDone: 1, milestonesTotal: 4, createdAt: "15/12/2024", createdAtTs: new Date("2024-12-15").getTime(), deadline: "28/02/2025" },
  { id: "3", code: "1088", name: "Viết nội dung SEO", counterparty: "Nguyễn Lan", status: "disputed", totalValue: 20000000, releasedValue: 16000000, milestonesDone: 4, milestonesTotal: 5, createdAt: "10/12/2024", createdAtTs: new Date("2024-12-10").getTime(), deadline: "15/01/2025" },
  { id: "4", code: "1095", name: "Thiết kế logo thương hiệu", counterparty: "Võ Anh", status: "completed", totalValue: 15000000, releasedValue: 15000000, milestonesDone: 3, milestonesTotal: 3, createdAt: "20/11/2024", createdAtTs: new Date("2024-11-20").getTime(), deadline: "20/12/2024" },
  { id: "5", code: "1098", name: "Phát triển Mobile App", counterparty: "Phạm Đức", status: "active", totalValue: 150000000, releasedValue: 50000000, milestonesDone: 2, milestonesTotal: 6, createdAt: "05/01/2025", createdAtTs: new Date("2025-01-05").getTime(), deadline: "30/04/2025" },
  { id: "6", code: "1101", name: "Quản trị hệ thống Cloud", counterparty: "Hoàng Nam", status: "paused", totalValue: 45000000, releasedValue: 15000000, milestonesDone: 1, milestonesTotal: 3, createdAt: "25/12/2024", createdAtTs: new Date("2024-12-25").getTime(), deadline: "25/02/2025" },
  { id: "7", code: "1103", name: "Xây dựng Landing Page", counterparty: "Lê Thảo", status: "completed", totalValue: 18000000, releasedValue: 18000000, milestonesDone: 3, milestonesTotal: 3, createdAt: "01/11/2024", createdAtTs: new Date("2024-11-01").getTime(), deadline: "01/12/2024" },
  { id: "8", code: "1105", name: "Tối ưu hiệu suất DB", counterparty: "Ngô Quang", status: "active", totalValue: 35000000, releasedValue: 10000000, milestonesDone: 1, milestonesTotal: 3, createdAt: "10/01/2025", createdAtTs: new Date("2025-01-10").getTime(), deadline: "10/03/2025" },
  { id: "9", code: "1107", name: "Thiết kế Marketing Kit", counterparty: "Mai Linh", status: "completed", totalValue: 22000000, releasedValue: 22000000, milestonesDone: 4, milestonesTotal: 4, createdAt: "15/10/2024", createdAtTs: new Date("2024-10-15").getTime(), deadline: "15/12/2024" },
  { id: "10", code: "1110", name: "Phát triển Chatbot AI", counterparty: "Trương Hải", status: "active", totalValue: 80000000, releasedValue: 20000000, milestonesDone: 1, milestonesTotal: 4, createdAt: "20/01/2025", createdAtTs: new Date("2025-01-20").getTime(), deadline: "20/04/2025" },
  { id: "11", code: "1112", name: "Kiểm thử bảo mật", counterparty: "Đặng Tuấn", status: "paused", totalValue: 30000000, releasedValue: 0, milestonesDone: 0, milestonesTotal: 2, createdAt: "28/01/2025", createdAtTs: new Date("2025-01-28").getTime(), deadline: "28/03/2025" },
  { id: "12", code: "1115", name: "Viết tài liệu kỹ thuật", counterparty: "Bùi Hà", status: "active", totalValue: 12000000, releasedValue: 6000000, milestonesDone: 2, milestonesTotal: 4, createdAt: "02/02/2025", createdAtTs: new Date("2025-02-02").getTime(), deadline: "02/04/2025" },
];

const ITEMS_PER_PAGE = 6;

const formatCurrency = (v: number) => {
  if (v >= 1_000_000) return `₫${(v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1)}M`;
  return `₫${v.toLocaleString("vi-VN")}`;
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } }),
};

// ─── Component ─────────────────────────────────────────
const Contracts = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(() => (localStorage.getItem("dashboard_role") as UserRole) || "contractor");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  useEffect(() => { localStorage.setItem("dashboard_role", role); }, [role]);
  useEffect(() => { setPage(1); }, [search, statusFilter, sortField, sortDir]);

  const filtered = useMemo(() => {
    let list = [...allContracts];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.counterparty.toLowerCase().includes(q) || c.code.includes(q));
    }
    if (statusFilter !== "all") list = list.filter(c => c.status === statusFilter);

    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name": cmp = a.name.localeCompare(b.name, "vi"); break;
        case "totalValue": cmp = a.totalValue - b.totalValue; break;
        case "createdAt": cmp = a.createdAtTs - b.createdAtTs; break;
        case "progress": cmp = (a.releasedValue / a.totalValue) - (b.releasedValue / b.totalValue); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [search, statusFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Stats
  const totalActive = allContracts.filter(c => c.status === "active").length;
  const totalCompleted = allContracts.filter(c => c.status === "completed").length;
  const totalValue = allContracts.reduce((s, c) => s + c.totalValue, 0);
  const totalReleased = allContracts.reduce((s, c) => s + c.releasedValue, 0);

  const stats = [
    { label: "Tổng hợp đồng", value: allContracts.length.toString(), icon: FileText, color: "text-primary", bgColor: "bg-primary/10" },
    { label: "Đang hoạt động", value: totalActive.toString(), icon: Briefcase, color: "text-accent", bgColor: "bg-accent/10" },
    { label: "Tổng giá trị", value: formatCurrency(totalValue), icon: DollarSign, color: "text-primary", bgColor: "bg-primary/10" },
    { label: "Đã giải ngân", value: formatCurrency(totalReleased), icon: CheckCircle2, color: "text-success", bgColor: "bg-success/10" },
  ];

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Danh sách hợp đồng</h1>
          <p className="text-muted-foreground text-sm mt-1">Quản lý tất cả hợp đồng của bạn</p>
        </div>
        <div className="flex items-center gap-3">
          <RoleSwitcher role={role} onRoleChange={setRole} />
          {role === "contractor" && (
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
              <Plus className="h-4 w-4" /><span className="hidden sm:inline">Tạo hợp đồng</span>
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="hover:shadow-[var(--shadow-card-hover)] transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                  </div>
                  <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", s.bgColor)}>
                    <s.icon className={cn("h-4 w-4", s.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, mã hợp đồng hoặc đối tác..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SlidersHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusFilters.map(f => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortField} onValueChange={v => { setSortField(v as SortField); setSortDir("desc"); }}>
                  <SelectTrigger className="w-[160px]">
                    <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Ngày tạo</SelectItem>
                    <SelectItem value="name">Tên hợp đồng</SelectItem>
                    <SelectItem value="totalValue">Giá trị</SelectItem>
                    <SelectItem value="progress">Tiến độ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status pills */}
            <div className="flex flex-wrap gap-2 mt-3">
              {statusFilters.map(f => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-all border",
                    statusFilter === f.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
                  )}
                >
                  {f.label}
                  {f.value !== "all" && (
                    <span className="ml-1 opacity-70">
                      ({allContracts.filter(c => c.status === f.value).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
        <Card>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Search className="h-10 w-10 mb-3 opacity-40" />
                <p className="font-medium">Không tìm thấy hợp đồng</p>
                <p className="text-sm">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("name")}>
                        <span className="flex items-center gap-1">
                          Hợp đồng
                          {sortField === "name" && <ArrowUpDown className="h-3 w-3" />}
                        </span>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        {role === "contractor" ? "Freelancer" : "Khách hàng"}
                      </TableHead>
                      <TableHead className="hidden sm:table-cell cursor-pointer select-none" onClick={() => toggleSort("totalValue")}>
                        <span className="flex items-center gap-1">
                          Giá trị
                          {sortField === "totalValue" && <ArrowUpDown className="h-3 w-3" />}
                        </span>
                      </TableHead>
                      <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("progress")}>
                        <span className="flex items-center gap-1">
                          Tiến độ
                          {sortField === "progress" && <ArrowUpDown className="h-3 w-3" />}
                        </span>
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">Milestone</TableHead>
                      <TableHead className="hidden lg:table-cell cursor-pointer select-none" onClick={() => toggleSort("createdAt")}>
                        <span className="flex items-center gap-1">
                          Ngày tạo
                          {sortField === "createdAt" && <ArrowUpDown className="h-3 w-3" />}
                        </span>
                      </TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map(c => {
                      const pct = Math.round((c.releasedValue / c.totalValue) * 100);
                      const cfg = statusCfg[c.status];
                      return (
                        <TableRow
                          key={c.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => navigate(`/dashboard/contracts/${c.code}`)}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{c.name}</p>
                              <p className="text-xs text-muted-foreground">#{c.code}</p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">{c.counterparty}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div>
                              <span className="font-semibold text-foreground">{formatCurrency(c.releasedValue)}</span>
                              <span className="text-muted-foreground text-xs"> / {formatCurrency(c.totalValue)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 min-w-[100px]">
                              <Progress value={pct} className="h-2 flex-1" />
                              <span className="text-xs font-medium text-muted-foreground w-8">{pct}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                            {c.milestonesDone}/{c.milestonesTotal}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                            {c.createdAt}
                          </TableCell>
                          <TableCell>
                            <Badge variant={cfg.variant} className="gap-1">
                              <cfg.icon className="h-3 w-3" />
                              {cfg.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-border px-4 py-3">
                    <p className="text-xs text-muted-foreground">
                      Hiển thị {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} / {filtered.length} hợp đồng
                    </p>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className={cn(page === 1 && "pointer-events-none opacity-50")}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                          <PaginationItem key={p}>
                            <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className={cn(page === totalPages && "pointer-events-none opacity-50")}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default Contracts;
