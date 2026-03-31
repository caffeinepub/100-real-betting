import { GameDemoModal } from "@/components/GameDemoModal";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type Game = {
  name: string;
  provider: string;
  category: string;
  gradient: string;
  isSlot?: boolean;
  isHot?: boolean;
};

const ALL_GAMES: Game[] = [
  {
    name: "Fortune Gems",
    provider: "JILI",
    category: "Slots",
    gradient: "card-gradient-jili",
    isSlot: true,
    isHot: true,
  },
  {
    name: "Super Ace",
    provider: "JILI",
    category: "Slots",
    gradient: "card-gradient-jili",
    isSlot: true,
  },
  {
    name: "Money Coming",
    provider: "JILI",
    category: "Slots",
    gradient: "card-gradient-jili",
    isSlot: true,
  },
  {
    name: "Crazy 777",
    provider: "JILI",
    category: "Slots",
    gradient: "card-gradient-jili",
    isSlot: true,
    isHot: true,
  },
  {
    name: "Bubble Beauty",
    provider: "JILI",
    category: "Slots",
    gradient: "card-gradient-jili",
    isSlot: true,
  },
  {
    name: "Lucky Goldbricks",
    provider: "JDB",
    category: "Slots",
    gradient: "card-gradient-jdb",
    isSlot: true,
  },
  {
    name: "Royal Flush",
    provider: "JDB",
    category: "Card",
    gradient: "card-gradient-jdb",
  },
  {
    name: "Pirate King",
    provider: "JDB",
    category: "Fishing",
    gradient: "card-gradient-jdb",
    isHot: true,
  },
  {
    name: "Zeus 2",
    provider: "JDB",
    category: "Slots",
    gradient: "card-gradient-jdb",
    isSlot: true,
  },
  {
    name: "Live Baccarat",
    provider: "Live Casino",
    category: "Live",
    gradient: "card-gradient-live",
  },
  {
    name: "Live Roulette",
    provider: "Live Casino",
    category: "Live",
    gradient: "card-gradient-live",
  },
  {
    name: "Live Blackjack",
    provider: "Live Casino",
    category: "Live",
    gradient: "card-gradient-live",
  },
  {
    name: "Dragon Tiger",
    provider: "Live Casino",
    category: "Live",
    gradient: "card-gradient-live",
    isHot: true,
  },
  {
    name: "Aviator",
    provider: "Crash",
    category: "Crash",
    gradient: "card-gradient-crash",
    isHot: true,
  },
  {
    name: "JetX",
    provider: "Crash",
    category: "Crash",
    gradient: "card-gradient-crash",
  },
  {
    name: "Spaceman",
    provider: "Crash",
    category: "Crash",
    gradient: "card-gradient-crash",
  },
  {
    name: "Ocean King",
    provider: "Fishing",
    category: "Fishing",
    gradient: "card-gradient-fishing",
    isHot: true,
  },
  {
    name: "Crab King",
    provider: "Fishing",
    category: "Fishing",
    gradient: "card-gradient-fishing",
  },
  {
    name: "Golden Toad",
    provider: "Fishing",
    category: "Fishing",
    gradient: "card-gradient-fishing",
  },
  {
    name: "Mahjong Ways",
    provider: "PG Soft",
    category: "Slots",
    gradient: "card-gradient-pg",
    isSlot: true,
    isHot: true,
  },
  {
    name: "Ganesha Gold",
    provider: "PG Soft",
    category: "Slots",
    gradient: "card-gradient-pg",
    isSlot: true,
  },
  {
    name: "Wild Bounty",
    provider: "PG Soft",
    category: "Slots",
    gradient: "card-gradient-pg",
    isSlot: true,
  },
  {
    name: "Treasures of Aztec",
    provider: "PG Soft",
    category: "Slots",
    gradient: "card-gradient-pg",
    isSlot: true,
  },
  {
    name: "Sweet Bonanza",
    provider: "Pragmatic Play",
    category: "Slots",
    gradient: "card-gradient-pragmatic",
    isSlot: true,
    isHot: true,
  },
  {
    name: "Gates of Olympus",
    provider: "Pragmatic Play",
    category: "Slots",
    gradient: "card-gradient-pragmatic",
    isSlot: true,
  },
  {
    name: "The Dog House",
    provider: "Pragmatic Play",
    category: "Slots",
    gradient: "card-gradient-pragmatic",
    isSlot: true,
  },
  {
    name: "Lucky Koi",
    provider: "Spadegaming",
    category: "Slots",
    gradient: "card-gradient-spade",
    isSlot: true,
  },
  {
    name: "Book of Myth",
    provider: "Spadegaming",
    category: "Slots",
    gradient: "card-gradient-spade",
    isSlot: true,
  },
  {
    name: "Dancing Fever",
    provider: "Spadegaming",
    category: "Slots",
    gradient: "card-gradient-spade",
    isSlot: true,
    isHot: true,
  },
  {
    name: "Boom Legend",
    provider: "CQ9",
    category: "Slots",
    gradient: "card-gradient-cq9",
    isSlot: true,
    isHot: true,
  },
  {
    name: "Thor Hammer",
    provider: "CQ9",
    category: "Slots",
    gradient: "card-gradient-cq9",
    isSlot: true,
  },
  {
    name: "Cricket Live",
    provider: "Sports",
    category: "Sports",
    gradient: "card-gradient-sports",
    isHot: true,
  },
  {
    name: "Football",
    provider: "Sports",
    category: "Sports",
    gradient: "card-gradient-sports",
  },
  {
    name: "PSL 2025",
    provider: "Sports",
    category: "Sports",
    gradient: "card-gradient-sports",
    isHot: true,
  },
  {
    name: "Lucky Draw",
    provider: "Lottery",
    category: "Lottery",
    gradient: "card-gradient-lottery",
    isHot: true,
  },
  {
    name: "Keno Classic",
    provider: "Lottery",
    category: "Lottery",
    gradient: "card-gradient-lottery",
  },
];

