import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import {
  Briefcase,
  Wallet,
  FileCheck,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ChevronRight,
  Bell,
  BarChart3,
  Users,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

// --- Mock Data ---
const stats = [
  {
    label: "Dự án đang chạy",
    value: "8",
    change: "+2 tuần này",
    icon: Briefcase,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Tiền Escrow",
    value: "$12,450",
    change: "+$3,200",
    icon: Wallet,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    label: "Hợp đồng chờ duyệt",
    value: "3",
    change: "Cần xử lý",
    icon: FileCheck,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    label: "Tổng chi tiêu",
    value: "$45,800",
    change: "+12% so tháng trước",
    icon: TrendingUp,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

const recentProjects = [
  {
    id: 1,
    name: "Thiết kế UI/UX App Mobile",
    freelancer: "Trần Minh",
    budget: "$2,500",
    status: "active",
    progress: 65,
    deadline: "15/03/2026",
  },
  {
    id: 2,
    name: "Phát triển Backend API",
    freelancer: "Lê Hoàng",
    budget: "$4,000",
    status: "active",
    progress: 40,
    deadline: "01/04/2026",
  },
  {
    id: 3,
    name: "Viết nội dung SEO",
    freelancer: "Nguyễn Lan",
    budget: "$800",
    status: "review",
    progress: 90,
    deadline: "10/03/2026",
  },
  {
    id: 4,
    name: "Tối ưu hiệu suất web",
    freelancer: "Phạm Đức",
    budget: "$1,200",
    status: "pending",
    progress: 0,
    deadline: "20/03/2026",
  },
  {
    id: 5,
    name: "Thiết kế logo thương hiệu",
    freelancer: "Võ Anh",
    budget: "$600",
    status: "completed",
    progress: 100,
    deadline: "28/02/2026",
  },
];

const contractTimeline = [
  { id: 1, title: "Hợp đồng #1089 – UI/UX App", stage: "Đang thực hiện", stageType: "active" },
  { id: 2, title: "Hợp đồng #1090 – Backend API", stage: "Chờ ký", stageType: "pending" },
  { id: 3, title: "Hợp đồng #1091 – Nội dung SEO", stage: "Chờ nghiệm thu", stageType: "review" },
  { id: 4, title: "Hợp đồng #1088 – Branding", stage: "Hoàn thành", stageType: "completed" },
];

const notifications = [
  { id: 1, text: "Freelancer Trần Minh gửi deliverable mới", time: "5 phút trước", type: "info" },
  { id: 2, text: "Hợp đồng #1090 cần bạn ký xác nhận", time: "30 phút trước", type: "warning" },
  { id: 3, text: "Thanh toán $800 cho dự án SEO đã hoàn tất", time: "2 giờ trước", type: "success" },
  { id: 4, text: "AI đề xuất 3 freelancer phù hợp cho dự án mới", time: "4 giờ trước", type: "info" },
];

// Mini bar chart data
const weeklySpend = [30, 55, 40, 70, 45, 80, 60];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Đang chạy", variant: "default" },
  review: { label: "Chờ duyệt", variant: "secondary" },
  pending: { label: "Chờ bắt đầu", variant: "outline" },
  completed: { label: "Hoàn thành", variant: "secondary" },
};

const stageIcon: Record<string, JSX.Element> = {
  active: <Clock className="h-4 w-4 text-primary" />,
  pending: <AlertCircle className="h-4 w-4 text-destructive" />,
  review: <FileCheck className="h-4 w-4 text-accent" />,
  completed: <CheckCircle2 className="h-4 w-4 text-accent" />,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" as const },
  }),
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Xin chào, <span className="font-medium text-foreground">Nguyễn Tuấn</span> — Tổng quan dự án & tài chính của bạn.
            </p>
          </div>
          <Button variant="hero" size="lg" className="gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" />
            Đăng dự án mới
          </Button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
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

        {/* Main content grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Projects table + mini chart */}
          <div className="xl:col-span-2 space-y-6">
            {/* Recent Projects */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Dự án gần đây
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
                        <TableHead>Dự án</TableHead>
                        <TableHead className="hidden md:table-cell">Freelancer</TableHead>
                        <TableHead className="hidden sm:table-cell">Ngân sách</TableHead>
                        <TableHead>Tiến độ</TableHead>
                        <TableHead className="hidden lg:table-cell">Deadline</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentProjects.map((p) => (
                        <TableRow key={p.id} className="cursor-pointer">
                          <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">{p.freelancer}</TableCell>
                          <TableCell className="hidden sm:table-cell font-semibold">{p.budget}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-primary transition-all"
                                  style={{ width: `${p.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{p.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">{p.deadline}</TableCell>
                          <TableCell>
                            <Badge variant={statusConfig[p.status]?.variant || "outline"}>
                              {statusConfig[p.status]?.label || p.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mini spend chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-accent" />
                      Chi tiêu 7 ngày qua
                    </CardTitle>
                    <span className="text-sm font-semibold text-foreground">$4,280</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 h-24">
                    {weeklySpend.map((val, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-md bg-primary/20 relative overflow-hidden"
                          style={{ height: `${val}%` }}
                        >
                          <div
                            className="absolute bottom-0 w-full rounded-md bg-primary transition-all"
                            style={{ height: "100%" }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Contract timeline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-primary" />
                    Trạng thái hợp đồng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-0">
                  {contractTimeline.map((c, i) => (
                    <div key={c.id} className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center mt-0.5">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          {stageIcon[c.stageType]}
                        </div>
                        {i < contractTimeline.length - 1 && (
                          <div className="w-px h-full min-h-[16px] bg-border/60 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{c.stage}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Thông báo
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary text-xs">
                      Xem tất cả
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-0">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0 hover:bg-muted/30 -mx-6 px-6 transition-colors cursor-pointer"
                    >
                      <div className="mt-0.5">
                        {n.type === "warning" ? (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        ) : n.type === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-accent" />
                        ) : (
                          <Bell className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{n.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick stats mini */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="bg-[image:var(--gradient-primary)] text-primary-foreground">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Freelancer đã hợp tác</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Tiết kiệm qua AI</p>
                      <p className="text-2xl font-bold">$3,200</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
