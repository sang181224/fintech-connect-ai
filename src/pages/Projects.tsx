import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Clock,
  Users,
  DollarSign,
  SlidersHorizontal,
  X,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data
const allSkills = [
  "React", "Node.js", "TypeScript", "Python", "Figma", "UI/UX",
  "Flutter", "Swift", "Go", "Rust", "AWS", "Docker",
  "Next.js", "Vue.js", "Laravel", "Django", "PostgreSQL", "MongoDB",
];

const projectTypes = ["Cố định", "Theo giờ", "Dài hạn", "Ngắn hạn"];

const mockProjects = [
  {
    id: 1,
    title: "Xây dựng ứng dụng quản lý dự án SaaS",
    description: "Cần một developer có kinh nghiệm xây dựng ứng dụng SaaS quản lý dự án với dashboard, Kanban board, báo cáo tiến độ và tích hợp thanh toán Stripe.",
    budget: { min: 15000000, max: 30000000 },
    type: "Cố định",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    postedAt: "2 giờ trước",
    postedDays: 0,
    applicants: 12,
    verified: true,
    clientName: "TechCorp VN",
    clientRating: 4.8,
    clientProjects: 15,
  },
  {
    id: 2,
    title: "Thiết kế UI/UX cho ứng dụng mobile fintech",
    description: "Tìm designer thiết kế giao diện và trải nghiệm người dùng cho ứng dụng ví điện tử. Bao gồm wireframe, mockup và prototype tương tác trên Figma.",
    budget: { min: 8000000, max: 15000000 },
    type: "Cố định",
    skills: ["Figma", "UI/UX"],
    postedAt: "5 giờ trước",
    postedDays: 0,
    applicants: 8,
    verified: true,
    clientName: "FinStart",
    clientRating: 4.5,
    clientProjects: 7,
  },
  {
    id: 3,
    title: "Phát triển API backend cho marketplace",
    description: "Xây dựng hệ thống API RESTful cho nền tảng marketplace bao gồm xác thực, quản lý sản phẩm, đơn hàng, thanh toán và hệ thống đánh giá.",
    budget: { min: 20000000, max: 40000000 },
    type: "Dài hạn",
    skills: ["Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS"],
    postedAt: "1 ngày trước",
    postedDays: 1,
    applicants: 18,
    verified: false,
    clientName: "ShopEasy",
    clientRating: 4.2,
    clientProjects: 3,
  },
  {
    id: 4,
    title: "Xây dựng landing page cho startup AI",
    description: "Cần một landing page hiện đại, responsive với animation mượt mà để giới thiệu sản phẩm AI. Yêu cầu tối ưu SEO và tốc độ tải trang.",
    budget: { min: 3000000, max: 7000000 },
    type: "Ngắn hạn",
    skills: ["React", "Next.js", "TypeScript"],
    postedAt: "3 ngày trước",
    postedDays: 3,
    applicants: 25,
    verified: true,
    clientName: "AIVision",
    clientRating: 5.0,
    clientProjects: 1,
  },
  {
    id: 5,
    title: "Phát triển ứng dụng Flutter cross-platform",
    description: "Xây dựng ứng dụng di động cross-platform bằng Flutter cho nền tảng đặt lịch hẹn. Cần tích hợp Google Calendar, push notification và thanh toán.",
    budget: { min: 25000000, max: 50000000 },
    type: "Cố định",
    skills: ["Flutter", "Firebase", "Docker"],
    postedAt: "4 ngày trước",
    postedDays: 4,
    applicants: 6,
    verified: true,
    clientName: "BookingPro",
    clientRating: 4.9,
    clientProjects: 22,
  },
  {
    id: 6,
    title: "Tối ưu hiệu suất website e-commerce",
    description: "Website hiện tại có vấn đề về tốc độ tải. Cần audit và tối ưu Core Web Vitals, lazy loading, caching, và CDN. Lighthouse score cần đạt trên 90.",
    budget: { min: 5000000, max: 10000000 },
    type: "Ngắn hạn",
    skills: ["React", "Next.js", "AWS"],
    postedAt: "5 ngày trước",
    postedDays: 5,
    applicants: 9,
    verified: false,
    clientName: "FashionVN",
    clientRating: 3.8,
    clientProjects: 5,
  },
  {
    id: 7,
    title: "Xây dựng hệ thống CRM tùy chỉnh",
    description: "Phát triển hệ thống CRM nội bộ với quản lý khách hàng, pipeline bán hàng, báo cáo analytics và tích hợp email marketing tự động.",
    budget: { min: 35000000, max: 60000000 },
    type: "Dài hạn",
    skills: ["React", "Python", "Django", "PostgreSQL"],
    postedAt: "1 tuần trước",
    postedDays: 7,
    applicants: 14,
    verified: true,
    clientName: "SalesHub",
    clientRating: 4.6,
    clientProjects: 11,
  },
  {
    id: 8,
    title: "Thiết kế hệ thống design system",
    description: "Tạo design system hoàn chỉnh bao gồm typography, color tokens, components library trên Figma và tài liệu hướng dẫn sử dụng chi tiết.",
    budget: { min: 10000000, max: 20000000 },
    type: "Theo giờ",
    skills: ["Figma", "UI/UX"],
    postedAt: "1 tuần trước",
    postedDays: 7,
    applicants: 11,
    verified: true,
    clientName: "DesignFirst",
    clientRating: 4.7,
    clientProjects: 9,
  },
];

