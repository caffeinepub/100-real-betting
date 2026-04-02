import { Toaster } from "@/components/ui/sonner";
import { useEffect, useRef, useState } from "react";
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

const STORAGE_KEYS = {
  USERS: "100real_registered_users",
  TRANSACTIONS: "100real_transactions",
  SESSION: "100real_session",
  NOTIFICATIONS: "100real_notifications",
} as const;

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key) ?? sessionStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore parse errors
  }
  return fallback;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    sessionStorage.setItem(key, serialized);
  } catch {
    // ignore storage errors
  }
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  sessionStorage.removeItem(STORAGE_KEYS.SESSION);
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "deposit",
    title: "Deposit Confirmed",
    detail:
      "Your deposit of PKR 1,000 via JazzCash has been confirmed and credited to your account.",
    icon: "\u2705",
    read: false,
  },
  {
    id: "2",
    type: "withdrawal",
    title: "Withdrawal Processed",
    detail:
      "Your withdrawal of PKR 2,500 has been processed. Funds will arrive in 2-4 hours via Easypaisa.",
    icon: "\ud83d\udcb8",
    read: false,
  },
  {
    id: "3",
    type: "promo",
    title: "\ud83d\udd25 50% Bonus on Next Deposit!",
    detail:
      "Deposit now and get a 50% bonus up to PKR 5,000! Limited time offer. Click to view Promotions.",
    icon: "\ud83c\udf81",
    read: false,
    link: "promotions",
  },
  {
    id: "4",
    type: "promo",
    title: "\ud83d\udc51 VIP Double XP Weekend!",
    detail:
      "This weekend only \u2014 earn double XP on all games! Level up faster. Check VIP rewards now.",
    icon: "\u26a1",
    read: false,
    link: "vip",
  },
  {
    id: "5",
    type: "system",
    title: "Welcome to 100%Real!",
    detail:
      "Welcome! Start playing now with 12 top game providers. Deposit with JazzCash or Easypaisa instantly.",
    icon: "\ud83c\udfb0",
    read: false,
  },
];

const REFERRAL_BONUS_PKR = 200;

type RegisteredUser = User & {
  password: string;
  referralCode?: string;
  balance: number;
};

