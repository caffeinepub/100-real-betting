import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart2,
  Clock,
  Flame,
  Globe,
  Monitor,
  Trophy,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Page } from "../App";
import type { Bet, Event } from "../backend";
import { Status, Status__1 } from "../backend";
import BetSlipPanel from "../components/BetSlipPanel";
import { useBetSlip } from "../context/BetSlipContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAccountSummary,
  useActiveMarkets,
  useMyBets,
} from "../hooks/useQueries";

const SPORT_FILTERS = [
  "All",
  "Live Now",
  "Football",
  "Basketball",
  "Tennis",
  "Esports",
];

const QUICK_LINKS = [
  { icon: Flame, label: "Live Now", badge: "12" },
  { icon: Trophy, label: "NBA Playoffs" },
  { icon: Globe, label: "Premier League" },
  { icon: Monitor, label: "UEFA Champions" },
];

function SportPill({
  active,
  onClick,
  label,
}: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      data-ocid={`market.${label.toLowerCase().replace(/ /g, "-")}.tab`}
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
        active
          ? "bg-emerald-brand text-white"
          : "bg-muted text-muted-foreground hover:bg-border hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function OddsButton({
  label,
  odds,
  active,
  onClick,
}: {
  label: string;
  odds: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-ocid="market.odds.button"
      onClick={onClick}
      className={`flex flex-col items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-w-[56px] border ${
        active
          ? "bg-emerald-brand text-white border-emerald-brand"
          : "bg-muted text-foreground border-border hover:border-emerald-brand hover:text-emerald-brand"
      }`}
    >
      <span className="text-[10px] opacity-70">{label}</span>
      <span className="font-bold text-sm">{odds.toFixed(2)}</span>
    </button>
  );
}

