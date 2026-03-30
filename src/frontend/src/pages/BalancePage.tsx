import {
  CheckCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  Wallet,
  XCircle,
} from "lucide-react";
import type { TransactionRequest, User } from "../App";

interface BalancePageProps {
  user: User;
  transactions: TransactionRequest[];
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

export function BalancePage({ user, transactions }: BalancePageProps) {
  const myTxns = transactions.filter((t) => t.username === user.username);
  const totalDeposited = myTxns
    .filter((t) => t.type === "deposit" && t.status === "approved")
    .reduce((s, t) => s + t.amount, 0);
  const totalWithdrawn = myTxns
    .filter((t) => t.type === "withdrawal" && t.status === "approved")
    .reduce((s, t) => s + t.amount, 0);
  const pendingDeposits = myTxns.filter(
    (t) => t.type === "deposit" && t.status === "pending",
  ).length;
  const pendingWithdrawals = myTxns.filter(
    (t) => t.type === "withdrawal" && t.status === "pending",
  ).length;

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

      {/* Current balance hero */}
      <div
        className="rounded-2xl p-6 mb-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.55 0.28 330), oklch(0.45 0.3 290))",
          boxShadow: "0 4px 30px oklch(0.55 0.28 330 / 0.4)",
        }}
      >
        <p className="text-sm font-bold opacity-80 mb-1">Current Balance</p>
        <p className="font-black text-4xl">
          PKR {(user.balance ?? 0).toLocaleString()}
        </p>
        <p className="text-xs opacity-60 mt-2">
          Demo balance · No real money involved
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-6">
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

      {/* Transaction history */}
      <h2
        className="font-black text-xs uppercase tracking-wider mb-3"
        style={{ color: "oklch(0.55 0.05 285)" }}
      >
        Transaction History
      </h2>

      {myTxns.length === 0 ? (
        <div
          className="rounded-xl p-10 text-center"
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
            Your deposits and withdrawals will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {myTxns.map((txn) => {
            const s = statusLabel(txn.status);
            const isDeposit = txn.type === "deposit";
            return (
              <div
                key={txn.id}
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
          })}
        </div>
      )}
    </div>
  );
}
