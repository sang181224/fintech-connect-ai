import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RoleSwitcher, UserRole } from "@/components/dashboard/RoleSwitcher";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send, Paperclip, Search, Phone, Video, MoreVertical,
  Image, File, Check, CheckCheck, Smile, Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  type: "text" | "file" | "image";
  fileName?: string;
  fileSize?: string;
  status: "sent" | "delivered" | "read";
}

interface Conversation {
  id: string;
  name: string;
  initials: string;
  role: string;
  contract: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const now = new Date();
const h = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 3600000);

const mockConversations: Conversation[] = [
  {
    id: "1", name: "Nguyễn Minh Tú", initials: "MT", role: "Freelancer",
    contract: "HĐ #1092 — Thiết kế UI/UX", lastMessage: "Em đã gửi file mockup mới ạ",
    lastTime: "10 phút", unread: 3, online: true,
    messages: [
      { id: "m1", senderId: "them", text: "Chào anh, em bắt đầu thiết kế trang Dashboard rồi ạ", timestamp: h(5), type: "text", status: "read" },
      { id: "m2", senderId: "me", text: "Ok em, anh muốn dùng tone màu xanh chủ đạo nhé", timestamp: h(4.5), type: "text", status: "read" },
      { id: "m3", senderId: "them", text: "Dạ anh, em note lại rồi. Em gửi bản draft đầu tiên", timestamp: h(3), type: "text", status: "read" },
      { id: "m4", senderId: "them", text: "", timestamp: h(2), type: "file", fileName: "Dashboard_v1.fig", fileSize: "12.4 MB", status: "read" },
      { id: "m5", senderId: "me", text: "Đẹp lắm em! Anh có vài feedback nhỏ", timestamp: h(1.5), type: "text", status: "read" },
      { id: "m6", senderId: "me", text: "1. Header nên fixed\n2. Sidebar thêm icon cho menu\n3. Card thống kê cần shadow nhẹ hơn", timestamp: h(1.4), type: "text", status: "read" },
      { id: "m7", senderId: "them", text: "Em đã gửi file mockup mới ạ", timestamp: h(0.2), type: "text", status: "delivered" },
      { id: "m8", senderId: "them", text: "", timestamp: h(0.1), type: "image", fileName: "Dashboard_v2_preview.png", fileSize: "2.1 MB", status: "delivered" },
    ],
  },
  {
    id: "2", name: "Trần Văn Hùng", initials: "VH", role: "Freelancer",
    contract: "HĐ #1088 — Backend API", lastMessage: "API endpoint đã deploy xong",
    lastTime: "1 giờ", unread: 1, online: true,
    messages: [
      { id: "m1", senderId: "them", text: "Anh ơi, em đã setup xong database schema", timestamp: h(24), type: "text", status: "read" },
      { id: "m2", senderId: "me", text: "Ok, em gửi anh document API spec nhé", timestamp: h(23), type: "text", status: "read" },
      { id: "m3", senderId: "them", text: "", timestamp: h(22), type: "file", fileName: "API_Specification_v2.pdf", fileSize: "3.8 MB", status: "read" },
      { id: "m4", senderId: "them", text: "API endpoint đã deploy xong", timestamp: h(1), type: "text", status: "delivered" },
    ],
  },
  {
    id: "3", name: "Lê Thị Hương", initials: "TH", role: "Freelancer",
    contract: "HĐ #1095 — SEO Content", lastMessage: "Em gửi 5 bài viết đợt 1 ạ",
    lastTime: "3 giờ", unread: 0, online: false,
    messages: [
      { id: "m1", senderId: "me", text: "Chào em, brief content đã gửi qua email rồi nhé", timestamp: h(48), type: "text", status: "read" },
      { id: "m2", senderId: "them", text: "Dạ em nhận được rồi ạ. Em sẽ hoàn thành trong 3 ngày", timestamp: h(47), type: "text", status: "read" },
      { id: "m3", senderId: "them", text: "Em gửi 5 bài viết đợt 1 ạ", timestamp: h(3), type: "text", status: "read" },
      { id: "m4", senderId: "them", text: "", timestamp: h(3), type: "file", fileName: "SEO_Content_Batch1.docx", fileSize: "856 KB", status: "read" },
    ],
  },
  {
    id: "4", name: "Phạm Đức Anh", initials: "ĐA", role: "Nhà thầu",
    contract: "HĐ #1100 — Mobile App", lastMessage: "Bao giờ em gửi bản build được?",
    lastTime: "5 giờ", unread: 0, online: false,
    messages: [
      { id: "m1", senderId: "them", text: "Em ơi, tiến độ dự án thế nào rồi?", timestamp: h(8), type: "text", status: "read" },
      { id: "m2", senderId: "me", text: "Dạ anh, em đang hoàn thiện phần authentication ạ", timestamp: h(7), type: "text", status: "read" },
      { id: "m3", senderId: "them", text: "Bao giờ em gửi bản build được?", timestamp: h(5), type: "text", status: "read" },
    ],
  },
];

