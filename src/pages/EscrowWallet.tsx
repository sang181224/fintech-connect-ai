import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RoleSwitcher, UserRole } from "@/components/dashboard/RoleSwitcher";
import {
  Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown,
  AlertTriangle, Clock, CheckCircle2, Shield, Plus, Send,
  Download, Filter, Search, ChevronRight, Eye, Ban,
  ArrowUpDown, Info, RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────
type TransactionType = "deposit" | "release" | "refund" | "hold" | "withdraw";
type TransactionStatus = "completed" | "pending" | "failed";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  contractCode: string;
  contractName: string;
  milestone?: string;
  status: TransactionStatus;
  description: string;
}

// ─── Mock Data ──────────────────────────────────────────────────
const cashFlowData = [
  { month: "T1", deposit: 45000000, release: 22000000, balance: 23000000 },
  { month: "T2", deposit: 30000000, release: 35000000, balance: 18000000 },
  { month: "T3", deposit: 60000000, release: 28000000, balance: 50000000 },
  { month: "T4", deposit: 25000000, release: 40000000, balance: 35000000 },
  { month: "T5", deposit: 55000000, release: 32000000, balance: 58000000 },
  { month: "T6", deposit: 40000000, release: 45000000, balance: 53000000 },
];

const weeklyData = [
  { day: "T2", inflow: 12000000, outflow: 5000000 },
  { day: "T3", inflow: 8000000, outflow: 15000000 },
  { day: "T4", inflow: 20000000, outflow: 10000000 },
  { day: "T5", inflow: 5000000, outflow: 8000000 },
  { day: "T6", inflow: 15000000, outflow: 12000000 },
  { day: "T7", inflow: 0, outflow: 3000000 },
  { day: "CN", inflow: 0, outflow: 0 },
];

const contractorTransactions: Transaction[] = [
  { id: "TXN001", type: "deposit", amount: 25000000, date: "2025-01-08 14:30", contractCode: "HD-1092", contractName: "Thiết kế UI/UX", status: "completed", description: "Nạp escrow cho MS #3" },
  { id: "TXN002", type: "release", amount: 15000000, date: "2025-01-07 10:15", contractCode: "HD-1088", contractName: "Backend API", milestone: "MS #2", status: "completed", description: "Giải ngân milestone #2" },
  { id: "TXN003", type: "hold", amount: 20000000, date: "2025-01-06 09:00", contractCode: "HD-1095", contractName: "SEO Content", status: "pending", description: "Đang giữ cho MS #1" },
  { id: "TXN004", type: "deposit", amount: 30000000, date: "2025-01-05 16:45", contractCode: "HD-1092", contractName: "Thiết kế UI/UX", status: "completed", description: "Nạp escrow cho MS #4, #5" },
  { id: "TXN005", type: "release", amount: 10000000, date: "2025-01-04 11:20", contractCode: "HD-1088", contractName: "Backend API", milestone: "MS #1", status: "completed", description: "Giải ngân milestone #1" },
  { id: "TXN006", type: "refund", amount: 5000000, date: "2025-01-03 08:30", contractCode: "HD-1085", contractName: "Mobile App", status: "completed", description: "Hoàn tiền – hợp đồng hủy" },
  { id: "TXN007", type: "deposit", amount: 18000000, date: "2025-01-02 13:00", contractCode: "HD-1095", contractName: "SEO Content", status: "failed", description: "Nạp escrow thất bại – lỗi ngân hàng" },
];

const freelancerTransactions: Transaction[] = [
  { id: "TXN101", type: "release", amount: 15000000, date: "2025-01-07 10:15", contractCode: "HD-1088", contractName: "Backend API", milestone: "MS #2", status: "completed", description: "Nhận tiền milestone #2" },
  { id: "TXN102", type: "release", amount: 10000000, date: "2025-01-04 11:20", contractCode: "HD-1088", contractName: "Backend API", milestone: "MS #1", status: "completed", description: "Nhận tiền milestone #1" },
  { id: "TXN103", type: "hold", amount: 20000000, date: "2025-01-06 09:00", contractCode: "HD-1092", contractName: "Thiết kế UI/UX", status: "pending", description: "Đang chờ nghiệm thu MS #3" },
  { id: "TXN104", type: "withdraw", amount: 22000000, date: "2025-01-05 15:00", contractCode: "-", contractName: "Rút về tài khoản", status: "completed", description: "Rút về VCB ****6789" },
  { id: "TXN105", type: "release", amount: 8000000, date: "2025-01-03 09:30", contractCode: "HD-1085", contractName: "Mobile App", milestone: "MS #1", status: "completed", description: "Nhận tiền milestone #1" },
  { id: "TXN106", type: "withdraw", amount: 15000000, date: "2025-01-01 10:00", contractCode: "-", contractName: "Rút về tài khoản", status: "pending", description: "Đang xử lý rút tiền" },
];

