import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-bold">FreelanceVN</span>
            </div>
            <p className="text-sm opacity-70 leading-relaxed">
              Nền tảng kết nối Freelancer và Khách hàng với thanh toán Escrow bảo mật và AI tư vấn thông minh.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Sản phẩm</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Đăng dự án</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Tìm Freelancer</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Escrow Payment</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">AI Matching</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Công ty</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Về chúng tôi</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Blog</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Tuyển dụng</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Liên hệ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Trung tâm hỗ trợ</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60">
          <p>© 2026 FreelanceVN. Tất cả quyền được bảo lưu.</p>
          <p>Made with ❤️ in Vietnam</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
