export type MilestoneStatus =
  | "awaiting_escrow"    // Chờ nạp tiền Escrow
  | "in_progress"        // Đang thực hiện
  | "submitted"          // Đã gửi nghiệm thu
  | "revision_requested" // Yêu cầu chỉnh sửa
  | "accepted"           // Đã chấp nhận – chờ giải ngân
  | "released"           // Đã giải ngân
  | "disputed"           // Tranh chấp
  | "expired";           // Hết hạn 24h tự hủy

export interface MilestoneData {
  id: number;
  contractId: string;
  contractName: string;
  title: string;
  amount: string;
  amountNum: number;
  status: MilestoneStatus;
  deadline: string;
  submittedAt?: string;
  revisionNote?: string;
  counterparty: string;
}

export const milestoneStatusConfig: Record<MilestoneStatus, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  awaiting_escrow: {
    label: "Chờ nạp Escrow",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    borderColor: "border-l-muted-foreground",
  },
  in_progress: {
    label: "Đang thực hiện",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-l-primary",
  },
  submitted: {
    label: "Chờ nghiệm thu",
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-l-warning",
  },
  revision_requested: {
    label: "Yêu cầu chỉnh sửa",
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-l-warning",
  },
  accepted: {
    label: "Chờ giải ngân",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-l-accent",
  },
  released: {
    label: "Đã giải ngân",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-l-success",
  },
  disputed: {
    label: "Tranh chấp",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-l-destructive",
  },
  expired: {
    label: "Hết hạn",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    borderColor: "border-l-muted-foreground",
  },
};
