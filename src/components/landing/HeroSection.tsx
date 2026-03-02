import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-illustration.png";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="container mx-auto px-4 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              <Sparkles className="h-4 w-4" />
              Nền tảng Freelance thông minh #1 Việt Nam
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground">
              Kết nối Talent.{" "}
              <span className="text-primary">Thanh toán an toàn.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Nền tảng kết nối Freelancer và Khách hàng với thanh toán Escrow bảo mật 
              và AI tư vấn thông minh — giúp mọi dự án diễn ra suôn sẻ.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button variant="hero" size="lg" className="h-12 px-8 rounded-xl">
                Đăng dự án <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
              <Button variant="heroOutline" size="lg" className="h-12 px-8 rounded-xl">
                Tìm việc ngay
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent" />
                10,000+ Freelancer
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                5,000+ Dự án hoàn thành
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="animate-float">
              <img
                src={heroImage}
                alt="Freelancer platform with escrow payment flow illustration"
                className="w-full rounded-2xl shadow-card"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
