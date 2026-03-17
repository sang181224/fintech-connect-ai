import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  Moon,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });
  if (!user) return null;
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            Cài đặt
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý cài đặt tài khoản của bạn
          </p>
        </motion.div>
        {/* Notifications */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Thông báo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Thông báo qua Email</Label>
                <p className="text-sm text-muted-foreground">
                  Nhận thông báo qua email
                </p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(v) =>
                  setNotifications({ ...notifications, email: v })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-1">
                  <Smartphone className="w-4 h-4" />
                  Push notification
                </Label>
                <p className="text-sm text-muted-foreground">
                  Thông báo đẩy trên trình duyệt
                </p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(v) =>
                  setNotifications({ ...notifications, push: v })
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Thông báo SMS</Label>
                <p className="text-sm text-muted-foreground">
                  Nhận tin nhắn SMS
                </p>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(v) =>
                  setNotifications({ ...notifications, sms: v })
                }
              />
            </div>
          </CardContent>
        </Card>
        {/* Security */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Bảo mật
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Mật khẩu hiện tại</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Mật khẩu mới</Label>
              <Input type="password" placeholder="Tối thiểu 8 ký tự" />
            </div>
            <div className="space-y-2">
              <Label>Xác nhận mật khẩu mới</Label>
              <Input type="password" placeholder="Nhập lại mật khẩu mới" />
            </div>
            <Button
              onClick={() =>
                toast({
                  title: "Đã cập nhật",
                  description: "Mật khẩu đã được thay đổi.",
                })
              }
            >
              Đổi mật khẩu
            </Button>
          </CardContent>
        </Card>
        {/* Preferences */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Tùy chọn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Ngôn ngữ</Label>
              </div>
              <Select defaultValue="vi">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-1">
                  <Moon className="w-4 h-4" />
                  Chế độ tối
                </Label>
                <p className="text-sm text-muted-foreground">
                  Chuyển đổi giao diện sáng/tối
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default Settings;
