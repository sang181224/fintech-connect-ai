import { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/data/projects";
import { formatCurrency } from "@/data/projects";
const applySchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên tối đa 100 ký tự")
    .required("Vui lòng nhập họ tên"),
  email: yup
    .string()
    .trim()
    .email("Email không hợp lệ")
    .max(255, "Email tối đa 255 ký tự")
    .required("Vui lòng nhập email"),
  phone: yup
    .string()
    .trim()
    .min(9, "Số điện thoại không hợp lệ")
    .max(15, "Số điện thoại tối đa 15 ký tự")
    .matches(/^[0-9+\-\s()]+$/, "Số điện thoại không hợp lệ")
    .required("Vui lòng nhập số điện thoại"),
  bidAmount: yup.string().trim().required("Vui lòng nhập giá đề xuất"),
  deliveryTime: yup.string().required("Vui lòng chọn thời gian hoàn thành"),
  coverLetter: yup
    .string()
    .trim()
    .min(50, "Thư giới thiệu phải có ít nhất 50 ký tự")
    .max(2000, "Thư giới thiệu tối đa 2000 ký tự")
    .required("Vui lòng nhập thư giới thiệu"),
  portfolioUrl: yup
    .string()
    .trim()
    .url("URL không hợp lệ")
    .max(500, "URL tối đa 500 ký tự")
    .notRequired()
    .default(""),
});
type ApplyFormValues = yup.InferType<typeof applySchema>;
interface ApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
}
export function ApplyDialog({ open, onOpenChange, project }: ApplyDialogProps) {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<ApplyFormValues>({
    resolver: yupResolver(applySchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      bidAmount: "",
      deliveryTime: "",
      coverLetter: "",
      portfolioUrl: "",
    },
  });
  const onSubmit = (data: ApplyFormValues) => {
    // In production, this would send to an API
    setSubmitted(true);
    toast({
      title: "Ứng tuyển thành công!",
      description: `Proposal của bạn cho "${project.title}" đã được gửi.`,
    });
  };
  const handleClose = () => {
    onOpenChange(false);
    if (submitted) {
      setTimeout(() => {
        setSubmitted(false);
        form.reset();
      }, 300);
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-8 text-center gap-4"
            >
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold">Gửi proposal thành công!</h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Khách hàng sẽ xem xét và phản hồi proposal của bạn. Bạn sẽ nhận
                được thông báo qua email.
              </p>
              <Button onClick={handleClose} className="mt-2">
                Đóng
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <DialogHeader>
                <DialogTitle>Ứng tuyển dự án</DialogTitle>
                <DialogDescription>
                  {project.title} · {formatCurrency(project.budget.min)} -{" "}
                  {formatCurrency(project.budget.max)} VNĐ
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 mt-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nguyễn Văn A" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="email@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại *</FormLabel>
                          <FormControl>
                            <Input placeholder="0901234567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bidAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giá đề xuất (VNĐ) *</FormLabel>
                          <FormControl>
                            <Input placeholder="15,000,000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="deliveryTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thời gian hoàn thành *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn thời gian" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-week">Dưới 1 tuần</SelectItem>
                            <SelectItem value="2-weeks">1 - 2 tuần</SelectItem>
                            <SelectItem value="1-month">
                              2 tuần - 1 tháng
                            </SelectItem>
                            <SelectItem value="2-months">
                              1 - 2 tháng
                            </SelectItem>
                            <SelectItem value="3-months">
                              2 - 3 tháng
                            </SelectItem>
                            <SelectItem value="3-months-plus">
                              Trên 3 tháng
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverLetter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thư giới thiệu *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Giới thiệu bản thân, kinh nghiệm liên quan và lý do bạn phù hợp với dự án này..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="portfolioUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link portfolio</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://portfolio.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                    style={{
                      background: "var(--gradient-primary)",
                      boxShadow: "var(--shadow-button)",
                    }}
                  >
                    <Send className="mr-2 h-4 w-4" /> Gửi Proposal
                  </Button>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
