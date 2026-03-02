import { motion } from "framer-motion";
import { ShieldCheck, Bot, FileText, Zap, Globe, HeadphonesIcon } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Thanh toán Escrow",
    description: "Tiền được bảo vệ trong tài khoản trung gian, đảm bảo an toàn cho cả hai bên.",
  },
  {
    icon: Bot,
    title: "AI Tư vấn thông minh",
    description: "AI hỗ trợ tìm Freelancer phù hợp, ước lượng chi phí và thời gian dự án.",
  },
  {
    icon: FileText,
    title: "Quản lý hợp đồng",
    description: "Tạo và ký hợp đồng số hóa, theo dõi milestone và tiến độ dự án dễ dàng.",
  },
  {
    icon: Zap,
    title: "Matching nhanh chóng",
    description: "Thuật toán AI ghép nối Freelancer với dự án phù hợp nhất trong vài giây.",
  },
  {
    icon: Globe,
    title: "Đa ngôn ngữ & quốc tế",
    description: "Hỗ trợ Freelancer và Khách hàng trên toàn cầu, đa ngôn ngữ và tiền tệ.",
  },
  {
    icon: HeadphonesIcon,
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ hỗ trợ luôn sẵn sàng giải quyết mọi vấn đề, bất cứ lúc nào.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tại sao chọn chúng tôi?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nền tảng được thiết kế để mang lại trải nghiệm tốt nhất cho Freelancer và Khách hàng.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-xl p-6 bg-card shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-card-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
