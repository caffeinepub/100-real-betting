import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { toast } from "sonner";

interface GameCard {
  name: string;
  image: string;
  provider: string;
  providerColor: string;
}

interface GameSection {
  title: string;
  provider: string;
  badgeColor: string;
  games: GameCard[];
}

const GAME_SECTIONS: GameSection[] = [
  {
    title: "JILI Games",
    provider: "JILI",
    badgeColor: "bg-red-500 text-white",
    games: [
      {
        name: "Fortune Tiger",
        image: "/assets/generated/jili-slots.dim_300x200.jpg",
        provider: "JILI",
        providerColor: "bg-red-500",
      },
      {
        name: "Lucky Piggy",
        image: "/assets/generated/jili-slots.dim_300x200.jpg",
        provider: "JILI",
        providerColor: "bg-red-500",
      },
      {
        name: "Super Ace",
        image: "/assets/generated/jili-slots.dim_300x200.jpg",
        provider: "JILI",
        providerColor: "bg-red-500",
      },
      {
        name: "Money Coming",
        image: "/assets/generated/jili-slots.dim_300x200.jpg",
        provider: "JILI",
        providerColor: "bg-red-500",
      },
    ],
  },
  {
    title: "JDB Games",
    provider: "JDB",
    badgeColor: "bg-blue-600 text-white",
    games: [
      {
        name: "Fruity Candy",
        image: "/assets/generated/jdb-slots.dim_300x200.jpg",
        provider: "JDB",
        providerColor: "bg-blue-600",
      },
      {
        name: "Golden Joker",
        image: "/assets/generated/jdb-slots.dim_300x200.jpg",
        provider: "JDB",
        providerColor: "bg-blue-600",
      },
      {
        name: "Thunder God",
        image: "/assets/generated/jdb-slots.dim_300x200.jpg",
        provider: "JDB",
        providerColor: "bg-blue-600",
      },
      {
        name: "Dancing Lion",
        image: "/assets/generated/jdb-slots.dim_300x200.jpg",
        provider: "JDB",
        providerColor: "bg-blue-600",
      },
    ],
  },
  {
    title: "Live Casino",
    provider: "LIVE",
    badgeColor: "bg-yellow-500 text-white",
    games: [
      {
        name: "Roulette",
        image: "/assets/generated/live-casino.dim_300x200.jpg",
        provider: "LIVE",
        providerColor: "bg-yellow-500",
      },
      {
        name: "Baccarat",
        image: "/assets/generated/live-casino.dim_300x200.jpg",
        provider: "LIVE",
        providerColor: "bg-yellow-500",
      },
      {
        name: "Blackjack",
        image: "/assets/generated/live-casino.dim_300x200.jpg",
        provider: "LIVE",
        providerColor: "bg-yellow-500",
      },
      {
        name: "Dragon Tiger",
        image: "/assets/generated/live-casino.dim_300x200.jpg",
        provider: "LIVE",
        providerColor: "bg-yellow-500",
      },
    ],
  },
  {
    title: "Crash Games",
    provider: "CRASH",
    badgeColor: "bg-purple-600 text-white",
    games: [
      {
        name: "Aviator",
        image: "/assets/generated/crash-game.dim_300x200.jpg",
        provider: "CRASH",
        providerColor: "bg-purple-600",
      },
      {
        name: "Spaceman",
        image: "/assets/generated/crash-game.dim_300x200.jpg",
        provider: "CRASH",
        providerColor: "bg-purple-600",
      },
      {
        name: "Rocket Launch",
        image: "/assets/generated/crash-game.dim_300x200.jpg",
        provider: "CRASH",
        providerColor: "bg-purple-600",
      },
    ],
  },
  {
    title: "Fishing Games",
    provider: "FISH",
    badgeColor: "bg-teal-500 text-white",
    games: [
      {
        name: "Fish Prawn Crab",
        image: "/assets/generated/fishing-game.dim_300x200.jpg",
        provider: "FISH",
        providerColor: "bg-teal-500",
      },
      {
        name: "Ocean King",
        image: "/assets/generated/fishing-game.dim_300x200.jpg",
        provider: "FISH",
        providerColor: "bg-teal-500",
      },
      {
        name: "Bombing Fishing",
        image: "/assets/generated/fishing-game.dim_300x200.jpg",
        provider: "FISH",
        providerColor: "bg-teal-500",
      },
    ],
  },
  {
    title: "Card & Poker",
    provider: "CARDS",
    badgeColor: "bg-gray-800 text-white",
    games: [
      {
        name: "Texas Hold'em",
        image: "/assets/generated/poker-game.dim_300x200.jpg",
        provider: "CARDS",
        providerColor: "bg-gray-800",
      },
      {
        name: "Teen Patti",
        image: "/assets/generated/poker-game.dim_300x200.jpg",
        provider: "CARDS",
        providerColor: "bg-gray-800",
      },
      {
        name: "Andar Bahar",
        image: "/assets/generated/poker-game.dim_300x200.jpg",
        provider: "CARDS",
        providerColor: "bg-gray-800",
      },
    ],
  },
];

function GameCard({ game, index }: { game: GameCard; index: number }) {
  return (
    <motion.div
      data-ocid={`casino.game.item.${index}`}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-xl overflow-hidden border border-border card-shadow group cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="relative overflow-hidden">
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-32 sm:h-36 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div
          className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${game.providerColor} text-white`}
        >
          {game.provider}
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-foreground truncate mb-2">
          {game.name}
        </p>
        <Button
          data-ocid={`casino.game.play.button.${index}`}
          size="sm"
          className="w-full bg-emerald-brand hover:bg-emerald-light text-white border-0 text-xs h-8"
          onClick={() => toast.info("Game launching soon! Stay tuned.")}
        >
          Play Now
        </Button>
      </div>
    </motion.div>
  );
}

function GameSection({
  section,
  sectionIndex,
}: { section: GameSection; sectionIndex: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-foreground">{section.title}</h2>
          <Badge className={`text-xs font-bold border-0 ${section.badgeColor}`}>
            {section.provider}
          </Badge>
        </div>
        <button
          type="button"
          data-ocid={`casino.${section.provider.toLowerCase()}.viewall.link`}
          className="text-sm text-emerald-brand hover:underline font-medium"
        >
          View All
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {section.games.map((game, i) => (
          <GameCard key={game.name} game={game} index={i + 1} />
        ))}
      </div>
    </motion.section>
  );
}

export default function CasinoGames() {
  return (
    <div>
      {/* Hero */}
      <div className="hero-gradient w-full py-12 px-6">
        <div className="max-w-[1280px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Casino Games
            </h1>
            <p className="text-white/70 text-lg mt-1">
              Play JILI, JDB, Live Casino & More
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["JILI", "JDB", "Live Casino", "Crash", "Fishing", "Poker"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/20"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Game sections */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-10">
        {GAME_SECTIONS.map((section, i) => (
          <GameSection key={section.title} section={section} sectionIndex={i} />
        ))}
      </div>
    </div>
  );
}
