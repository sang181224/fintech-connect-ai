import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Milestones from "./pages/Milestones";
import ContractDetail from "./pages/ContractDetail";
import Contracts from "./pages/Contracts";
import EscrowWallet from "./pages/EscrowWallet";
import Messages from "./pages/Messages";
import Disputes from "./pages/Disputes";
import Notifications from "./pages/Notifications";
import AIConsultant from "./pages/AIConsultant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/milestones" element={<Milestones />} />
          <Route path="/dashboard/contracts" element={<Contracts />} />
          <Route path="/dashboard/contracts/:contractId" element={<ContractDetail />} />
          <Route path="/dashboard/escrow" element={<EscrowWallet />} />
          <Route path="/dashboard/messages" element={<Messages />} />
          <Route path="/dashboard/disputes" element={<Disputes />} />
          <Route path="/dashboard/notifications" element={<Notifications />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