function formatCurrency(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
}

const ITEMS_PER_PAGE = 6;

export default function Projects() {
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState([0, 60000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [savedProjects, setSavedProjects] = useState<number[]>([]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
    setCurrentPage(1);
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const toggleSave = (id: number) => {
    setSavedProjects((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedSkills([]);
    setSelectedTypes([]);
    setBudgetRange([0, 60000000]);
    setSearch("");
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let result = mockProjects.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchSkills =
        selectedSkills.length === 0 ||
        selectedSkills.some((s) => p.skills.includes(s));
      const matchType =
        selectedTypes.length === 0 || selectedTypes.includes(p.type);
      const matchBudget =
        p.budget.min <= budgetRange[1] && p.budget.max >= budgetRange[0];
      return matchSearch && matchSkills && matchType && matchBudget;
    });

    if (sortBy === "newest") result.sort((a, b) => a.postedDays - b.postedDays);
    else if (sortBy === "budget-high") result.sort((a, b) => b.budget.max - a.budget.max);
    else if (sortBy === "budget-low") result.sort((a, b) => a.budget.min - b.budget.min);
    else if (sortBy === "applicants") result.sort((a, b) => a.applicants - b.applicants);

    return result;
  }, [search, selectedSkills, selectedTypes, budgetRange, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeFilterCount =
    selectedSkills.length + selectedTypes.length + (budgetRange[0] > 0 || budgetRange[1] < 60000000 ? 1 : 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-display text-foreground">
            Tìm dự án
          </h1>
          <p className="text-muted-foreground mt-1">
            {filtered.length} dự án phù hợp đang chờ bạn
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tiêu đề, mô tả hoặc kỹ năng..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-11 h-12 text-base bg-card border-border shadow-card"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="lg"
            className="h-12 gap-2 shrink-0"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Bộ lọc</span>
            {activeFilterCount > 0 && (
              <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground border-0">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0 overflow-hidden hidden lg:block"
              >
                <div className="w-[280px] space-y-6">
                  <Card className="shadow-card border-border">
                    <CardContent className="p-5 space-y-6">
                      {/* Budget Filter */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          Ngân sách (VNĐ)
                        </Label>
                        <Slider
                          value={budgetRange}
                          onValueChange={(v) => {
                            setBudgetRange(v);
                            setCurrentPage(1);
                          }}
                          min={0}
                          max={60000000}
                          step={1000000}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formatCurrency(budgetRange[0])} đ</span>
                          <span>{formatCurrency(budgetRange[1])} đ</span>
                        </div>
                      </div>

                      {/* Project Type */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          Loại dự án
                        </Label>
                        <div className="space-y-2">
                          {projectTypes.map((type) => (
                            <label
                              key={type}
                              className="flex items-center gap-2.5 cursor-pointer group"
                            >
                              <Checkbox
                                checked={selectedTypes.includes(type)}
                                onCheckedChange={() => toggleType(type)}
                              />
                              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                {type}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Skills Filter */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-foreground">
                          Kỹ năng
                        </Label>
                        <div className="flex flex-wrap gap-1.5">
                          {allSkills.map((skill) => (
                            <Badge
                              key={skill}
                              variant={selectedSkills.includes(skill) ? "default" : "outline"}
                              className="cursor-pointer text-xs transition-all hover:shadow-sm"
                              onClick={() => toggleSkill(skill)}
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Clear */}
                      {activeFilterCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-destructive hover:text-destructive"
                          onClick={clearFilters}
                        >
                          <X className="h-3.5 w-3.5 mr-1.5" />
                          Xóa tất cả bộ lọc
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Sort & View Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] h-9 bg-card">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="budget-high">Ngân sách cao → thấp</SelectItem>
                    <SelectItem value="budget-low">Ngân sách thấp → cao</SelectItem>
                    <SelectItem value="applicants">Ít ứng viên nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-1 bg-muted rounded-lg p-0.5">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Project Cards */}
            {paginated.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="p-12 text-center">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                  <p className="text-lg font-semibold text-foreground">Không tìm thấy dự án</p>
                  <p className="text-muted-foreground mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Xóa bộ lọc
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 xl:grid-cols-2 gap-4"
                    : "flex flex-col gap-3"
                }
              >
                <AnimatePresence mode="popLayout">
                  {paginated.map((project, i) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25, delay: i * 0.04 }}
                    >
                      <ProjectCard
                        project={project}
                        viewMode={viewMode}
                        saved={savedProjects.includes(project.id)}
                        onToggleSave={() => toggleSave(project.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Project Card Component
interface ProjectCardProps {
  project: (typeof mockProjects)[0];
  viewMode: "grid" | "list";
  saved: boolean;
  onToggleSave: () => void;
}

function ProjectCard({ project, viewMode, saved, onToggleSave }: ProjectCardProps) {
  const isList = viewMode === "list";

  return (
    <Card className="group shadow-card hover:shadow-card-hover transition-all duration-300 border-border overflow-hidden">
      <CardContent className={`p-5 ${isList ? "flex gap-5" : ""}`}>
        <div className={`flex-1 min-w-0 ${isList ? "" : "space-y-3"}`}>
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display font-semibold text-foreground truncate text-base group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                {project.verified && (
                  <Badge variant="secondary" className="text-[10px] shrink-0 px-1.5 py-0">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">{project.clientName}</span>
                <span>•</span>
                <span>⭐ {project.clientRating}</span>
                <span>•</span>
                <span>{project.clientProjects} dự án</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave();
              }}
              className="shrink-0 p-1.5 rounded-md hover:bg-muted transition-colors"
            >
              <Bookmark
                className={`h-4 w-4 transition-colors ${saved ? "fill-primary text-primary" : "text-muted-foreground"}`}
              />
            </button>
          </div>

          {/* Description */}
          <p className={`text-sm text-muted-foreground leading-relaxed ${isList ? "mt-2" : ""} line-clamp-2`}>
            {project.description}
          </p>

          {/* Skills */}
          <div className={`flex flex-wrap gap-1.5 ${isList ? "mt-2" : ""}`}>
            {project.skills.map((skill) => (
              <Badge
                key={skill}
                variant="outline"
                className="text-[11px] bg-muted/50 border-border"
              >
                {skill}
              </Badge>
            ))}
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-between ${isList ? "mt-3" : "pt-3 border-t border-border"}`}>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-semibold text-primary flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" />
                {formatCurrency(project.budget.min)} – {formatCurrency(project.budget.max)} đ
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {project.postedAt}
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {project.applicants} ứng viên
              </span>
            </div>
            <Button size="sm" className="shrink-0 shadow-button">
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
