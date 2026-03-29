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
    badgeColor: "bg-blue-100 text-blue-700",
    cta: "Claim Now",
  },
  {
    icon: Percent,
    title: "Accumulator Boost",
    description:
      "Earn up to 50% extra winnings on accumulators with 4+ selections.",
    badge: "BOOST",
    badgeColor: "bg-green-100 text-green-700",
    cta: "Learn More",
  },
  {
    icon: Star,
    title: "Weekly Cashback",
    description:
      "Get 10% cashback on net losses every week, up to 500 credits.",
    badge: "WEEKLY",
    badgeColor: "bg-purple-100 text-purple-700",
    cta: "Opt In",
  },
  {
    icon: Zap,
    title: "Live Betting Bonus",
    description: "Double your winnings on selected live events every Saturday.",
    badge: "LIVE",
    badgeColor: "bg-red-100 text-red-700",
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
          Exclusive offers and bonuses for WinSport members.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {PROMOTIONS.map((promo, i) => (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl card-shadow border border-border p-5 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-emerald-brand/10 flex items-center justify-center">
                  <promo.icon className="h-5 w-5 text-emerald-brand" />
                </div>
                <Badge
                  className={`text-[10px] font-bold border-0 ${promo.badgeColor}`}
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
                className="self-start bg-emerald-brand hover:bg-emerald-light text-white border-0"
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