function MarketRow({ event }: { event: Event }) {
  const { setSelection, selection } = useBetSlip();
  const isLive = event.status === Status.live;

  return (
    <div className="px-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {isLive && (
              <Badge className="bg-destructive/10 text-destructive text-[10px] px-1.5 py-0 border-0 font-semibold">
                LIVE
              </Badge>
            )}
            <span className="text-xs text-muted-foreground truncate">
              {event.sport}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground truncate">
            {event.title}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {event.description}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {event.selections.slice(0, 3).map((sel) => (
            <OddsButton
              key={sel.id.toString()}
              label={sel.name.slice(0, 3).toUpperCase()}
              odds={sel.odds}
              active={
                selection?.selectionId === sel.id &&
                selection?.eventId === event.id
              }
              onClick={() =>
                setSelection({
                  eventId: event.id,
                  eventTitle: event.title,
                  selectionId: sel.id,
                  selectionName: sel.name,
                  odds: sel.odds,
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ActiveBetRow({ bet, index }: { bet: Bet; index: number }) {
  const progress = bet.status === Status__1.active ? 45 : 100;
  return (
    <div
      data-ocid={`mybet.item.${index}`}
      className="px-4 py-3 border-b border-border last:border-0"
    >
      <div className="flex items-center justify-between gap-4 mb-1.5">
        <div className="text-xs font-semibold text-foreground truncate flex-1">
          Bet #{bet.id.toString()} · Event #{bet.eventId.toString()}
        </div>
        <Badge
          className={`text-[10px] px-1.5 py-0 border-0 font-semibold ${
            bet.status === Status__1.won
              ? "bg-green-100 text-green-700"
              : bet.status === Status__1.lost
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
          }`}
        >
          {bet.status.toUpperCase()}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>
          Stake:{" "}
          <strong className="text-foreground">{bet.stake.toFixed(0)}</strong>
        </span>
        <span>
          Payout:{" "}
          <strong className="text-emerald-brand">
            {bet.potentialPayout.toFixed(0)}
          </strong>
        </span>
      </div>
      <Progress value={progress} className="h-1.5 [&>div]:bg-emerald-brand" />
    </div>
  );
}

const DEMO_MARKETS: Event[] = [
  {
    id: 1n,
    title: "Arsenal vs Manchester City",
    description: "Premier League · Matchday 34",
    sport: "Football",
    status: Status.live,
    startTime: BigInt(Date.now()),
    selections: [
      { id: 1n, name: "Arsenal", odds: 2.15 },
      { id: 2n, name: "Draw", odds: 3.4 },
      { id: 3n, name: "Man City", odds: 1.85 },
    ],
  },
  {
    id: 2n,
    title: "Lakers vs Celtics",
    description: "NBA Playoffs · Game 5",
    sport: "Basketball",
    status: Status.upcoming,
    startTime: BigInt(Date.now()),
    selections: [
      { id: 4n, name: "Lakers", odds: 1.95 },
      { id: 5n, name: "Celtics", odds: 1.9 },
    ],
  },
  {
    id: 3n,
    title: "Novak Djokovic vs Carlos Alcaraz",
    description: "Roland Garros · Semifinal",
    sport: "Tennis",
    status: Status.upcoming,
    startTime: BigInt(Date.now()),
    selections: [
      { id: 6n, name: "Djokovic", odds: 1.7 },
      { id: 7n, name: "Alcaraz", odds: 2.2 },
    ],
  },
  {
    id: 4n,
    title: "Real Madrid vs Bayern Munich",
    description: "UEFA Champions League · Quarter Final",
    sport: "Football",
    status: Status.live,
    startTime: BigInt(Date.now()),
    selections: [
      { id: 8n, name: "Real Madrid", odds: 1.6 },
      { id: 9n, name: "Draw", odds: 3.8 },
      { id: 10n, name: "Bayern", odds: 2.4 },
    ],
  },
];

interface DashboardProps {
  onNavigate?: (page: Page) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { identity, loginStatus } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const { data: markets, isLoading: marketsLoading } = useActiveMarkets();
  const { data: myBets, isLoading: betsLoading } = useMyBets();
  const { data: account } = useAccountSummary();
  const [sportFilter, setSportFilter] = useState("All");

  const displayMarkets = markets && markets.length > 0 ? markets : DEMO_MARKETS;
  const filtered =
    sportFilter === "All"
      ? displayMarkets
      : sportFilter === "Live Now"
        ? displayMarkets.filter((m) => m.status === Status.live)
        : displayMarkets.filter(
            (m) => m.sport.toLowerCase() === sportFilter.toLowerCase(),
          );

  const activeBets = myBets?.filter((b) => b.status === Status__1.active) ?? [];
  const principal = identity?.getPrincipal().toString();
  const shortName = principal ? `${principal.slice(0, 8)}...` : "Player";

  const skeletonKeys = ["sk1", "sk2", "sk3"];
  const skeletonKeys2 = ["sk4", "sk5"];

  return (
    <div>
      {/* Hero strip */}
      <div className="hero-gradient w-full py-10 px-6">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Welcome Back, {isLoggedIn ? shortName : "Alex"}!
            </h1>
            <p className="text-white/70 text-lg mt-1">Your Betting Dashboard</p>
          </motion.div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_280px] gap-5">
          {/* LEFT SIDEBAR */}
          <aside className="space-y-4">
            <div className="bg-white rounded-xl card-shadow border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                  Quick Links
                </h3>
              </div>
              <div className="py-1">
                {QUICK_LINKS.map((link, i) => (
                  <button
                    key={link.label}
                    type="button"
                    data-ocid={`quicklinks.item.${i + 1}`}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                  >
                    <link.icon className="h-4 w-4 text-emerald-brand flex-shrink-0" />
                    <span className="flex-1 text-foreground">{link.label}</span>
                    {link.badge && (
                      <Badge className="bg-destructive/10 text-destructive text-[10px] border-0 px-1.5 py-0">
                        {link.badge}
                      </Badge>
                    )}
                  </button>
                ))}
                {onNavigate && (
                  <button
                    type="button"
                    data-ocid="quicklinks.casino.link"
                    onClick={() => onNavigate("casino")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                  >
                    <span className="h-4 w-4 text-emerald-brand flex-shrink-0 text-base">
                      🎰
                    </span>
                    <span className="flex-1 text-foreground">Casino Games</span>
                    <Badge className="bg-emerald-brand/10 text-emerald-brand text-[10px] border-0 px-1.5 py-0">
                      NEW
                    </Badge>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl card-shadow border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                  My Bets
                </h3>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  data-ocid="sidebar.activebets.button"
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                >
                  <Zap className="h-4 w-4 text-emerald-brand" />
                  <span className="text-foreground">Active</span>
                  {activeBets.length > 0 && (
                    <Badge className="ml-auto bg-emerald-brand/10 text-emerald-brand text-[10px] border-0">
                      {activeBets.length}
                    </Badge>
                  )}
                </button>
                <button
                  type="button"
                  data-ocid="sidebar.histbets.button"
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">History</span>
                </button>
              </div>
            </div>
          </aside>

          {/* CENTER CONTENT */}
          <main className="space-y-5 min-w-0">
            <div className="bg-white rounded-xl card-shadow border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
                  Active Betting Markets
                </h2>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="px-4 py-3 border-b border-border flex gap-2 flex-wrap">
                {SPORT_FILTERS.map((f) => (
                  <SportPill
                    key={f}
                    label={f}
                    active={sportFilter === f}
                    onClick={() => setSportFilter(f)}
                  />
                ))}
              </div>
              {marketsLoading ? (
                <div
                  data-ocid="markets.loading_state"
                  className="p-4 space-y-3"
                >
                  {skeletonKeys.map((k) => (
                    <Skeleton key={k} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div
                  data-ocid="markets.empty_state"
                  className="py-10 text-center text-muted-foreground text-sm"
                >
                  No markets available for this filter.
                </div>
              ) : (
                <div>
                  {filtered.map((event) => (
                    <MarketRow key={event.id.toString()} event={event} />
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl card-shadow border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
                  My Active Bets
                </h2>
              </div>
              {!isLoggedIn ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Login to see your active bets.
                </div>
              ) : betsLoading ? (
                <div
                  data-ocid="activebets.loading_state"
                  className="p-4 space-y-3"
                >
                  {skeletonKeys2.map((k) => (
                    <Skeleton key={k} className="h-14 w-full rounded-lg" />
                  ))}
                </div>
              ) : activeBets.length === 0 ? (
                <div
                  data-ocid="activebets.empty_state"
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No active bets. Place a bet to get started!
                </div>
              ) : (
                activeBets.map((bet, i) => (
                  <ActiveBetRow
                    key={bet.id.toString()}
                    bet={bet}
                    index={i + 1}
                  />
                ))
              )}
            </div>
          </main>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-4">
            <BetSlipPanel />
            <div className="bg-white rounded-xl card-shadow border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                  Account Summary
                </h3>
              </div>
              {!isLoggedIn ? (
                <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                  Login to see your account.
                </div>
              ) : (
                <div className="px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-muted-foreground">
                      Total Balance
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {account?.balance.toFixed(0) ?? "–"} credits
                    </span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-xs text-muted-foreground">
                      Total Won
                    </span>
                    <span className="text-xs font-semibold text-positive">
                      +{account?.totalWon.toFixed(0) ?? "0"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-xs text-muted-foreground">
                      Total Wagered
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {account?.totalWagered.toFixed(0) ?? "0"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-0.5">
                    <span className="text-xs text-muted-foreground">
                      Total Lost
                    </span>
                    <span className="text-xs font-semibold text-negative">
                      -{account?.totalLost.toFixed(0) ?? "0"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
