import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RoleSwitcher, UserRole } from "@/components/dashboard/RoleSwitcher";
import {
  Briefcase, Wallet, FileCheck, TrendingUp, Plus, Clock, CheckCircle2,
  AlertCircle, ArrowUpRight, ChevronRight, Send, Edit3, DollarSign,
  Hammer, Hourglass, BadgeCheck, ArrowDownToLine,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";

// ─── Mock Data: Contractor ─────────────────────────────────────
const contractorStats = [
  { label: "Hợp đồng hoạt động", value: "6", change: "+1 tuần này", icon: Briefcase, color: "text-primary", bgColor: "bg-primary/10" },
  { label: "Milestone chờ nghiệm thu", value: "4", change: "Cần xử lý", icon: Hourglass, color: "text-destructive", bgColor: "bg-destructive/10" },
  { label: "Tiền giữ Escrow", value: "₫58.5M", change: "+₫12M", icon: Wallet, color: "text-accent", bgColor: "bg-accent/10" },
  { label: "Đã giải ngân", value: "₫124M", change: "+18% tháng này", icon: TrendingUp, color: "text-accent", bgColor: "bg-accent/10" },
];

const contractorActions = [
  { title: "3 milestone chờ bạn duyệt", desc: "Dự án UI/UX, Backend API, Branding", icon: FileCheck, type: "warning" as const },
  { title: "Nạp thêm ₫15M vào escrow", desc: "Hợp đồng #1092 sắp thiếu quỹ", icon: Wallet, type: "error" as const },
  { title: "1 tranh chấp cần phản hồi", desc: "Hợp đồng #1088 — Freelancer khiếu nại", icon: AlertCircle, type: "error" as const },
];

const contractorContracts = [
  { id: 1, name: "Thiết kế UI/UX App", freelancer: "Trần Minh", total: "₫62.5M", released: "₫37.5M", progress: 60, milestones: "3/5", status: "active" },
  { id: 2, name: "Phát triển Backend API", freelancer: "Lê Hoàng", total: "₫100M", released: "₫25M", progress: 25, milestones: "1/4", status: "active" },
  { id: 3, name: "Viết nội dung SEO", freelancer: "Nguyễn Lan", total: "₫20M", released: "₫18M", progress: 90, milestones: "4/5", status: "review" },
  { id: 4, name: "Thiết kế logo thương hiệu", freelancer: "Võ Anh", total: "₫15M", released: "₫15M", progress: 100, milestones: "3/3", status: "completed" },
];

// ─── Mock Data: Freelancer ─────────────────────────────────────
const freelancerStats = [
  { label: "Hợp đồng đang làm", value: "4", change: "+1 mới", icon: Briefcase, color: "text-primary", bgColor: "bg-primary/10" },
  { label: "Milestone đang làm", value: "3", change: "Đang thực hiện", icon: Hammer, color: "text-primary", bgColor: "bg-primary/10" },
  { label: "Chờ nghiệm thu", value: "2", change: "Đã gửi", icon: Hourglass, color: "text-destructive", bgColor: "bg-destructive/10" },
  { label: "Thu nhập đã nhận", value: "₫86M", change: "+₫22M tháng này", icon: DollarSign, color: "text-accent", bgColor: "bg-accent/10" },
];

const freelancerActions = [
  { title: "2 milestone cần gửi nghiệm thu", desc: "UI/UX App (MS#4), Backend API (MS#2)", icon: Send, type: "warning" as const },
  { title: "1 milestone bị yêu cầu chỉnh sửa", desc: "Nội dung SEO – MS#5 cần bổ sung", icon: Edit3, type: "error" as const },
  { title: "₫22M vừa được giải ngân", desc: "Hợp đồng #1089 – Milestone #3", icon: BadgeCheck, type: "success" as const },
];

const freelancerContracts = [
  { id: 1, name: "Thiết kế UI/UX App", client: "Công ty ABC", total: "₫62.5M", earned: "₫37.5M", progress: 60, current: "MS #4 — Prototype", status: "active" },
  { id: 2, name: "Phát triển Backend API", client: "Startup XYZ", total: "₫100M", earned: "₫25M", progress: 25, current: "MS #2 — Auth Module", status: "active" },
  { id: 3, name: "Viết nội dung SEO", client: "Shop Online", total: "₫20M", earned: "₫18M", progress: 90, current: "MS #5 — Chỉnh sửa", status: "review" },
  { id: 4, name: "Thiết kế logo", client: "Brand Corp", total: "₫15M", earned: "₫15M", progress: 100, current: "Hoàn thành", status: "completed" },
];

// ─── Timeline Events ───────────────────────────────────────────
const timelineEvents = [
  { id: 1, text: "Trần Minh gửi nghiệm thu MS#3 — UI/UX App", time: "10 phút trước", icon: Send, color: "text-primary" },
  { id: 2, text: "Bạn chấp nhận MS#2 — Backend API", time: "2 giờ trước", icon: CheckCircle2, color: "text-accent" },
  { id: 3, text: "Giải ngân ₫25M cho Lê Hoàng", time: "2 giờ trước", icon: ArrowDownToLine, color: "text-accent" },
  { id: 4, text: "Hợp đồng #1092 được tạo mới", time: "Hôm qua", icon: FileCheck, color: "text-primary" },
  { id: 5, text: "Nguyễn Lan gửi lại MS#5 sau chỉnh sửa", time: "Hôm qua", icon: Edit3, color: "text-destructive" },
];

// ─── Status Config ─────────────────────────────────────────────
const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Đang chạy", variant: "default" },
  review: { label: "Chờ nghiệm thu", variant: "secondary" },
  completed: { label: "Hoàn thành", variant: "outline" },
};

