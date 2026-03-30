const TIERS = [
  {
    name: "Bronze",
    icon: "\uD83E\uDD49",
    xp: "0 - 999 XP",
    color: "from-[#7c4a1e] to-[#b06b30]",
    border: "border-[#b06b30]",
    text: "text-[#e8a060]",
    benefits: [
      "5% cashback on losses",
      "Standard support",
      "Access to all games",
    ],
  },
  {
    name: "Silver",
    icon: "\uD83E\uDD48",
    xp: "1,000 - 4,999 XP",
    color: "from-[#3d4a5c] to-[#6b7f96]",
    border: "border-[#8aa0b8]",
    text: "text-[#b8cfe0]",
    benefits: [
      "8% cashback",
      "Priority support",
      "Weekly bonus spins",
      "Exclusive tournaments",
    ],
  },
  {
    name: "Gold",
    icon: "\uD83C\uDFC6",
    xp: "5,000 - 19,999 XP",
    color: "from-[#5a4400] to-[#c8960a]",
    border: "border-gold",
    text: "text-gold",
    benefits: [
      "12% cashback",
      "Dedicated support",
      "Daily reload bonus",
      "VIP tournaments",
      "Higher withdrawal limits",
    ],
  },
  {
    name: "Platinum",
    icon: "\uD83D\uDC8E",
    xp: "20,000 - 99,999 XP",
    color: "from-[#1a0a3e] to-[#5a20c0]",
    border: "border-[#a060ff]",
    text: "text-[#c090ff]",
    benefits: [
      "18% cashback",
      "Personal account manager",
      "Instant withdrawals",
      "Monthly luxury gifts",
      "Private events",
      "Custom bonuses",
    ],
  },
  {
    name: "Diamond",
    icon: "\uD83D\uDCA0",
    xp: "100,000+ XP",
    color: "from-[#001a3a] to-[#0090d0]",
    border: "border-cyan",
    text: "text-cyan",
    benefits: [
      "25% cashback",
      "Elite personal manager",
      "Zero withdrawal fees",
      "Unlimited bonuses",
      "VIP lounge access",
      "Exclusive PKR rewards",
      "Birthday bonus PKR 10,000",
    ],
  },
];

export function VipPage() {
  return (
    <div className="container mx-auto px-4 py-8" data-ocid="vip.section">
      <div
        className="rounded-2xl p-8 text-center mb-10 relative overflow-hidden"
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
        <span className="text-6xl mb-4 block relative">&#x1F451;</span>
        <h1 className="text-gold font-display font-black text-3xl sm:text-4xl mb-3 relative">
          VIP Club
        </h1>
        <p className="text-foreground/80 max-w-xl mx-auto relative">
          Climb the ranks and unlock exclusive rewards. The higher you go, the
          more you earn. Play more to earn XP and advance through our 5-tier VIP
          system.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {TIERS.map((tier, i) => (
          <div
            key={tier.name}
            data-ocid={`vip.tier.item.${i + 1}`}
            className={`rounded-xl border-2 ${tier.border} overflow-hidden transition-all hover:scale-105`}
            style={{ background: "oklch(0.17 0.1 285)" }}
          >
            <div className={`bg-gradient-to-br ${tier.color} p-4 text-center`}>
              <span className="text-4xl block mb-2">{tier.icon}</span>
              <h2 className={`font-display font-black text-xl ${tier.text}`}>
                {tier.name}
              </h2>
              <p className="text-white/70 text-xs mt-1">{tier.xp}</p>
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
        ))}
      </div>

      <div
        className="mt-10 rounded-xl border border-border p-6"
        style={{ background: "oklch(0.17 0.1 285)" }}
      >
        <h2 className="text-gold font-display font-bold text-xl mb-4">
          How to Earn XP
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: "\uD83C\uDFB0",
              title: "Play Games",
              desc: "Earn 1 XP for every PKR 100 wagered on any game",
            },
            {
              icon: "\uD83D\uDCB0",
              title: "Make Deposits",
              desc: "Earn 5 XP for every PKR 100 deposited",
            },
            {
              icon: "\uD83C\uDF81",
              title: "Complete Missions",
              desc: "Special missions reward bonus XP up to 500 XP per week",
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
