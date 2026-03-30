import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { toast } from "sonner";
import { APKDownloadModal } from "./components/APKDownloadModal";
import { DepositModal } from "./components/DepositModal";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LoginModal } from "./components/LoginModal";
import { NotificationsPanel } from "./components/NotificationsPanel";
import { ReferralModal } from "./components/ReferralModal";
import { RegisterModal } from "./components/RegisterModal";
import { WithdrawModal } from "./components/WithdrawModal";
import { AdminPanel } from "./pages/AdminPanel";
import { CasinoGamesPage } from "./pages/CasinoGamesPage";
import { CasinoLobby } from "./pages/CasinoLobby";
import { PromotionsPage } from "./pages/PromotionsPage";
import { VipPage } from "./pages/VipPage";

export type Page = "lobby" | "games" | "vip" | "promotions" | "admin";

export type User = {
  username: string;
  name: string;
  phone: string;
  isAdmin?: boolean;
  balance?: number;
};

export type ModalState =
  | "none"
  | "login"
  | "register"
  | "deposit"
  | "withdraw"
  | "notifications"
  | "referral"
  | "apk";

export type Notification = {
  id: string;
  type: "deposit" | "withdrawal" | "promo" | "system";
  title: string;
  detail: string;
  icon: string;
  read: boolean;
  link?: Page;
};

export type TransactionRequest = {
  id: string;
  type: "deposit" | "withdrawal";
  username: string;
  amount: number;
  method: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  receiptUrl?: string;
  accountNumber?: string;
};

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "deposit",
    title: "Deposit Confirmed",
    detail:
      "Your deposit of PKR 1,000 via JazzCash has been confirmed and credited to your account.",
    icon: "✅",
    read: false,
  },
  {
    id: "2",
    type: "withdrawal",
    title: "Withdrawal Processed",
    detail:
      "Your withdrawal of PKR 2,500 has been processed. Funds will arrive in 2–4 hours via Easypaisa.",
    icon: "💸",
    read: false,
  },
  {
    id: "3",
    type: "promo",
    title: "🔥 50% Bonus on Next Deposit!",
    detail:
      "Deposit now and get a 50% bonus up to PKR 5,000! Limited time offer. Click to view Promotions.",
    icon: "🎁",
    read: false,
    link: "promotions",
  },
  {
    id: "4",
    type: "promo",
    title: "👑 VIP Double XP Weekend!",
    detail:
      "This weekend only — earn double XP on all games! Level up faster. Check VIP rewards now.",
    icon: "⚡",
    read: false,
    link: "vip",
  },
  {
    id: "5",
    type: "system",
    title: "Welcome to 100%Real!",
    detail:
      "Welcome! Start playing now with 12 top game providers. Deposit with JazzCash or Easypaisa instantly.",
    icon: "🎰",
    read: false,
  },
];

const REFERRAL_BONUS_PKR = 200;

