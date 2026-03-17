import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Briefcase,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    location: user?.location || "",
  });
  const { toast } = useToast();
  if (!user) return null;
  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast({
      title: "Đã cập nhật hồ sơ",
      description: "Thông tin của bạn đã được lưu.",
    });
  };
  const handleCancel = () => {
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      bio: user.bio || "",
      location: user.location || "",
    });
    setEditing(false);
  };
  return (
    <DashboardLayout>
      <div className="mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-display font-bold text-foreground">
            Hồ sơ cá nhân
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin cá nhân của bạn
          </p>
        </motion.div>
        {/* Profile Header */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-display font-bold text-foreground">
                  {user.name}
                </h2>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="secondary" className="capitalize">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {user.role === "contractor" ? "Nhà thầu" : "Freelancer"}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span>4.8/5.0</span>
                  </div>
                  {user.location && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {user.location}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant={editing ? "destructive" : "default"}
                onClick={editing ? handleCancel : () => setEditing(true)}
              >
                {editing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Hủy
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Info Form */}
          <Card className="md:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-display">
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Họ và tên
                  </Label>
                  {editing ? (
                    <Input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-foreground font-medium py-2">
                      {user.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  {editing ? (
                    <Input
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-foreground font-medium py-2">
                      {user.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Số điện thoại
                  </Label>
                  {editing ? (
                    <Input
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-foreground font-medium py-2">
                      {user.phone || "Chưa cập nhật"}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Vị trí
                  </Label>
                  {editing ? (
                    <Input
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-foreground font-medium py-2">
                      {user.location || "Chưa cập nhật"}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Giới thiệu bản thân</Label>
                {editing ? (
                  <Textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground py-2">
                    {user.bio || "Chưa có giới thiệu"}
                  </p>
                )}
              </div>
              {editing && (
                <Button onClick={handleSave} className="shadow-button">
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </Button>
              )}
            </CardContent>
          </Card>
          {/* Side Stats */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-display">Thống kê</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Dự án hoàn thành
                  </span>
                  <span className="font-bold text-foreground">24</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tổng thu nhập</span>
                  <span className="font-bold text-foreground">₫186M</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Tỷ lệ hoàn thành
                  </span>
                  <span className="font-bold text-success">96%</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Tham gia
                  </span>
                  <span className="font-medium text-foreground">01/2024</span>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg font-display">Kỹ năng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(user.skills || []).map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default Profile;
