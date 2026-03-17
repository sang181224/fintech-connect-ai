import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RoleSwitcher, UserRole } from "@/components/dashboard/RoleSwitcher";
import { MilestoneCard } from "@/components/dashboard/MilestoneCard";
import {
  MilestoneData,
  MilestoneStatus,
  milestoneStatusConfig,
} from "@/types/milestone";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Wallet,
  TrendingUp,
  Clock,
  User,
  CalendarDays,
  Send,
  CheckCircle2,
  Edit3,
  AlertTriangle,
  ArrowDownToLine,
  FileCheck,
  Plus,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─── Mock contracts ────────────────────────────────────
interface ContractData {
  id: string;
  name: string;
  counterparty: string;
  counterpartyRole: string;
  status: "active" | "completed" | "paused" | "disputed";
  totalValue: number;
  releasedValue: number;
  createdAt: string;
  deadline: string;
  description: string;
  milestones: MilestoneData[];
}

const mockContracts: Record<string, ContractData> = {
  "1090": {
    id: "#1090",
    name: "Thiết kế UI/UX App",
    counterparty: "Trần Minh",
    counterpartyRole: "Freelancer",
    status: "active",
    totalValue: 62500000,
    releasedValue: 25000000,
    createdAt: "01/01/2025",
    deadline: "28/02/2025",
    description:
      "Thiết kế giao diện người dùng và trải nghiệm cho ứng dụng mobile, bao gồm wireframe, UI design, prototype và handoff cho đội phát triển.",
    milestones: [
      {
        id: 1,
        contractId: "#1090",
        contractName: "Thiết kế UI/UX App",
        title: "MS#1 — Wireframe",
        amount: "₫12.5M",
        amountNum: 12500000,
        status: "released",
        deadline: "15/01",
        counterparty: "Trần Minh",
      },
      {
        id: 2,
        contractId: "#1090",
        contractName: "Thiết kế UI/UX App",
        title: "MS#2 — UI Design",
        amount: "₫12.5M",
        amountNum: 12500000,
        status: "released",
        deadline: "28/01",
        counterparty: "Trần Minh",
      },
      {
        id: 3,
        contractId: "#1090",
        contractName: "Thiết kế UI/UX App",
        title: "MS#3 — Prototype",
        amount: "₫12.5M",
        amountNum: 12500000,
        status: "submitted",
        deadline: "10/02",
        submittedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
        counterparty: "Trần Minh",
      },
      {
        id: 4,
        contractId: "#1090",
        contractName: "Thiết kế UI/UX App",
        title: "MS#4 — Handoff",
        amount: "₫25M",
        amountNum: 25000000,
        status: "in_progress",
        deadline: "28/02",
        counterparty: "Trần Minh",
      },
    ],
  },
  "1092": {
    id: "#1092",
    name: "Backend API",
    counterparty: "Lê Hoàng",
    counterpartyRole: "Freelancer",
    status: "active",
    totalValue: 100000000,
    releasedValue: 25000000,
    createdAt: "15/12/2024",
    deadline: "28/02/2025",
    description:
      "Phát triển backend API cho hệ thống quản lý, bao gồm database schema, auth module, payment integration và deployment.",
    milestones: [
      {
        id: 5,
        contractId: "#1092",
        contractName: "Backend API",
        title: "MS#1 — Database Schema",
        amount: "₫25M",
        amountNum: 25000000,
        status: "released",
        deadline: "05/01",
        counterparty: "Lê Hoàng",
      },
      {
        id: 6,
        contractId: "#1092",
        contractName: "Backend API",
        title: "MS#2 — Auth Module",
        amount: "₫25M",
        amountNum: 25000000,
        status: "revision_requested",
        deadline: "20/01",
        revisionNote:
          "API response chưa đúng format, cần bổ sung validation cho email và phone.",
        counterparty: "Lê Hoàng",
      },
      {
        id: 7,
        contractId: "#1092",
        contractName: "Backend API",
        title: "MS#3 — Payment Integration",
        amount: "₫25M",
        amountNum: 25000000,
        status: "awaiting_escrow",
        deadline: "10/02",
        counterparty: "Lê Hoàng",
      },
      {
        id: 8,
        contractId: "#1092",
        contractName: "Backend API",
        title: "MS#4 — Deployment",
        amount: "₫25M",
        amountNum: 25000000,
        status: "awaiting_escrow",
        deadline: "28/02",
        counterparty: "Lê Hoàng",
      },
    ],
  },
  "1088": {
    id: "#1088",
    name: "Nội dung SEO",
    counterparty: "Nguyễn Lan",
    counterpartyRole: "Freelancer",
    status: "disputed",
    totalValue: 20000000,
    releasedValue: 16000000,
    createdAt: "10/12/2024",
    deadline: "15/01/2025",
    description:
      "Viết nội dung SEO cho website, bao gồm bài viết blog, mô tả sản phẩm, landing page copy.",
    milestones: [
      {
        id: 9,
        contractId: "#1088",
        contractName: "Nội dung SEO",
        title: "MS#1 — Nghiên cứu keyword",
        amount: "₫4M",
        amountNum: 4000000,
        status: "released",
        deadline: "20/12",
        counterparty: "Nguyễn Lan",
      },
      {
        id: 10,
        contractId: "#1088",
        contractName: "Nội dung SEO",
        title: "MS#2 — Landing page copy",
        amount: "₫4M",
        amountNum: 4000000,
        status: "released",
        deadline: "25/12",
        counterparty: "Nguyễn Lan",
      },
      {
        id: 11,
        contractId: "#1088",
        contractName: "Nội dung SEO",
        title: "MS#3 — Mô tả sản phẩm",
        amount: "₫4M",
        amountNum: 4000000,
        status: "released",
        deadline: "01/01",
        counterparty: "Nguyễn Lan",
      },
      {
        id: 12,
        contractId: "#1088",
        contractName: "Nội dung SEO",
        title: "MS#4 — Blog post series",
        amount: "₫4M",
        amountNum: 4000000,
        status: "released",
        deadline: "08/01",
        counterparty: "Nguyễn Lan",
      },
      {
        id: 13,
        contractId: "#1088",
        contractName: "Nội dung SEO",
        title: "MS#5 — Bài viết blog",
        amount: "₫4M",
        amountNum: 4000000,
        status: "disputed",
        deadline: "15/01",
        counterparty: "Nguyễn Lan",
      },
    ],
  },
};

