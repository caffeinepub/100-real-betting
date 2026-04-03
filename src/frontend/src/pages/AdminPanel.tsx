import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  Link,
  MessageSquare,
  Send,
  Share2,
  ShieldCheck,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SupportTicket, TransactionRequest, User } from "../App";

type MemberRecord = User & {
  password: string;
  referralCode?: string;
  balance: number;
};

interface AdminPanelProps {
  members: MemberRecord[];
  transactionRequests: TransactionRequest[];
  onUpdateRequest: (id: string, status: "approved" | "rejected") => void;
  onDeleteMember: (username: string) => void;
  onBroadcastNotification: (
    targets: string[] | "all",
    title: string,
    detail: string,
  ) => void;
  supportTickets: SupportTicket[];
  onAdminReplySupportMessage: (ticketId: string, text: string) => void;
  onCloseSupportTicket: (ticketId: string) => void;
}

export function AdminPanel({
  members,
  transactionRequests,
  onUpdateRequest,
  onDeleteMember,
  onBroadcastNotification,
  supportTickets,
  onAdminReplySupportMessage,
  onCloseSupportTicket,
}: AdminPanelProps) {
  const [activeStatuses, setActiveStatuses] = useState<Record<string, boolean>>(
    {},
  );

  function toggleStatus(username: string) {
    setActiveStatuses((prev) => ({ ...prev, [username]: !prev[username] }));
  }

  function getReferralCount(username: string) {
    return members.filter((m) => m.referralCode === username).length;
  }

  const totalMembers = members.length;
  const activeCount = Object.values(activeStatuses).filter(Boolean).length;

  const pendingCount = transactionRequests.filter(
    (r) => r.status === "pending",
  ).length;
  const approvedCount = transactionRequests.filter(
    (r) => r.status === "approved",
  ).length;
  const openTicketCount = supportTickets.filter(
    (t) => t.status === "open",
  ).length;
  const rejectedCount = transactionRequests.filter(
    (r) => r.status === "rejected",
  ).length;

  const totalDeposits = transactionRequests
    .filter((r) => r.type === "deposit" && r.status === "approved")
    .reduce((sum, r) => sum + r.amount, 0);
  const totalWithdrawals = transactionRequests
    .filter((r) => r.type === "withdrawal" && r.status === "approved")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ background: "oklch(0.09 0.07 285)" }}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-xl"
            style={{ background: "oklch(0.55 0.28 50 / 0.2)" }}
          >
            <ShieldCheck size={28} style={{ color: "oklch(0.85 0.18 50)" }} />
          </div>
          <div>
            <h1
              className="text-3xl font-black tracking-wide"
              style={{ color: "oklch(0.85 0.18 50)" }}
            >
              Admin Panel
            </h1>
            <p className="text-sm" style={{ color: "oklch(0.65 0.05 285)" }}>
              100%Real Member & Transaction Management
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Users size={20} />}
            label="Total Members"
            value={totalMembers}
            color="oklch(0.75 0.2 195)"
          />
          <StatCard
            icon={<Crown size={20} />}
            label="Active Members"
            value={activeCount}
            color="oklch(0.75 0.25 335)"
          />
          <StatCard
            icon={<TrendingUp size={20} />}
            label="Approved Deposits"
            value={
              totalDeposits > 0
                ? `PKR ${totalDeposits.toLocaleString()}`
                : "PKR 0"
            }
            color="oklch(0.80 0.18 130)"
          />
          <StatCard
            icon={<TrendingDown size={20} />}
            label="Approved Withdrawals"
            value={
              totalWithdrawals > 0
                ? `PKR ${totalWithdrawals.toLocaleString()}`
                : "PKR 0"
            }
            color="oklch(0.85 0.18 50)"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="members">
          <TabsList
            className="mb-6 border"
            style={{
              background: "oklch(0.13 0.08 285)",
              borderColor: "oklch(0.22 0.08 285)",
            }}
          >
            <TabsTrigger
              value="members"
              data-ocid="admin.members.tab"
              className="font-bold data-[state=active]:text-cyan-400"
              style={{ color: "oklch(0.65 0.06 285)" }}
            >
              <Users size={15} className="mr-1.5" />
              Members
              {totalMembers > 0 && (
                <span
                  className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-black"
                  style={{
                    background: "oklch(0.75 0.2 195 / 0.2)",
                    color: "oklch(0.75 0.2 195)",
                  }}
                >
                  {totalMembers}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              data-ocid="admin.transactions.tab"
              className="font-bold data-[state=active]:text-yellow-400"
              style={{ color: "oklch(0.65 0.06 285)" }}
            >
              <Clock size={15} className="mr-1.5" />
              Transactions
              {pendingCount > 0 && (
                <span
                  className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-black animate-pulse"
                  style={{
                    background: "oklch(0.85 0.18 50 / 0.25)",
                    color: "oklch(0.85 0.18 50)",
                  }}
                >
                  {pendingCount} pending
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              data-ocid="admin.notifications.tab"
              className="font-bold data-[state=active]:text-pink-400"
              style={{ color: "oklch(0.65 0.06 285)" }}
            >
              <Bell size={15} className="mr-1.5" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="support"
              data-ocid="admin.support.tab"
              className="font-bold data-[state=active]:text-indigo-400"
              style={{ color: "oklch(0.65 0.06 285)" }}
            >
              <MessageSquare size={15} className="mr-1.5" />
              Support Chat
              {openTicketCount > 0 && (
                <span
                  className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-black animate-pulse"
                  style={{
                    background: "oklch(0.55 0.25 280 / 0.25)",
                    color: "oklch(0.75 0.2 280)",
                  }}
                >
                  {openTicketCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members">
            {/* Share App Link Card */}
            <div
              className="rounded-2xl border p-5 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{
                background: "oklch(0.85 0.18 50 / 0.08)",
                borderColor: "oklch(0.85 0.18 50 / 0.35)",
              }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.85 0.18 50 / 0.2)" }}
                >
                  <Share2 size={18} style={{ color: "oklch(0.85 0.18 50)" }} />
                </div>
                <div className="min-w-0">
                  <p
                    className="font-black text-sm"
                    style={{ color: "oklch(0.85 0.18 50)" }}
                  >
                    📢 Share App Link
                  </p>
                  <p
                    className="text-xs truncate font-mono"
                    style={{ color: "oklch(0.60 0.05 285)" }}
                  >
                    {`${window.location.origin}/?ref=admin100real`}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.05 285)" }}
                  >
                    Share this link to grow the community
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  type="button"
                  size="sm"
                  data-ocid="admin.share.button"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(`${window.location.origin}/?ref=admin100real`)
                      .then(() => toast.success("Link copied!"))
                      .catch(() => toast.error("Could not copy"));
                  }}
                  className="h-9 px-3 font-black text-black text-xs flex items-center gap-1.5"
                  style={{ background: "oklch(0.85 0.18 50)" }}
                >
                  <Copy size={13} />
                  Copy Link
                </Button>
                <Button
                  type="button"
                  size="sm"
                  data-ocid="admin.whatsapp.button"
                  onClick={() => {
                    const url = encodeURIComponent(
                      `${window.location.origin}/?ref=admin100real`,
                    );
                    window.open(
                      `https://wa.me/?text=Join+100%25Real+Casino+and+win+big!+%0A${url}`,
                      "_blank",
                    );
                  }}
                  className="h-9 px-3 font-black text-white text-xs flex items-center gap-1.5"
                  style={{
                    background: "linear-gradient(135deg, #25D366, #128C7E)",
                  }}
                >
                  WhatsApp
                </Button>
              </div>
            </div>

            <section
              className="rounded-2xl border overflow-hidden"
              style={{
                background: "oklch(0.13 0.08 285)",
                borderColor: "oklch(0.25 0.08 285)",
              }}
              data-ocid="admin.table"
            >
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{ borderColor: "oklch(0.22 0.08 285)" }}
              >
                <h2
                  className="font-bold text-lg"
                  style={{ color: "oklch(0.75 0.2 195)" }}
                >
                  Registered Members
                </h2>
                <Badge
                  className="font-bold"
                  style={{
                    background: "oklch(0.75 0.2 195 / 0.15)",
                    color: "oklch(0.75 0.2 195)",
                    border: "1px solid oklch(0.75 0.2 195 / 0.3)",
                  }}
                >
                  {totalMembers} total
                </Badge>
              </div>

              {members.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-16 gap-3"
                  data-ocid="admin.members.empty_state"
                >
                  <Users size={48} style={{ color: "oklch(0.40 0.08 285)" }} />
                  <p
                    style={{ color: "oklch(0.55 0.05 285)" }}
                    className="text-sm font-medium"
                  >
                    No members registered yet
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor: "oklch(0.22 0.08 285)" }}>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          #
                        </TableHead>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          Username
                        </TableHead>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          Full Name
                        </TableHead>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          Phone
                        </TableHead>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          Referred By
                        </TableHead>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          <span className="flex items-center gap-1">
                            <Share2 size={12} />
                            Referrals
                          </span>
                        </TableHead>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          Joined
                        </TableHead>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          Balance (PKR)
                        </TableHead>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          Status
                        </TableHead>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member, i) => {
                        const isActive =
                          activeStatuses[member.username] ?? true;
                        const refCount = getReferralCount(member.username);
                        return (
                          <TableRow
                            key={member.username}
                            style={{ borderColor: "oklch(0.20 0.07 285)" }}
                            data-ocid={`admin.members.row.${i + 1}`}
                          >
                            <TableCell
                              style={{ color: "oklch(0.50 0.06 285)" }}
                              className="text-sm"
                            >
                              {i + 1}
                            </TableCell>
                            <TableCell>
                              <span
                                className="font-bold"
                                style={{ color: "oklch(0.75 0.2 195)" }}
                              >
                                {member.username}
                              </span>
                            </TableCell>
                            <TableCell
                              style={{ color: "oklch(0.80 0.04 285)" }}
                            >
                              {member.name}
                            </TableCell>
                            <TableCell
                              style={{ color: "oklch(0.75 0.05 285)" }}
                              className="font-mono text-sm"
                            >
                              {member.phone}
                            </TableCell>
                            <TableCell>
                              {member.referralCode ? (
                                <span
                                  className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                                  style={{
                                    background: "oklch(0.80 0.18 130 / 0.15)",
                                    color: "oklch(0.80 0.18 130)",
                                  }}
                                >
                                  {member.referralCode}
                                </span>
                              ) : (
                                <span
                                  style={{ color: "oklch(0.40 0.05 285)" }}
                                  className="text-xs"
                                >
                                  —
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span
                                className="flex items-center gap-1.5 font-black text-sm"
                                style={{
                                  color:
                                    refCount > 0
                                      ? "oklch(0.85 0.18 50)"
                                      : "oklch(0.45 0.05 285)",
                                }}
                              >
                                <Share2 size={12} />
                                {refCount}
                              </span>
                            </TableCell>
                            <TableCell
                              style={{ color: "oklch(0.60 0.05 285)" }}
                              className="text-sm"
                            >
                              {new Date().toLocaleDateString("en-PK")}
                            </TableCell>
                            <TableCell>
                              <span
                                className="font-black text-sm"
                                style={{ color: "oklch(0.85 0.18 50)" }}
                              >
                                PKR {(member.balance ?? 0).toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className="text-xs font-bold"
                                style={{
                                  background: isActive
                                    ? "oklch(0.80 0.18 130 / 0.15)"
                                    : "oklch(0.50 0.18 0 / 0.15)",
                                  color: isActive
                                    ? "oklch(0.80 0.18 130)"
                                    : "oklch(0.65 0.18 0)",
                                  border: `1px solid ${isActive ? "oklch(0.80 0.18 130 / 0.3)" : "oklch(0.50 0.18 0 / 0.3)"}`,
                                }}
                              >
                                {isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => toggleStatus(member.username)}
                                data-ocid={`admin.members.toggle.${i + 1}`}
                                className="text-xs font-bold h-7 px-3"
                                style={{
                                  background: isActive
                                    ? "oklch(0.50 0.18 0 / 0.2)"
                                    : "oklch(0.80 0.18 130 / 0.2)",
                                  color: isActive
                                    ? "oklch(0.65 0.18 0)"
                                    : "oklch(0.80 0.18 130)",
                                  border: `1px solid ${isActive ? "oklch(0.50 0.18 0 / 0.4)" : "oklch(0.80 0.18 130 / 0.4)"}`,
                                }}
                              >
                                {isActive ? "Deactivate" : "Activate"}
                              </Button>
                              <button
                                type="button"
                                onClick={() => {
                                  const refLink = `${window.location.origin}/?ref=${encodeURIComponent(member.username)}`;
                                  navigator.clipboard
                                    .writeText(refLink)
                                    .then(() =>
                                      toast.success(
                                        `Referral link copied for ${member.username}!`,
                                      ),
                                    )
                                    .catch(() =>
                                      toast.error("Could not copy link"),
                                    );
                                }}
                                className="ml-2 p-1.5 rounded-lg transition-colors"
                                style={{
                                  color: "oklch(0.85 0.18 50)",
                                  background: "oklch(0.85 0.18 50 / 0.1)",
                                  border:
                                    "1px solid oklch(0.85 0.18 50 / 0.25)",
                                }}
                                title="Copy Ref Link"
                                data-ocid={`admin.members.secondary_button.${i + 1}`}
                              >
                                <Link size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Delete member "${member.username}"? This cannot be undone.`,
                                    )
                                  ) {
                                    onDeleteMember(member.username);
                                  }
                                }}
                                className="ml-2 p-1.5 rounded-lg transition-colors"
                                style={{
                                  color: "oklch(0.65 0.25 25)",
                                  background: "oklch(0.65 0.25 25 / 0.1)",
                                }}
                                title="Delete member"
                                data-ocid={`admin.members.delete_button.${i + 1}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </section>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <SummaryCard
                icon={<Clock size={18} />}
                label="Pending"
                value={pendingCount}
                color="oklch(0.85 0.18 50)"
                bg="oklch(0.85 0.18 50 / 0.1)"
                border="oklch(0.85 0.18 50 / 0.3)"
              />
              <SummaryCard
                icon={<CheckCircle2 size={18} />}
                label="Approved"
                value={approvedCount}
                color="oklch(0.80 0.18 130)"
                bg="oklch(0.80 0.18 130 / 0.1)"
                border="oklch(0.80 0.18 130 / 0.3)"
              />
              <SummaryCard
                icon={<XCircle size={18} />}
                label="Rejected"
                value={rejectedCount}
                color="oklch(0.65 0.22 15)"
                bg="oklch(0.65 0.22 15 / 0.1)"
                border="oklch(0.65 0.22 15 / 0.3)"
              />
            </div>

            <section
              className="rounded-2xl border overflow-hidden"
              style={{
                background: "oklch(0.13 0.08 285)",
                borderColor: "oklch(0.25 0.08 285)",
              }}
              data-ocid="admin.transactions.table"
            >
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{ borderColor: "oklch(0.22 0.08 285)" }}
              >
                <h2
                  className="font-bold text-lg"
                  style={{ color: "oklch(0.85 0.18 50)" }}
                >
                  Deposit & Withdrawal Requests
                </h2>
                <Badge
                  className="font-bold"
                  style={{
                    background: "oklch(0.85 0.18 50 / 0.15)",
                    color: "oklch(0.85 0.18 50)",
                    border: "1px solid oklch(0.85 0.18 50 / 0.3)",
                  }}
                >
                  {transactionRequests.length} total
                </Badge>
              </div>

              {transactionRequests.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-16 gap-3"
                  data-ocid="admin.transactions.empty_state"
                >
                  <Clock size={48} style={{ color: "oklch(0.40 0.08 285)" }} />
                  <p
                    style={{ color: "oklch(0.55 0.05 285)" }}
                    className="text-sm font-medium"
                  >
                    No transaction requests yet
                  </p>
                  <p
                    style={{ color: "oklch(0.45 0.05 285)" }}
                    className="text-xs"
                  >
                    Requests will appear here when users submit deposits or
                    withdrawals
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor: "oklch(0.22 0.08 285)" }}>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          Username
                        </TableHead>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          Type
                        </TableHead>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          Amount (PKR)
                        </TableHead>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          Method
                        </TableHead>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          Submitted
                        </TableHead>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          Status
                        </TableHead>
                        <TableHead style={{ color: "oklch(0.60 0.08 285)" }}>
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionRequests.map((req, i) => (
                        <TableRow
                          key={req.id}
                          style={{ borderColor: "oklch(0.20 0.07 285)" }}
                          data-ocid={`admin.transactions.row.${i + 1}`}
                        >
                          <TableCell>
                            <span
                              className="font-bold font-mono text-sm"
                              style={{ color: "oklch(0.75 0.2 195)" }}
                            >
                              {req.username}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className="flex items-center gap-1.5 text-sm font-bold"
                              style={{
                                color:
                                  req.type === "deposit"
                                    ? "oklch(0.80 0.18 130)"
                                    : "oklch(0.75 0.25 335)",
                              }}
                            >
                              {req.type === "deposit" ? (
                                <TrendingUp size={13} />
                              ) : (
                                <TrendingDown size={13} />
                              )}
                              {req.type === "deposit"
                                ? "Deposit"
                                : "Withdrawal"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className="font-black"
                              style={{ color: "oklch(0.85 0.18 50)" }}
                            >
                              {req.amount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className="text-sm"
                              style={{ color: "oklch(0.70 0.06 285)" }}
                            >
                              {req.method}
                            </span>
                          </TableCell>
                          <TableCell
                            className="text-xs"
                            style={{ color: "oklch(0.60 0.05 285)" }}
                          >
                            {new Date(req.submittedAt).toLocaleString("en-PK", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={req.status} />
                          </TableCell>
                          <TableCell>
                            {req.status === "pending" ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    onUpdateRequest(req.id, "approved")
                                  }
                                  data-ocid={`admin.transactions.confirm_button.${i + 1}`}
                                  className="h-7 px-3 text-xs font-black"
                                  style={{
                                    background: "oklch(0.80 0.18 130 / 0.2)",
                                    color: "oklch(0.80 0.18 130)",
                                    border:
                                      "1px solid oklch(0.80 0.18 130 / 0.5)",
                                  }}
                                >
                                  <CheckCircle2 size={12} className="mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    onUpdateRequest(req.id, "rejected")
                                  }
                                  data-ocid={`admin.transactions.delete_button.${i + 1}`}
                                  className="h-7 px-3 text-xs font-black"
                                  style={{
                                    background: "oklch(0.65 0.22 15 / 0.2)",
                                    color: "oklch(0.65 0.22 15)",
                                    border:
                                      "1px solid oklch(0.65 0.22 15 / 0.5)",
                                  }}
                                >
                                  <XCircle size={12} className="mr-1" />
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <span
                                className="text-xs"
                                style={{ color: "oklch(0.50 0.05 285)" }}
                              >
                                —
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </section>
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsTab
              onBroadcast={onBroadcastNotification}
              members={members}
            />
          </TabsContent>

          {/* Support Chat Tab */}
          <TabsContent value="support">
            <SupportChatTab
              tickets={supportTickets}
              onReply={onAdminReplySupportMessage}
              onClose={onCloseSupportTicket}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: TransactionRequest["status"] }) {
  const styles = {
    pending: {
      bg: "oklch(0.85 0.18 50 / 0.15)",
      color: "oklch(0.85 0.18 50)",
      border: "1px solid oklch(0.85 0.18 50 / 0.3)",
      label: "Pending",
    },
    approved: {
      bg: "oklch(0.80 0.18 130 / 0.15)",
      color: "oklch(0.80 0.18 130)",
      border: "1px solid oklch(0.80 0.18 130 / 0.3)",
      label: "Approved",
    },
    rejected: {
      bg: "oklch(0.65 0.22 15 / 0.15)",
      color: "oklch(0.65 0.22 15)",
      border: "1px solid oklch(0.65 0.22 15 / 0.3)",
      label: "Rejected",
    },
  };
  const s = styles[status];
  return (
    <Badge
      className="text-xs font-bold capitalize"
      style={{ background: s.bg, color: s.color, border: s.border }}
    >
      {s.label}
    </Badge>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  color,
  bg,
  border,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      className="rounded-xl p-4 border flex items-center gap-3"
      style={{ background: bg, borderColor: border }}
    >
      <span style={{ color }}>{icon}</span>
      <div>
        <p className="text-2xl font-black" style={{ color }}>
          {value}
        </p>
        <p
          className="text-xs font-semibold"
          style={{ color: "oklch(0.60 0.05 285)" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        background: "oklch(0.13 0.08 285)",
        borderColor: "oklch(0.22 0.08 285)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color }}>{icon}</span>
        <span
          className="text-xs font-semibold"
          style={{ color: "oklch(0.60 0.05 285)" }}
        >
          {label}
        </span>
      </div>
      <p className="text-xl font-black" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

function NotificationsTab({
  onBroadcast,
  members,
}: {
  onBroadcast: (
    targets: string[] | "all",
    title: string,
    detail: string,
  ) => void;
  members: MemberRecord[];
}) {
  const [recipient, setRecipient] = useState("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  function send() {
    if (!title.trim() || !message.trim()) return;
    const targets = recipient === "all" ? "all" : [recipient];
    onBroadcast(targets, title.trim(), message.trim());
    toast.success("Notification sent!");
    setTitle("");
    setMessage("");
    setRecipient("all");
  }

  return (
    <div
      className="rounded-2xl p-6 space-y-5"
      style={{
        background: "oklch(0.14 0.08 285)",
        border: "1px solid oklch(0.22 0.08 285)",
      }}
      data-ocid="admin.notifications.panel"
    >
      <div>
        <h3
          className="font-display font-bold text-lg mb-1"
          style={{ color: "oklch(0.85 0.18 50)" }}
        >
          📢 Broadcast Notification
        </h3>
        <p className="text-xs" style={{ color: "oklch(0.55 0.05 285)" }}>
          Send a promo or announcement to all members or a specific user
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label
            className="text-xs font-bold"
            style={{ color: "oklch(0.65 0.06 285)" }}
          >
            Recipient
          </Label>
          <Select value={recipient} onValueChange={setRecipient}>
            <SelectTrigger
              className="bg-input border-border text-foreground"
              data-ocid="admin.notifications.select"
            >
              <SelectValue placeholder="Select recipient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              {members.map((m) => (
                <SelectItem key={m.username} value={m.username}>
                  {m.name} (@{m.username})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label
            className="text-xs font-bold"
            style={{ color: "oklch(0.65 0.06 285)" }}
          >
            Notification Title
          </Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Special Bonus Alert!"
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            data-ocid="admin.notifications.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            className="text-xs font-bold"
            style={{ color: "oklch(0.65 0.06 285)" }}
          >
            Message
          </Label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your notification message here..."
            rows={3}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
            data-ocid="admin.notifications.textarea"
          />
        </div>
        <Button
          type="button"
          onClick={send}
          disabled={!title.trim() || !message.trim()}
          className="w-full h-11 font-black"
          data-ocid="admin.notifications.submit_button"
          style={{
            background:
              !title.trim() || !message.trim()
                ? "oklch(0.35 0.05 285)"
                : "linear-gradient(135deg, oklch(0.75 0.25 330), oklch(0.65 0.28 350))",
            color:
              !title.trim() || !message.trim()
                ? "oklch(0.5 0.03 285)"
                : "white",
          }}
        >
          📢 Send Notification
        </Button>
      </div>
    </div>
  );
}

function SupportChatTab({
  tickets,
  onReply,
  onClose,
}: {
  tickets: SupportTicket[];
  onReply: (ticketId: string, text: string) => void;
  onClose: (ticketId: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const sorted = [...tickets].sort((a, b) => {
    if (a.status === "open" && b.status !== "open") return -1;
    if (b.status === "open" && a.status !== "open") return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const selected = tickets.find((t) => t.id === selectedId);

  function sendReply() {
    if (!selectedId || !replyText.trim()) return;
    onReply(selectedId, replyText.trim());
    setReplyText("");
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "oklch(0.13 0.08 285)",
        border: "1px solid oklch(0.25 0.08 285)",
      }}
      data-ocid="admin.support.panel"
    >
      <div
        className="px-6 py-4 border-b flex items-center gap-3"
        style={{ borderColor: "oklch(0.22 0.08 285)" }}
      >
        <MessageSquare size={18} style={{ color: "oklch(0.65 0.2 280)" }} />
        <h2
          className="font-bold text-lg"
          style={{ color: "oklch(0.65 0.2 280)" }}
        >
          Support Tickets
        </h2>
      </div>

      {sorted.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 gap-3"
          data-ocid="admin.support.empty_state"
        >
          <MessageSquare size={40} style={{ color: "oklch(0.35 0.06 285)" }} />
          <p style={{ color: "oklch(0.50 0.05 285)" }}>
            No support tickets yet
          </p>
        </div>
      ) : (
        <div
          className="divide-y"
          style={{ borderColor: "oklch(0.18 0.06 285)" }}
        >
          {sorted.map((ticket, idx) => (
            <div key={ticket.id} data-ocid={`admin.support.item.${idx + 1}`}>
              {/* Ticket row */}
              <button
                type="button"
                onClick={() =>
                  setSelectedId(selectedId === ticket.id ? null : ticket.id)
                }
                className="w-full text-left px-6 py-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-black"
                      style={{
                        background: "oklch(0.55 0.25 280 / 0.2)",
                        color: "oklch(0.65 0.2 280)",
                      }}
                    >
                      {ticket.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">
                        {ticket.displayName}
                        <span
                          className="ml-1.5 text-xs font-normal"
                          style={{ color: "oklch(0.55 0.05 285)" }}
                        >
                          @
                          {ticket.username.startsWith("guest_")
                            ? "guest"
                            : ticket.username}
                        </span>
                      </p>
                      <p
                        className="text-xs truncate max-w-[220px]"
                        style={{ color: "oklch(0.55 0.05 285)" }}
                      >
                        {ticket.messages[ticket.messages.length - 1]?.text ??
                          "No messages"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-black"
                      style={{
                        background:
                          ticket.status === "open"
                            ? "oklch(0.75 0.2 150 / 0.2)"
                            : "oklch(0.45 0.05 285 / 0.3)",
                        color:
                          ticket.status === "open"
                            ? "oklch(0.75 0.2 150)"
                            : "oklch(0.55 0.05 285)",
                      }}
                    >
                      {ticket.status}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ color: "oklch(0.45 0.04 285)" }}
                    >
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </button>

              {/* Expanded chat */}
              {selectedId === ticket.id && (
                <div
                  className="px-6 pb-4 space-y-3"
                  style={{ borderTop: "1px solid oklch(0.18 0.06 285)" }}
                >
                  {/* Messages */}
                  <div
                    className="rounded-xl p-3 space-y-2 max-h-60 overflow-y-auto"
                    style={{ background: "oklch(0.10 0.06 285)" }}
                  >
                    {selected?.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.from === "admin" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className="max-w-[75%] rounded-xl px-3 py-2 text-sm"
                          style={{
                            background:
                              msg.from === "admin"
                                ? "linear-gradient(135deg, oklch(0.55 0.25 280), oklch(0.45 0.28 265))"
                                : "oklch(0.20 0.08 285)",
                            color: "white",
                          }}
                        >
                          <p
                            className="text-[10px] font-bold mb-0.5"
                            style={{
                              color:
                                msg.from === "admin"
                                  ? "rgba(255,255,255,0.7)"
                                  : "oklch(0.65 0.2 195)",
                            }}
                          >
                            {msg.from === "admin"
                              ? "You (Admin)"
                              : msg.senderName}
                          </p>
                          <p>{msg.text}</p>
                          <p className="text-[9px] mt-0.5 opacity-60">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply input */}
                  {ticket.status === "open" && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        data-ocid={`admin.support.input.${idx + 1}`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendReply()}
                        placeholder="Type your reply..."
                        className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
                        style={{
                          background: "oklch(0.18 0.08 285)",
                          border: "1px solid oklch(0.28 0.1 285)",
                          color: "white",
                        }}
                      />
                      <Button
                        type="button"
                        data-ocid={`admin.support.submit_button.${idx + 1}`}
                        onClick={sendReply}
                        disabled={!replyText.trim()}
                        className="h-9 px-3"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.55 0.25 280), oklch(0.45 0.28 265))",
                          color: "white",
                        }}
                      >
                        <Send size={14} />
                      </Button>
                      <Button
                        type="button"
                        data-ocid={`admin.support.close_button.${idx + 1}`}
                        onClick={() => {
                          onClose(ticket.id);
                          setSelectedId(null);
                          toast.success("Ticket closed");
                        }}
                        variant="outline"
                        className="h-9 px-3 text-xs font-bold border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Close Ticket
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
