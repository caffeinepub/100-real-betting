import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Bell, Download, LogIn, LogOut, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { LocalUser, Page } from "../App";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenSignup: () => void;
  onOpenLogin: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  localUser: LocalUser | null;
  onLogout: () => void;
}

const NOTIFICATIONS = [
  {
    id: 1,
    type: "deposit",
    text: "Deposit of PKR 5,000 confirmed",
    time: "2 min ago",
    detail:
      "Your JazzCash deposit of PKR 5,000 has been successfully credited to your account. Your balance has been updated. Reference: TXN-20260329-001.",
  },
  {
    id: 2,
    type: "withdrawal",
    text: "Withdrawal of PKR 2,500 processed",
    time: "15 min ago",
    detail:
      "Your withdrawal request of PKR 2,500 to Easypaisa (03125030697) has been processed and sent. Funds typically arrive within 1–2 hours. Reference: WDR-20260329-042.",
  },
  {
    id: 3,
    type: "promo",
    text: "🎁 50% Bonus on your next deposit!",
    time: "1 hr ago",
    detail:
      "Limited time offer! Deposit between PKR 1,000 and PKR 10,000 today and receive a 50% bonus credited instantly to your account. Offer expires midnight tonight.",
  },
  {
    id: 4,
    type: "promo",
    text: "🏆 VIP Exclusive: Double XP Weekend",
    time: "3 hrs ago",
    detail:
      "As a VIP member, you earn double loyalty points this weekend on all casino games. Level up faster and unlock premium rewards. Valid Sat–Sun only.",
  },
  {
    id: 5,
    type: "system",
    text: "Welcome to 100%Real! Your account is ready",
    time: "1 day ago",
    detail:
      "Your account has been successfully created. You can now deposit funds and start placing bets. Enjoy a welcome bonus on your first deposit!",
  },
];

const NOTIF_ICONS: Record<string, string> = {
  deposit: "💰",
  withdrawal: "🏧",
  promo: "🎁",
  system: "🔔",
};

const PINK = "oklch(0.65 0.22 330)";
const PURPLE_DARK = "oklch(0.13 0.09 280)";
const PURPLE_MID = "oklch(0.22 0.07 275)";
const PURPLE_CARD = "oklch(0.18 0.08 280)";
const CYAN = "oklch(0.72 0.15 195)";
const GOLD = "#FFD700";
const GREEN = "oklch(0.65 0.17 155)";