// ─── Timeline Events ────────────────────────────────────
interface TimelineEvent {
  id: number;
  text: string;
  time: string;
  icon: typeof Send;
  color: string;
  type:
    | "submit"
    | "accept"
    | "release"
    | "revision"
    | "dispute"
    | "create"
    | "escrow";
}

const generateTimeline = (contract: ContractData): TimelineEvent[] => {
  const events: TimelineEvent[] = [
    {
      id: 1,
      text: `Hợp đồng "${contract.name}" được tạo`,
      time: contract.createdAt,
      icon: FileCheck,
      color: "text-primary",
      type: "create",
    },
  ];

  let eventId = 2;
  contract.milestones.forEach((ms) => {
    if (ms.status === "released") {
      events.push(
        {
          id: eventId++,
          text: `${ms.title} — Gửi nghiệm thu`,
          time: ms.deadline,
          icon: Send,
          color: "text-primary",
          type: "submit",
        },
        {
          id: eventId++,
          text: `${ms.title} — Được chấp nhận`,
          time: ms.deadline,
          icon: CheckCircle2,
          color: "text-success",
          type: "accept",
        },
        {
          id: eventId++,
          text: `Giải ngân ${ms.amount} cho ${contract.counterparty}`,
          time: ms.deadline,
          icon: ArrowDownToLine,
          color: "text-accent",
          type: "release",
        },
      );
    }
    if (ms.status === "submitted") {
      events.push({
        id: eventId++,
        text: `${ms.title} — Đang chờ nghiệm thu`,
        time: "Gần đây",
        icon: Send,
        color: "text-warning",
        type: "submit",
      });
    }
    if (ms.status === "revision_requested") {
      events.push({
        id: eventId++,
        text: `${ms.title} — Yêu cầu chỉnh sửa`,
        time: "Gần đây",
        icon: Edit3,
        color: "text-warning",
        type: "revision",
      });
    }
    if (ms.status === "disputed") {
      events.push({
        id: eventId++,
        text: `${ms.title} — Tranh chấp đang xử lý`,
        time: "Gần đây",
        icon: AlertTriangle,
        color: "text-destructive",
        type: "dispute",
      });
    }
  });

  return events.reverse();
};

