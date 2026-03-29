import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PaymentModal from "./components/PaymentModal";
import SignupModal from "./components/SignupModal";
import { BetSlipProvider } from "./context/BetSlipContext";
import AdminPanel from "./pages/AdminPanel";
import CasinoGames from "./pages/CasinoGames";
import Dashboard from "./pages/Dashboard";
import MyBets from "./pages/MyBets";
import Promotions from "./pages/Promotions";
import Support from "./pages/Support";

export type Page =
  | "dashboard"
  | "sports"
  | "live"
  | "promotions"
  | "support"
  | "my-bets"
  | "admin"
  | "casino";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [signupOpen, setSignupOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentTab, setPaymentTab] = useState<"deposit" | "withdraw">(
    "deposit",
  );

  const openDeposit = () => {
    setPaymentTab("deposit");
    setPaymentOpen(true);
  };
  const openWithdraw = () => {
    setPaymentTab("withdraw");
    setPaymentOpen(true);
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard":
      case "sports":
      case "live":
        return <Dashboard onNavigate={setPage} />;
      case "casino":
        return <CasinoGames />;
      case "my-bets":
        return <MyBets />;
      case "admin":
        return <AdminPanel />;
      case "promotions":
        return <Promotions />;
      case "support":
        return <Support />;
      default:
        return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <BetSlipProvider>
      <div className="min-h-screen flex flex-col">
        <Header
          currentPage={page}
          onNavigate={setPage}
          onOpenSignup={() => setSignupOpen(true)}
          onOpenDeposit={openDeposit}
          onOpenWithdraw={openWithdraw}
        />
        <main className="flex-1">{renderPage()}</main>
        <Footer />
      </div>
      <Toaster position="top-right" richColors />
      <SignupModal open={signupOpen} onClose={() => setSignupOpen(false)} />
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        defaultTab={paymentTab}
      />
    </BetSlipProvider>
  );
}