const PROVIDERS = [
  "All",
  ...Array.from(new Set(ALL_GAMES.map((g) => g.provider))),
];
const CATEGORIES = [
  "All",
  "Slots",
  "Live",
  "Crash",
  "Fishing",
  "Card",
  "Sports",
  "Lottery",
];

export function CasinoGamesPage() {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState("All");
  const [category, setCategory] = useState("All");
  const [gameDemo, setGameDemo] = useState<{
    name: string;
    provider: string;
    gameCategory: string;
  } | null>(null);

  const filtered = useMemo(() => {
    return ALL_GAMES.filter((g) => {
      const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
      const matchProvider = provider === "All" || g.provider === provider;
      const matchCategory = category === "All" || g.category === category;
      return matchSearch && matchProvider && matchCategory;
    });
  }, [search, provider, category]);

  return (
    <div className="container mx-auto px-4 py-8" data-ocid="games.section">
      <h1 className="text-gold font-display font-black text-2xl sm:text-3xl mb-6">
        All Games
      </h1>

      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search games..."
            data-ocid="games.search_input"
            className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {PROVIDERS.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setProvider(p)}
              data-ocid="games.provider.tab"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                provider === p
                  ? "bg-pink-accent text-black border-pink"
                  : "border-border text-muted-foreground hover:border-pink/50 hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setCategory(c)}
              data-ocid="games.category.tab"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                category === c
                  ? "bg-cyan-accent text-black border-cyan"
                  : "border-border text-muted-foreground hover:border-cyan/50 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="text-muted-foreground text-sm mb-4">
        {filtered.length} games found
      </p>

      {filtered.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="games.empty_state"
        >
          <p className="text-4xl mb-3">&#x1F50D;</p>
          <p className="font-semibold">
            No games found. Try a different search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((game, i) => (
            <div
              key={game.name}
              data-ocid={`games.item.${i + 1}`}
              className="group rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105"
            >
              <div
                className={`${game.gradient} h-28 sm:h-32 relative flex flex-col items-end justify-between p-2`}
              >
                <div className="flex gap-1 self-start">
                  {game.isSlot && (
                    <Badge className="bg-cyan-accent text-black text-[9px] font-black px-1.5 py-0 h-4">
                      SLOT
                    </Badge>
                  )}
                  {game.isHot && (
                    <Badge className="bg-pink-accent text-black text-[9px] font-black px-1.5 py-0 h-4">
                      HOT
                    </Badge>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setGameDemo({
                      name: game.name,
                      provider: game.provider,
                      gameCategory:
                        game.category === "Slots"
                          ? "slots"
                          : game.category === "Card"
                            ? "card"
                            : game.category === "Fishing"
                              ? "fishing"
                              : game.category === "Live"
                                ? "live"
                                : game.category === "Crash"
                                  ? "crash"
                                  : game.category === "Sports"
                                    ? "sports"
                                    : game.category === "Lottery"
                                      ? "lottery"
                                      : "slots",
                    })
                  }
                  className="bg-black/60 hover:bg-gold hover:text-black text-white text-[10px] font-black px-2 py-1 rounded transition-colors w-full text-center"
                >
                  Play Now
                </button>
              </div>
              <div
                className="p-2"
                style={{ background: "oklch(0.18 0.09 285)" }}
              >
                <p className="text-foreground text-xs font-bold truncate">
                  {game.name}
                </p>
                <p className="text-muted-foreground text-[10px] truncate">
                  {game.provider}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <GameDemoModal
        open={!!gameDemo}
        onClose={() => setGameDemo(null)}
        gameName={gameDemo?.name ?? ""}
        provider={gameDemo?.provider ?? ""}
      />
    </div>
  );
}
