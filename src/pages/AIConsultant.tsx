import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RoleSwitcher, UserRole } from "@/components/dashboard/RoleSwitcher";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot, Send, Sparkles, FileText, Wallet, Shield,
  Lightbulb, ArrowRight, RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  { icon: FileText, text: "Quy trình tạo hợp đồng mới như thế nào?", category: "Hợp đồng" },
  { icon: Wallet, text: "Escrow hoạt động ra sao? Tiền được bảo vệ thế nào?", category: "Escrow" },
  { icon: Shield, text: "Khi nào nên mở tranh chấp và quy trình xử lý?", category: "Tranh chấp" },
  { icon: Sparkles, text: "Làm sao để milestone được tự động phê duyệt?", category: "Milestone" },
];

const mockResponses: Record<string, string> = {
  "hợp đồng": `## Quy trình tạo hợp đồng

1. **Nhà thầu tạo hợp đồng** — Điền thông tin dự án, mô tả công việc, ngân sách tổng và thời hạn.
2. **Thiết lập Milestone** — Chia dự án thành các milestone nhỏ với giá trị và deadline cụ thể.
3. **Gửi cho Freelancer** — Freelancer nhận lời mời và xem xét điều khoản.
4. **Xác nhận & Nạp Escrow** — Sau khi đồng ý, Nhà thầu nạp tiền vào ví Escrow để bắt đầu.

> 💡 **Mẹo:** Hãy chia milestone càng chi tiết càng tốt để dễ theo dõi và giảm rủi ro tranh chấp.`,

  "escrow": `## Cơ chế Escrow

Escrow là hệ thống **giữ tiền trung gian** bảo vệ cả hai bên:

- 💰 **Nhà thầu nạp tiền** vào ví Escrow trước khi Freelancer bắt đầu làm việc
- 🔒 **Tiền được khóa** cho đến khi công việc được nghiệm thu
- ✅ **Giải ngân** khi Nhà thầu chấp nhận deliverable hoặc sau **24h tự động phê duyệt**
- ⚖️ **Tranh chấp** có thể mở nếu có bất đồng, Admin sẽ can thiệp

### Các trạng thái Escrow:
| Trạng thái | Mô tả |
|---|---|
| Chờ nạp tiền | Nhà thầu chưa nạp |
| Đang thực hiện | Freelancer đang làm việc |
| Đã gửi nghiệm thu | Chờ Nhà thầu duyệt |
| Chờ giải ngân | Đã duyệt, đang xử lý |
| Đã giải ngân | Hoàn tất |`,

  "tranh chấp": `## Quy trình Tranh chấp

### Khi nào nên mở tranh chấp?
- Freelancer không giao deliverable đúng hạn
- Chất lượng công việc không đạt yêu cầu đã thỏa thuận
- Nhà thầu không phản hồi nghiệm thu sau thời gian quy định

### Các bước xử lý:
1. **Mở tranh chấp** — Bên khiếu nại mô tả vấn đề và đính kèm bằng chứng
2. **Phản hồi** — Bên còn lại có **48h** để phản hồi
3. **Hòa giải** — Hai bên trao đổi trực tiếp qua hệ thống
4. **Leo thang** — Nếu không giải quyết được, Admin can thiệp
5. **Phán quyết** — Admin ra quyết định cuối cùng về phân chia tiền Escrow

> ⚠️ **Lưu ý:** Luôn giữ bằng chứng (file, tin nhắn, screenshot) để hỗ trợ quá trình xử lý.`,

  "milestone": `## Milestone & Tự động phê duyệt

### 8 trạng thái Milestone:
1. **Chờ nạp tiền** → Nhà thầu cần nạp Escrow
2. **Đang thực hiện** → Freelancer đang làm việc
3. **Đã gửi nghiệm thu** → Chờ Nhà thầu review
4. **Yêu cầu chỉnh sửa** → Cần sửa lại
5. **Chờ giải ngân** → Đã duyệt
6. **Đã giải ngân** → Hoàn tất
7. **Tranh chấp** → Đang khiếu nại
8. **Hết hạn tự hủy** → Quá deadline

### Tự động phê duyệt
Sau khi Freelancer gửi nghiệm thu, Nhà thầu có **24 giờ** để:
- ✅ Chấp nhận & giải ngân
- 📝 Yêu cầu chỉnh sửa
- ⚖️ Mở tranh chấp

Nếu không phản hồi trong 24h, hệ thống **tự động phê duyệt** và giải ngân.`,
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, value] of Object.entries(mockResponses)) {
    if (lower.includes(key)) return value;
  }
  return `Cảm ơn bạn đã hỏi! Đây là một số thông tin hữu ích:

### Hệ thống hỗ trợ
- **Hợp đồng**: Tạo, quản lý và theo dõi hợp đồng giữa Nhà thầu & Freelancer
- **Escrow**: Thanh toán an toàn qua ví trung gian
- **Milestone**: Chia nhỏ dự án, theo dõi tiến độ và nghiệm thu
- **Tranh chấp**: Giải quyết bất đồng minh bạch với sự hỗ trợ của Admin

Bạn có thể hỏi cụ thể hơn về bất kỳ chủ đề nào ở trên, tôi sẽ giải đáp chi tiết! 😊`;
}

export default function AIConsultant() {
  const [role, setRole] = useState<UserRole>("contractor");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`, role: "user", content: text.trim(), timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `a-${Date.now()}`, role: "assistant", content: getResponse(text), timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const resetChat = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground font-heading">AI Tư vấn</h1>
            <p className="text-sm text-muted-foreground">Hỏi đáp về hợp đồng, milestone & escrow</p>
          </div>
        </div>
        <RoleSwitcher role={role} onRoleChange={setRole} />
      </div>

      <Card className="flex flex-col h-[calc(100vh-10rem)] overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Welcome */}
            {messages.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-8">
                <div className="text-center mb-8">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Xin chào! Tôi là AI Tư vấn 👋</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Tôi có thể giúp bạn hiểu rõ về quy trình hợp đồng, thanh toán escrow, quản lý milestone và giải quyết tranh chấp.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestedQuestions.map((q, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      onClick={() => sendMessage(q.text)}
                      className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 text-left transition-colors group"
                    >
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <q.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <Badge variant="secondary" className="text-[10px] mb-1">{q.category}</Badge>
                        <p className="text-sm text-foreground leading-snug">{q.text}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Messages */}
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mr-2 mt-1 shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&_table]:text-xs [&_th]:px-3 [&_td]:px-3 [&_th]:py-1.5 [&_td]:py-1.5">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-3 border-t border-border shrink-0">
          <div className="flex items-center gap-2 max-w-3xl mx-auto">
            {messages.length > 0 && (
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={resetChat} title="Làm mới">
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            <div className="relative flex-1 flex items-center">
              <Lightbulb className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Hỏi về hợp đồng, escrow, milestone..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage(input))}
                className="pl-9 h-9"
                disabled={isTyping}
              />
            </div>
            <Button size="icon" className="h-9 w-9 shrink-0" onClick={() => sendMessage(input)} disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
