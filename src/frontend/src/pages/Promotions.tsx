import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Percent, Star, Zap } from "lucide-react";
import { motion } from "motion/react";

const PROMOTIONS = [
  {
    icon: Gift,
    title: "Welcome Bonus",
    description:
      "Get 1000 free credits when you sign up and make your first deposit.",
    badge: "NEW PLAYER",
    badgeStyle: {
      background: "oklch(0.72 0.15 195)",
      color: "oklch(0.1 0.02 280)",
    },
    accentColor: "oklch(0.72 0.15 195)",
    cta: "Claim Now",
  },
  {
    icon: Percent,
    title: "Accumulator Boost",
    description:
      "Earn up to 50% extra winnings on accumulators with 4+ selections.",
    badge: "BOOST",
    badgeStyle: { background: "oklch(0.65 0.17 155)", color: "white" },
    accentColor: "oklch(0.65 0.17 155)",
    cta: "Learn More",
  },
  {
    icon: Star,
    title: "Weekly Cashback",
    description:
      "Get 10% cashback on net losses every week, up to 500 credits.",
    badge: "WEEKLY",
    badgeStyle: {
      background: "oklch(0.82 0.18 85)",
      color: "oklch(0.1 0.02 280)",
    },
    accentColor: "oklch(0.82 0.18 85)",
    cta: "Opt In",
  },
  {
    icon: Zap,
    title: "Live Betting Bonus",
    description: "Double your winnings on selected live events every Saturday.",
    badge: "LIVE",
    badgeStyle: { background: "oklch(0.65 0.22 330)", color: "white" },
    accentColor: "oklch(0.65 0.22 330)",
    cta: "View Events",
  },
];

export default function Promotions() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-foreground mb-1">Promotions</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Exclusive offers and bonuses for 100%Real members.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {PROMOTIONS.map((promo, i) => (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl card-shadow border p-5 flex flex-col gap-4"
              style={{
                background: "oklch(0.18 0.07 270)",
                borderColor: "oklch(0.28 0.06 275)",
                borderLeft: `4px solid ${promo.accentColor}`,
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${promo.accentColor}22` }}
                >
                  <promo.icon
                    className="h-5 w-5"
                    style={{ color: promo.accentColor }}
                  />
                </div>
                <Badge
                  className="text-[10px] font-bold border-0"
                  style={promo.badgeStyle}
                >
                  {promo.badge}
                </Badge>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">
                  {promo.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {promo.description}
                </p>
              </div>
              <Button
                size="sm"
                className="self-start border-0 font-bold"
                style={{
                  background: promo.accentColor,
                  color: i === 0 || i === 2 ? "oklch(0.1 0.02 280)" : "white",
                }}
              >
                {promo.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
