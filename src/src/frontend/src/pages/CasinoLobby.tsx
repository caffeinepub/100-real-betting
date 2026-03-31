import { GameDemoModal } from "@/components/GameDemoModal";
import { useState } from "react";
import type { Page } from "../App";

interface CasinoLobbyProps {
  onNavigate: (p: Page) => void;
}

type GameCard = { name: string; gradient: string; badge?: string };
type Provider = { id: string; title: string; icon: string; cards: GameCard[] };

const PROVIDERS: Provider[] = [
  {
    id: "jili",
    title: "JILI Games",
    icon: "\uD83C\uDFB0",
    cards: [
      { name: "Fortune Gems", gradient: "card-gradient-jili", badge: "HOT" },
      { name: "Super Ace", gradient: "card-gradient-jili", badge: "SLOT" },
      { name: "Money Coming", gradient: "card-gradient-jili" },
      { name: "Crazy 777", gradient: "card-gradient-jili", badge: "SLOT" },
    ],
  },
  {
    id: "jdb",
    title: "JDB Games",
    icon: "\uD83D\uDC8E",
    cards: [
      {
        name: "Lucky Goldbricks",
        gradient: "card-gradient-jdb",
        badge: "SLOT",
      },
      { name: "Royal Flush", gradient: "card-gradient-jdb" },
      { name: "Pirate King", gradient: "card-gradient-jdb", badge: "HOT" },
      { name: "Zeus 2", gradient: "card-gradient-jdb", badge: "SLOT" },
    ],
  },
  {
    id: "live",
    title: "Live Casino",
    icon: "\uD83C\uDFB2",
    cards: [
      { name: "Live Baccarat", gradient: "card-gradient-live", badge: "LIVE" },
      { name: "Live Roulette", gradient: "card-gradient-live", badge: "LIVE" },
      { name: "Live Blackjack", gradient: "card-gradient-live", badge: "LIVE" },
      { name: "Dragon Tiger", gradient: "card-gradient-live", badge: "HOT" },
    ],
  },
  {
    id: "crash",
    title: "Crash Games",
    icon: "\uD83D\uDE80",
    cards: [
      { name: "Aviator", gradient: "card-gradient-crash", badge: "HOT" },
      { name: "JetX", gradient: "card-gradient-crash" },
      { name: "Crash X", gradient: "card-gradient-crash" },
      { name: "Spaceman", gradient: "card-gradient-crash", badge: "NEW" },
    ],
  },
  {
    id: "fishing",
    title: "Fishing Games",
    icon: "\uD83C\uDFA3",
    cards: [
      { name: "Ocean King", gradient: "card-gradient-fishing", badge: "HOT" },
      { name: "Crab King", gradient: "card-gradient-fishing" },
      { name: "Fish Haiba", gradient: "card-gradient-fishing" },
      { name: "Golden Toad", gradient: "card-gradient-fishing", badge: "NEW" },
    ],
  },
  {
    id: "card",
    title: "Card & Poker",
    icon: "\uD83C\uDCCF",
    cards: [
      { name: "Teen Patti", gradient: "card-gradient-card", badge: "HOT" },
      { name: "Andar Bahar", gradient: "card-gradient-card" },
      { name: "Texas Holdem", gradient: "card-gradient-card" },
      { name: "3 Card Poker", gradient: "card-gradient-card" },
    ],
  },
  {
    id: "pg",
    title: "PG Soft",
    icon: "\uD83C\uDF1F",
    cards: [
      { name: "Mahjong Ways", gradient: "card-gradient-pg", badge: "SLOT" },
      { name: "Ganesha Gold", gradient: "card-gradient-pg", badge: "HOT" },
      { name: "Wild Bounty", gradient: "card-gradient-pg", badge: "SLOT" },
      { name: "Treasures of Aztec", gradient: "card-gradient-pg" },
    ],
  },
  {
    id: "pragmatic",
    title: "Pragmatic Play",
    icon: "\uD83C\uDFC6",
    cards: [
      {
        name: "Sweet Bonanza",
        gradient: "card-gradient-pragmatic",
        badge: "HOT",
      },
      {
        name: "Gates of Olympus",
        gradient: "card-gradient-pragmatic",
        badge: "SLOT",
      },
      {
        name: "The Dog House",
        gradient: "card-gradient-pragmatic",
        badge: "SLOT",
      },
      { name: "Starlight Princess", gradient: "card-gradient-pragmatic" },
    ],
  },
  {
    id: "spade",
    title: "Spadegaming",
    icon: "\u2660\uFE0F",
    cards: [
      { name: "Lucky Koi", gradient: "card-gradient-spade", badge: "SLOT" },
      { name: "Book of Myth", gradient: "card-gradient-spade" },
      { name: "Dancing Fever", gradient: "card-gradient-spade", badge: "HOT" },
      { name: "Alien Hunter", gradient: "card-gradient-spade" },
    ],
  },
  {
    id: "cq9",
    title: "CQ9 Gaming",
    icon: "\u26A1",
    cards: [
      { name: "Boom Legend", gradient: "card-gradient-cq9", badge: "HOT" },
      { name: "Thor Hammer", gradient: "card-gradient-cq9", badge: "SLOT" },
      { name: "Sky Conquest", gradient: "card-gradient-cq9" },
      { name: "Slot Car Rally", gradient: "card-gradient-cq9", badge: "SLOT" },
    ],
  },
  {
    id: "sports",
    title: "Sports Betting",
    icon: "\u26BD",
    cards: [
      { name: "Cricket", gradient: "card-gradient-sports", badge: "LIVE" },
      { name: "Football", gradient: "card-gradient-sports", badge: "LIVE" },
      { name: "PSL 2025", gradient: "card-gradient-sports", badge: "HOT" },
      { name: "Tennis", gradient: "card-gradient-sports" },
    ],
  },
  {
    id: "lottery",
    title: "Lottery & Keno",
    icon: "\uD83C\uDFA1",
    cards: [
      { name: "Lucky Draw", gradient: "card-gradient-lottery", badge: "HOT" },
      { name: "Keno Classic", gradient: "card-gradient-lottery" },
      { name: "Mega Lottery", gradient: "card-gradient-lottery", badge: "NEW" },
      { name: "Scratch Card", gradient: "card-gradient-lottery" },
    ],
  },
];

