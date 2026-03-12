import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RoleSwitcher, UserRole } from "@/components/dashboard/RoleSwitcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle, Search, Clock, CheckCircle2, XCircle, MessageSquare,
  FileText, Shield, Scale, ArrowRight, Send, Paperclip, ChevronRight,
  AlertCircle, Eye, Flag, Users, Gavel,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type DisputeStatus = "open" | "reviewing" | "waiting_response" | "resolved" | "escalated" | "rejected";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  actor: string;
  type: "system" | "contractor" | "freelancer" | "admin";
}

interface DisputeResponse {
  id: string;
  author: string;
  initials: string;
  role: "contractor" | "freelancer" | "admin";
  text: string;
  date: string;
  attachments?: string[];
}

interface Dispute {
  id: string;
  code: string;
  contract: string;
  contractCode: string;
  milestone: string;
  amount: string;
  amountNum: number;
  status: DisputeStatus;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
  initiator: string;
  initiatorRole: "contractor" | "freelancer";
  respondent: string;
  respondentRole: "contractor" | "freelancer";
  reason: string;
  description: string;
  timeline: TimelineEvent[];
  responses: DisputeResponse[];
  resolution?: string;
  deadline: string;
}

const mockDisputes: Dispute[] = [
  {
    id: "1", code: "TC-001", contract: "Thiết kế UI/UX Dashboard", contractCode: "HĐ #1092",
    milestone: "Milestone 3 — Mockup hoàn chỉnh", amount: "₫8,000,000", amountNum: 8000000,
    status: "waiting_response", priority: "high", createdAt: "08/03/2026", updatedAt: "11/03/2026",
    initiator: "Nguyễn Minh Tú", initiatorRole: "freelancer",
    respondent: "Công ty ABC", respondentRole: "contractor",
    reason: "Không thanh toán đúng hạn",
    description: "Freelancer đã hoàn thành và gửi nghiệm thu Milestone 3 từ ngày 01/03/2026. Sau 7 ngày, Nhà thầu chưa phản hồi chấp nhận hoặc yêu cầu chỉnh sửa, dẫn đến việc Freelancer mở tranh chấp để yêu cầu giải ngân theo quy định tự động phê duyệt sau 24h.",
    deadline: "15/03/2026",
    timeline: [
      { id: "t1", date: "01/03/2026 14:30", title: "Gửi nghiệm thu", description: "Freelancer gửi bản giao Milestone 3 với đầy đủ file Figma và tài liệu", actor: "Nguyễn Minh Tú", type: "freelancer" },
      { id: "t2", date: "02/03/2026 14:30", title: "Nhắc nhở tự động", description: "Hệ thống gửi nhắc nhở đến Nhà thầu về việc nghiệm thu", actor: "Hệ thống", type: "system" },
      { id: "t3", date: "05/03/2026 09:00", title: "Nhắc nhở lần 2", description: "Hệ thống gửi nhắc nhở lần 2, cảnh báo quá hạn", actor: "Hệ thống", type: "system" },
      { id: "t4", date: "08/03/2026 10:15", title: "Mở tranh chấp", description: "Freelancer mở tranh chấp do Nhà thầu không phản hồi sau 7 ngày", actor: "Nguyễn Minh Tú", type: "freelancer" },
      { id: "t5", date: "08/03/2026 10:20", title: "Thông báo đến Nhà thầu", description: "Hệ thống gửi thông báo tranh chấp đến Nhà thầu, yêu cầu phản hồi trong 72h", actor: "Hệ thống", type: "system" },
      { id: "t6", date: "11/03/2026 08:00", title: "Chờ phản hồi", description: "Nhà thầu chưa phản hồi. Hạn cuối: 15/03/2026", actor: "Hệ thống", type: "system" },
    ],
    responses: [
      { id: "r1", author: "Nguyễn Minh Tú", initials: "MT", role: "freelancer", text: "Em đã hoàn thành đúng yêu cầu brief và gửi nghiệm thu từ ngày 01/03. Đã 7 ngày mà anh chưa phản hồi. Em yêu cầu giải ngân theo quy định.", date: "08/03/2026 10:15", attachments: ["Mockup_Final.fig", "Brief_Checklist.pdf"] },
    ],
  },
  {
    id: "2", code: "TC-002", contract: "Backend API Development", contractCode: "HĐ #1088",
    milestone: "Milestone 2 — API Authentication", amount: "₫15,000,000", amountNum: 15000000,
    status: "reviewing", priority: "critical", createdAt: "05/03/2026", updatedAt: "10/03/2026",
    initiator: "Công ty XYZ", initiatorRole: "contractor",
    respondent: "Trần Văn Hùng", respondentRole: "freelancer",
    reason: "Chất lượng không đạt yêu cầu",
    description: "Nhà thầu cho rằng API Authentication không đáp ứng yêu cầu bảo mật đã thỏa thuận. Cụ thể: thiếu rate limiting, không có 2FA, và response time vượt quá 500ms theo SLA.",
    deadline: "13/03/2026",
    timeline: [
      { id: "t1", date: "28/02/2026 16:00", title: "Gửi nghiệm thu", description: "Freelancer gửi bản giao API Authentication", actor: "Trần Văn Hùng", type: "freelancer" },
      { id: "t2", date: "02/03/2026 10:00", title: "Yêu cầu chỉnh sửa", description: "Nhà thầu yêu cầu bổ sung rate limiting và 2FA", actor: "Công ty XYZ", type: "contractor" },
      { id: "t3", date: "04/03/2026 14:00", title: "Nộp lại", description: "Freelancer nộp lại bản chỉnh sửa", actor: "Trần Văn Hùng", type: "freelancer" },
      { id: "t4", date: "05/03/2026 09:30", title: "Mở tranh chấp", description: "Nhà thầu mở tranh chấp vì bản chỉnh sửa vẫn chưa đạt yêu cầu", actor: "Công ty XYZ", type: "contractor" },
      { id: "t5", date: "06/03/2026 11:00", title: "Phản hồi freelancer", description: "Freelancer phản hồi với bằng chứng kỹ thuật", actor: "Trần Văn Hùng", type: "freelancer" },
      { id: "t6", date: "10/03/2026 09:00", title: "Admin xem xét", description: "Admin tiếp nhận và đang xem xét hồ sơ hai bên", actor: "Admin", type: "admin" },
    ],
    responses: [
      { id: "r1", author: "Công ty XYZ", initials: "XY", role: "contractor", text: "API không đáp ứng SLA đã ký. Response time trung bình 800ms (yêu cầu <500ms). Không có rate limiting và 2FA như đã thỏa thuận trong brief.", date: "05/03/2026 09:30", attachments: ["SLA_Agreement.pdf", "Performance_Report.xlsx"] },
      { id: "r2", author: "Trần Văn Hùng", initials: "VH", role: "freelancer", text: "Em đã bổ sung rate limiting trong bản v2. Về 2FA, brief ban đầu không yêu cầu, đây là yêu cầu mới phát sinh. Response time 800ms là do test server của bên anh, em có benchmark trên production đạt 320ms.", date: "06/03/2026 11:00", attachments: ["Benchmark_Results.png", "Original_Brief.pdf"] },
      { id: "r3", author: "Admin FreelanceVN", initials: "AD", role: "admin", text: "Đã tiếp nhận hồ sơ. Đang xem xét brief gốc và SLA để đánh giá khách quan. Dự kiến có kết luận trước 13/03/2026.", date: "10/03/2026 09:00" },
    ],
  },
  {
    id: "3", code: "TC-003", contract: "SEO Content Writing", contractCode: "HĐ #1095",
    milestone: "Milestone 1 — 10 bài viết SEO", amount: "₫5,000,000", amountNum: 5000000,
    status: "resolved", priority: "medium", createdAt: "20/02/2026", updatedAt: "28/02/2026",
    initiator: "Công ty DEF", initiatorRole: "contractor",
    respondent: "Lê Thị Hương", respondentRole: "freelancer",
    reason: "Nội dung không đạt chuẩn SEO",
    description: "Nhà thầu cho rằng 3/10 bài viết không đạt chuẩn SEO theo yêu cầu: thiếu meta description, keyword density thấp, và không có internal linking.",
    deadline: "01/03/2026",
    resolution: "Hai bên đồng ý Freelancer chỉnh sửa 3 bài viết trong 5 ngày. Nhà thầu giải ngân 70% trước, 30% sau khi nhận bản chỉnh sửa.",
    timeline: [
      { id: "t1", date: "15/02/2026 10:00", title: "Gửi nghiệm thu", description: "Freelancer gửi 10 bài viết SEO", actor: "Lê Thị Hương", type: "freelancer" },
      { id: "t2", date: "18/02/2026 14:00", title: "Yêu cầu chỉnh sửa", description: "Nhà thầu phát hiện 3 bài không đạt chuẩn", actor: "Công ty DEF", type: "contractor" },
      { id: "t3", date: "20/02/2026 09:00", title: "Mở tranh chấp", description: "Hai bên không thống nhất về tiêu chuẩn đánh giá", actor: "Công ty DEF", type: "contractor" },
      { id: "t4", date: "25/02/2026 10:00", title: "Hòa giải", description: "Admin đề xuất phương án hòa giải", actor: "Admin", type: "admin" },
      { id: "t5", date: "28/02/2026 16:00", title: "Giải quyết", description: "Hai bên chấp nhận phương án hòa giải", actor: "Hệ thống", type: "system" },
    ],
    responses: [
      { id: "r1", author: "Công ty DEF", initials: "DF", role: "contractor", text: "3 bài viết về chủ đề công nghệ thiếu meta description và keyword density chỉ đạt 0.3% (yêu cầu 1-2%).", date: "20/02/2026 09:00" },
      { id: "r2", author: "Lê Thị Hương", initials: "TH", role: "freelancer", text: "Em đã viết theo brief, tuy nhiên brief không ghi rõ keyword density cụ thể. Em sẵn sàng chỉnh sửa nếu có hướng dẫn chi tiết hơn.", date: "21/02/2026 11:00" },
      { id: "r3", author: "Admin FreelanceVN", initials: "AD", role: "admin", text: "Đề xuất: Freelancer chỉnh sửa 3 bài trong 5 ngày. Nhà thầu giải ngân 70% ngay, 30% sau chỉnh sửa. Hai bên vui lòng xác nhận.", date: "25/02/2026 10:00" },
    ],
  },
  {
    id: "4", code: "TC-004", contract: "Mobile App Flutter", contractCode: "HĐ #1100",
    milestone: "Milestone 4 — Tích hợp thanh toán", amount: "₫20,000,000", amountNum: 20000000,
    status: "escalated", priority: "critical", createdAt: "01/03/2026", updatedAt: "10/03/2026",
    initiator: "Phạm Đức Anh", initiatorRole: "contractor",
    respondent: "Nguyễn Hoàng", respondentRole: "freelancer",
    reason: "Vi phạm deadline nghiêm trọng",
    description: "Freelancer trễ deadline 2 tuần mà không thông báo. Tính năng thanh toán chưa hoàn thiện, gây ảnh hưởng đến kế hoạch ra mắt sản phẩm của Nhà thầu.",
    deadline: "14/03/2026",
    timeline: [
      { id: "t1", date: "15/02/2026", title: "Deadline gốc", description: "Hạn hoàn thành Milestone 4", actor: "Hệ thống", type: "system" },
      { id: "t2", date: "01/03/2026 08:00", title: "Mở tranh chấp", description: "Nhà thầu mở tranh chấp sau 2 tuần trễ hạn", actor: "Phạm Đức Anh", type: "contractor" },
      { id: "t3", date: "03/03/2026 14:00", title: "Freelancer phản hồi", description: "Freelancer giải thích lý do và xin gia hạn", actor: "Nguyễn Hoàng", type: "freelancer" },
      { id: "t4", date: "07/03/2026 09:00", title: "Leo thang", description: "Nhà thầu yêu cầu leo thang vì không chấp nhận gia hạn", actor: "Phạm Đức Anh", type: "contractor" },
      { id: "t5", date: "10/03/2026 10:00", title: "Ban xử lý tiếp nhận", description: "Ban xử lý tranh chấp cấp cao đang xem xét", actor: "Admin", type: "admin" },
    ],
    responses: [
      { id: "r1", author: "Phạm Đức Anh", initials: "ĐA", role: "contractor", text: "Freelancer trễ 2 tuần không báo trước. Kế hoạch launch app bị ảnh hưởng nghiêm trọng. Yêu cầu hoàn tiền hoặc chuyển cho freelancer khác.", date: "01/03/2026 08:00" },
      { id: "r2", author: "Nguyễn Hoàng", initials: "NH", role: "freelancer", text: "Em xin lỗi vì trễ hạn. API thanh toán của bên thứ 3 thay đổi documentation, em cần thêm 1 tuần để hoàn thiện. Em đã hoàn thành 80%.", date: "03/03/2026 14:00" },
    ],
  },
];