const chartConfig = {
  deposit: { label: "Nạp vào", color: "hsl(var(--primary))" },
  release: { label: "Giải ngân", color: "hsl(var(--success))" },
  balance: { label: "Số dư", color: "hsl(var(--accent))" },
  inflow: { label: "Tiền vào", color: "hsl(var(--success))" },
  outflow: { label: "Tiền ra", color: "hsl(var(--destructive))" },
};

// ─── Helpers ────────────────────────────────────────────────────
function formatCurrency(n: number) {
  if (n >= 1_000_000) return `₫${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₫${(n / 1_000).toFixed(0)}K`;
  return `₫${n}`;
}

function formatFullCurrency(n: number) {
  return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
}

const txTypeConfig: Record<TransactionType, { label: string; icon: typeof ArrowUpRight; color: string; bg: string }> = {
  deposit: { label: "Nạp tiền", icon: ArrowDownLeft, color: "text-primary", bg: "bg-primary/10" },
  release: { label: "Giải ngân", icon: ArrowUpRight, color: "text-success", bg: "bg-success/10" },
  refund: { label: "Hoàn tiền", icon: RefreshCw, color: "text-accent", bg: "bg-accent/10" },
  hold: { label: "Đang giữ", icon: Shield, color: "text-warning", bg: "bg-warning/10" },
  withdraw: { label: "Rút tiền", icon: Send, color: "text-muted-foreground", bg: "bg-muted" },
};

const txStatusConfig: Record<TransactionStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  completed: { label: "Hoàn thành", variant: "default" },
  pending: { label: "Đang xử lý", variant: "secondary" },
  failed: { label: "Thất bại", variant: "destructive" },
};