export default function App() {
  const [page, setPage] = useState<Page>("lobby");
  const [modal, setModal] = useState<ModalState>("none");

  // Load session from storage — lazy init so it only runs once
  const [user, setUser] = useState<User | null>(() =>
    loadFromStorage<User | null>(STORAGE_KEYS.SESSION, null),
  );

  const [notifications, setNotifications] = useState<Notification[]>(() =>
    loadFromStorage<Notification[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      DEFAULT_NOTIFICATIONS,
    ),
  );

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() =>
    loadFromStorage<RegisteredUser[]>(STORAGE_KEYS.USERS, []),
  );

  const [transactionRequests, setTransactionRequests] = useState<
    TransactionRequest[]
  >(() => loadFromStorage<TransactionRequest[]>(STORAGE_KEYS.TRANSACTIONS, []));

  // Read ?ref= URL param on mount and auto-open register modal with code pre-filled
  const [urlRefCode, setUrlRefCode] = useState("");
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) return;
    didMount.current = true;

    // Restore admin page if session is admin
    const savedSession = loadFromStorage<User | null>(
      STORAGE_KEYS.SESSION,
      null,
    );
    if (savedSession?.isAdmin) {
      setPage("admin");
    }

    // Handle referral link (?ref=username)
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref && !savedSession) {
      setUrlRefCode(ref);
      setModal("register");
      // Clean the URL without reloading
      const clean = window.location.origin + window.location.pathname;
      window.history.replaceState({}, "", clean);
    }
  }, []);

  // Persist registeredUsers whenever it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USERS, registeredUsers);
  }, [registeredUsers]);

  // Persist transactions whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactionRequests);
  }, [transactionRequests]);

  // Persist session whenever logged-in user changes (save only, never clear reactively)
  useEffect(() => {
    if (user) {
      saveToStorage(STORAGE_KEYS.SESSION, user);
    }
    // NOTE: clearing session on logout is done explicitly in handleLogout, NOT here
    // to avoid wiping storage during initial render / StrictMode double-invoke
  }, [user]);

  // Persist notifications
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  // Sync balance from registeredUsers into logged-in user state
  useEffect(() => {
    if (user && !user.isAdmin) {
      const stored = registeredUsers.find((u) => u.username === user.username);
      if (stored && stored.balance !== user.balance) {
        setUser((prev) => (prev ? { ...prev, balance: stored.balance } : prev));
      }
    }
  }, [registeredUsers, user]);

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

    const newUser: RegisteredUser = { ...data, balance: startingBalance };
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    saveToStorage(STORAGE_KEYS.USERS, updatedUsers);

    const sessionUser: User = {
      username: data.username,
      name: data.name,
      phone: data.phone,
      balance: startingBalance,
    };
    setUser(sessionUser);
    saveToStorage(STORAGE_KEYS.SESSION, sessionUser);
    setModal("none");
    setUrlRefCode("");

    if (isValidReferral) {
      setTimeout(() => {
        toast.success(
          `\ud83c\udf81 PKR ${REFERRAL_BONUS_PKR} referral bonus credited to your account!`,
          { duration: 5000 },
        );
        addNotification({
          type: "promo",
          title: "\ud83c\udf81 Referral Bonus Credited!",
          detail: `You received PKR ${REFERRAL_BONUS_PKR} referral bonus for joining with a referral code. Start playing now!`,
          icon: "\ud83c\udf81",
        });
      }, 600);
    }
  }

  function handleLogin(username: string, password: string): boolean {
    if (username === "admin" && password === "admin123") {
      const adminUser: User = {
        username: "admin",
        name: "Administrator",
        phone: "-",
        isAdmin: true,
      };
      setUser(adminUser);
      saveToStorage(STORAGE_KEYS.SESSION, adminUser);
      setModal("none");
      setPage("admin");
      return true;
    }

    // Always read from storage to get the latest registered users
    const allUsers = loadFromStorage<RegisteredUser[]>(STORAGE_KEYS.USERS, []);
    const found = allUsers.find(
      (u) => u.username === username && u.password === password,
    );
    if (found) {
      setRegisteredUsers(allUsers);
      const sessionUser: User = {
        username: found.username,
        name: found.name,
        phone: found.phone,
        balance: found.balance,
      };
      setUser(sessionUser);
      saveToStorage(STORAGE_KEYS.SESSION, sessionUser);
      setModal("none");
      return true;
    }
    return false;
  }

  function handleLogout() {
    setUser(null);
    clearSession(); // explicitly clear storage only on logout
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
    const updated = [newReq, ...transactionRequests];
    setTransactionRequests(updated);
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, updated);
  }

  function handleUpdateRequest(id: string, status: "approved" | "rejected") {
    const updated = transactionRequests.map((r) =>
      r.id === id ? { ...r, status } : r,
    );
    setTransactionRequests(updated);
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, updated);

    const req = transactionRequests.find((r) => r.id === id);
    if (req && status === "approved") {
      const updatedUsers = registeredUsers.map((u) => {
        if (u.username === req.username) {
          const delta = req.type === "deposit" ? req.amount : -req.amount;
          return { ...u, balance: Math.max(0, (u.balance || 0) + delta) };
        }
        return u;
      });
      setRegisteredUsers(updatedUsers);
      saveToStorage(STORAGE_KEYS.USERS, updatedUsers);

      if (user && user.username === req.username) {
        const delta = req.type === "deposit" ? req.amount : -req.amount;
        const newBalance = Math.max(0, (user.balance || 0) + delta);
        const updatedSession = { ...user, balance: newBalance };
        setUser(updatedSession);
        saveToStorage(STORAGE_KEYS.SESSION, updatedSession);
      }
    }
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
        defaultReferralCode={urlRefCode}
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
