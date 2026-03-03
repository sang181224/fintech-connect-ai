import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Send, RotateCcw, AlertTriangle, Wallet, CheckCircle2, Edit3,
  Clock, Ban, Shield, Loader2, Timer, CalendarClock,
} from "lucide-react";
import { MilestoneData, milestoneStatusConfig } from "@/types/milestone";
import type { UserRole } from "./RoleSwitcher";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface MilestoneCardProps {
  milestone: MilestoneData;
  role: UserRole;
}

function useCountdown(submittedAt?: string) {
  const [remaining, setRemaining] = useState("");
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!submittedAt) return;
    const deadline = new Date(submittedAt).getTime() + 24 * 60 * 60 * 1000;

    const tick = () => {
      const now = Date.now();
      const diff = deadline - now;
      if (diff <= 0) {
        setRemaining("00:00:00");
        setExpired(true);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [submittedAt]);

  return { remaining, expired };
}

export function MilestoneCard({ milestone, role }: MilestoneCardProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: string;
    variant: "default" | "destructive";
  }>({ open: false, title: "", description: "", action: "", variant: "default" });

  const config = milestoneStatusConfig[milestone.status];
  const { remaining, expired } = useCountdown(
    milestone.status === "submitted" ? milestone.submittedAt : undefined
  );
  const isDisputed = milestone.status === "disputed";

  const handleAction = (action: string) => {
    setLoading(action);
    setTimeout(() => {
      setLoading(null);
      toast({
        title: "Thành công",
        description: `Hành động "${action}" đã được thực hiện.`,
      });
    }, 1500);
  };

  const openConfirm = (title: string, description: string, action: string, variant: "default" | "destructive" = "default") => {
    setConfirmDialog({ open: true, title, description, action, variant });
  };

  const renderActions = () => {
    if (isDisputed) {
      return (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-destructive shrink-0" />
          <p className="text-sm text-destructive font-medium">
            {role === "contractor"
              ? "Đang chờ Admin xử lý tranh chấp"
              : "Đang xử lý tranh chấp — Tất cả hành động bị khóa"}
          </p>
        </div>
      );
    }

    if (milestone.status === "expired") {
      return (
        <div className="rounded-lg bg-muted p-3 flex items-center gap-2">
          <Ban className="h-4 w-4 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">Milestone đã hết hạn xử lý</p>
        </div>
      );
    }

    if (milestone.status === "released") {
      return (
        <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/10">
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
          {role === "contractor" ? "Đã thanh toán" : "Hoàn thành"}
        </Badge>
      );
    }

    // ─── Freelancer Actions ───
    if (role === "freelancer") {
      switch (milestone.status) {
        case "in_progress":
          return (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                className="gap-1.5"
                disabled={!!loading}
                onClick={() => openConfirm("Gửi nghiệm thu", `Bạn xác nhận gửi nghiệm thu cho "${milestone.title}"?`, "submit")}
              >
                {loading === "submit" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Gửi nghiệm thu
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" disabled={!!loading}
                onClick={() => handleAction("extend")}>
                <CalendarClock className="h-4 w-4" />
                Gia hạn
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5" disabled={!!loading}
                onClick={() => openConfirm("Tạo tranh chấp", "Bạn muốn tạo tranh chấp cho milestone này?", "dispute", "destructive")}>
                <AlertTriangle className="h-4 w-4" />
                Tranh chấp
              </Button>
            </div>
          );
        case "submitted":
          return (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="gap-1.5" disabled={!!loading}
                onClick={() => openConfirm("Rút nghiệm thu", "Bạn muốn rút lại yêu cầu nghiệm thu?", "withdraw")}>
                {loading === "withdraw" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                Rút lại yêu cầu
              </Button>
            </div>
          );
        case "revision_requested":
          return (
            <Button size="sm" className="gap-1.5" disabled={!!loading}
              onClick={() => openConfirm("Nộp lại sản phẩm", "Bạn xác nhận nộp lại sản phẩm sau chỉnh sửa?", "resubmit")}>
              {loading === "resubmit" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Nộp lại sản phẩm
            </Button>
          );
        default:
          return null;
      }
    }

    // ─── Contractor Actions ───
    if (role === "contractor") {
      switch (milestone.status) {
        case "awaiting_escrow":
          return (
            <Button size="sm" className="gap-1.5" disabled={!!loading}
              onClick={() => openConfirm("Nạp tiền Escrow", `Nạp ${milestone.amount} vào ví ký quỹ cho milestone "${milestone.title}"?`, "fund")}>
              {loading === "fund" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
              Nạp tiền Escrow
            </Button>
          );
        case "submitted":
          return (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="gap-1.5 bg-success hover:bg-success/90 text-success-foreground" disabled={!!loading}
                onClick={() => openConfirm("Giải ngân", `Chấp nhận và giải ngân ${milestone.amount} cho freelancer?`, "approve")}>
                {loading === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Chấp nhận & Giải ngân
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 border-warning text-warning hover:bg-warning/5" disabled={!!loading}
                onClick={() => handleAction("revision")}>
                <Edit3 className="h-4 w-4" />
                Yêu cầu chỉnh sửa
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5" disabled={!!loading}
                onClick={() => openConfirm("Tạo tranh chấp", "Bạn muốn tạo tranh chấp cho milestone này?", "dispute", "destructive")}>
                <AlertTriangle className="h-4 w-4" />
                Tranh chấp
              </Button>
            </div>
          );
        case "in_progress":
          return (
            <p className="text-sm text-muted-foreground italic">Freelancer đang thực hiện...</p>
          );
        default:
          return null;
      }
    }

    return null;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className={cn(
          "border-l-4 transition-shadow hover:shadow-card-hover",
          config.borderColor,
          isDisputed && "opacity-80"
        )}>
          <CardContent className="p-5 space-y-4">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground mb-0.5">
                  {milestone.contractId} — {milestone.contractName}
                </p>
                <h3 className="font-semibold text-foreground truncate">{milestone.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {role === "contractor" ? "Freelancer" : "Khách hàng"}: {milestone.counterparty}
                </p>
              </div>
              <Badge className={cn("shrink-0", config.bgColor, config.color, "border-0 hover:" + config.bgColor)}>
                {config.label}
              </Badge>
            </div>

            {/* Amount & deadline */}
            <div className="flex items-center gap-4 text-sm">
              <span className="font-semibold text-foreground">{milestone.amount}</span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Hạn: {milestone.deadline}
              </span>
            </div>

            {/* Countdown for submitted */}
            {milestone.status === "submitted" && remaining && (
              <div className={cn(
                "flex items-center gap-2 rounded-lg p-2.5 text-sm font-medium",
                expired ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
              )}>
                <Timer className="h-4 w-4" />
                {expired
                  ? "Đã hết thời hạn 24h — Tự động chấp nhận"
                  : `Còn ${remaining} để xử lý`}
              </div>
            )}

            {/* Revision note */}
            {milestone.status === "revision_requested" && milestone.revisionNote && (
              <div className="rounded-lg bg-warning/10 border border-warning/20 p-3">
                <p className="text-xs font-medium text-warning mb-1">Ghi chú từ Nhà thầu:</p>
                <p className="text-sm text-foreground">{milestone.revisionNote}</p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-1">
              {renderActions()}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(o) => setConfirmDialog((p) => ({ ...p, open: o }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog((p) => ({ ...p, open: false }))}>
              Hủy
            </Button>
            <Button
              variant={confirmDialog.variant === "destructive" ? "destructive" : "default"}
              onClick={() => {
                setConfirmDialog((p) => ({ ...p, open: false }));
                handleAction(confirmDialog.action);
              }}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
