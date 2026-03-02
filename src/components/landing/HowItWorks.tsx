import { motion } from "framer-motion";
import { Search, Handshake, Code2, CreditCard } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Đăng dự án hoặc tìm việc",
    description: "Mô tả dự án của bạn hoặc tạo hồ sơ Freelancer chuyên nghiệp.",
  },
  {
    number: "02",
    icon: Handshake,
    title: "AI ghép nối & thỏa thuận",
    description: "AI gợi ý ứng viên phù hợp nhất. Hai bên thống nhất scope và ngân sách.",
  },
  {
    number: "03",
    icon: Code2,
    title: "Thực hiện & theo dõi",
    description: "Freelancer hoàn thành công việc theo milestone. Khách hàng review theo từng giai đoạn.",
  },
  {
    number: "04",
    icon: CreditCard,
    title: "Thanh toán an toàn",
    description: "Sau khi nghiệm thu, Escrow giải ngân tự động. Nhanh chóng và minh bạch.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Cách hoạt động
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Chỉ 4 bước đơn giản để bắt đầu dự án thành công.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center"
            >
              <div className="mb-6">
                <span className="font-display text-5xl font-bold text-primary/10">
                  {step.number}
                </span>
              </div>
              <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-button">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
