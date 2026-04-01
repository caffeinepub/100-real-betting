import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { APKDownloadModal } from "./components/APKDownloadModal";
import { DepositModal } from "./components/DepositModal";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LoginModal } from "./components/LoginModal";
import { NotificationsPanel } from "./components/NotificationsPanel";
import { ReferralModal } from "./components/ReferralModal";
import { RegisterModal } from "./components/RegisterModal";
import { WelcomePopup } from "./components/WelcomePopup";
import { WithdrawModal } from "./components/WithdrawModal";
import { AdminPanel } from "./pages/AdminPanel";
import { BalancePage } from "./pages/BalancePage";
import { CasinoGamesPage } from "./pages/CasinoGamesPage";
import { CasinoLobby } from "./pages/CasinoLobby";
import { PromotionsPage } from "./pages/PromotionsPage";
import { VipPage } from "./pages/VipPage";
import { getUrlParameter } from "./utils/urlParams";

export type Page =
  | "lobby"
  | "games"
  | "vip"
  | "promotions"
  | "admin"
  | "balance";

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

const REFERRAL_BONUS_PKR = 200;

function useLocalState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  function setAndPersist(updater: T | ((prev: T) => T)) {
    setState((prev) => {
      const next =
        typeof updater === "function"
          ? (updater as (prev: T) => T)(prev)
          : updater;
      try {
        if (next === null || next === undefined) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(next));
        }
      } catch {}
      return next;
    });
  }

  return [state, setAndPersist] as const;
}

