import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
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
      {
        name: "Crazy777",
        image: "/assets/generated/jili-slots.dim_300x200.jpg",
        provider: "JILI",
        providerColor: "bg-red-500",
      },
      {
        name: "Mega Ace",
        image: "/assets/generated/jili-slots.dim_300x200.jpg",
        provider: "JILI",
        providerColor: "bg-red-500",
      },
      {
        name: "Book of Gold",
        image: "/assets/generated/jili-slots.dim_300x200.jpg",
        provider: "JILI",
        providerColor: "bg-red-500",
      },
      {
        name: "Wild Bounty",
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
      {
        name: "Winning Mask",
        image: "/assets/generated/jdb-slots.dim_300x200.jpg",
        provider: "JDB",
        providerColor: "bg-blue-600",
      },
      {
        name: "Dragon King",
        image: "/assets/generated/jdb-slots.dim_300x200.jpg",
        provider: "JDB",
        providerColor: "bg-blue-600",
      },
      {
        name: "Lucky Baller",
        image: "/assets/generated/jdb-slots.dim_300x200.jpg",
        provider: "JDB",
        providerColor: "bg-blue-600",
      },
      {
        name: "Sugar Rush",
        image: "/assets/generated/jdb-slots.dim_300x200.jpg",
        provider: "JDB",
        providerColor: "bg-blue-600",
      },
    ],
  },
  {
    title: "PG Soft",
    provider: "PG",
    badgeColor: "bg-orange-500 text-white",
    games: [
      {
        name: "Mahjong Ways",
        image: "/assets/generated/pgsoft-slots.dim_300x200.jpg",
        provider: "PG",
        providerColor: "bg-orange-500",
      },
      {
        name: "Mahjong Ways 2",
        image: "/assets/generated/pgsoft-slots.dim_300x200.jpg",
        provider: "PG",
        providerColor: "bg-orange-500",
      },
      {
        name: "Fortune Mouse",
        image: "/assets/generated/pgsoft-slots.dim_300x200.jpg",
        provider: "PG",
        providerColor: "bg-orange-500",
      },
      {
        name: "Leprechaun Riches",
        image: "/assets/generated/pgsoft-slots.dim_300x200.jpg",
        provider: "PG",
        providerColor: "bg-orange-500",
      },
      {
        name: "Candy Bonanza",
        image: "/assets/generated/pgsoft-slots.dim_300x200.jpg",
        provider: "PG",
        providerColor: "bg-orange-500",
      },
      {
        name: "Wild Fireworks",
        image: "/assets/generated/pgsoft-slots.dim_300x200.jpg",
        provider: "PG",
        providerColor: "bg-orange-500",
      },
      {
        name: "Dragon Hatch",
        image: "/assets/generated/pgsoft-slots.dim_300x200.jpg",
        provider: "PG",
        providerColor: "bg-orange-500",
      },
      {
        name: "Gem Saviour",
        image: "/assets/generated/pgsoft-slots.dim_300x200.jpg",
        provider: "PG",
        providerColor: "bg-orange-500",
      },
    ],
  },
  {
    title: "Pragmatic Play",
    provider: "PP",
    badgeColor: "bg-rose-600 text-white",
    games: [
      {
        name: "Gates of Olympus",
        image: "/assets/generated/pragmatic-slots.dim_300x200.jpg",
        provider: "PP",
        providerColor: "bg-rose-600",
      },
      {
        name: "Sweet Bonanza",
        image: "/assets/generated/pragmatic-slots.dim_300x200.jpg",
        provider: "PP",
        providerColor: "bg-rose-600",
      },
      {
        name: "Starlight Princess",
        image: "/assets/generated/pragmatic-slots.dim_300x200.jpg",
        provider: "PP",
        providerColor: "bg-rose-600",
      },
      {
        name: "Big Bass Bonanza",
        image: "/assets/generated/pragmatic-slots.dim_300x200.jpg",
        provider: "PP",
        providerColor: "bg-rose-600",
      },
      {
        name: "Wolf Gold",
        image: "/assets/generated/pragmatic-slots.dim_300x200.jpg",
        provider: "PP",
        providerColor: "bg-rose-600",
      },
      {
        name: "Aztec Gems",
        image: "/assets/generated/pragmatic-slots.dim_300x200.jpg",
        provider: "PP",
        providerColor: "bg-rose-600",
      },
      {
        name: "Fruit Party",
        image: "/assets/generated/pragmatic-slots.dim_300x200.jpg",
        provider: "PP",
        providerColor: "bg-rose-600",
      },
      {
        name: "Eye of Cleopatra",
        image: "/assets/generated/pragmatic-slots.dim_300x200.jpg",
        provider: "PP",
        providerColor: "bg-rose-600",
      },
    ],
  },
  {
    title: "Spadegaming",
    provider: "SPADE",
    badgeColor: "bg-violet-600 text-white",
    games: [
      {
        name: "Gem & Stars",
        image: "/assets/generated/spade-slots.dim_300x200.jpg",
        provider: "SPADE",
        providerColor: "bg-violet-600",
      },
      {
        name: "Midas Touch",
        image: "/assets/generated/spade-slots.dim_300x200.jpg",
        provider: "SPADE",
        providerColor: "bg-violet-600",
      },
      {
        name: "Lucky Koi",
        image: "/assets/generated/spade-slots.dim_300x200.jpg",
        provider: "SPADE",
        providerColor: "bg-violet-600",
      },
      {
        name: "Triple Pandas",
        image: "/assets/generated/spade-slots.dim_300x200.jpg",
        provider: "SPADE",
        providerColor: "bg-violet-600",
      },
      {
        name: "Dragon Gold",
        image: "/assets/generated/spade-slots.dim_300x200.jpg",
        provider: "SPADE",
        providerColor: "bg-violet-600",
      },
      {
        name: "Ninja vs Samurai",
        image: "/assets/generated/spade-slots.dim_300x200.jpg",
        provider: "SPADE",
        providerColor: "bg-violet-600",
      },
    ],
  },
  {
    title: "CQ9 Gaming",
    provider: "CQ9",
    badgeColor: "bg-amber-600 text-white",
    games: [
      {
        name: "Thor X",
        image: "/assets/generated/cq9-slots.dim_300x200.jpg",
        provider: "CQ9",
        providerColor: "bg-amber-600",
      },
      {
        name: "Money Tree",
        image: "/assets/generated/cq9-slots.dim_300x200.jpg",
        provider: "CQ9",
        providerColor: "bg-amber-600",
      },
      {
        name: "Jumping Cats",
        image: "/assets/generated/cq9-slots.dim_300x200.jpg",
        provider: "CQ9",
        providerColor: "bg-amber-600",
      },
      {
        name: "Three Little Pigs",
        image: "/assets/generated/cq9-slots.dim_300x200.jpg",
        provider: "CQ9",
        providerColor: "bg-amber-600",
      },
      {
        name: "Lucky Strike",
        image: "/assets/generated/cq9-slots.dim_300x200.jpg",
        provider: "CQ9",
        providerColor: "bg-amber-600",
      },
      {
        name: "Golden Dragon",
        image: "/assets/generated/cq9-slots.dim_300x200.jpg",
        provider: "CQ9",
        providerColor: "bg-amber-600",
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
      {
        name: "Sic Bo",
        image: "/assets/generated/live-casino.dim_300x200.jpg",
        provider: "LIVE",
        providerColor: "bg-yellow-500",
      },
      {
        name: "Andar Bahar",
        image: "/assets/generated/live-casino.dim_300x200.jpg",
        provider: "LIVE",
        providerColor: "bg-yellow-500",
      },
      {
        name: "Teen Patti",
        image: "/assets/generated/live-casino.dim_300x200.jpg",
        provider: "LIVE",
        providerColor: "bg-yellow-500",
      },
      {
        name: "Casino Hold'em",
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
      {
        name: "JetX",
        image: "/assets/generated/crash-game.dim_300x200.jpg",
        provider: "CRASH",
        providerColor: "bg-purple-600",
      },
      {
        name: "Mines",
        image: "/assets/generated/crash-game.dim_300x200.jpg",
        provider: "CRASH",
        providerColor: "bg-purple-600",
      },
      {
        name: "Plinko",
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
      {
        name: "Mega Fishing",
        image: "/assets/generated/fishing-game.dim_300x200.jpg",
        provider: "FISH",
        providerColor: "bg-teal-500",
      },
      {
        name: "All Star Fishing",
        image: "/assets/generated/fishing-game.dim_300x200.jpg",
        provider: "FISH",
        providerColor: "bg-teal-500",
      },
      {
        name: "Royal Fishing",
        image: "/assets/generated/fishing-game.dim_300x200.jpg",
        provider: "FISH",
        providerColor: "bg-teal-500",
      },
    ],
  },
  {
    title: "Sports Betting",
    provider: "SPORT",
    badgeColor: "bg-green-600 text-white",
    games: [
      {
        name: "Football (Soccer)",
        image: "/assets/generated/sports-betting.dim_300x200.jpg",
        provider: "SPORT",
        providerColor: "bg-green-600",
      },
      {
        name: "Cricket",
        image: "/assets/generated/sports-betting.dim_300x200.jpg",
        provider: "SPORT",
        providerColor: "bg-green-600",
      },
      {
        name: "Basketball",
        image: "/assets/generated/sports-betting.dim_300x200.jpg",
        provider: "SPORT",
        providerColor: "bg-green-600",
      },
      {
        name: "Tennis",
        image: "/assets/generated/sports-betting.dim_300x200.jpg",
        provider: "SPORT",
        providerColor: "bg-green-600",
      },
      {
        name: "Kabaddi",
        image: "/assets/generated/sports-betting.dim_300x200.jpg",
        provider: "SPORT",
        providerColor: "bg-green-600",
      },
      {
        name: "Horse Racing",
        image: "/assets/generated/sports-betting.dim_300x200.jpg",
        provider: "SPORT",
        providerColor: "bg-green-600",
      },
    ],
  },
  {
    title: "Lottery & Keno",
    provider: "LOTTO",
    badgeColor: "bg-pink-600 text-white",
    games: [
      {
        name: "Keno Deluxe",
        image: "/assets/generated/lottery-game.dim_300x200.jpg",
        provider: "LOTTO",
        providerColor: "bg-pink-600",
      },
      {
        name: "Lucky Numbers",
        image: "/assets/generated/lottery-game.dim_300x200.jpg",
        provider: "LOTTO",
        providerColor: "bg-pink-600",
      },
      {
        name: "Bingo Blitz",
        image: "/assets/generated/lottery-game.dim_300x200.jpg",
        provider: "LOTTO",
        providerColor: "bg-pink-600",
      },
      {
        name: "Powerball",
        image: "/assets/generated/lottery-game.dim_300x200.jpg",
        provider: "LOTTO",
        providerColor: "bg-pink-600",
      },
      {
        name: "Pick 3",
        image: "/assets/generated/lottery-game.dim_300x200.jpg",
        provider: "LOTTO",
        providerColor: "bg-pink-600",
      },
      {
        name: "Scratch Cards",
        image: "/assets/generated/lottery-game.dim_300x200.jpg",
        provider: "LOTTO",
        providerColor: "bg-pink-600",
      },
    ],
  },
  {
    title: "Card & Poker",
    provider: "POKER",
    badgeColor: "bg-slate-600 text-white",
    games: [
      {
        name: "Texas Hold'em",
        image: "/assets/generated/card-poker.dim_300x200.jpg",
        provider: "POKER",
        providerColor: "bg-slate-600",
      },
      {
        name: "Three Card Poker",
        image: "/assets/generated/card-poker.dim_300x200.jpg",
        provider: "POKER",
        providerColor: "bg-slate-600",
      },
      {
        name: "Pai Gow",
        image: "/assets/generated/card-poker.dim_300x200.jpg",
        provider: "POKER",
        providerColor: "bg-slate-600",
      },
      {
        name: "Caribbean Stud",
        image: "/assets/generated/card-poker.dim_300x200.jpg",
        provider: "POKER",
        providerColor: "bg-slate-600",
      },
      {
        name: "Video Poker",
        image: "/assets/generated/card-poker.dim_300x200.jpg",
        provider: "POKER",
        providerColor: "bg-slate-600",
      },
      {
        name: "Hi-Lo",
        image: "/assets/generated/card-poker.dim_300x200.jpg",
        provider: "POKER",
        providerColor: "bg-slate-600",
      },
    ],
  },
];

const FILTER_PILLS = [
  { label: "All", value: "ALL" },
  { label: "JILI", value: "JILI" },
  { label: "JDB", value: "JDB" },
  { label: "PG Soft", value: "PG" },
  { label: "Pragmatic", value: "PP" },
  { label: "Spadegaming", value: "SPADE" },
  { label: "CQ9", value: "CQ9" },
  { label: "Live Casino", value: "LIVE" },
  { label: "Crash", value: "CRASH" },
  { label: "Fishing", value: "FISH" },
  { label: "Sports", value: "SPORT" },
  { label: "Lottery", value: "LOTTO" },
  { label: "Poker", value: "POKER" },
];

function GameCard({ game, index }: { game: GameCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group rounded-xl overflow-hidden bg-card border border-border hover:border-emerald-brand/50 hover:shadow-lg transition-all cursor-pointer"
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
      transition={{ duration: 0.4, delay: sectionIndex * 0.05 }}
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("ALL");

  const filteredSections = useMemo(() => {
    let sections = GAME_SECTIONS;

    if (selectedProvider !== "ALL") {
      sections = sections.filter((s) => s.provider === selectedProvider);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      sections = sections
        .map((s) => ({
          ...s,
          games: s.games.filter((g) => g.name.toLowerCase().includes(q)),
        }))
        .filter((s) => s.games.length > 0);
    }

    return sections;
  }, [searchTerm, selectedProvider]);

  const totalGames = filteredSections.reduce(
    (acc, s) => acc + s.games.length,
    0,
  );
  const isFiltering = searchTerm.trim() !== "" || selectedProvider !== "ALL";

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
              JILI · JDB · PG Soft · Pragmatic · Spadegaming · CQ9 & More
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                "JILI",
                "JDB",
                "PG Soft",
                "Pragmatic",
                "Spadegaming",
                "CQ9",
                "Live Casino",
                "Crash",
                "Fishing",
                "Sports",
                "Lottery",
                "Poker",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Search & Filter Bar */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border shadow-md">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              data-ocid="casino.search_input"
              type="text"
              placeholder="Search games by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-emerald-brand/50 focus:border-emerald-brand transition"
            />
            {searchTerm && (
              <button
                type="button"
                data-ocid="casino.search_input"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {FILTER_PILLS.map((pill) => (
              <button
                key={pill.value}
                type="button"
                data-ocid={`casino.${pill.value.toLowerCase()}.tab`}
                onClick={() => setSelectedProvider(pill.value)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  selectedProvider === pill.value
                    ? "bg-emerald-brand text-white border-emerald-brand shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-emerald-brand/50 hover:text-foreground"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Result Count */}
          <AnimatePresence>
            {isFiltering && (
              <motion.p
                key="count"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                data-ocid="casino.search.success_state"
                className="text-xs text-emerald-brand font-medium"
              >
                {totalGames} game{totalGames !== 1 ? "s" : ""} found
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Game sections */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 space-y-10">
        <AnimatePresence mode="wait">
          {filteredSections.length > 0 ? (
            filteredSections.map((section, i) => (
              <GameSection
                key={section.title}
                section={section}
                sectionIndex={i}
              />
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3 }}
              data-ocid="casino.search.empty_state"
              className="flex flex-col items-center justify-center py-24 text-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  No games found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try a different keyword or select another category.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedProvider("ALL");
                }}
                className="text-sm text-emerald-brand hover:underline font-medium"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
