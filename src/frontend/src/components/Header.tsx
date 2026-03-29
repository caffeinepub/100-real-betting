import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, LogIn, LogOut } from "lucide-react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin, useMyBalance } from "../hooks/useQueries";

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenSignup: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export default function Header({
  currentPage,
  onNavigate,
  onOpenSignup,
  onOpenDeposit,
  onOpenWithdraw,
}: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: balance } = useMyBalance();
  const { data: isAdmin } = useIsAdmin();

  const isLoggedIn = loginStatus === "success" && !!identity;
  const principal = identity?.getPrincipal().toString();
  const shortName = principal ? `${principal.slice(0, 5)}...` : "Guest";

  const navLinks: { id: Page; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "sports", label: "Sports" },
    { id: "live", label: "Live Betting" },
    { id: "casino", label: "Casino" },
    { id: "promotions", label: "Promotions" },
    { id: "support", label: "Support" },
  ];

  if (isAdmin) {
    navLinks.push({ id: "admin", label: "Admin" });
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border shadow-xs">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-6">
        {/* Brand */}
        <button
          type="button"
          className="flex items-center gap-2 flex-shrink-0 focus:outline-none"
          onClick={() => onNavigate("dashboard")}
        >
          <div className="w-8 h-8 rounded-md bg-navy-deep flex items-center justify-center">
            <span className="text-emerald-brand font-black text-xs">%</span>
          </div>
          <span className="font-black text-lg tracking-tight">
            <span className="text-emerald-brand">100%</span>
            <span className="text-foreground">Real</span>
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
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                currentPage === link.id
                  ? "text-foreground bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isLoggedIn ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-emerald-brand text-white">
                    {shortName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-xs">
                  <div className="font-semibold text-foreground">
                    {shortName}
                  </div>
                  <div className="text-muted-foreground">
                    {balance !== undefined
                      ? `${balance.toFixed(0)} credits`
                      : "–"}
                  </div>
                </div>
              </div>

              <Button
                data-ocid="header.deposit.button"
                size="sm"
                className="bg-emerald-brand hover:bg-emerald-light text-white border-0"
                onClick={onOpenDeposit}
              >
                Deposit
              </Button>

              <Button
                data-ocid="header.withdraw.button"
                size="sm"
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary hover:text-white"
                onClick={onOpenWithdraw}
              >
                Withdraw
              </Button>

              <Button
                data-ocid="header.bell.button"
                size="icon"
                variant="ghost"
                className="relative"
              >
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[9px] flex items-center justify-center bg-destructive border-0">
                  2
                </Badge>
              </Button>

              <Button
                data-ocid="header.logout.button"
                size="icon"
                variant="ghost"
                onClick={clear}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                data-ocid="header.signup.button"
                size="sm"
                variant="outline"
                className="border-emerald-brand text-emerald-brand hover:bg-emerald-brand hover:text-white"
                onClick={onOpenSignup}
              >
                Sign Up
              </Button>
              <Button
                data-ocid="header.login.button"
                size="sm"
                className="bg-emerald-brand hover:bg-emerald-light text-white border-0"
                onClick={login}
                disabled={loginStatus === "logging-in"}
              >
                <LogIn className="h-4 w-4 mr-1.5" />
                {loginStatus === "logging-in" ? "Connecting..." : "Login"}
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
