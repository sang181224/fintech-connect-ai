import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Nguyễn Minh Tuấn",
    role: "CEO, TechStartup VN",
    content:
      "Escrow giúp tôi yên tâm khi thuê Freelancer. Tiền chỉ được giải ngân khi tôi hài lòng với kết quả. AI tư vấn cũng rất chính xác!",
    rating: 5,
  },
  {
    name: "Trần Thị Hương",
    role: "Full-stack Developer",
    content:
      "Là Freelancer, tôi luôn lo lắng về thanh toán. Nền tảng này đã giải quyết hoàn toàn vấn đề đó. Thu nhập tăng 40% sau 3 tháng.",
    rating: 5,
  },
  {
    name: "Lê Hoàng Nam",
    role: "Product Manager, FinCorp",
    content:
      "Chức năng quản lý hợp đồng và milestone rất chuyên nghiệp. AI matching giúp tìm được đúng người chỉ trong vài phút.",
    rating: 5,
  },
];

const Testimonials = () => {
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
            Khách hàng nói gì?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hàng nghìn người dùng đã tin tưởng và sử dụng nền tảng mỗi ngày.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="rounded-xl p-6 bg-card shadow-card border border-border/50 hover:shadow-card-hover transition-shadow duration-300"
            >
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-card-foreground text-sm leading-relaxed mb-6">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-primary font-semibold text-sm">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-card-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
