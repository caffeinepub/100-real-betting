import { Progress } from "@/components/ui/progress";
import type { TransactionRequest, User } from "../App";

const TIERS = [
  {
    name: "Bronze",
    icon: "🥉",
    min: 0,
    max: 4999,
    label: "PKR 0 - 4,999",
    cashback: "3%",
    color: "from-[#7c4a1e] to-[#b06b30]",
    border: "border-[#b06b30]",
    text: "text-[#e8a060]",
    textColor: "oklch(0.75 0.15 55)",
    benefits: [
      "3% cashback on losses",
      "Standard support",
      "Access to all games",
    ],
  },
  {
    name: "Silver",
    icon: "🥈",
    min: 5000,
    max: 19999,
    label: "PKR 5,000 - 19,999",
    cashback: "5%",
    color: "from-[#3d4a5c] to-[#6b7f96]",
    border: "border-[#8aa0b8]",
    text: "text-[#b8cfe0]",
    textColor: "oklch(0.78 0.08 220)",
    benefits: [
      "5% cashback",
      "Priority support",
      "Weekly bonus spins",
      "Exclusive tournaments",
    ],
  },
  {
    name: "Gold",
    icon: "🏆",
    min: 20000,
    max: 49999,
    label: "PKR 20,000 - 49,999",
    cashback: "8%",
    color: "from-[#5a4400] to-[#c8960a]",
    border: "border-gold",
    text: "text-gold",
    textColor: "oklch(0.82 0.22 75)",
    benefits: [
      "8% cashback",
      "Dedicated support",
      "Daily reload bonus",
      "VIP tournaments",
      "Higher withdrawal limits",
    ],
  },
  {
    name: "Platinum",
    icon: "💎",
    min: 50000,
    max: 99999,
    label: "PKR 50,000 - 99,999",
    cashback: "12%",
    color: "from-[#1a0a3e] to-[#5a20c0]",
    border: "border-[#a060ff]",
    text: "text-[#c090ff]",
    textColor: "oklch(0.72 0.20 295)",
    benefits: [
      "12% cashback",
      "Personal account manager",
      "Instant withdrawals",
      "Monthly luxury gifts",
      "Private events",
      "Custom bonuses",
    ],
  },
  {
    name: "Diamond",
    icon: "💠",
    min: 100000,
    max: Number.POSITIVE_INFINITY,
    label: "PKR 100,000+",
    cashback: "18%",
    color: "from-[#001a3a] to-[#0090d0]",
    border: "border-cyan",
    text: "text-cyan",
    textColor: "oklch(0.78 0.18 210)",
    benefits: [
      "18% cashback",
      "Elite personal manager",
      "Zero withdrawal fees",
      "Unlimited bonuses",
      "VIP lounge access",
      "Exclusive PKR rewards",
      "Birthday bonus PKR 10,000",
    ],
  },
];

function getTierIndex(totalDeposited: number): number {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (totalDeposited >= TIERS[i].min) return i;
  }
  return 0;
}

interface VipPageProps {
  user?: User | null;
  transactions?: TransactionRequest[];
}

