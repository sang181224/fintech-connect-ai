import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Bell, CheckCheck, FileText, Wallet, AlertTriangle, MessageSquare,
  Milestone, Clock, Settings, Trash2, BellOff, Mail, Smartphone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type NotificationType = "contract" | "milestone" | "payment" | "dispute" | "message" | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}

const typeConfig: Record<NotificationType, { icon: React.ElementType; label: string; color: string }> = {
  contract: { icon: FileText, label: "Hợp đồng", color: "bg-blue-500/10 text-blue-600" },
  milestone: { icon: Milestone, label: "Milestone", color: "bg-emerald-500/10 text-emerald-600" },
  payment: { icon: Wallet, label: "Thanh toán", color: "bg-amber-500/10 text-amber-600" },
  dispute: { icon: AlertTriangle, label: "Tranh chấp", color: "bg-destructive/10 text-destructive" },
  message: { icon: MessageSquare, label: "Tin nhắn", color: "bg-purple-500/10 text-purple-600" },
  system: { icon: Bell, label: "Hệ thống", color: "bg-muted text-muted-foreground" },
};

const initialNotifications: Notification[] = [
  { id: "1", type: "milestone", title: "Milestone được phê duyệt", description: "Milestone 'Thiết kế UI Dashboard' trong hợp đồng HD-2024-001 đã được nhà thầu phê duyệt. Tiền sẽ được giải ngân trong 24h.", time: "5 phút trước", read: false },
  { id: "2", type: "payment", title: "Giải ngân thành công", description: "Bạn đã nhận 15.000.000₫ từ hợp đồng HD-2024-003. Số dư ví: 45.200.000₫.", time: "30 phút trước", read: false },
  { id: "3", type: "contract", title: "Hợp đồng mới được tạo", description: "Nhà thầu Nguyễn Văn A đã tạo hợp đồng mới 'Phát triển App Mobile' và mời bạn tham gia.", time: "1 giờ trước", read: false },
  { id: "4", type: "dispute", title: "Tranh chấp cần phản hồi", description: "Vụ tranh chấp TC-003 về hợp đồng HD-2024-002 cần phản hồi từ bạn trước ngày 20/03/2026.", time: "2 giờ trước", read: false },
  { id: "5", type: "message", title: "Tin nhắn mới từ Trần Thị B", description: "Trần Thị B: 'Mình đã cập nhật bản thiết kế mới, bạn kiểm tra giúp nhé!'", time: "3 giờ trước", read: true },
  { id: "6", type: "milestone", title: "Deadline milestone sắp đến", description: "Milestone 'Backend API' trong HD-2024-001 sẽ đến hạn trong 2 ngày nữa.", time: "5 giờ trước", read: true },
  { id: "7", type: "system", title: "Cập nhật chính sách nền tảng", description: "FreelanceVN đã cập nhật chính sách bảo vệ freelancer. Xem chi tiết tại mục Điều khoản.", time: "1 ngày trước", read: true },
  { id: "8", type: "payment", title: "Yêu cầu ký quỹ mới", description: "Hợp đồng HD-2024-005 yêu cầu ký quỹ 20.000.000₫. Vui lòng xác nhận.", time: "1 ngày trước", read: true },
  { id: "9", type: "contract", title: "Hợp đồng sắp hết hạn", description: "Hợp đồng HD-2024-002 sẽ hết hạn trong 7 ngày. Hãy hoàn tất các milestone còn lại.", time: "2 ngày trước", read: true },
  { id: "10", type: "message", title: "Tin nhắn mới từ Lê Văn C", description: "Lê Văn C: 'Thanh toán đợt 2 đã được chuyển, bạn kiểm tra nhé.'", time: "2 ngày trước", read: true },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("all");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    email_contract: true, email_milestone: true, email_payment: true, email_dispute: true, email_message: false, email_system: false,
    push_contract: true, push_milestone: true, push_payment: true, push_dispute: true, push_message: true, push_system: false,
  });

  const filtered = activeTab === "all" ? notifications : activeTab === "unread" ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === activeTab);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const deleteNotif = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  const toggleSetting = (key: string) => setNotifSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Thông báo</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo chưa đọc` : "Tất cả thông báo đã được đọc"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
              <CheckCheck className="h-4 w-4 mr-1" /> Đọc tất cả
            </Button>
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Settings className="h-4 w-4 mr-1" /> Cài đặt</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>Cài đặt thông báo</DialogTitle></DialogHeader>
                <ScrollArea className="max-h-[60vh]">
                  <div className="space-y-6 pr-2">
                    {(Object.keys(typeConfig) as NotificationType[]).map(type => {
                      const cfg = typeConfig[type];
                      const Icon = cfg.icon;
                      return (
                        <div key={type} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-md ${cfg.color}`}><Icon className="h-3.5 w-3.5" /></div>
                            <span className="font-medium text-sm text-foreground">{cfg.label}</span>
                          </div>
                          <div className="ml-8 space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm text-muted-foreground flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> Email</Label>
                              <Switch checked={notifSettings[`email_${type}` as keyof typeof notifSettings]} onCheckedChange={() => toggleSetting(`email_${type}`)} />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm text-muted-foreground flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5" /> Push</Label>
                              <Switch checked={notifSettings[`push_${type}` as keyof typeof notifSettings]} onCheckedChange={() => toggleSetting(`push_${type}`)} />
                            </div>
                          </div>
                          <Separator />
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Tổng thông báo", value: notifications.length, icon: Bell },
            { label: "Chưa đọc", value: unreadCount, icon: BellOff },
            { label: "Hôm nay", value: notifications.filter(n => n.time.includes("phút") || n.time.includes("giờ")).length, icon: Clock },
            { label: "Cần hành động", value: notifications.filter(n => !n.read && (n.type === "dispute" || n.type === "contract")).length, icon: AlertTriangle },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><s.icon className="h-4 w-4 text-primary" /></div>
                <div><p className="text-2xl font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs + List */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="unread">Chưa đọc {unreadCount > 0 && <Badge className="ml-1 h-5 px-1.5 text-[10px]">{unreadCount}</Badge>}</TabsTrigger>
            {(Object.keys(typeConfig) as NotificationType[]).map(type => (
              <TabsTrigger key={type} value={type}>{typeConfig[type].label}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardContent className="p-0">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <BellOff className="h-10 w-10 mb-3 opacity-40" />
                    <p className="font-medium">Không có thông báo</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filtered.map(n => {
                      const cfg = typeConfig[n.type];
                      const Icon = cfg.icon;
                      return (
                        <motion.div
                          key={n.id}
                          layout
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          className={`flex items-start gap-3 p-4 border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-accent/50 ${!n.read ? "bg-primary/[0.03]" : ""}`}
                          onClick={() => markRead(n.id)}
                        >
                          <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${cfg.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm ${!n.read ? "font-semibold text-foreground" : "text-foreground/80"}`}>{n.title}</p>
                                {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{n.time}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.description}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 opacity-0 group-hover:opacity-100 hover:!opacity-100" onClick={e => { e.stopPropagation(); deleteNotif(n.id); }}>
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