const statusConfig: Record<DisputeStatus, { label: string; color: string; icon: typeof Clock }> = {
  open: { label: "Mới mở", color: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20", icon: AlertCircle },
  reviewing: { label: "Đang xem xét", color: "bg-primary/10 text-primary border-primary/20", icon: Eye },
  waiting_response: { label: "Chờ phản hồi", color: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20", icon: Clock },
  resolved: { label: "Đã giải quyết", color: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20", icon: CheckCircle2 },
  escalated: { label: "Leo thang", color: "bg-destructive/10 text-destructive border-destructive/20", icon: Flag },
  rejected: { label: "Bị từ chối", color: "bg-muted text-muted-foreground border-border", icon: XCircle },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Thấp", color: "bg-muted text-muted-foreground" },
  medium: { label: "Trung bình", color: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]" },
  high: { label: "Cao", color: "bg-destructive/10 text-destructive" },
  critical: { label: "Nghiêm trọng", color: "bg-destructive text-destructive-foreground" },
};

const timelineTypeColors: Record<string, string> = {
  system: "bg-muted-foreground",
  contractor: "bg-primary",
  freelancer: "bg-accent",
  admin: "bg-destructive",
};

export default function Disputes() {
  const [role, setRole] = useState<UserRole>("contractor");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [responseText, setResponseText] = useState("");
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [sending, setSending] = useState(false);

  const filtered = mockDisputes.filter(d => {
    const matchSearch = d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.contract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: "Tổng tranh chấp", value: mockDisputes.length, icon: Scale, color: "text-primary", bg: "bg-primary/10" },
    { label: "Đang xử lý", value: mockDisputes.filter(d => ["open", "reviewing", "waiting_response"].includes(d.status)).length, icon: Clock, color: "text-[hsl(var(--warning))]", bg: "bg-[hsl(var(--warning))]/10" },
    { label: "Đã giải quyết", value: mockDisputes.filter(d => d.status === "resolved").length, icon: CheckCircle2, color: "text-[hsl(var(--success))]", bg: "bg-[hsl(var(--success))]/10" },
    { label: "Leo thang", value: mockDisputes.filter(d => d.status === "escalated").length, icon: Flag, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  const handleSendResponse = () => {
    if (!responseText.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setResponseText("");
      setShowResponseDialog(false);
    }, 1200);
  };

  const totalAmount = mockDisputes.filter(d => d.status !== "resolved").reduce((s, d) => s + d.amountNum, 0);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Tranh chấp</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý và theo dõi các vụ tranh chấp · Tổng giá trị đang tranh chấp: <span className="font-semibold text-destructive">₫{(totalAmount / 1000000).toFixed(0)}M</span>
          </p>
        </div>
        <RoleSwitcher role={role} onRoleChange={setRole} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm theo mã, hợp đồng, lý do..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {Object.entries(statusConfig).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Dispute list */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((d, i) => {
            const sc = statusConfig[d.status];
            const pc = priorityConfig[d.priority];
            return (
              <motion.div key={d.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ delay: i * 0.04 }}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedDispute(d)}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="font-mono text-sm font-semibold text-foreground">{d.code}</span>
                          <Badge variant="outline" className={sc.color}>{sc.label}</Badge>
                          <Badge variant="outline" className={pc.color}>{pc.label}</Badge>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{d.reason}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{d.description}</p>
                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" />{d.contractCode} — {d.contract}</span>
                          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{d.initiator} vs {d.respondent}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Hạn: {d.deadline}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-foreground">{d.amount}</p>
                        <p className="text-xs text-muted-foreground mt-1">{d.responses.length} phản hồi</p>
                        <ChevronRight className="h-5 w-5 text-muted-foreground mt-2 ml-auto" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <Card><CardContent className="p-12 text-center text-muted-foreground">Không tìm thấy tranh chấp nào</CardContent></Card>
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selectedDispute} onOpenChange={open => { if (!open) setSelectedDispute(null); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          {selectedDispute && (() => {
            const d = selectedDispute;
            const sc = statusConfig[d.status];
            const pc = priorityConfig[d.priority];
            return (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-semibold">{d.code}</span>
                    <Badge variant="outline" className={sc.color}>{sc.label}</Badge>
                    <Badge variant="outline" className={pc.color}>{pc.label}</Badge>
                  </div>
                  <DialogTitle className="text-lg">{d.reason}</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {d.contractCode} — {d.contract} · {d.milestone}
                  </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 -mx-6 px-6">
                  <div className="space-y-6 pb-4">
                    {/* Info grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Giá trị", value: d.amount },
                        { label: "Người khởi tạo", value: d.initiator },
                        { label: "Bên bị", value: d.respondent },
                        { label: "Hạn xử lý", value: d.deadline },
                      ].map(item => (
                        <div key={item.label} className="bg-muted/50 rounded-lg p-3">
                          <p className="text-[11px] text-muted-foreground">{item.label}</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-2">Mô tả chi tiết</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{d.description}</p>
                    </div>

                    {/* Resolution */}
                    {d.resolution && (
                      <div className="bg-[hsl(var(--success))]/5 border border-[hsl(var(--success))]/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                          <h4 className="font-semibold text-sm text-foreground">Kết quả giải quyết</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{d.resolution}</p>
                      </div>
                    )}

                    {/* Timeline */}
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-3">Timeline xử lý</h4>
                      <div className="relative ml-3">
                        <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
                        <div className="space-y-4">
                          {d.timeline.map((evt, idx) => (
                            <div key={evt.id} className="relative pl-6">
                              <div className={`absolute left-[-4px] top-1.5 h-2.5 w-2.5 rounded-full ${timelineTypeColors[evt.type]} ring-2 ring-card`} />
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-medium text-foreground">{evt.title}</span>
                                  <span className="text-[11px] text-muted-foreground">{evt.date}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">{evt.description}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">— {evt.actor}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Responses */}
                    <div>
                      <h4 className="font-semibold text-sm text-foreground mb-3">Phản hồi ({d.responses.length})</h4>
                      <div className="space-y-3">
                        {d.responses.map(r => {
                          const roleBg = r.role === "admin" ? "bg-destructive/10 text-destructive" : r.role === "contractor" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent";
                          const roleLabel = r.role === "admin" ? "Admin" : r.role === "contractor" ? "Nhà thầu" : "Freelancer";
                          return (
                            <div key={r.id} className="border border-border rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarFallback className={`text-[10px] font-semibold ${roleBg}`}>{r.initials}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-foreground">{r.author}</span>
                                <Badge variant="outline" className={`text-[10px] ${roleBg}`}>{roleLabel}</Badge>
                                <span className="text-[11px] text-muted-foreground ml-auto">{r.date}</span>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                              {r.attachments && r.attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {r.attachments.map(a => (
                                    <span key={a} className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                                      <Paperclip className="h-3 w-3" />{a}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                {/* Actions */}
                {d.status !== "resolved" && d.status !== "rejected" && (
                  <DialogFooter className="border-t border-border pt-4 gap-2">
                    <Button variant="outline" onClick={() => setSelectedDispute(null)}>Đóng</Button>
                    <Button onClick={() => setShowResponseDialog(true)}>
                      <MessageSquare className="h-4 w-4 mr-1" /> Gửi phản hồi
                    </Button>
                    {role === "contractor" && d.status === "waiting_response" && (
                      <Button variant="destructive" className="gap-1">
                        <Flag className="h-4 w-4" /> Leo thang
                      </Button>
                    )}
                  </DialogFooter>
                )}
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Response dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Gửi phản hồi tranh chấp</DialogTitle>
            <DialogDescription>
              {selectedDispute?.code} — {selectedDispute?.reason}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Nhập nội dung phản hồi..."
              value={responseText}
              onChange={e => setResponseText(e.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Paperclip className="h-3.5 w-3.5" /> Đính kèm file
              </Button>
              <span className="text-xs text-muted-foreground">PDF, DOCX, PNG, JPG (tối đa 10MB)</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResponseDialog(false)}>Hủy</Button>
            <Button onClick={handleSendResponse} disabled={!responseText.trim() || sending}>
              {sending ? <Clock className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
              {sending ? "Đang gửi..." : "Gửi phản hồi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