export default function App() {
  const [page, setPage] = useState<Page>("lobby");
  const [modal, setModal] = useState<ModalState>("none");
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(
    DEFAULT_NOTIFICATIONS,
  );
  const [registeredUsers, setRegisteredUsers] = useState<
    Array<User & { password: string; referralCode?: string; balance: number }>
  >([]);
  const [transactionRequests, setTransactionRequests] = useState<
    TransactionRequest[]
  >([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const referralCount = user
    ? registeredUsers.filter((u) => u.referralCode === user.username).length
    : 0;

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  function addNotification(notification: Omit<Notification, "id" | "read">) {
    const newNotif: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }

  function handleRegister(
    data: User & { password: string; referralCode?: string },
  ) {
    const referralCode = data.referralCode?.trim();
    const isValidReferral =
      referralCode && registeredUsers.some((u) => u.username === referralCode);

    const startingBalance = isValidReferral ? REFERRAL_BONUS_PKR : 0;

    setRegisteredUsers((prev) => [
      ...prev,
      { ...data, balance: startingBalance },
    ]);
    setUser({
      username: data.username,
      name: data.name,
      phone: data.phone,
      balance: startingBalance,
    });
    setModal("none");

    if (isValidReferral) {
      setTimeout(() => {
        toast.success(
          `🎁 PKR ${REFERRAL_BONUS_PKR} referral bonus credited to your account!`,
          { duration: 5000 },
        );
        addNotification({
          type: "promo",
          title: "🎁 Referral Bonus Credited!",
          detail: `You received PKR ${REFERRAL_BONUS_PKR} referral bonus for joining with a referral code. Start playing now!`,
          icon: "🎁",
        });
      }, 600);
    }
  }

  function handleLogin(username: string, password: string): boolean {
    if (username === "admin" && password === "admin123") {
      setUser({
        username: "admin",
        name: "Administrator",
        phone: "-",
        isAdmin: true,
      });
      setModal("none");
      setPage("admin");
      return true;
    }
    const found = registeredUsers.find(
      (u) => u.username === username && u.password === password,
    );
    if (found) {
      setUser({
        username: found.username,
        name: found.name,
        phone: found.phone,
        balance: found.balance,
      });
      setModal("none");
      return true;
    }
    return false;
  }

  function handleLogout() {
    setUser(null);
    setModal("none");
    setPage("lobby");
  }

  function navigateTo(p: Page) {
    setPage(p);
    setModal("none");
  }

  function handleSubmitRequest(
    req: Omit<TransactionRequest, "id" | "status" | "submittedAt">,
  ) {
    const newReq: TransactionRequest = {
      ...req,
      id: `txn-${Date.now()}`,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    setTransactionRequests((prev) => [newReq, ...prev]);
  }

  function handleUpdateRequest(id: string, status: "approved" | "rejected") {
    setTransactionRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
  }

  return (
    <div className="min-h-screen casino-gradient flex flex-col">
      <Toaster position="top-center" richColors />
      <Header
        user={user}
        unreadCount={unreadCount}
        onOpenLogin={() => setModal("login")}
        onOpenRegister={() => setModal("register")}
        onOpenDeposit={() => setModal("deposit")}
        onOpenWithdraw={() => setModal("withdraw")}
        onOpenNotifications={() => setModal("notifications")}
        onOpenReferral={() => setModal("referral")}
        onOpenAPK={() => setModal("apk")}
        onLogout={handleLogout}
        currentPage={page}
        onNavigate={navigateTo}
      />

      <main className="flex-1">
        {page === "lobby" && <CasinoLobby onNavigate={navigateTo} />}
        {page === "games" && <CasinoGamesPage />}
        {page === "vip" && <VipPage />}
        {page === "promotions" && <PromotionsPage />}
        {page === "admin" && (
          <AdminPanel
            members={registeredUsers}
            transactionRequests={transactionRequests}
            onUpdateRequest={handleUpdateRequest}
          />
        )}
      </main>

      <Footer />

      <LoginModal
        open={modal === "login"}
        onClose={() => setModal("none")}
        onLogin={handleLogin}
        onSwitchToRegister={() => setModal("register")}
      />

      <RegisterModal
        open={modal === "register"}
        onClose={() => setModal("none")}
        onRegister={handleRegister}
        onSwitchToLogin={() => setModal("login")}
        existingUsers={registeredUsers.map((u) => u.username)}
      />

      <DepositModal
        open={modal === "deposit"}
        onClose={() => setModal("none")}
        username={user?.username}
        onSubmitRequest={handleSubmitRequest}
      />

      <WithdrawModal
        open={modal === "withdraw"}
        onClose={() => setModal("none")}
        username={user?.username}
        onSubmitRequest={handleSubmitRequest}
      />

      <NotificationsPanel
        open={modal === "notifications"}
        onClose={() => setModal("none")}
        notifications={notifications}
        onMarkRead={markRead}
        onNavigate={(p) => {
          navigateTo(p);
        }}
      />

      {user && !user.isAdmin && (
        <ReferralModal
          open={modal === "referral"}
          onClose={() => setModal("none")}
          username={user.username}
          referralCount={referralCount}
        />
      )}

      <APKDownloadModal
        open={modal === "apk"}
        onClose={() => setModal("none")}
      />
    </div>
  );
}