const contractStatusConfig: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  active: {
    label: "Đang hoạt động",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  completed: {
    label: "Hoàn thành",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  paused: {
    label: "Tạm dừng",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  disputed: {
    label: "Tranh chấp",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: "easeOut" as const },
  }),
};

const ContractDetail = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>(
    () => (localStorage.getItem("dashboard_role") as UserRole) || "contractor",
  );
  const [showAllTimeline, setShowAllTimeline] = useState(false);

  useEffect(() => {
    localStorage.setItem("dashboard_role", role);
  }, [role]);

  const contract = contractId ? mockContracts[contractId] : undefined;

  const progressPct = contract
    ? Math.round((contract.releasedValue / contract.totalValue) * 100)
    : 0;
  const escrowHeld = contract
    ? contract.totalValue - contract.releasedValue
    : 0;
  const completedMs = contract
    ? contract.milestones.filter((m) => m.status === "released").length
    : 0;
  const totalMs = contract ? contract.milestones.length : 0;
  const statusConf = contract
    ? contractStatusConfig[contract.status]
    : contractStatusConfig.active;
  const timeline = contract ? generateTimeline(contract) : [];
  const visibleTimeline = showAllTimeline ? timeline : timeline.slice(0, 5);

  const milestoneSummary = useMemo(() => {
    if (!contract) return {};
    const counts: Partial<Record<MilestoneStatus, number>> = {};
    contract.milestones.forEach((m) => {
      counts[m.status] = (counts[m.status] || 0) + 1;
    });
    return counts;
  }, [contract]);

  if (!contract) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Không tìm thấy hợp đồng
          </h2>
          <p className="text-muted-foreground mb-6">
            Hợp đồng này không tồn tại hoặc đã bị xoá.
          </p>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Back + Header */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground mb-4"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {contract.name}
              </h1>
              <Badge
                className={cn(
                  "border-0",
                  statusConf.bgColor,
                  statusConf.color,
                  "hover:" + statusConf.bgColor,
                )}
              >
                {statusConf.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {contract.id} • {contract.description}
            </p>
          </div>
          <RoleSwitcher role={role} onRoleChange={setRole} />
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Tổng giá trị",
            value: `₫${(contract.totalValue / 1e6).toFixed(0)}M`,
            icon: DollarSign,
            color: "text-primary",
            bgColor: "bg-primary/10",
          },
          {
            label: "Đã giải ngân",
            value: `₫${(contract.releasedValue / 1e6).toFixed(0)}M`,
            icon: TrendingUp,
            color: "text-success",
            bgColor: "bg-success/10",
          },
          {
            label: "Đang giữ Escrow",
            value: `₫${(escrowHeld / 1e6).toFixed(0)}M`,
            icon: Wallet,
            color: "text-accent",
            bgColor: "bg-accent/10",
          },
          {
            label: "Milestone",
            value: `${completedMs}/${totalMs}`,
            icon: FileText,
            color: "text-primary",
            bgColor: "bg-primary/10",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i + 1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Card className="hover:shadow-[var(--shadow-card-hover)] transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center",
                      stat.bgColor,
                    )}
                  >
                    <stat.icon className={cn("h-5 w-5", stat.color)} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <motion.div
        custom={5}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-6"
      >
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Tiến độ giải ngân
                </span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {progressPct}%
              </span>
            </div>
            <Progress value={progressPct} className="h-3 mb-3" />
            <div className="flex flex-wrap gap-3">
              {Object.entries(milestoneSummary).map(([status, count]) => {
                const conf = milestoneStatusConfig[status as MilestoneStatus];
                return (
                  <div
                    key={status}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        conf.bgColor.replace("/10", ""),
                      )}
                    />
                    <span className="text-muted-foreground">
                      {conf.label}:{" "}
                      <span className="font-medium text-foreground">
                        {count}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Contract Info + Counterparty */}
      <motion.div
        custom={6}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-6"
      >
        <Card>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {role === "contractor" ? "Freelancer" : "Nhà thầu"}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {contract.counterparty}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Ngày tạo</p>
                  <p className="text-sm font-medium text-foreground">
                    {contract.createdAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                  <p className="text-sm font-medium text-foreground">
                    {contract.deadline}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Mã hợp đồng</p>
                  <p className="text-sm font-medium text-foreground">
                    {contract.id}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main: Milestones + Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Milestones */}
        <div className="xl:col-span-2">
          <motion.div
            custom={7}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Danh sách Milestone
              </h2>
              <Badge variant="secondary" className="text-xs">
                {completedMs}/{totalMs} hoàn thành
              </Badge>
            </div>

            {/* Milestone Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={role}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {contract.milestones.map((ms, i) => {
                    const conf = milestoneStatusConfig[ms.status];
                    const isCompleted = ms.status === "released";
                    return (
                      <div key={ms.id} className="relative flex gap-4">
                        {/* Timeline dot */}
                        <div className="relative z-10 shrink-0 mt-5">
                          <div
                            className={cn(
                              "h-10 w-10 rounded-full flex items-center justify-center border-2 border-card",
                              isCompleted
                                ? "bg-success text-success-foreground"
                                : conf.bgColor,
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <span
                                className={cn("text-xs font-bold", conf.color)}
                              >
                                {i + 1}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Card */}
                        <div className="flex-1 min-w-0">
                          <MilestoneCard milestone={ms} role={role} />
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Activity Timeline */}
        <div>
          <motion.div
            custom={8}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Lịch sử hoạt động
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {visibleTimeline.map((e, i) => (
                  <div
                    key={e.id}
                    className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0"
                  >
                    <div className="flex flex-col items-center mt-0.5">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <e.icon className={cn("h-4 w-4", e.color)} />
                      </div>
                      {i < visibleTimeline.length - 1 && (
                        <div className="w-px h-full min-h-[12px] bg-border/60 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{e.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {e.time}
                      </p>
                    </div>
                  </div>
                ))}

                {timeline.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-muted-foreground"
                    onClick={() => setShowAllTimeline(!showAllTimeline)}
                  >
                    {showAllTimeline ? (
                      <>
                        Thu gọn <ChevronUp className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Xem thêm ({timeline.length - 5}){" "}
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-accent" />
                  Tài chính
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Tổng giá trị
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    ₫{(contract.totalValue / 1e6).toFixed(0)}M
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Đã giải ngân
                  </span>
                  <span className="text-sm font-semibold text-success">
                    ₫{(contract.releasedValue / 1e6).toFixed(0)}M
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Đang giữ Escrow
                  </span>
                  <span className="text-sm font-semibold text-accent">
                    ₫{(escrowHeld / 1e6).toFixed(0)}M
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Còn lại</span>
                  <span className="text-sm font-semibold text-foreground">
                    {totalMs - completedMs} milestone • ₫
                    {(
                      (contract.totalValue - contract.releasedValue) /
                      1e6
                    ).toFixed(0)}
                    M
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContractDetail;