const BADGE_STYLES: Record<string, string> = {
  HOT: "bg-pink-accent text-black",
  LIVE: "bg-[oklch(0.55_0.22_27)] text-white",
  NEW: "bg-green-neon text-black",
  SLOT: "bg-cyan-accent text-black",
};

function GameCardComp({
  card,
  providerTitle,
  onPlay,
  categoryId,
}: {
  card: GameCard;
  providerTitle: string;
  onPlay: (name: string, provider: string, categoryId: string) => void;
  categoryId: string;
}) {
  return (
    <div className="group rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-lg">
      <div
        className={`${card.gradient} h-28 sm:h-32 relative flex items-end justify-between p-2`}
      >
        {card.badge && (
          <span
            className={`text-[9px] font-black px-1.5 py-0.5 rounded ${BADGE_STYLES[card.badge] ?? "bg-gold text-black"}`}
          >
            {card.badge}
          </span>
        )}
        <button
          type="button"
          onClick={() => onPlay(card.name, providerTitle, categoryId)}
          className="ml-auto bg-black/60 hover:bg-gold hover:text-black text-white text-[10px] font-black px-2 py-1 rounded transition-colors"
        >
          Play Now
        </button>
      </div>
      <div className="p-2" style={{ background: "oklch(0.18 0.09 285)" }}>
        <p className="text-foreground text-xs font-bold truncate">
          {card.name}
        </p>
      </div>
    </div>
  );
}

export function CasinoLobby({ onNavigate }: CasinoLobbyProps) {
  const [gameDemo, setGameDemo] = useState<{
    name: string;
    provider: string;
    gameCategory: string;
  } | null>(null);

  return (
    <div
      className="container mx-auto px-4 py-8 space-y-10"
      data-ocid="lobby.section"
    >
      <div
        className="rounded-2xl p-6 sm:p-10 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.2 0.15 290) 0%, oklch(0.15 0.1 320) 50%, oklch(0.2 0.12 260) 100%)",
          boxShadow: "0 0 80px oklch(0.55 0.28 0 / 0.2)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, oklch(0.85 0.18 85) 0px, oklch(0.85 0.18 85) 1px, transparent 1px, transparent 20px)",
          }}
        />
        <h1 className="text-gold font-display text-3xl sm:text-5xl font-black mb-3 relative">
          100%Real Casino
        </h1>
        <p className="text-foreground/80 text-sm sm:text-base max-w-xl mx-auto mb-6 relative">
          Pakistan&apos;s #1 Online Casino. Real money, real wins. JazzCash
          &amp; Easypaisa deposits.
        </p>
        <div className="flex flex-wrap justify-center gap-3 relative">
          <button
            type="button"
            onClick={() => onNavigate("games")}
            className="bg-pink-accent hover:bg-pink-accent/90 text-black font-black px-6 py-3 rounded-xl transition-all glow-pink"
            data-ocid="lobby.games.primary_button"
          >
            Play Now
          </button>
          <button
            type="button"
            onClick={() => onNavigate("promotions")}
            className="bg-gold hover:bg-gold/90 text-black font-black px-6 py-3 rounded-xl transition-all glow-gold"
            data-ocid="lobby.promotions.secondary_button"
          >
            Bonuses
          </button>
          <button
            type="button"
            onClick={() => onNavigate("vip")}
            className="bg-cyan-accent hover:bg-cyan-accent/90 text-black font-black px-6 py-3 rounded-xl transition-all glow-cyan"
            data-ocid="lobby.vip.secondary_button"
          >
            VIP Club
          </button>
        </div>
      </div>

      {PROVIDERS.map((provider) => (
        <section key={provider.id} data-ocid={`lobby.${provider.id}.section`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{provider.icon}</span>
            <h2 className="text-gold font-display font-bold text-lg sm:text-xl">
              {provider.title}
            </h2>
            <div
              className="flex-1 h-px"
              style={{
                background:
                  "linear-gradient(to right, oklch(0.85 0.18 85 / 0.5), transparent)",
              }}
            />
            <button
              type="button"
              onClick={() => onNavigate("games")}
              className="text-xs text-cyan hover:underline font-semibold"
              data-ocid={`lobby.${provider.id}.link`}
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {provider.cards.map((card, ci) => (
              <div
                key={card.name}
                data-ocid={`lobby.${provider.id}.item.${ci + 1}`}
              >
                <GameCardComp
                  card={card}
                  providerTitle={provider.title}
                  onPlay={(name, prov, catId) =>
                    setGameDemo({ name, provider: prov, gameCategory: catId })
                  }
                  categoryId={provider.id}
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      <GameDemoModal
        open={!!gameDemo}
        onClose={() => setGameDemo(null)}
        gameName={gameDemo?.name ?? ""}
        provider={gameDemo?.provider ?? ""}
      />
    </div>
  );
}