export default function App() {
  const [page, setPage] = useState<Page>("lobby");
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  // Read ?ref= from URL on first mount
  const [initialReferralCode] = useState<string>(
    () => getUrlParameter("ref") ?? "",
  );
  const [modal, setModal] = useState<ModalState>(() =>
    getUrlParameter("ref") ? "register" : "none",
  );

  const [user, setUser] = useLocalState<User | null>("app_current_user", null);
  const [userNotifications, setUserNotifications] = useLocalState<
    Record<string, Notification[]>
  >("app_notifications", {});
  const [registeredUsers, setRegisteredUsers] = useLocalState<
    Array<User & { password: string; referralCode?: string; balance: number }>
  >("app_registered_users", []);
  const [transactionRequests, setTransactionRequests] = useLocalState<
    TransactionRequest[]
  >("app_transactions", []);

  // Push history entry whenever page or modal changes
  useEffect(() => {
    history.pushState({ page, modal }, "");
  }, [page, modal]);

  // Handle Android/browser back button via popstate
  useEffect(() => {
    function handlePopState(e: PopStateEvent) {
      const state = e.state as { page?: Page; modal?: ModalState } | null;
      if (state) {
        setPage(state.page ?? "lobby");
        setModal(state.modal ?? "none");
      } else {
        setPage("lobby");
        setModal("none");
      }
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Sync restored session balance with registeredUsers on refresh
  useEffect(() => {
    if (user && !user.isAdmin) {
      const found = registeredUsers.find((u) => u.username === user.username);
      if (found && found.balance !== user.balance) {
        setUser((prev) => (prev ? { ...prev, balance: found.balance } : prev));
      }
    }
  }, [registeredUsers, user, setUser]);

  const notifications =
    user && !user.isAdmin ? (userNotifications[user.username] ?? []) : [];
  const unreadCount = notifications.filter((n) => !n.read).length;
  const unreadPromoCount = notifications.filter(
    (n) => !n.read && n.type === "promo",
  ).length;

  const referralCount = user
    ? registeredUsers.filter((u) => u.referralCode === user.username).length
    : 0;

  const referredMembers = user
    ? registeredUsers
        .filter((u) => u.referralCode === user.username)
        .map((u) => ({ username: u.username, name: u.name, joinedAt: "" }))
    : [];

  function markRead(id: string) {
    if (!user) return;
    setUserNotifications((prev) => ({
      ...prev,
      [user.username]: (prev[user.username] ?? []).map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));
  }

  function addNotificationForUser(
    username: string,
    notification: Omit<Notification, "id" | "read">,
  ) {
    const newNotif: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      read: false,
    };
    setUserNotifications((prev) => ({
      ...prev,
      [username]: [newNotif, ...(prev[username] ?? [])],
    }));
  }

  function handleBroadcastNotification(
    targets: string[] | "all",
    title: string,
    detail: string,
  ) {
    const recipients =
      targets === "all" ? registeredUsers.map((u) => u.username) : targets;
    for (const username of recipients) {
      addNotificationForUser(username, {
        type: "promo",
        icon: "📢",
        title,
        detail,
        link: "promotions",
      });
    }
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
    const newUser: User = {
      username: data.username,
      name: data.name,
      phone: data.phone,
      balance: startingBalance,
    };
    setUser(newUser);
    setModal("none");
    if (!localStorage.getItem("100real_welcome_dismissed")) {
      setShowWelcomePopup(true);
    }

    addNotificationForUser(data.username, {
      type: "system",
      title: "Welcome to 100%Real!",
      detail:
        "Welcome! Start playing now with 12 top game providers. Deposit with JazzCash or Easypaisa instantly.",
      icon: "🎰",
    });

    if (isValidReferral) {
      setTimeout(() => {
        toast.success(
          `🎁 PKR ${REFERRAL_BONUS_PKR} referral bonus credited to your account!`,
          { duration: 5000 },
        );
        addNotificationForUser(data.username, {
          type: "promo",
          title: "🎁 Referral Bonus Credited!",
          detail: `You received PKR ${REFERRAL_BONUS_PKR} referral bonus for joining with a referral code. Start playing now!`,
          icon: "🎁",
          link: "promotions",
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
      if (!localStorage.getItem("100real_welcome_dismissed")) {
        setShowWelcomePopup(true);
      }
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

  function handleDeleteMember(username: string) {
    setRegisteredUsers((prev) => prev.filter((u) => u.username !== username));
  }

  function handleUpdateRequest(id: string, status: "approved" | "rejected") {
    const req = transactionRequests.find((r) => r.id === id);

    setTransactionRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );

    if (req && status === "approved") {
      const delta = req.type === "deposit" ? req.amount : -req.amount;

      setRegisteredUsers((prev) =>
        prev.map((u) =>
          u.username === req.username
            ? { ...u, balance: Math.max(0, (u.balance ?? 0) + delta) }
            : u,
        ),
      );

      setUser((prev) => {
        if (!prev || prev.username !== req.username) return prev;
        return { ...prev, balance: Math.max(0, (prev.balance ?? 0) + delta) };
      });

      addNotificationForUser(req.username, {
        type: req.type === "deposit" ? "deposit" : "withdrawal",
        title:
          req.type === "deposit"
            ? "✅ Deposit Approved"
            : "💸 Withdrawal Approved",
        detail:
          req.type === "deposit"
            ? `Your deposit of PKR ${req.amount.toLocaleString()} via ${req.method} has been approved and credited to your account.`
            : `Your withdrawal of PKR ${req.amount.toLocaleString()} via ${req.method} has been approved and is being processed.`,
        icon: req.type === "deposit" ? "✅" : "💸",
      });
    } else if (req && status === "rejected") {
      addNotificationForUser(req.username, {
        type: req.type === "deposit" ? "deposit" : "withdrawal",
        title:
          req.type === "deposit"
            ? "❌ Deposit Rejected"
            : "❌ Withdrawal Rejected",
        detail: `Your ${req.type} request of PKR ${req.amount.toLocaleString()} via ${req.method} was rejected. Please contact support if you need help.`,
        icon: "❌",
      });
    }
  }

  return (
    <div className="min-h-screen casino-gradient flex flex-col">
      <Toaster position="top-center" richColors />
      <Header
        user={user}
        unreadCount={unreadCount}
        unreadPromoCount={unreadPromoCount}
        onOpenLogin={() => setModal("login")}
        onOpenRegister={() => setModal("register")}
        onOpenDeposit={() => setModal("deposit")}
        onOpenWithdraw={() => setModal("withdraw")}
        onOpenNotifications={() => setModal("notifications")}
        onOpenReferral={() => setModal("referral")}
        onOpenAPK={() => setModal("apk")}
        onOpenBalance={() => navigateTo("balance")}
        onLogout={handleLogout}
        currentPage={page}
        onNavigate={navigateTo}
      />

      <main className="flex-1">
        {page !== "lobby" && page !== "admin" && (
          <div className="px-4 pt-3 pb-1">
            <button
              type="button"
              data-ocid="nav.back_button"
              onClick={() => navigateTo("lobby")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm"
              style={{
                background: "oklch(0.82 0.22 75 / 0.15)",
                border: "1px solid oklch(0.82 0.22 75 / 0.4)",
                color: "oklch(0.82 0.22 75)",
              }}
            >
              ← Back to Lobby
            </button>
          </div>
        )}
        {page === "lobby" && <CasinoLobby onNavigate={navigateTo} />}
        {page === "games" && <CasinoGamesPage />}
        {page === "vip" && <VipPage />}
        {page === "promotions" && <PromotionsPage />}
        {page === "balance" && user && !user.isAdmin && (
          <BalancePage user={user} transactions={transactionRequests} />
        )}
        {page === "admin" && (
          <AdminPanel
            members={registeredUsers}
            transactionRequests={transactionRequests}
            onUpdateRequest={handleUpdateRequest}
            onDeleteMember={handleDeleteMember}
            onBroadcastNotification={handleBroadcastNotification}
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
        initialReferralCode={initialReferralCode}
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
          referredMembers={referredMembers}
        />
      )}

      <APKDownloadModal
        open={modal === "apk"}
        onClose={() => setModal("none")}
      />

      <WelcomePopup
        open={showWelcomePopup}
        onClose={() => setShowWelcomePopup(false)}
      />
    </div>
  );
}