// ─── Component ──────────────────────────────────────────────────
export default function EscrowWallet() {
  const [role, setRole] = useState<UserRole>(() =>
    (localStorage.getItem("dashboard_role") as UserRole) || "contractor"
  );
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);

  useEffect(() => {
    localStorage.setItem("dashboard_role", role);
  }, [role]);

  const isContractor = role === "contractor";
  const transactions = isContractor ? contractorTransactions : freelancerTransactions;

  const filteredTx = transactions.filter((tx) => {
    const matchType = filterType === "all" || tx.type === filterType;
    const matchSearch =
      searchQuery === "" ||
      tx.contractName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.contractCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  // Stats
  const contractorWallet = {
    balance: 58500000,
    held: 45000000,
    released: 124000000,
    pendingDeposit: 18000000,
    lowBalanceThreshold: 20000000,
  };

  const freelancerWallet = {
    available: 33000000,
    pending: 20000000,
    totalEarned: 86000000,
    withdrawn: 53000000,
    lowBalanceThreshold: 5000000,
  };

  const walletData = isContractor ? contractorWallet : freelancerWallet;
  const showLowBalanceAlert = isContractor
    ? contractorWallet.balance < contractorWallet.lowBalanceThreshold
    : freelancerWallet.available < freelancerWallet.lowBalanceThreshold;

  const handleDeposit = () => {
    setLoadingDeposit(true);
    setTimeout(() => {
      setLoadingDeposit(false);
      setDepositOpen(false);
      setDepositAmount("");
    }, 1500);
  };

  const handleWithdraw = () => {
    setLoadingWithdraw(true);
    setTimeout(() => {
      setLoadingWithdraw(false);
      setWithdrawOpen(false);
      setWithdrawAmount("");
    }, 1500);
  };

  const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35 },
  };

  const statsCards = isContractor
    ? [
        { label: "Số dư Escrow", value: formatCurrency(contractorWallet.balance), icon: Wallet, color: "text-primary", bg: "bg-primary/10", sub: "Tổng tiền trong ví" },
        { label: "Đang giữ", value: formatCurrency(contractorWallet.held), icon: Shield, color: "text-warning", bg: "bg-warning/10", sub: "Cho milestone đang xử lý" },
        { label: "Đã giải ngân", value: formatCurrency(contractorWallet.released), icon: ArrowUpRight, color: "text-success", bg: "bg-success/10", sub: "+18% so với tháng trước" },
        { label: "Chờ nạp", value: formatCurrency(contractorWallet.pendingDeposit), icon: Clock, color: "text-destructive", bg: "bg-destructive/10", sub: "1 giao dịch thất bại" },
      ]
    : [
        { label: "Khả dụng", value: formatCurrency(freelancerWallet.available), icon: Wallet, color: "text-success", bg: "bg-success/10", sub: "Có thể rút ngay" },
        { label: "Chờ nghiệm thu", value: formatCurrency(freelancerWallet.pending), icon: Clock, color: "text-warning", bg: "bg-warning/10", sub: "Đang chờ duyệt" },
        { label: "Tổng thu nhập", value: formatCurrency(freelancerWallet.totalEarned), icon: TrendingUp, color: "text-primary", bg: "bg-primary/10", sub: "Từ khi tham gia" },
        { label: "Đã rút", value: formatCurrency(freelancerWallet.withdrawn), icon: Send, color: "text-muted-foreground", bg: "bg-muted", sub: "Về tài khoản ngân hàng" },
      ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-heading">Ví Escrow</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isContractor ? "Quản lý quỹ escrow cho các hợp đồng" : "Theo dõi thu nhập và rút tiền"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <RoleSwitcher role={role} onRoleChange={setRole} />
            {isContractor ? (
              <Button onClick={() => setDepositOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" /> Nạp tiền
              </Button>
            ) : (
              <Button onClick={() => setWithdrawOpen(true)} variant="default" className="gap-2">
                <Send className="h-4 w-4" /> Rút tiền
              </Button>
            )}
          </div>
        </div>

        {/* Low Balance Alert */}
        <AnimatePresence>
          {showLowBalanceAlert && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-destructive">Cảnh báo số dư thấp</p>
                    <p className="text-xs text-muted-foreground">
                      {isContractor
                        ? "Số dư escrow dưới ngưỡng ₫20M. Nạp thêm để đảm bảo các milestone không bị gián đoạn."
                        : "Số dư khả dụng dưới ngưỡng ₫5M. Hãy kiểm tra các milestone đang chờ nghiệm thu."}
                    </p>
                  </div>
                  {isContractor && (
                    <Button size="sm" variant="destructive" onClick={() => setDepositOpen(true)} className="gap-1 shrink-0">
                      <Plus className="h-3.5 w-3.5" /> Nạp ngay
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.06 } } }}
          >
            {statsCards.map((stat, i) => (
              <motion.div key={stat.label} variants={fadeUp}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.sub}</p>
                      </div>
                      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.bg)}>
                        <stat.icon className={cn("h-5 w-5", stat.color)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Cash Flow Chart */}
          <motion.div {...fadeUp}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Dòng tiền 6 tháng</CardTitle>
                <CardDescription>
                  {isContractor ? "Tiền nạp vs giải ngân" : "Thu nhập vs rút tiền"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[260px] w-full">
                  <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradDeposit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradRelease" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatFullCurrency(value as number)} />} />
                    <Area type="monotone" dataKey="deposit" stroke="hsl(var(--primary))" fill="url(#gradDeposit)" strokeWidth={2} />
                    <Area type="monotone" dataKey="release" stroke="hsl(var(--success))" fill="url(#gradRelease)" strokeWidth={2} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Bar Chart */}
          <motion.div {...fadeUp}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Dòng tiền tuần này</CardTitle>
                <CardDescription>Tiền vào và tiền ra theo ngày</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[260px] w-full">
                  <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="day" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatFullCurrency(value as number)} />} />
                    <Bar dataKey="inflow" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="outflow" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Escrow Allocation (Contractor only) */}
        {isContractor && (
          <motion.div {...fadeUp}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Phân bổ Escrow theo hợp đồng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "HD-1092 – Thiết kế UI/UX", held: 25000000, total: 50000000, released: 15000000 },
                    { name: "HD-1088 – Backend API", held: 10000000, total: 40000000, released: 25000000 },
                    { name: "HD-1095 – SEO Content", held: 20000000, total: 30000000, released: 0 },
                  ].map((contract) => {
                    const pct = Math.round(((contract.released + contract.held) / contract.total) * 100);
                    return (
                      <div key={contract.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">{contract.name}</span>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3 text-warning" />
                              Giữ: {formatCurrency(contract.held)}
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-success" />
                              Giải ngân: {formatCurrency(contract.released)}
                            </span>
                          </div>
                        </div>
                        <div className="relative">
                          <Progress value={pct} className="h-2" />
                          <span className="absolute right-0 -top-5 text-[10px] text-muted-foreground">{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Transaction History */}
        <motion.div {...fadeUp}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">Lịch sử giao dịch</CardTitle>
                  <CardDescription>{filteredTx.length} giao dịch</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-9 w-[180px] text-sm"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="h-9 w-[140px] text-sm">
                      <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="deposit">Nạp tiền</SelectItem>
                      <SelectItem value="release">Giải ngân</SelectItem>
                      <SelectItem value="hold">Đang giữ</SelectItem>
                      <SelectItem value="refund">Hoàn tiền</SelectItem>
                      {!isContractor && <SelectItem value="withdraw">Rút tiền</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[100px]">Loại</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead className="hidden md:table-cell">Hợp đồng</TableHead>
                    <TableHead className="text-right">Số tiền</TableHead>
                    <TableHead className="hidden sm:table-cell">Trạng thái</TableHead>
                    <TableHead className="hidden lg:table-cell text-right">Thời gian</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTx.map((tx) => {
                    const typeConf = txTypeConfig[tx.type];
                    const statusConf = txStatusConfig[tx.status];
                    const Icon = typeConf.icon;
                    const isInflow = tx.type === "deposit" || tx.type === "release" || tx.type === "refund";
                    return (
                      <TableRow key={tx.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", typeConf.bg)}>
                              <Icon className={cn("h-4 w-4", typeConf.color)} />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground hidden sm:inline">{typeConf.label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium text-foreground">{tx.description}</p>
                          {tx.milestone && (
                            <p className="text-xs text-muted-foreground">{tx.milestone}</p>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-xs font-mono text-muted-foreground">{tx.contractCode}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={cn("text-sm font-semibold tabular-nums",
                            isInflow && role === "freelancer" ? "text-success" : isInflow && role === "contractor" ? "text-primary" : "text-foreground"
                          )}>
                            {isInflow ? "+" : "-"}{formatCurrency(tx.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant={statusConf.variant} className="text-[10px]">
                            {statusConf.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-right">
                          <span className="text-xs text-muted-foreground">{tx.date}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredTx.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        Không tìm thấy giao dịch nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Deposit Dialog */}
      <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nạp tiền vào Escrow</DialogTitle>
            <DialogDescription>Chọn hợp đồng và nhập số tiền cần nạp</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Hợp đồng</label>
              <Select defaultValue="HD-1092">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HD-1092">HD-1092 – Thiết kế UI/UX</SelectItem>
                  <SelectItem value="HD-1088">HD-1088 – Backend API</SelectItem>
                  <SelectItem value="HD-1095">HD-1095 – SEO Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Số tiền (VNĐ)</label>
              <Input
                type="number"
                placeholder="Nhập số tiền..."
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <div className="flex gap-2">
                {[5000000, 10000000, 20000000, 50000000].map((amt) => (
                  <Button key={amt} variant="outline" size="sm" className="text-xs flex-1"
                    onClick={() => setDepositAmount(String(amt))}>
                    {formatCurrency(amt)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Phí giao dịch</span>
                <span>Miễn phí</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-foreground">
                <span>Tổng nạp</span>
                <span>{depositAmount ? formatFullCurrency(Number(depositAmount)) : "—"}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDepositOpen(false)}>Hủy</Button>
            <Button onClick={handleDeposit} disabled={!depositAmount || loadingDeposit}>
              {loadingDeposit ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" /> Đang xử lý...
                </span>
              ) : (
                "Xác nhận nạp tiền"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rút tiền về tài khoản</DialogTitle>
            <DialogDescription>
              Số dư khả dụng: <span className="font-semibold text-success">{formatFullCurrency(freelancerWallet.available)}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tài khoản ngân hàng</label>
              <Select defaultValue="vcb">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vcb">Vietcombank ****6789</SelectItem>
                  <SelectItem value="tcb">Techcombank ****1234</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Số tiền rút (VNĐ)</label>
              <Input
                type="number"
                placeholder="Nhập số tiền..."
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <Button variant="outline" size="sm" className="text-xs"
                onClick={() => setWithdrawAmount(String(freelancerWallet.available))}>
                Rút toàn bộ
              </Button>
            </div>
            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Phí rút tiền</span>
                <span>Miễn phí</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Thời gian xử lý</span>
                <span>1-2 ngày làm việc</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-foreground pt-1 border-t border-border">
                <span>Thực nhận</span>
                <span>{withdrawAmount ? formatFullCurrency(Number(withdrawAmount)) : "—"}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawOpen(false)}>Hủy</Button>
            <Button onClick={handleWithdraw} disabled={!withdrawAmount || loadingWithdraw || Number(withdrawAmount) > freelancerWallet.available}>
              {loadingWithdraw ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" /> Đang xử lý...
                </span>
              ) : (
                "Xác nhận rút tiền"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
