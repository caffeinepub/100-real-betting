import { Button } from "@/components/ui/button";
import {
  Bell,
  Download,
  Gift,
  LogOut,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import type { Page, User } from "../App";

interface HeaderProps {
  user: User | null;
  unreadCount: number;
  unreadPromoCount: number;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenNotifications: () => void;
  onOpenReferral: () => void;
  onOpenAPK: () => void;
  onOpenBalance: () => void;
  onLogout: () => void;
  currentPage: Page;
  onNavigate: (p: Page) => void;
}

const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: "Lobby", page: "lobby" },
  { label: "Games", page: "games" },
  { label: "VIP", page: "vip" },
  { label: "Promotions", page: "promotions" },
];

export function Header({
  user,
  unreadCount,
  unreadPromoCount,
  onOpenLogin,
  onOpenRegister,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenNotifications,
  onOpenReferral,
  onOpenAPK,
  onOpenBalance,
  onLogout,
  currentPage,
  onNavigate,
}: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border"
      style={{
        background: "oklch(0.11 0.08 285)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <button
            type="button"
            onClick={() => onNavigate("lobby")}
            className="flex-shrink-0 text-gold font-display text-xl font-black tracking-wider hover:opacity-80 transition-opacity"
            data-ocid="nav.link"
          >
            100%Real
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {!user?.isAdmin &&
              NAV_ITEMS.map((item) => {
                const isActive = currentPage === item.page;
                const showPromoBadge =
                  item.page === "promotions" &&
                  unreadPromoCount > 0 &&
                  !isActive;
                return (
                  <button
                    type="button"
                    key={item.page}
                    onClick={() => onNavigate(item.page)}
                    data-ocid={`nav.${item.page}.link`}
                    className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all font-body ${
                      isActive
                        ? "bg-pink-accent text-black"
                        : "text-foreground hover:text-gold hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                    {showPromoBadge && (
                      <span
                        className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-black flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.85 0.18 50), oklch(0.78 0.22 60))",
                          color: "#000",
                        }}
                      >
                        {unreadPromoCount}
                      </span>
                    )}
                  </button>
                );
              })}
            {user?.isAdmin && (
              <button
                type="button"
                onClick={() => onNavigate("admin")}
                data-ocid="nav.admin.link"
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all font-body flex items-center gap-1.5 ${
                  currentPage === "admin" ? "text-black" : "hover:bg-white/5"
                }`}
                style={{
                  background:
                    currentPage === "admin"
                      ? "oklch(0.85 0.18 50)"
                      : "transparent",
                  color:
                    currentPage === "admin" ? "black" : "oklch(0.85 0.18 50)",
                }}
              >
                <ShieldCheck size={14} />
                Admin Panel
              </button>
            )}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
              data-ocid="notifications.open_modal_button"
            >
              <Bell size={20} className="text-gold" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-pink-accent text-black text-[10px] font-black rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <Button
              type="button"
              onClick={onOpenAPK}
              data-ocid="header.download.button"
              className="hidden sm:flex items-center gap-1.5 font-black !text-black text-sm px-3 h-9"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.85 0.18 50), oklch(0.78 0.22 60))",
                boxShadow: "0 2px 10px oklch(0.85 0.18 50 / 0.35)",
                color: "#000000",
              }}
            >
              <Download size={14} />
              Download
            </Button>

            {!user ? (
              <>
                <Button
                  type="button"
                  onClick={onOpenLogin}
                  data-ocid="header.login.button"
                  className="bg-pink-accent hover:bg-pink-accent/90 !text-black font-black text-sm px-4 h-9"
                  style={{ color: "#000000" }}
                >
                  Login
                </Button>
                <Button
                  type="button"
                  onClick={onOpenRegister}
                  data-ocid="header.register.button"
                  className="bg-cyan-accent hover:bg-cyan-accent/90 !text-black font-black text-sm px-4 h-9"
                  style={{ color: "#000000" }}
                >
                  Register
                </Button>
              </>
            ) : (
              <>
                {!user.isAdmin && (
                  <button
                    type="button"
                    onClick={onOpenBalance}
                    data-ocid="header.balance.button"
                    className="hidden sm:flex items-center gap-1.5 px-3 h-9 rounded-lg font-black text-sm transition-all hover:opacity-80"
                    style={{
                      background: "oklch(0.85 0.18 50 / 0.15)",
                      border: "1px solid oklch(0.85 0.18 50 / 0.4)",
                      color: "oklch(0.85 0.18 50)",
                    }}
                  >
                    <Wallet size={14} />
                    PKR {(user.balance ?? 0).toLocaleString()}
                  </button>
                )}
                <span className="text-gold font-bold text-sm hidden sm:block">
                  {user.username}
                </span>
                {!user.isAdmin && (
                  <>
                    <Button
                      type="button"
                      onClick={onOpenDeposit}
                      data-ocid="header.deposit.button"
                      className="bg-gold hover:bg-gold/90 !text-black font-black text-sm px-4 h-9"
                      style={{ color: "#000000" }}
                    >
                      Deposit
                    </Button>
                    <Button
                      type="button"
                      onClick={onOpenWithdraw}
                      data-ocid="header.withdraw.button"
                      className="bg-green-neon hover:bg-green-neon/90 !text-black font-black text-sm px-3 h-9"
                      style={{ color: "#000000" }}
                    >
                      Withdraw
                    </Button>
                    <Button
                      type="button"
                      onClick={onOpenReferral}
                      data-ocid="header.referral.button"
                      className="hidden sm:flex items-center gap-1.5 font-black !text-black text-sm px-3 h-9"
                      style={{
                        background: "oklch(0.80 0.18 130)",
                        color: "#000000",
                      }}
                    >
                      <Gift size={14} />
                      Refer &amp; Earn
                    </Button>
                  </>
                )}
                <button
                  type="button"
                  onClick={onLogout}
                  data-ocid="header.logout.button"
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} className="text-muted-foreground" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-1 pb-2 overflow-x-auto scrollbar-thin">
          {!user?.isAdmin &&
            NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.page;
              const showPromoBadge =
                item.page === "promotions" && unreadPromoCount > 0 && !isActive;
              return (
                <button
                  type="button"
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  data-ocid={`mobile.nav.${item.page}.link`}
                  className={`relative px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-pink-accent text-black"
                      : "text-foreground hover:text-gold"
                  }`}
                >
                  {item.label}
                  {showPromoBadge && (
                    <span
                      className="absolute -top-1 -right-1 min-w-[14px] h-3.5 px-0.5 rounded-full text-[8px] font-black flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.85 0.18 50), oklch(0.78 0.22 60))",
                        color: "#000",
                      }}
                    >
                      {unreadPromoCount}
                    </span>
                  )}
                </button>
              );
            })}
          {user?.isAdmin && (
            <button
              type="button"
              onClick={() => onNavigate("admin")}
              data-ocid="mobile.nav.admin.link"
              className="px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1"
              style={{
                background:
                  currentPage === "admin"
                    ? "oklch(0.85 0.18 50)"
                    : "oklch(0.85 0.18 50 / 0.15)",
                color:
                  currentPage === "admin" ? "black" : "oklch(0.85 0.18 50)",
              }}
            >
              <ShieldCheck size={12} />
              Admin
            </button>
          )}
          {user && !user.isAdmin && (
            <>
              <button
                type="button"
                onClick={onOpenBalance}
                data-ocid="mobile.balance.button"
                className="px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1"
                style={{
                  background: "oklch(0.85 0.18 50 / 0.15)",
                  color: "oklch(0.85 0.18 50)",
                }}
              >
                <Wallet size={11} />
                PKR {(user.balance ?? 0).toLocaleString()}
              </button>
              <button
                type="button"
                onClick={onOpenReferral}
                data-ocid="mobile.referral.button"
                className="px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1"
                style={{
                  background: "oklch(0.80 0.18 130 / 0.2)",
                  color: "oklch(0.80 0.18 130)",
                }}
              >
                <Gift size={11} />
                Refer &amp; Earn
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onOpenAPK}
            data-ocid="mobile.download.button"
            className="px-3 py-1.5 rounded-md text-xs font-black whitespace-nowrap transition-all flex items-center gap-1"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.85 0.18 50), oklch(0.78 0.22 60))",
              color: "#000000",
            }}
          >
            <Download size={11} />
            Download
          </button>
        </div>
      </div>
    </header>
  );
}
