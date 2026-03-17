export interface Project {
  id: number;
  title: string;
  description: string;
  budget: { min: number; max: number };
  type: string;
  skills: string[];
  postedAt: string;
  postedDays: number;
  applicants: number;
  verified: boolean;
  clientName: string;
  clientRating: number;
  clientProjects: number;
}

export const mockProjects: Project[] = [
  {
    id: 1,
    title: "Xây dựng ứng dụng quản lý dự án SaaS",
    description:
      "Cần một developer có kinh nghiệm xây dựng ứng dụng SaaS quản lý dự án với dashboard, Kanban board, báo cáo tiến độ và tích hợp thanh toán Stripe.",
    budget: { min: 15000000, max: 30000000 },
    type: "Cố định",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    postedAt: "2 giờ trước",
    postedDays: 0,
    applicants: 12,
    verified: true,
    clientName: "TechCorp VN",
    clientRating: 4.8,
    clientProjects: 15,
  },
  {
    id: 2,
    title: "Thiết kế UI/UX cho ứng dụng mobile fintech",
    description:
      "Tìm designer thiết kế giao diện và trải nghiệm người dùng cho ứng dụng ví điện tử. Bao gồm wireframe, mockup và prototype tương tác trên Figma.",
    budget: { min: 8000000, max: 15000000 },
    type: "Cố định",
    skills: ["Figma", "UI/UX"],
    postedAt: "5 giờ trước",
    postedDays: 0,
    applicants: 8,
    verified: true,
    clientName: "FinStart",
    clientRating: 4.5,
    clientProjects: 7,
  },
  {
    id: 3,
    title: "Phát triển API backend cho marketplace",
    description:
      "Xây dựng hệ thống API RESTful cho nền tảng marketplace bao gồm xác thực, quản lý sản phẩm, đơn hàng, thanh toán và hệ thống đánh giá.",
    budget: { min: 20000000, max: 40000000 },
    type: "Dài hạn",
    skills: ["Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS"],
    postedAt: "1 ngày trước",
    postedDays: 1,
    applicants: 18,
    verified: false,
    clientName: "ShopEasy",
    clientRating: 4.2,
    clientProjects: 3,
  },
  {
    id: 4,
    title: "Xây dựng landing page cho startup AI",
    description:
      "Cần một landing page hiện đại, responsive với animation mượt mà để giới thiệu sản phẩm AI. Yêu cầu tối ưu SEO và tốc độ tải trang.",
    budget: { min: 3000000, max: 7000000 },
    type: "Ngắn hạn",
    skills: ["React", "Next.js", "TypeScript"],
    postedAt: "3 ngày trước",
    postedDays: 3,
    applicants: 25,
    verified: true,
    clientName: "AIVision",
    clientRating: 5.0,
    clientProjects: 1,
  },
  {
    id: 5,
    title: "Phát triển ứng dụng Flutter cross-platform",
    description:
      "Xây dựng ứng dụng di động cross-platform bằng Flutter cho nền tảng đặt lịch hẹn. Cần tích hợp Google Calendar, push notification và thanh toán.",
    budget: { min: 25000000, max: 50000000 },
    type: "Cố định",
    skills: ["Flutter", "Firebase", "Docker"],
    postedAt: "4 ngày trước",
    postedDays: 4,
    applicants: 6,
    verified: true,
    clientName: "BookingPro",
    clientRating: 4.9,
    clientProjects: 22,
  },
  {
    id: 6,
    title: "Tối ưu hiệu suất website e-commerce",
    description:
      "Website hiện tại có vấn đề về tốc độ tải. Cần audit và tối ưu Core Web Vitals, lazy loading, caching, và CDN. Lighthouse score cần đạt trên 90.",
    budget: { min: 5000000, max: 10000000 },
    type: "Ngắn hạn",
    skills: ["React", "Next.js", "AWS"],
    postedAt: "5 ngày trước",
    postedDays: 5,
    applicants: 9,
    verified: false,
    clientName: "FashionVN",
    clientRating: 3.8,
    clientProjects: 5,
  },
  {
    id: 7,
    title: "Xây dựng hệ thống CRM tùy chỉnh",
    description:
      "Phát triển hệ thống CRM nội bộ với quản lý khách hàng, pipeline bán hàng, báo cáo analytics và tích hợp email marketing tự động.",
    budget: { min: 35000000, max: 60000000 },
    type: "Dài hạn",
    skills: ["React", "Python", "Django", "PostgreSQL"],
    postedAt: "1 tuần trước",
    postedDays: 7,
    applicants: 14,
    verified: true,
    clientName: "SalesHub",
    clientRating: 4.6,
    clientProjects: 11,
  },
  {
    id: 8,
    title: "Thiết kế hệ thống design system",
    description:
      "Tạo design system hoàn chỉnh bao gồm typography, color tokens, components library trên Figma và tài liệu hướng dẫn sử dụng chi tiết.",
    budget: { min: 10000000, max: 20000000 },
    type: "Theo giờ",
    skills: ["Figma", "UI/UX"],
    postedAt: "1 tuần trước",
    postedDays: 7,
    applicants: 11,
    verified: true,
    clientName: "DesignFirst",
    clientRating: 4.7,
    clientProjects: 9,
  },
];

export function formatCurrency(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
}
