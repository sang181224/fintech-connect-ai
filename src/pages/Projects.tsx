import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
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
import { mockProjects, formatCurrency, type Project } from "@/data/projects";
const allSkills = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "Figma",
  "UI/UX",
  "Flutter",
  "Swift",
  "Go",
  "Rust",
  "AWS",
  "Docker",
  "Next.js",
  "Vue.js",
  "Laravel",
  "Django",
  "PostgreSQL",
  "MongoDB",
];
const projectTypes = ["Cố định", "Theo giờ", "Dài hạn", "Ngắn hạn"];
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
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
    setCurrentPage(1);
  };
  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
    setCurrentPage(1);
  };
  const toggleSave = (id: number) => {
    setSavedProjects((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
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
    const result = mockProjects.filter((p) => {
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
    else if (sortBy === "budget-high")
      result.sort((a, b) => b.budget.max - a.budget.max);
    else if (sortBy === "budget-low")
      result.sort((a, b) => a.budget.min - b.budget.min);
    else if (sortBy === "applicants")
      result.sort((a, b) => a.applicants - b.applicants);
    return result;
  }, [search, selectedSkills, selectedTypes, budgetRange, sortBy]);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const activeFilterCount =
    selectedSkills.length +
    selectedTypes.length +
    (budgetRange[0] > 0 || budgetRange[1] < 60000000 ? 1 : 0);
  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Tìm dự án</h1>
          <p className="text-muted-foreground mt-1">
            {filtered.length} dự án phù hợp đang chờ bạn
          </p>
        </div>
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, mô tả hoặc kỹ năng..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-11 h-12 text-base bg-card border-border"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            className="h-12 gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Bộ lọc
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-sm"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
        {/* Filters Sidebar + Content */}
        <div className="flex gap-6">
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 280 }}
              exit={{ opacity: 0, width: 0 }}
              className="shrink-0 space-y-6"
            >
              <Card>
                <CardContent className="p-4 space-y-6">
                  {/* Budget Filter */}
                  <div className="space-y-3">
                    <Label className="font-semibold text-sm">
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
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatCurrency(budgetRange[0])} đ</span>
                      <span>{formatCurrency(budgetRange[1])} đ</span>
                    </div>
                  </div>
                  {/* Project Type */}
                  <div className="space-y-3">
                    <Label className="font-semibold text-sm">Loại dự án</Label>
                    <div className="space-y-2">
                      {projectTypes.map((type) => (
                        <div key={type} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() => toggleType(type)}
                          />
                          <span className="text-sm">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Skills Filter */}
                  <div className="space-y-3">
                    <Label className="font-semibold text-sm">Kỹ năng</Label>
                    <div className="flex flex-wrap gap-1.5">
                      {allSkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant={
                            selectedSkills.includes(skill)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer text-sm"
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
                      className="w-full"
                      onClick={clearFilters}
                    >
                      <X className="h-3 w-3 mr-1" /> Xóa tất cả bộ lọc
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Sort & View Toggle */}
            <div className="flex items-center justify-between">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="budget-high">
                    Ngân sách cao → thấp
                  </SelectItem>
                  <SelectItem value="budget-low">
                    Ngân sách thấp → cao
                  </SelectItem>
                  <SelectItem value="applicants">Ít ứng viên nhất</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* Project Cards */}
            {paginated.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg font-medium text-muted-foreground">
                  Không tìm thấy dự án
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage + viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                      : "space-y-3"
                  }
                >
                  {paginated.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      viewMode={viewMode}
                      saved={savedProjects.includes(project.id)}
                      onToggleSave={() => toggleSave(project.id)}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ),
                )}
                <Button
                  variant="outline"
                  size="icon"
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
  project: Project;
  viewMode: "grid" | "list";
  saved: boolean;
  onToggleSave: () => void;
}
function ProjectCard({
  project,
  viewMode,
  saved,
  onToggleSave,
}: ProjectCardProps) {
  const isList = viewMode === "list";
  return (
    <Link to={`/dashboard/projects/${project.id}`}>
      <Card
        className={`hover:shadow-md transition-shadow cursor-pointer ${isList ? "flex-row" : ""}`}
      >
        <CardContent
          className={`p-4 space-y-3 ${isList ? "flex gap-4 items-start" : ""}`}
        >
          <div className={isList ? "flex-1 space-y-2" : "space-y-3"}>
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span>{project.clientName}</span>
                  <span>•</span>
                  <span>⭐ {project.clientRating}</span>
                  <span>•</span>
                  <span>{project.clientProjects} dự án</span>
                </div>
                {project.verified && (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] mt-1">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleSave();
                }}
                className="shrink-0 p-1.5 rounded-md hover:bg-muted transition-colors"
              >
                <Bookmark
                  className={`h-4 w-4 ${saved ? "fill-primary text-primary" : "text-muted-foreground"}`}
                />
              </button>
            </div>
            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.description}
            </p>
            {/* Skills */}
            <div className="flex flex-wrap gap-1">
              {project.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="text-[10px] px-1.5 py-0"
                >
                  {skill}
                </Badge>
              ))}
            </div>
            {/* Footer */}
            <div className="flex items-center justify-between pt-1 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {formatCurrency(project.budget.min)} –{" "}
                {formatCurrency(project.budget.max)} đ
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {project.postedAt}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {project.applicants} ứng viên
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