export default function Header({
  currentPage,
  onNavigate,
  onOpenSignup,
  onOpenLogin,
  onOpenDeposit,
  onOpenWithdraw,
  localUser,
  onLogout,
}: HeaderProps) {
  const isLoggedIn = !!localUser;
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(5);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  const handleBellClick = () => {
    setNotifOpen((prev) => !prev);
    setUnread(0);
  };

  const handleNotifClick = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const navLinks: { id: Page; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "sports", label: "Sports" },
    { id: "live", label: "Live Betting" },
    { id: "casino", label: "Casino" },
    { id: "promotions", label: "Promotions" },
    { id: "support", label: "Support" },
    { id: "my-bets", label: "My Bets" },
    { id: "vip", label: "⭐ VIP" },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b shadow-sm"
        style={{
          background: PURPLE_DARK,
          borderColor: PURPLE_MID,
        }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">
          {/* Brand */}
          <button
            type="button"
            className="flex items-center gap-2 flex-shrink-0 focus:outline-none"
            onClick={() => onNavigate("dashboard")}
          >
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center"
              style={{ background: PINK }}
            >
              <span className="font-black text-xs text-white">%</span>
            </div>
            <span className="font-black text-lg tracking-tight">
              <span style={{ color: GOLD }}>100%</span>
              <span className="text-white">Real</span>
            </span>
          </button>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 overflow-x-auto">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                data-ocid={`nav.${link.id}.link`}
                onClick={() => onNavigate(link.id)}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                style={{
                  color:
                    currentPage === link.id
                      ? link.id === "vip"
                        ? "#1a0e00"
                        : "white"
                      : link.id === "vip"
                        ? GOLD
                        : "oklch(0.75 0.04 280)",
                  background:
                    currentPage === link.id
                      ? link.id === "vip"
                        ? GOLD
                        : PINK
                      : "transparent",
                  fontWeight: link.id === "vip" ? 700 : undefined,
                }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Download App Button */}
            <button
              type="button"
              data-ocid="header.download.button"
              onClick={() => setDownloadOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold border transition-colors hover:bg-white/10"
              style={{
                borderColor: "rgba(255,255,255,0.3)",
                color: CYAN,
                background: "transparent",
              }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download App</span>
            </button>

            {isLoggedIn ? (
              <>
                <div
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: PURPLE_CARD }}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback
                      className="text-xs text-white"
                      style={{ background: PINK }}
                    >
                      {localUser.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-xs">
                    <div className="font-semibold text-white">
                      {localUser.username}
                    </div>
                    <div style={{ color: CYAN }}>Welcome back!</div>
                  </div>
                </div>

                {/* Deposit button — bright green, always visible */}
                <button
                  type="button"
                  data-ocid="header.deposit.button"
                  onClick={onOpenDeposit}
                  className="px-4 py-2 rounded-md text-sm font-extrabold transition-all hover:opacity-90 active:scale-95"
                  style={{
                    background: "#16a34a",
                    color: "#000000",
                    border: "2px solid #ffffff",
                    boxShadow: "0 0 14px rgba(22,163,74,0.6)",
                  }}
                >
                  💰 Deposit
                </button>

                {/* Withdraw button */}
                <button
                  type="button"
                  data-ocid="header.withdraw.button"
                  onClick={onOpenWithdraw}
                  className="px-3 py-2 rounded-md text-sm font-bold transition-colors hover:opacity-90"
                  style={{
                    background: "#ffffff",
                    color: "#1a1a1a",
                    border: "2px solid #ffffff",
                  }}
                >
                  Withdraw
                </button>

                {/* Notifications */}
                <div ref={notifRef} className="relative">
                  <Button
                    data-ocid="header.bell.button"
                    size="icon"
                    variant="ghost"
                    className="relative text-white hover:bg-white/10 cursor-pointer"
                    onClick={handleBellClick}
                  >
                    <Bell className="h-4 w-4" />
                    {unread > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[9px] flex items-center justify-center bg-destructive border-0">
                        {unread}
                      </Badge>
                    )}
                  </Button>

                  {notifOpen && (
                    <div
                      className="absolute right-0 top-10 w-80 rounded-xl shadow-2xl border overflow-hidden z-50"
                      style={{
                        background: "oklch(0.16 0.09 280)",
                        borderColor: PURPLE_MID,
                      }}
                    >
                      <div
                        className="px-4 py-2.5 border-b text-xs font-semibold tracking-wide uppercase"
                        style={{
                          borderColor: PURPLE_MID,
                          color: GOLD,
                        }}
                      >
                        Notifications
                      </div>
                      <div>
                        {NOTIFICATIONS.map((n) => (
                          <button
                            type="button"
                            key={n.id}
                            data-ocid={`notif.item.${n.id}`}
                            className="w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-white/5 transition-colors cursor-pointer select-none"
                            style={{ borderColor: PURPLE_MID }}
                            onClick={() => handleNotifClick(n.id)}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-base flex-shrink-0 mt-0.5">
                                {NOTIF_ICONS[(n as any).type] ?? "🔔"}
                              </span>
                              <p className="text-sm text-white leading-snug flex-1">
                                {n.text}
                              </p>
                              <span
                                className="text-xs mt-0.5 flex-shrink-0"
                                style={{ color: CYAN }}
                              >
                                {expandedId === n.id ? "▲" : "▼"}
                              </span>
                            </div>
                            <p
                              className="text-xs mt-1"
                              style={{ color: "oklch(0.6 0.04 280)" }}
                            >
                              {n.time}
                            </p>
                            {expandedId === n.id && (
                              <div>
                                <p
                                  className="text-xs mt-2 leading-relaxed p-2 rounded-lg"
                                  style={{
                                    color: "oklch(0.8 0.05 280)",
                                    background: "oklch(0.22 0.07 275)",
                                    borderLeft: `3px solid ${CYAN}`,
                                  }}
                                >
                                  {n.detail}
                                </p>
                                {(n as any).type === "promo" && (
                                  <button
                                    type="button"
                                    data-ocid="notif.view_promotions.button"
                                    className="mt-2 text-xs px-3 py-1.5 rounded-md w-full font-bold"
                                    style={{
                                      background: PINK,
                                      color: "white",
                                      fontWeight: 700,
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onNavigate("promotions");
                                      setNotifOpen(false);
                                      setExpandedId(null);
                                    }}
                                  >
                                    🎁 View Promotions
                                  </button>
                                )}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                      <div
                        className="px-4 py-2.5 flex items-center justify-between border-t"
                        style={{ borderColor: PURPLE_MID }}
                      >
                        <button
                          type="button"
                          className="text-xs hover:underline"
                          style={{ color: GREEN }}
                          onClick={() => setNotifOpen(false)}
                        >
                          Mark all as read
                        </button>
                        <button
                          type="button"
                          className="text-xs hover:underline"
                          style={{ color: "oklch(0.6 0.04 280)" }}
                          onClick={() => {
                            setExpandedId(null);
                            setNotifOpen(false);
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  data-ocid="header.logout.button"
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  onClick={onLogout}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                {/* Sign Up — cyan border, dark text */}
                <button
                  type="button"
                  data-ocid="header.signup.button"
                  onClick={onOpenSignup}
                  className="px-3 py-2 rounded-md text-sm font-bold transition-colors hover:opacity-90"
                  style={{
                    background: "transparent",
                    color: CYAN,
                    border: `2px solid ${CYAN}`,
                  }}
                >
                  Sign Up
                </button>
                {/* Login — hot pink, white text */}
                <button
                  type="button"
                  data-ocid="header.login.button"
                  onClick={onOpenLogin}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{
                    background: PINK,
                    color: "white",
                    fontWeight: 800,
                    border: `2px solid ${PINK}`,
                    boxShadow: "0 0 12px oklch(0.65 0.22 330 / 0.5)",
                  }}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Download App Dialog */}
      <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
        <DialogContent
          className="max-w-sm border"
          style={{
            background: "oklch(0.18 0.07 270)",
            borderColor: "oklch(0.28 0.06 275)",
            isolation: "isolate",
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
              <Smartphone className="h-5 w-5" style={{ color: PINK }} />
              Download 100%Real App
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <p className="text-sm" style={{ color: "oklch(0.75 0.04 280)" }}>
              Install directly on your Android phone. No app store needed.
            </p>

            {/* Android APK */}
            <button
              type="button"
              data-ocid="download.android.button"
              onClick={() => {
                toast.success("APK download will be available soon!", {
                  description:
                    "We'll notify you when the Android APK is ready.",
                });
              }}
              className="w-full flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95"
              style={{
                background: GREEN,
                boxShadow: "0 0 16px oklch(0.65 0.17 155 / 0.4)",
              }}
            >
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold">Download APK for Android</div>
                <div className="text-xs font-normal opacity-80">
                  Free · Direct install
                </div>
              </div>
            </button>

            {/* iOS — coming soon */}
            <div
              className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-sm cursor-not-allowed opacity-50"
              style={{
                background: "oklch(0.22 0.06 275)",
                border: "1px solid oklch(0.28 0.06 275)",
                color: "oklch(0.75 0.04 280)",
              }}
            >
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Smartphone className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold">Coming Soon for iOS</div>
                <div className="text-xs font-normal opacity-70">
                  iPhone support launching soon
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
