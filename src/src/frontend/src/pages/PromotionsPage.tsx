import { Badge } from "@/components/ui/badge";

const PROMOS = [
  {
    id: "welcome",
    title: "Welcome Bonus",
    subtitle: "100% match on your first deposit!",
    desc: "New users get a 100% bonus on their first deposit up to PKR 10,000. Minimum deposit PKR 500. Wagering requirement: 10x.",
    icon: "\uD83C\uDF81",
    tag: "New Users",
    tagColor: "bg-green-neon text-black",
    gradient: "from-[#0a3a0a] to-[#1a6a1a]",
    border: "border-green-neon/40",
    expiry: "No expiry",
  },
  {
    id: "reload",
    title: "Daily Reload Bonus",
    subtitle: "50% reload on every deposit today!",
    desc: "Every day, get a 50% reload bonus on your deposit up to PKR 5,000. Available for all players. Wagering: 5x.",
    icon: "\uD83D\uDD04",
    tag: "Daily",
    tagColor: "bg-cyan-accent text-black",
    gradient: "from-[#0a1a4e] to-[#1a3a8e]",
    border: "border-cyan/40",
    expiry: "Resets daily",
  },
  {
    id: "vip-xp",
    title: "VIP Double XP Weekend",
    subtitle: "Earn 2x XP on all games this weekend!",
    desc: "All VIP members earn double XP on every game played this weekend. Level up faster and unlock exclusive rewards.",
    icon: "\u26A1",
    tag: "VIP",
    tagColor: "bg-pink-accent text-black",
    gradient: "from-[#2d0a4e] to-[#6a1a8a]",
    border: "border-pink/40",
    expiry: "This weekend only",
  },
  {
    id: "cashback",
    title: "Weekly Cashback",
    subtitle: "Get up to 15% of your losses back!",
    desc: "Every Monday, receive cashback on your weekly net losses. Bronze: 5%, Silver: 8%, Gold: 12%, Platinum: 18%, Diamond: 25%.",
    icon: "\uD83D\uDCB5",
    tag: "Weekly",
    tagColor: "bg-gold text-black",
    gradient: "from-[#3a2a00] to-[#7a5a00]",
    border: "border-gold/40",
    expiry: "Every Monday",
  },
  {
    id: "referral",
    title: "Refer a Friend",
    subtitle: "Earn PKR 500 for every referral!",
    desc: "Share your referral code with friends. When they deposit PKR 500 or more, you earn PKR 500 bonus instantly. No limit on referrals!",
    icon: "\uD83D\uDC65",
    tag: "Permanent",
    tagColor: "bg-[oklch(0.55_0.22_27)] text-white",
    gradient: "from-[#3a0a0a] to-[#7a1a1a]",
    border: "border-pink/40",
    expiry: "Always active",
  },
  {
    id: "sports",
    title: "PSL 2025 Mega Bet",
    subtitle: "Win PKR 100,000 in prize pool!",
    desc: "Place bets on PSL 2025 matches and win from a PKR 100,000 prize pool. Top bettor each match wins a special prize.",
    icon: "\u26BD",
    tag: "Sports Special",
    tagColor: "bg-green-neon text-black",
    gradient: "from-[#0a2a0a] to-[#1a5a1a]",
    border: "border-green-neon/40",
    expiry: "PSL Season",
  },
];

export function PromotionsPage() {
  return (
    <div className="container mx-auto px-4 py-8" data-ocid="promotions.section">
      <div
        className="rounded-2xl p-8 text-center mb-10 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.1 0.1 285) 0%, oklch(0.2 0.15 0) 50%, oklch(0.1 0.1 285) 100%)",
          boxShadow: "0 0 80px oklch(0.55 0.28 0 / 0.3)",
        }}
      >
        <span className="text-5xl block mb-3">&#x1F381;</span>
        <h1 className="text-gold font-display font-black text-3xl sm:text-4xl mb-3">
          Promotions
        </h1>
        <p className="text-foreground/80 max-w-xl mx-auto">
          Exclusive bonuses, cashback, and special offers for our players. New
          promotions added regularly!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PROMOS.map((promo, i) => (
          <div
            key={promo.id}
            data-ocid={`promotions.item.${i + 1}`}
            className={`rounded-xl border-2 ${promo.border} overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg`}
            style={{ background: "oklch(0.17 0.1 285)" }}
          >
            <div className={`bg-gradient-to-br ${promo.gradient} p-5`}>
              <div className="flex items-start justify-between gap-2">
                <span className="text-4xl">{promo.icon}</span>
                <Badge
                  className={`${promo.tagColor} text-xs font-black px-2 py-0.5 flex-shrink-0`}
                >
                  {promo.tag}
                </Badge>
              </div>
              <h2 className="text-gold font-display font-black text-xl mt-3">
                {promo.title}
              </h2>
              <p className="text-foreground/90 font-semibold text-sm mt-1">
                {promo.subtitle}
              </p>
            </div>
            <div className="p-5">
              <p className="text-foreground/80 text-sm leading-relaxed">
                {promo.desc}
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-muted-foreground text-xs">
                  &#x23F1; {promo.expiry}
                </span>
                <button
                  type="button"
                  data-ocid="promotions.claim.primary_button"
                  className="bg-pink-accent hover:bg-pink-accent/90 text-black text-xs font-black px-4 py-2 rounded-lg transition-all"
                  onClick={() => alert(`Claiming: ${promo.title}`)}
                >
                  Claim Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
