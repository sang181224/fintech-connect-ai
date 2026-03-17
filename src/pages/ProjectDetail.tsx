import { useParams, useNavigate, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Clock,
  Users,
  DollarSign,
  Star,
  ShieldCheck,
  Briefcase,
  MapPin,
  Calendar,
  Send,
  Bookmark,
  Share2,
  Flag,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { mockProjects, formatCurrency } from "@/data/projects";
import { useState } from "react";
import { ApplyDialog } from "@/components/project/ApplyDialog";
// import { ApplyDialog } from "@/components/project/Applydialog"
export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applyOpen, setApplyOpen] = useState(false);
  const project = mockProjects.find((p) => p.id === Number(id));
  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy dự án</h2>
          <p className="text-muted-foreground mb-6">
            Dự án bạn tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button onClick={() => navigate("/dashboard/projects")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  const relatedProjects = mockProjects
    .filter(
      (p) =>
        p.id !== project.id && p.skills.some((s) => project.skills.includes(s)),
    )
    .slice(0, 3);
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link
            to="/dashboard/projects"
            className="hover:text-primary transition-colors"
          >
            Dự án
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[300px]">
            {project.title}
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card
              className="overflow-hidden"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <CardContent className="p-6 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium"
                      >
                        {project.type}
                      </Badge>
                      {project.verified && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                          <ShieldCheck className="h-3 w-3 mr-1" /> Đã xác minh
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold leading-tight">
                      {project.title}
                    </h1>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {project.postedAt}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" /> {project.applicants} ứng viên
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    {formatCurrency(project.budget.min)} -{" "}
                    {formatCurrency(project.budget.max)} VNĐ
                  </span>
                </div>
              </CardContent>
            </Card>
            {/* Description */}
            <Card style={{ boxShadow: "var(--shadow-card)" }}>
              <CardHeader>
                <CardTitle className="text-lg">Mô tả dự án</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3 text-sm">
                    Yêu cầu chi tiết
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Thiết kế responsive trên mọi thiết bị",
                      "Code sạch, có documentation đầy đủ",
                      "Tối ưu hiệu suất và bảo mật",
                      "Hỗ trợ bảo trì 3 tháng sau khi bàn giao",
                    ].map((req, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3 text-sm">
                    Kỹ năng yêu cầu
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="bg-secondary/50 text-secondary-foreground"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <Card style={{ boxShadow: "var(--shadow-card)" }}>
                <CardHeader>
                  <CardTitle className="text-lg">Dự án tương tự</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {relatedProjects.map((rp) => (
                    <Link
                      key={rp.id}
                      to={`/dashboard/projects/${rp.id}`}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                          {rp.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>
                            {formatCurrency(rp.budget.min)} -{" "}
                            {formatCurrency(rp.budget.max)} VNĐ
                          </span>
                          <span>{rp.applicants} ứng viên</span>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs shrink-0 ml-2"
                      >
                        {rp.type}
                      </Badge>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card
              className="sticky top-6"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    Ngân sách dự án
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{
                      background: "var(--gradient-primary)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {formatCurrency(project.budget.min)} -{" "}
                    {formatCurrency(project.budget.max)}
                  </p>
                  <p className="text-xs text-muted-foreground">VNĐ</p>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setApplyOpen(true)}
                  style={{
                    background: "var(--gradient-primary)",
                    boxShadow: "var(--shadow-button)",
                  }}
                >
                  <Send className="mr-2 h-4 w-4" /> Ứng tuyển ngay
                </Button>
                <Button variant="outline" className="w-full">
                  <Bookmark className="mr-2 h-4 w-4" /> Lưu dự án
                </Button>
              </CardContent>
            </Card>
            {/* Client Info */}
            <Card style={{ boxShadow: "var(--shadow-card)" }}>
              <CardHeader>
                <CardTitle className="text-lg">Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {project.clientName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{project.clientName}</p>
                    {project.verified && (
                      <span className="text-xs text-emerald-600 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Đã xác minh
                      </span>
                    )}
                  </div>
                </div>
                <Separator />
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-500" /> Đánh giá
                    </span>
                    <span className="font-semibold">
                      {project.clientRating}/5.0
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" /> Dự án đã đăng
                    </span>
                    <span className="font-semibold">
                      {project.clientProjects}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> Địa điểm
                    </span>
                    <span className="font-semibold">Việt Nam</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> Tham gia
                    </span>
                    <span className="font-semibold">2024</span>
                  </div>
                </div>
                <Separator />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                >
                  <Flag className="mr-2 h-3 w-3" /> Báo cáo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
      <ApplyDialog
        open={applyOpen}
        onOpenChange={setApplyOpen}
        project={project}
      />
    </DashboardLayout>
  );
}