const actionTypeStyles: Record<string, string> = {
  warning: "border-l-4 border-l-yellow-400 bg-yellow-50/50",
  error: "border-l-4 border-l-destructive bg-destructive/5",
  success: "border-l-4 border-l-accent bg-accent/5",
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: "easeOut" as const },
  }),
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem("dashboard_role") as UserRole) || "contractor";
  });

  useEffect(() => {
    localStorage.setItem("dashboard_role", role);
  }, [role]);

  const stats = role === "contractor" ? contractorStats : freelancerStats;
  const actions = role === "contractor" ? contractorActions : freelancerActions;
  const contracts = role === "contractor" ? contractorContracts : freelancerContracts;

  return (
    <DashboardLayout>
      {/* Header with role switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Tổng quan</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Xin chào, <span className="font-medium text-foreground">Nguyễn Tuấn</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RoleSwitcher role={role} onRoleChange={setRole} />
          {role === "contractor" && (
            <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Đăng dự án</span>
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <ArrowUpRight className="h-3 w-3 text-accent" />
                          {stat.change}
                        </p>
                      </div>
                      <div className={`h-10 w-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Action items — highlighted */}
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Cần xử lý
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {actions.map((a, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-4 rounded-lg p-3 cursor-pointer hover:shadow-sm transition-all ${actionTypeStyles[a.type]}`}
                  >
                    <div className="h-9 w-9 rounded-lg bg-card flex items-center justify-center shadow-sm shrink-0">
                      <a.icon className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main grid: Contracts + Timeline */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Contracts table */}
            <div className="xl:col-span-2">
              <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Danh sách hợp đồng
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-primary gap-1">
                        Xem tất cả <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Hợp đồng</TableHead>
                          <TableHead className="hidden md:table-cell">
                            {role === "contractor" ? "Freelancer" : "Khách hàng"}
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">Giá trị</TableHead>
                          <TableHead>Tiến độ giải ngân</TableHead>
                          <TableHead className="hidden lg:table-cell">
                            {role === "contractor" ? "Milestone" : "Giai đoạn hiện tại"}
                          </TableHead>
                          <TableHead>Trạng thái</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contracts.map((c: any) => (
                          <TableRow key={c.id} className="cursor-pointer">
                            <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground">
                              {c.freelancer || c.client}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <div>
                                <span className="font-semibold text-foreground">{c.released || c.earned}</span>
                                <span className="text-muted-foreground text-xs"> / {c.total}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2 min-w-[100px]">
                                <Progress value={c.progress} className="h-2 flex-1" />
                                <span className="text-xs font-medium text-muted-foreground w-8">{c.progress}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                              {c.milestones || c.current}
                            </TableCell>
                            <TableCell>
                              <Badge variant={statusConfig[c.status]?.variant || "outline"}>
                                {statusConfig[c.status]?.label || c.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Activity Timeline */}
            <div>
              <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Dòng thời gian
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-0">
                    {timelineEvents.map((e, i) => (
                      <div key={e.id} className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
                        <div className="flex flex-col items-center mt-0.5">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <e.icon className={`h-4 w-4 ${e.color}`} />
                          </div>
                          {i < timelineEvents.length - 1 && (
                            <div className="w-px h-full min-h-[12px] bg-border/60 mt-1" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">{e.text}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{e.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Dashboard;
