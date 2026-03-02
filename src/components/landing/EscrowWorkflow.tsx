import { motion } from "framer-motion";
import { Shield, ArrowDown, CheckCircle, Lock } from "lucide-react";

const steps = [
  {
    icon: Lock,
    title: "Khách hàng ký quỹ",
    description: "Tiền được giữ an toàn trong tài khoản Escrow trước khi dự án bắt đầu.",
  },
  {
    icon: ArrowDown,
    title: "Freelancer thực hiện",
    description: "Freelancer hoàn thành công việc theo các milestone đã thỏa thuận.",
  },
  {
    icon: CheckCircle,
    title: "Nghiệm thu & thanh toán",
    description: "Khách hàng xác nhận hoàn thành, tiền được giải ngân cho Freelancer.",
  },
  {
    icon: Shield,
    title: "Bảo vệ hai bên",
    description: "Cả hai bên đều được bảo vệ bởi hệ thống giải quyết tranh chấp.",
  },
];

const EscrowWorkflow = () => {
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
            Thanh toán Escrow — An toàn tuyệt đối
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hệ thống Escrow giữ tiền an toàn cho đến khi cả hai bên hài lòng.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="grid gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`flex items-center gap-6 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <div
                    className="rounded-xl p-6 bg-background shadow-card hover:shadow-card-hover transition-shadow duration-300"
                    style={{ background: "var(--gradient-card)" }}
                  >
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-button">
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EscrowWorkflow;
