import {
  CheckCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  Trophy,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import type { GameActivity, TransactionRequest, User } from "../App";

interface BalancePageProps {
  user: User;
  transactions: TransactionRequest[];
  gameActivity?: GameActivity[];
}

function statusIcon(status: TransactionRequest["status"]) {
  if (status === "approved")
    return <CheckCircle size={14} style={{ color: "oklch(0.75 0.22 140)" }} />;
  if (status === "rejected")
    return <XCircle size={14} style={{ color: "oklch(0.65 0.25 25)" }} />;
  return <Clock size={14} style={{ color: "oklch(0.85 0.18 50)" }} />;
}

function statusLabel(status: TransactionRequest["status"]) {
  if (status === "approved")
    return { label: "Approved", color: "oklch(0.75 0.22 140)" };
  if (status === "rejected")
    return { label: "Rejected", color: "oklch(0.65 0.25 25)" };
  return { label: "Pending", color: "oklch(0.85 0.18 50)" };
}

type FilterTab = "all" | "deposits" | "withdrawals" | "games";

type UnifiedEntry =
  | { kind: "txn"; data: TransactionRequest; timestamp: string }
  | { kind: "game"; data: GameActivity; timestamp: string };

export function BalancePage({
  user,
  transactions,
  gameActivity = [],
}: BalancePageProps) {
  const [filter, setFilter] = useState<FilterTab>("all");

  const myTxns = transactions.filter((t) => t.username === user.username);
  const myGames = gameActivity.filter((g) => g.username === user.username);

  const totalDeposited = myTxns
    .filter((t) => t.type === "deposit" && t.status === "approved")
    .reduce((s, t) => s + t.amount, 0);
  const totalWithdrawn = myTxns
    .filter((t) => t.type === "withdrawal" && t.status === "approved")
    .reduce((s, t) => s + t.amount, 0);
  const totalGameWins = myGames
    .filter((g) => g.type === "win")
    .reduce((s, g) => s + g.amount, 0);
  const totalGameLosses = myGames
    .filter((g) => g.type === "loss")
    .reduce((s, g) => s + g.amount, 0);
  const netPnl =
    totalDeposited - totalWithdrawn + totalGameWins - totalGameLosses;

  const pendingDeposits = myTxns.filter(
    (t) => t.type === "deposit" && t.status === "pending",
  ).length;
  const pendingWithdrawals = myTxns.filter(
    (t) => t.type === "withdrawal" && t.status === "pending",
  ).length;

  const winningBalance = user.balance ?? 0;

  // Build unified list
  const allEntries: UnifiedEntry[] = [
    ...myTxns.map(
      (t): UnifiedEntry => ({ kind: "txn", data: t, timestamp: t.submittedAt }),
    ),
    ...myGames.map(
      (g): UnifiedEntry => ({ kind: "game", data: g, timestamp: g.timestamp }),
    ),
  ].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const filtered = allEntries.filter((e) => {
    if (filter === "all") return true;
    if (filter === "deposits")
      return e.kind === "txn" && e.data.type === "deposit";
    if (filter === "withdrawals")
      return e.kind === "txn" && e.data.type === "withdrawal";
    if (filter === "games") return e.kind === "game";
    return true;
  });

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: allEntries.length },
    {
      key: "deposits",
      label: "Deposits",
      count: myTxns.filter((t) => t.type === "deposit").length,
    },
    {
      key: "withdrawals",
      label: "Withdrawals",
      count: myTxns.filter((t) => t.type === "withdrawal").length,
    },
    { key: "games", label: "Game Activity", count: myGames.length },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Page title */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "oklch(0.85 0.18 50 / 0.15)" }}
        >
          <Wallet size={20} style={{ color: "oklch(0.85 0.18 50)" }} />
        </div>
        <div>
          <h1
            className="font-black text-xl"
            style={{ color: "oklch(0.92 0.05 285)" }}
          >
            Balance Sheet
          </h1>
          <p className="text-xs" style={{ color: "oklch(0.55 0.05 285)" }}>
            Account: {user.username}
          </p>
        </div>
      </div>

      {/* Winning Balance hero */}
      <div
        className="rounded-2xl p-6 mb-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.42 0.28 155), oklch(0.35 0.25 175))",
          boxShadow: "0 4px 30px oklch(0.75 0.22 140 / 0.45)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Trophy size={18} style={{ color: "oklch(0.95 0.18 85)" }} />
          <p
            className="text-sm font-black tracking-wide"
            style={{ color: "oklch(0.95 0.18 85)" }}
          >
            Winning Balance
          </p>
        </div>
        <p className="font-black text-4xl" style={{ color: "#ffffff" }}>
          PKR {winningBalance.toLocaleString()}
        </p>
        <p className="text-xs mt-2" style={{ color: "oklch(0.88 0.12 155)" }}>
          Available to withdraw · Tap Withdraw to cash out
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div
          className="rounded-xl p-4"
          style={{
            background: "oklch(0.14 0.08 285)",
            border: "1px solid oklch(0.75 0.22 140 / 0.3)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} style={{ color: "oklch(0.75 0.22 140)" }} />
            <span
              className="text-xs font-bold"
              style={{ color: "oklch(0.75 0.22 140)" }}
            >
              Total Deposited
            </span>
          </div>
          <p
            className="font-black text-xl"
            style={{ color: "oklch(0.92 0.05 285)" }}
          >
            PKR {totalDeposited.toLocaleString()}
          </p>
          {pendingDeposits > 0 && (
            <p
              className="text-[11px] mt-0.5"
              style={{ color: "oklch(0.85 0.18 50)" }}
            >
              {pendingDeposits} pending approval
            </p>
          )}
        </div>
        <div
          className="rounded-xl p-4"
          style={{
            background: "oklch(0.14 0.08 285)",
            border: "1px solid oklch(0.65 0.25 25 / 0.3)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={14} style={{ color: "oklch(0.65 0.25 25)" }} />
            <span
              className="text-xs font-bold"
              style={{ color: "oklch(0.65 0.25 25)" }}
            >
              Total Withdrawn
            </span>
          </div>
          <p
            className="font-black text-xl"
            style={{ color: "oklch(0.92 0.05 285)" }}
          >
            PKR {totalWithdrawn.toLocaleString()}
          </p>
          {pendingWithdrawals > 0 && (
            <p
              className="text-[11px] mt-0.5"
              style={{ color: "oklch(0.85 0.18 50)" }}
            >
              {pendingWithdrawals} pending approval
            </p>
          )}
        </div>
      </div>

      {/* Game stats + Net P&L row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div
          className="rounded-xl p-3"
          style={{
            background: "oklch(0.14 0.08 285)",
            border: "1px solid oklch(0.82 0.22 75 / 0.3)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={12} style={{ color: "oklch(0.82 0.22 75)" }} />
            <span
              className="text-[11px] font-bold"
              style={{ color: "oklch(0.82 0.22 75)" }}
            >
              Game Wins
            </span>
          </div>
          <p
            className="font-black text-base"
            style={{ color: "oklch(0.82 0.22 75)" }}
          >
            +PKR {totalGameWins.toLocaleString()}
          </p>
        </div>
        <div
          className="rounded-xl p-3"
          style={{
            background: "oklch(0.14 0.08 285)",
            border: "1px solid oklch(0.50 0.04 285 / 0.3)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown size={12} style={{ color: "oklch(0.55 0.05 285)" }} />
            <span
              className="text-[11px] font-bold"
              style={{ color: "oklch(0.55 0.05 285)" }}
            >
              Game Losses
            </span>
          </div>
          <p
            className="font-black text-base"
            style={{ color: "oklch(0.60 0.05 285)" }}
          >
            -PKR {totalGameLosses.toLocaleString()}
          </p>
        </div>
        <div
          className="rounded-xl p-3"
          style={{
            background: "oklch(0.14 0.08 285)",
            border: `1px solid ${
              netPnl >= 0
                ? "oklch(0.75 0.22 140 / 0.4)"
                : "oklch(0.65 0.25 25 / 0.4)"
            }`,
          }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Trophy
              size={12}
              style={{
                color:
                  netPnl >= 0 ? "oklch(0.75 0.22 140)" : "oklch(0.65 0.25 25)",
              }}
            />
            <span
              className="text-[11px] font-bold"
              style={{
                color:
                  netPnl >= 0 ? "oklch(0.75 0.22 140)" : "oklch(0.65 0.25 25)",
              }}
            >
              Net P&L
            </span>
          </div>
          <p
            className="font-black text-base"
            style={{
              color:
                netPnl >= 0 ? "oklch(0.75 0.22 140)" : "oklch(0.65 0.25 25)",
            }}
          >
            {netPnl >= 0 ? "+" : ""}
            PKR {netPnl.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            data-ocid={`balance.${tab.key}.tab`}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{
              background:
                filter === tab.key
                  ? "oklch(0.82 0.22 75 / 0.2)"
                  : "oklch(0.14 0.08 285)",
              border:
                filter === tab.key
                  ? "1px solid oklch(0.82 0.22 75 / 0.6)"
                  : "1px solid oklch(0.22 0.07 285)",
              color:
                filter === tab.key
                  ? "oklch(0.82 0.22 75)"
                  : "oklch(0.55 0.05 285)",
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px]"
                style={{
                  background: "oklch(0.22 0.07 285)",
                  color: "oklch(0.65 0.05 285)",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Unified transaction history */}
      {filtered.length === 0 ? (
        <div
          className="rounded-xl p-10 text-center"
          data-ocid="balance.empty_state"
          style={{
            background: "oklch(0.14 0.08 285)",
            border: "1px solid oklch(0.22 0.07 285)",
          }}
        >
          <p className="text-3xl mb-2">📋</p>
          <p className="font-bold" style={{ color: "oklch(0.60 0.05 285)" }}>
            No transactions yet
          </p>
          <p className="text-xs mt-1" style={{ color: "oklch(0.45 0.04 285)" }}>
            Your activity will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((entry, idx) => {
            if (entry.kind === "txn") {
              const txn = entry.data;
              const s = statusLabel(txn.status);
              const isDeposit = txn.type === "deposit";
              return (
                <div
                  key={txn.id}
                  data-ocid={`balance.item.${idx + 1}`}
                  className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{
                    background: "oklch(0.14 0.08 285)",
                    border: "1px solid oklch(0.22 0.07 285)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isDeposit
                        ? "oklch(0.75 0.22 140 / 0.15)"
                        : "oklch(0.65 0.25 25 / 0.15)",
                    }}
                  >
                    {isDeposit ? (
                      <TrendingUp
                        size={16}
                        style={{ color: "oklch(0.75 0.22 140)" }}
                      />
                    ) : (
                      <TrendingDown
                        size={16}
                        style={{ color: "oklch(0.65 0.25 25)" }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-bold text-sm capitalize"
                      style={{ color: "oklch(0.88 0.04 285)" }}
                    >
                      {txn.type} · {txn.method}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.50 0.04 285)" }}
                    >
                      {new Date(txn.submittedAt).toLocaleString("en-PK", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className="font-black text-base"
                      style={{
                        color: isDeposit
                          ? "oklch(0.75 0.22 140)"
                          : "oklch(0.65 0.25 25)",
                      }}
                    >
                      {isDeposit ? "+" : "-"}PKR {txn.amount.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      {statusIcon(txn.status)}
                      <span
                        className="text-[11px] font-bold"
                        style={{ color: s.color }}
                      >
                        {s.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            // Game activity entry
            const game = entry.data;
            const isWin = game.type === "win";
            return (
              <div
                key={game.id}
                data-ocid={`balance.item.${idx + 1}`}
                className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{
                  background: "oklch(0.14 0.08 285)",
                  border: "1px solid oklch(0.22 0.07 285)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isWin
                      ? "oklch(0.82 0.22 75 / 0.15)"
                      : "oklch(0.35 0.04 285 / 0.4)",
                  }}
                >
                  {isWin ? (
                    <Zap size={16} style={{ color: "oklch(0.82 0.22 75)" }} />
                  ) : (
                    <TrendingDown
                      size={16}
                      style={{ color: "oklch(0.50 0.04 285)" }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-bold text-sm capitalize"
                    style={{ color: "oklch(0.88 0.04 285)" }}
                  >
                    {isWin ? "Win" : "Loss"} · {game.gameName}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.50 0.04 285)" }}
                  >
                    {new Date(game.timestamp).toLocaleString("en-PK", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p
                    className="font-black text-base"
                    style={{
                      color: isWin
                        ? "oklch(0.82 0.22 75)"
                        : "oklch(0.50 0.04 285)",
                    }}
                  >
                    {isWin ? "+" : "-"}PKR {game.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <CheckCircle
                      size={14}
                      style={{ color: "oklch(0.55 0.04 285)" }}
                    />
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: "oklch(0.55 0.04 285)" }}
                    >
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