export function VipPage({ user, transactions = [] }: VipPageProps) {
  const totalDeposited =
    user && !user.isAdmin
      ? transactions
          .filter(
            (t) =>
              t.username === user.username &&
              t.type === "deposit" &&
              t.status === "approved",
          )
          .reduce((s, t) => s + t.amount, 0)
      : 0;

  const tierIndex = getTierIndex(totalDeposited);
  const currentTier = TIERS[tierIndex];
  const nextTier = tierIndex < TIERS.length - 1 ? TIERS[tierIndex + 1] : null;

  const progressPct = nextTier
    ? Math.min(
        100,
        Math.round(
          ((totalDeposited - currentTier.min) /
            (nextTier.min - currentTier.min)) *
            100,
        ),
      )
    : 100;

  const amountToNext = nextTier
    ? Math.max(0, nextTier.min - totalDeposited)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8" data-ocid="vip.section">
      {/* Hero */}
      <div
        className="rounded-2xl p-8 text-center mb-8 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.1 290) 0%, oklch(0.2 0.18 320) 50%, oklch(0.12 0.1 260) 100%)",
          boxShadow: "0 0 100px oklch(0.85 0.18 85 / 0.3)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, oklch(0.85 0.18 85 / 0.05) 0%, transparent 70%)",
          }}
        />
        <span className="text-6xl mb-4 block relative">👑</span>
        <h1 className="text-gold font-display font-black text-3xl sm:text-4xl mb-3 relative">
          VIP Club
        </h1>
        <p className="text-foreground/80 max-w-xl mx-auto relative">
          Climb the ranks and unlock exclusive rewards. Deposit more to advance
          through our 5-tier VIP system and earn bigger cashback bonuses.
        </p>
      </div>

      {/* Current level banner — only for logged-in non-admin users */}
      {user && !user.isAdmin && (
        <div
          className="rounded-2xl p-5 mb-8"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.15 0.12 285), oklch(0.20 0.15 300))",
            border: `2px solid ${currentTier.textColor}`,
            boxShadow: `0 0 30px ${currentTier.textColor}33`,
          }}
          data-ocid="vip.panel"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-5xl">{currentTier.icon}</span>
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-0.5"
                  style={{ color: "oklch(0.55 0.05 285)" }}
                >
                  Your Current Level
                </p>
                <p
                  className="font-display font-black text-2xl"
                  style={{ color: currentTier.textColor }}
                >
                  {currentTier.name}
                </p>
                <p
                  className="text-sm font-bold mt-0.5"
                  style={{ color: "oklch(0.65 0.08 285)" }}
                >
                  Total Deposited:{" "}
                  <span style={{ color: "oklch(0.88 0.04 285)" }}>
                    PKR {totalDeposited.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>

            {nextTier && (
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: currentTier.textColor }}>
                    {currentTier.name}
                  </span>
                  <span style={{ color: nextTier.textColor }}>
                    {nextTier.name}
                  </span>
                </div>
                <Progress
                  value={progressPct}
                  className="h-2.5 rounded-full"
                  style={{
                    background: "oklch(0.22 0.08 285)",
                  }}
                />
                <p
                  className="text-xs mt-1.5"
                  style={{ color: "oklch(0.60 0.05 285)" }}
                >
                  Deposit{" "}
                  <span
                    className="font-bold"
                    style={{ color: nextTier.textColor }}
                  >
                    PKR {amountToNext.toLocaleString()} more
                  </span>{" "}
                  to reach {nextTier.name}
                </p>
              </div>
            )}

            {!nextTier && (
              <div className="text-center sm:text-right">
                <p
                  className="font-black text-lg"
                  style={{ color: currentTier.textColor }}
                >
                  🏆 Max Level!
                </p>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.60 0.05 285)" }}
                >
                  You've reached Diamond status
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tier cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {TIERS.map((tier, i) => {
          const isActive = user && !user.isAdmin && i === tierIndex;
          return (
            <div
              key={tier.name}
              data-ocid={`vip.tier.item.${i + 1}`}
              className={`rounded-xl border-2 ${tier.border} overflow-hidden transition-all hover:scale-105 ${
                isActive ? "ring-2 ring-offset-2 ring-offset-transparent" : ""
              }`}
              style={{
                background: "oklch(0.17 0.1 285)",
                ...(isActive ? { ringColor: tier.textColor } : {}),
                boxShadow: isActive ? `0 0 20px ${tier.textColor}55` : "none",
              }}
            >
              <div
                className={`bg-gradient-to-br ${tier.color} p-4 text-center relative`}
              >
                {isActive && (
                  <span
                    className="absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      color: tier.textColor,
                    }}
                  >
                    YOUR LEVEL
                  </span>
                )}
                <span className="text-4xl block mb-2">{tier.icon}</span>
                <h2 className={`font-display font-black text-xl ${tier.text}`}>
                  {tier.name}
                </h2>
                <p className="text-white/70 text-xs mt-1">{tier.label}</p>
                <p
                  className="text-xs font-bold mt-1"
                  style={{ color: tier.textColor }}
                >
                  {tier.cashback} Cashback
                </p>
              </div>
              <div className="p-4">
                <p className="text-muted-foreground text-xs font-bold mb-3 uppercase tracking-wider">
                  Benefits
                </p>
                <ul className="space-y-2">
                  {tier.benefits.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-sm text-foreground/90"
                    >
                      <span
                        className={`${tier.text} flex-shrink-0 text-base leading-none`}
                      >
                        &#x2726;
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* How VIP levels work */}
      <div
        className="mt-10 rounded-xl border border-border p-6"
        style={{ background: "oklch(0.17 0.1 285)" }}
      >
        <h2 className="text-gold font-display font-bold text-xl mb-4">
          How VIP Levels Work
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: "💰",
              title: "Deposit Funds",
              desc: "Your VIP level is based on your total approved deposits. The more you deposit, the higher your tier.",
            },
            {
              icon: "📈",
              title: "Automatic Upgrade",
              desc: "Levels upgrade automatically when your cumulative deposits cross the required threshold.",
            },
            {
              icon: "🎁",
              title: "Earn Cashback",
              desc: "Higher tiers earn bigger cashback percentages on losses, priority support, and exclusive bonuses.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-3 items-start p-4 rounded-lg"
              style={{ background: "oklch(0.2 0.1 285)" }}
            >
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="font-bold text-foreground">{item.title}</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