export default function Messages() {
  const [role, setRole] = useState<UserRole>("contractor");
  const [conversations] = useState(mockConversations);
  const [activeId, setActiveId] = useState(mockConversations[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>(() => {
    const map: Record<string, Message[]> = {};
    mockConversations.forEach(c => { map[c.id] = [...c.messages]; });
    return map;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConv = conversations.find(c => c.id === activeId)!;
  const messages = localMessages[activeId] || [];

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contract.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: `new-${Date.now()}`, senderId: "me", text: newMessage.trim(),
      timestamp: new Date(), type: "text", status: "sent",
    };
    setLocalMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] || []), msg] }));
    setNewMessage("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const msg: Message = {
      id: `file-${Date.now()}`, senderId: "me", text: "",
      timestamp: new Date(), type: isImage ? "image" : "file",
      fileName: file.name, fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      status: "sent",
    };
    setLocalMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] || []), msg] }));
    e.target.value = "";
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "read") return <CheckCheck className="h-3.5 w-3.5 text-primary" />;
    if (status === "delivered") return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />;
    return <Check className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  const formatTime = (d: Date) => d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-foreground font-heading">Tin nhắn</h1>
        <RoleSwitcher role={role} onRoleChange={setRole} />
      </div>

      <Card className="flex h-[calc(100vh-10rem)] overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-border flex flex-col shrink-0">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm cuộc trò chuyện..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {filtered.map(conv => (
              <button
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={`w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-muted/50 ${
                  activeId === conv.id ? "bg-secondary/60" : ""
                }`}
              >
                <div className="relative shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {conv.initials}
                    </AvatarFallback>
                  </Avatar>
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[hsl(var(--success))] border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground truncate">{conv.name}</span>
                    <span className="text-[11px] text-muted-foreground shrink-0">{conv.lastTime}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.contract}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <Badge className="bg-primary text-primary-foreground text-[10px] h-5 min-w-5 flex items-center justify-center rounded-full shrink-0">
                    {conv.unread}
                  </Badge>
                )}
              </button>
            ))}
          </ScrollArea>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {activeConv.initials}
                  </AvatarFallback>
                </Avatar>
                {activeConv.online && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[hsl(var(--success))] border-2 border-card" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{activeConv.name}</p>
                <p className="text-xs text-muted-foreground">
                  {activeConv.online ? "Đang hoạt động" : "Offline"} · {activeConv.contract}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Video className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3 max-w-3xl mx-auto">
              <AnimatePresence initial={false}>
                {messages.map(msg => {
                  const isMe = msg.senderId === "me";
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] ${isMe ? "order-1" : ""}`}>
                        {msg.type === "text" && (
                          <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            isMe
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>
                        )}
                        {msg.type === "file" && (
                          <div className={`rounded-2xl px-4 py-3 text-sm ${
                            isMe
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                                isMe ? "bg-primary-foreground/20" : "bg-primary/10"
                              }`}>
                                <File className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium truncate">{msg.fileName}</p>
                                <p className={`text-xs ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                  {msg.fileSize}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {msg.type === "image" && (
                          <div className={`rounded-2xl overflow-hidden text-sm ${
                            isMe
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}>
                            <div className="h-40 bg-muted/30 flex items-center justify-center">
                              <Image className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="px-4 py-2">
                              <p className="text-xs truncate">{msg.fileName}</p>
                              <p className={`text-[11px] ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                {msg.fileSize}
                              </p>
                            </div>
                          </div>
                        )}
                        <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                          <span className="text-[11px] text-muted-foreground">{formatTime(msg.timestamp)}</span>
                          {isMe && <StatusIcon status={msg.status} />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-border shrink-0">
            <div className="flex items-center gap-2 max-w-3xl mx-auto">
              <Button
                variant="ghost" size="icon" className="h-9 w-9 shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.fig,.sketch,.zip"
              />
              <Input
                placeholder="Nhập tin nhắn..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                className="flex-1 h-9"
              />
              <Button
                size="icon" className="h-9 w-9 shrink-0"
                onClick={handleSend}
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
